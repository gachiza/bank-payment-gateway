import { Response } from "express";

interface ApiResponseOptions {
  success?: boolean;
  message?: string;
  data?: any;
  errors?: any;
  statuscode?: number;
}

export class ApiResponse {
  static success(
    res:Response,
    message: string= "Success",
    data: any = null,
    statusCode: number = 200
  ){
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
  static error(
    res:Response,
    message: string = "Error",
    statusCode: number= 400,
    options: ApiResponseOptions= {}
  ) {
    const { errors, data } = options;
    return res.status(statusCode).json({
      success: false,
      message,
      data
    });
  }
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}