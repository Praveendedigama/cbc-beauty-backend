import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
  console.log('=== ORDER CREATION DEBUG ===');
  console.log('User object:', req.user);
  console.log('User type:', req.user?.type);
  console.log('isCustomer result:', isCustomer(req.user));

  if (!isCustomer(req.user)) {
    console.log('❌ User is not a customer. User type:', req.user?.type);
    return res.status(403).json({
      message: "Please login as customer to create orders",
    });
  }

  try {
    console.log('=== ORDER CREATION DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    console.log('Required fields check:');
    console.log('- name:', req.body.name);
    console.log('- address:', req.body.address);
    console.log('- phone:', req.body.phone);
    console.log('- orderedItems:', req.body.orderedItems);

    const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1);
    console.log(latestOrder);

    let orderId;

    if (latestOrder.length == 0) {
      orderId = "CBC0001";
    } else {
      const currentOrderId = latestOrder[0].orderId;

      const numberString = currentOrderId.replace("CBC", "");

      const number = parseInt(numberString);

      const newNumber = (number + 1).toString().padStart(4, "0");

      orderId = "CBC" + newNumber;
    }

    const newOrderData = req.body;

    const newProductArray = [];
    const stockReductionData = []; // Store original data for stock reduction

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (product == null) {
        res.json({
          message:
            "Product with id " +
            newOrderData.orderedItems[i].productId +
            " not found",
        });
        return;
      }

      // Check if enough stock is available
      const requestedQuantity = parseInt(newOrderData.orderedItems[i].qty);

      // Validate quantity is a valid number
      if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
        res.status(400).json({
          message: `Invalid quantity for ${product.productName}. Quantity must be a positive number.`,
        });
        return;
      }

      if (product.stock < requestedQuantity) {
        res.status(400).json({
          message: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Requested: ${requestedQuantity}`,
        });
        return;
      }

      // Store data for stock reduction
      stockReductionData.push({
        productId: newOrderData.orderedItems[i].productId,
        quantitySold: requestedQuantity
      });

      newProductArray[i] = {
        name: product.productName,
        price: product.lastPrice,
        quantity: newOrderData.orderedItems[i].qty,
        image: product.images[0],
      };
    }
    console.log(newProductArray);

    newOrderData.orderedItems = newProductArray;

    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    // Set appropriate status based on payment method
    if (newOrderData.paymentMethod === 'card') {
      newOrderData.status = 'paid';
    } else if (newOrderData.paymentMethod === 'cash_on_delivery') {
      newOrderData.status = 'pending';
    } else {
      newOrderData.status = 'pending'; // Default for other payment methods
    }

    console.log('Order status set to:', newOrderData.status);

    const order = new Order(newOrderData);

    const savedOrder = await order.save();

    // Reduce stock for each product in the order
    for (let i = 0; i < stockReductionData.length; i++) {
      const { productId, quantitySold } = stockReductionData[i];

      console.log(`Reducing stock for ${productId} by ${quantitySold}`);

      // Validate quantity is a number
      if (isNaN(quantitySold) || quantitySold <= 0) {
        console.error(`Invalid quantity for ${productId}: ${quantitySold}`);
        continue;
      }

      const result = await Product.findOneAndUpdate(
        { productId: productId },
        { $inc: { stock: -quantitySold } },
        { new: true }
      );

      console.log(`Stock reduced for ${productId}. New stock: ${result.stock}`);
    }

    res.json({
      message: "Order created",
      data: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getOrders(req, res) {


  try {
    if (isCustomer(req)) {
      const orders = await Order.find({ email: req.user.email });

      res.json(orders);
      return;
    } else if (isAdmin(req)) {
      const orders = await Order.find({});

      res.json(orders);
      return;
    } else {
      res.json({
        message: "Please login to view orders"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getOrderById(req, res) {
  try {
    const orderId = req.params.orderId;

    // Find order by orderId
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // Check if user has permission to view this order
    if (isCustomer(req)) {
      // Customer can only view their own orders
      if (order.email !== req.user.email) {
        return res.status(403).json({
          message: "You don't have permission to view this order"
        });
      }
    } else if (!isAdmin(req)) {
      return res.status(403).json({
        message: "Please login to view order details"
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getQuote(req, res) {

  try {
    const newOrderData = req.body;

    const newProductArray = [];

    let total = 0;
    let labeledTotal = 0;
    console.log(req.body)

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (product == null) {
        res.json({
          message:
            "Product with id " +
            newOrderData.orderedItems[i].productId +
            " not found",
        });
        return;
      }
      labeledTotal += product.price * newOrderData.orderedItems[i].qty;
      total += product.lastPrice * newOrderData.orderedItems[i].qty;
      newProductArray[i] = {
        name: product.productName,
        price: product.lastPrice,
        labeledPrice: product.price,
        quantity: newOrderData.orderedItems[i].qty,
        image: product.images[0],
      };
    }
    console.log(newProductArray);
    newOrderData.orderedItems = newProductArray;
    newOrderData.total = total;

    res.json({
      orderedItems: newProductArray,
      total: total,
      labeledTotal: labeledTotal,
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateOrder(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Please login as admin to update orders",
    });
  }

  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      orderId: orderId,
    });

    if (order == null) {
      res.status(404).json({
        message: "Order not found",
      })
      return;
    }

    const notes = req.body.notes;
    const status = req.body.status;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { notes: notes, status: status },
      { new: true }
    );

    res.json({
      message: "Order updated",
      data: updatedOrder
    });

  } catch (error) {


    res.status(500).json({
      message: error.message,
    });
  }
}