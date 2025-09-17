# 🚀 CBC Beauty - Backend API

A robust Node.js backend API for CBC Beauty e-commerce platform with MongoDB, JWT authentication, and comprehensive order management.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **User Management** - Customer and admin role management
- 📦 **Product Management** - CRUD operations for products
- 🛒 **Order Management** - Complete order lifecycle management
- 💳 **Payment Integration** - Stripe payment processing
- 🗄️ **MongoDB Integration** - Scalable database operations
- 🔒 **Security Middleware** - CORS, authentication, and validation
- 📊 **Admin Dashboard** - Order tracking and status updates
- 🖼️ **Image Support** - Product image management

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cbc-beauty-backend.git
   cd cbc-beauty-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   MONGO_DB_URI=mongodb://localhost:27017/cbc-beauty
   SECRET=your_jwt_secret_key
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Test the API**
   ```bash
   curl https://cbc-beauty-backend.onrender.com/api/products
   ```

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (if configured)

## 🏗️ Project Structure

```
├── controllers/          # Route controllers
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── models/              # Database models
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/              # API routes
│   ├── orderRouter.js
│   ├── productRouter.js
│   └── userRouter.js
├── middleware/          # Custom middleware
│   └── auth.js
├── index.js             # Main server file
└── package.json         # Dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:orderId` - Get order by ID (protected)
- `POST /api/orders` - Create new order (protected)
- `PUT /api/orders/:orderId` - Update order status (admin only)

### Admin
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:orderId` - Update order status (admin only)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_DB_URI` | MongoDB connection string | Yes | - |
| `SECRET` | JWT secret key | Yes | - |
| `NODE_ENV` | Environment mode | No | development |
| `PORT` | Server port | No | 5000 |

### Database Setup

1. **Local MongoDB**
   ```bash
   # Install MongoDB
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster
   - Get connection string
   - Add to environment variables

### CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev server)
- Your production frontend domains

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Request validation middleware
- **Role-based Access** - Admin and customer role separation

## 🚀 Deployment

### Deploy to Railway (Recommended)

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Railway will auto-detect Node.js

2. **Add Environment Variables**
   - Add all required environment variables
   - Use production MongoDB connection string

3. **Deploy**
   - Railway will automatically deploy on every push

### Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Add Environment Variables**
   ```bash
   heroku config:set MONGO_DB_URI=your_mongodb_uri
   heroku config:set SECRET=your_jwt_secret
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to DigitalOcean

1. **Create Droplet**
   - Choose Node.js image
   - Configure firewall

2. **Deploy Code**
   ```bash
   git clone your-repo
   npm install
   npm start
   ```

## 🧪 Testing

```bash
# Test API endpoints
curl https://cbc-beauty-backend.onrender.com/api/products

# Test authentication
curl -X POST https://cbc-beauty-backend.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  type: String (customer/admin),
  createdAt: Date
}
```

### Product Model
```javascript
{
  productId: String (unique),
  productName: String,
  altNames: [String],
  images: [String],
  price: Number,
  lastPrice: Number,
  stock: Number,
  description: String
}
```

### Order Model
```javascript
{
  orderId: String (unique),
  userId: ObjectId,
  orderedItems: [Object],
  totalAmount: Number,
  status: String,
  paymentMethod: String,
  name: String,
  address: String,
  phone: String,
  date: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/YOUR_USERNAME/cbc-beauty-backend/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🎯 Roadmap

- [ ] Add product categories
- [ ] Implement inventory management
- [ ] Add email notifications
- [ ] Implement caching with Redis
- [ ] Add API rate limiting
- [ ] Implement file upload for product images
- [ ] Add comprehensive logging
- [ ] Implement API documentation with Swagger

---

**🚀 Built with ❤️ for CBC Beauty**
