import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";


const notFound = expressAsyncHandler((req: any, res: any, next: any) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
})

const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
  next(err);
};
export { notFound, errorHandler };
