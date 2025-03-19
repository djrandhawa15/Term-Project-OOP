import { PrismaClient } from "@prisma/client";
import { db } from "../../../database/client";
import { IAuthService } from "../../../shared/interfaces";
import { ILogin, IUser } from "../../../shared/dtos";
import bcrypt from "bcrypt";


export class AuthService implements IAuthService {
  private readonly SALT_ROUNDS = 10;

  async createUser(user: Omit<IUser, "id">): Promise<IUser> {
    const emailExists = await db.user.findUnique({
      where: { email: user.email },
    });

    if (emailExists) {
      throw new Error(
        "That email has already been taken. Please try another one."
      );
    }
    if (user.username) {
  const usernameExists = await db.user.findUnique({
   where: { username: user.username },
  });
    
    if (usernameExists) {
      throw new Error(
      "Invalid username"
      );
    }
  }

  const hashedPassword = await bcrypt.hash(user.password, this.SALT_ROUNDS);
            
  const userData = {
    email: user.email,
    password: hashedPassword,
    username: user.username,
    fName: user.fName,
    lName: user.lName,
    createdAt: user.createdAt?.toString(),
    updatedAt: user.updatedAt?.toString(),
  };

  const createdUser = await db.user.create({ data: userData });
      return {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        password: createdUser.password,
        fName: user.fName,
        lName: user.lName,
        createdAt: user.createdAt?.toString(),
        updatedAt: user.createdAt?.toString(),
    }
  }

  async loginUser(user: ILogin): Promise<IUser> {
    const foundUser = await db.user.findUnique({
      where: { email: user.email },
    });
    
    if (!foundUser) {
      throw new Error(" Invalid Login Credentials. Please try again.");
    }
    
    const passwordMatch = await bcrypt.compare(user.password, foundUser.password);
    
    if (!passwordMatch) {
      throw new Error(" Invalid Login Credentials. Please try again.");
    }

    return {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      password: foundUser.password,
      fName: foundUser.fName,
      lName: foundUser.lName,
      createdAt: foundUser.createdAt.toISOString(),
      updatedAt: foundUser.updatedAt.toISOString()
    };
  }
}

