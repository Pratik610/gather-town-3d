import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../util/prisma";
import asyncHandler from "express-async-handler";
const protect = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
 

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
          token!,
          process.env.JWT_SECRET!
        ) as JwtPayload;

        const data = await prisma.user.findUniqueOrThrow({
          where: {
            id: decoded?.id,
          },
          select: {
            id: true,
            email: true,
            name: true,
            profilePhoto: true,
          },
        });

        req.user = data;

        next();
      } catch (error) {
        console.log(error);
        throw new Error("Token Expired");
      }
    } else {
      throw new Error("No Token Found");
    }
  }
);

export { protect };
