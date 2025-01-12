import asyncHandler from "express-async-handler";
import prisma from "../util/prisma";

export const createWorkSpace = asyncHandler(async (req: any, res: any) => {
  try {
    const { name, description } = req.body;

    await prisma.workspace.create({
      data: {
        adminId: req.user.id,
        name,
        description,
        Workspace_Users: {
          create: {
            userId: req.user.id,
          },
        },
      },
    });

    return res.status(201).json({ message: "Workspace Created" });
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
});

export const getAllWorkSpace = asyncHandler(async (req: any, res: any) => {
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        Workspace_Users: {
          select: {
            workspace: true,
          },
        },
      },
    });
   

    return res.status(200).json(data?.Workspace_Users);
  } catch (error) {
    console.log(error);
    throw new Error("Something Went Wrong");
  }
});
