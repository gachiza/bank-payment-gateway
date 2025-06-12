import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export const errorMiddleware = (
  error: Error,
  req:Request,
  res:Response,
  next: NextFunction
) => {
  console.error(error.stack);
  return ApiResponse.error(res, " Internal server error", 500);
};

export default errorMiddleware;