import { PrismaClient } from "@prisma/client";
import { IPost, IUser } from "../shared/dtos";

export const db = new PrismaClient();

export const mockUsers: IUser[] = [
  {
    id: 1,
    email: "john123@gmail.com",
    password: "123456",
  },
];