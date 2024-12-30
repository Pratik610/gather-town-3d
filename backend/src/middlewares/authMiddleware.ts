import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../util/prisma";
import asyncHandler from "express-async-handler";
const protect = asyncHandler(
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    if (req.cookies.token) {
      try {
        const decoded = jwt.verify(
          req.cookies.token!,
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

        req.session.user = data;

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
