import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
// Note: In production, use bcrypt to hash passwords. Simulating for now to keep it simple but functional.
// import bcrypt from 'bcryptjs';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  // const salt = await bcrypt.genSalt(10);
  // const passwordHash = await bcrypt.hash(password, salt);
  const passwordHash = password; // TODO: Implement bcrypt

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.passwordHash === password) { // TODO: Use bcrypt.compare
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
