import User from "../Models/user.js";
import bcrypt from "bcrypt";

export function createUser(req, res) {
  const newUserData = req.body;

  if (newUserData.type === "admin") {
    if (!req.user) {
      res.json({
        message: "Please login as administrator to create admin accounts",
      });
      return;
    }

    if (req.user.type !== "admin") {
      res.json({
        message: "Please login as administrator to create admin accounts",
      });
      return;
    }
  }

  newUserData.password = bcrypt.hashSync(newUserData.password, 10);

  const user = new User(newUserData);

  user
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error creating user",
        error: error.message,
      });
    });
}


