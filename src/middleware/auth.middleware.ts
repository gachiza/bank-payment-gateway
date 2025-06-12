import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/auth.services";
import { ApiResponse } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || " your-secret-key";

declare module "express" {
  interface Request {
    user?: any;
  }
}

const authMiddleware = {
  authenticate: (req: Request, res:Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    if (!token ){
      return ApiResponse.error (res, "Authentication required", 401);
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return ApiResponse.error(res, "Invalid token ", 401);
    }
  },
  authorizeAdmin: (req: Request, res: Response, next:NextFunction) => {
    if (!req.user?.isAdmin) {
      return ApiResponse.error(res, "Admin Access Required", 403);
    }
    next();
  }
};

export default authMiddleware;