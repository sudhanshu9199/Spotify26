import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function register(req, res) {
  const { email, fullname, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    email,
    password: hashPassword,
    fullname: {
      firstName: fullname.firstName,
      lastName: fullname.lastName,
    },
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(201).json({
    message: "User created successfully!",
    user: {
      id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullname,
      role: newUser.role,
    },
    token,
  });
}
