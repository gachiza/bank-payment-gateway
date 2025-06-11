import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiResponse } from "../utils/apiResponse";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join("."),
          message: err.message
        }));
        return ApiResponse.error(res, "Validation failed", 400, {errors});
      }
      return ApiResponse.error(res, "Internal server error", 500);
    }
  };
};