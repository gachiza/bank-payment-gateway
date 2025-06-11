import { Request, Response } from 'express';
import { AuthService } from "../services/auth.services";
import { ApiResponse } from "../utils/apiResponse";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = await AuthService.registerUser(email, password, firstName, lastName);
      return ApiResponse.success(res, "User registered successfully", {user});
    } catch (error: any ) {
      return ApiResponse.error(res, error.message);
    }
  },
  async login (req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.loginUser(email, password);
      return ApiResponse.success(res, "login successful", {token});
    } catch (error: any ){
      return ApiResponse.error(res, error.message);
    }
  },
  async profile(req: Request, res:Response) {
    try {
      return ApiResponse.success(res, "Profile retrieved successfully", {user: req.user});
    } catch (error: any ) {
      return ApiResponse.error(res, error.message);
    }
  }
};