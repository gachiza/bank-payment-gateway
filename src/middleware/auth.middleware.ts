import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || " your-secret-key";

declare module "express" {
  interface Request {
    user?: any;
  }
}

export const authMiddleware = {
  authenticate: (req: Request, res:Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer", "");
    console.log(token);
    if (!token ){
      ApiResponse.error (res, "Authentication required", 401);
      return;
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      req.user = decoded;
      
      next();
    } catch (error) {
      ApiResponse.error(res, "Invalid token ", 401);
      console.log(error);
      return;
    }
  },
  authorizeAdmin: (req: Request, res: Response, next:NextFunction) => {
    if (!req.user?.isAdmin) {
      ApiResponse.error(res, "Admin Access Required", 403);
      return;
    }
    next();
  }
};

