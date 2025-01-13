import asyncHandler from "express-async-handler";
import axios from "axios";
import prisma from "../util/prisma";
import { createToken } from "../util/token";

export const userLogin = asyncHandler(async (req: any, res: any) => {
  const { access_token, loginType, email, password } = req.body;

  const googleLogin = async () => {
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
              loginType: loginType,
            },
            select: {
              id: true,
            },
          });


          res.cookie("token", createToken(createNewUser!.id), {
            httpOnly: true,
            secure:false,
            sameSite: "None",
            expires: new Date(Date.now() + (30*24*3600000))
            
          });

          return res.status(201).json("Login Successfull");
        } else {
          res.cookie("token", createToken(checkUserExists!.id));

          return res.status(200).json("Login Successfull");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  switch (loginType) {
    case "normal":
      break;
    case "google":
      googleLogin();
      break;

    default:
      break;
  }
});

export const getUserDetails = asyncHandler(async (req: any, res: any) => {
 
  return res.status(200).json(req.user);
});
