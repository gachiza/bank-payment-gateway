import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiResponse } from "../utils/apiResponse";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //console.log({schema, req});
      schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join("."),
          message: err.message,
          validation:err.code
        }));
        return res.status(400).json({
          status: "validation-error",
          message: 'request validation failed',
          errors: error
        });
      }
      ApiResponse.error(res, "Internal server error", 500);
      return;
    }
  };
};