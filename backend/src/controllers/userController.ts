import asyncHandler from "express-async-handler";
import axios from "axios";
import prisma from "../util/prisma";
import { createToken } from "../util/token";

export const userLogin = asyncHandler(async (req: any, res: any) => {
  const { access_token } = req.body;

  try {
    if (access_token) {
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const checkUserExists = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
        select: {
          id: true,
        },
      });

      if (!checkUserExists) {
        const createNewUser = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            googleId: data.sub,
            profilePhoto: data.picture,
          },
          select: {
            id: true,
          },
        });

        return res.status(201).json({ token: createToken(createNewUser!.id) });
      } else {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.cookie("token", createToken(checkUserExists!.id));

        return res
          .status(200)
          .json({ token: createToken(checkUserExists!.id) });
      }
    }
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
});

export const getUserDetails = asyncHandler(async (req: any, res: any) => {
  return res.status(200).json(req.user);
});
