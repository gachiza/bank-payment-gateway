import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '../models/entites/User';
import { AppDataSource } from "../config/db";
import { z } from "zod";



const JWT_SECRET = process.env.JWT_SECRET || "1faccc11d4e4e589c07f1dcf010828b9bf396754ce014f44b8d03e691d47476dd58f62921836533f2e15587a5c3e642aa7e993b3f23ea6746a1dbf5572beb09e";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export const AuthService = { async registerUser(
  email:string,
  password:string,
  firstName: string,
  lastName: string
): Promise<User> {
  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOne({ where: {email}});
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({
    email,
    password: hashedPassword,
    firstName,
    lastName
  })
  await userRepository.save(user);
  return user;
  },
  async loginUser(email: string, password:string): Promise<string> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({where: { email }});
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid  =  await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(" Invalid credentials");
    }
    const token = jwt.sign({id: user.id, email: user.email, isAdmin: user.isAdmin}, JWT_SECRET,{ expiresIn: JWT_EXPIRES_IN});
    return token;
  },
  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, JWT_SECRET);
  }

};

//Zod validation schemes
export const registerSchema = z. object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

export const loginSchema = z.object ({
  email: z.string().email(),
  password: z.string().min(8)
})
