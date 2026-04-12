import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";

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

  await publishToQueue("user_created", {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    role: newUser.role,
  });

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

export async function googleAuthCallback(req, res) {
  const user = req.user;
  console.log(user);

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isUserAlreadyExists) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExists._id,
        role: isUserAlreadyExists.role,
      },
      config.JWT_SECRET,
      { expiresIn: "2d" },
    );
    res.cookie("token", token);
    return res.status(200).json({
      message: "User logged in successfully!",
      user: {
        id: isUserAlreadyExists._id,
        email: isUserAlreadyExists.email,
        fullname: isUserAlreadyExists.fullname,
        role: isUserAlreadyExists.role,
      },
    });
  }

  const newUser = await userModel.create({
    googleId: user.id,
    email: user.emails[0].value,
    fullname: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  await publishToQueue("user_created", {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullname,
    role: newUser.role,
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
    },
    config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser._id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
    },
  });

  res.send("Google Auth Callback");
}
