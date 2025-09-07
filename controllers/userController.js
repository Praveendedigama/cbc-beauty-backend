import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config()

export function createUser(req, res) {

  const newUserData = req.body

  // Validate required fields
  if (!newUserData.email || !newUserData.password || !newUserData.firstName || !newUserData.lastName) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newUserData.email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  // Validate password strength
  if (newUserData.password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long"
    });
  }

  // Check if user already exists
  User.findOne({ email: newUserData.email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    if (newUserData.type == "admin") {

      if (req.user == null) {
        return res.status(401).json({
          message: "Please login as administrator to create admin accounts"
        });
      }

      if (req.user.type != "admin") {
        return res.status(403).json({
          message: "Please login as administrator to create admin accounts"
        });
      }

    }

    // Set default type to customer if not specified
    if (!newUserData.type) {
      newUserData.type = "customer";
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10)

    const user = new User(newUserData)

    user.save().then((savedUser) => {
      console.log('User saved successfully:', savedUser);
      console.log('SECRET available:', !!process.env.SECRET);

      try {
        // Auto-login after registration
        const token = jwt.sign({
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          isBlocked: savedUser.isBlocked,
          type: savedUser.type,
          profilePicture: savedUser.profilePicture
        }, process.env.SECRET, { expiresIn: '24h' })

        console.log('Token generated successfully');

        res.status(201).json({
          message: "User created successfully",
          token: token,
          user: {
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            type: savedUser.type,
            profilePicture: savedUser.profilePicture,
            email: savedUser.email
          }
        })
      } catch (jwtError) {
        console.error('JWT generation error:', jwtError);
        res.status(500).json({
          message: "User created but login failed"
        })
      }
    }).catch((error) => {
      console.error("Error creating user:", error);
      res.status(500).json({
        message: "User not created"
      })
    })
  }).catch((error) => {
    console.error("Error checking existing user:", error);
    res.status(500).json({
      message: "Server error"
    });
  });

}

export function loginUser(req, res) {

  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format"
    });
  }

  User.findOne({ email: email }).then(
    (user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      console.log('=== LOGIN DEBUG ===');
      console.log('User found:', user.email);
      console.log('User type:', user.type);
      console.log('User isBlocked:', user.isBlocked);

      // Check if user is blocked
      if (user.isBlocked) {
        return res.status(403).json({
          message: "Account is blocked. Please contact support."
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (isPasswordCorrect) {
        console.log('Password correct, creating JWT token...');
        console.log('Token payload:', {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isBlocked: user.isBlocked,
          type: user.type,
          profilePicture: user.profilePicture
        });

        const token = jwt.sign({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isBlocked: user.isBlocked,
          type: user.type,
          profilePicture: user.profilePicture
        }, process.env.SECRET, { expiresIn: '24h' })

        console.log('JWT token created successfully');

        res.json({
          message: "User logged in successfully",
          token: token,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
            profilePicture: user.profilePicture,
            email: user.email
          }
        })

      } else {
        res.status(401).json({
          message: "Invalid email or password"
        });
      }
    }
  ).catch((error) => {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error"
    });
  });
}

export function isAdmin(req) {
  if (req.user == null) {
    return false
  }

  if (req.user.type != "admin") {
    return false
  }

  return true
}

export function isCustomer(req) {
  if (req.user == null) {
    return false
  }

  if (req.user.type != "customer") {
    return false
  }

  return true
}

export async function googleLogin(req, res) {
  console.log(req.body)
  const token = req.body.token
  //'https://www.googleapis.com/oauth2/v3/userinfo'
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const email = response.data.email
    //check if user exists
    const usersList = await User.find({ email: email })
    if (usersList.length > 0) {
      const user = usersList[0]
      const token = jwt.sign({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isBlocked: user.isBlocked,
        type: user.type,
        profilePicture: user.profilePicture
      }, process.env.SECRET)

      res.json({
        message: "User logged in",
        token: token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
          profilePicture: user.profilePicture,
          email: user.email
        }
      })
    } else {
      //create new user
      const newUserData = {
        email: email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        type: "customer",
        password: "ffffff",
        profilePicture: response.data.picture
      }
      const user = new User(newUserData)
      user.save().then(() => {
        res.json({
          message: "User created"
        })
      }).catch((error) => {
        res.json({
          message: "User not created"
        })
      })

    }

  } catch (e) {
    res.json({
      message: "Google login failed"
    })
  }


}

// hansa@gmail.com praveen123 - admin
// john.doe@example.com  customer -customer