import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createToken } from "../utils/createToken.js";

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  const token = createToken(user);

  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user);
  res.json({ user, token });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
