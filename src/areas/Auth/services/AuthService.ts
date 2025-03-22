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

  async getUserById(id: number): Promise<IUser | null> {
    const user = await db.user.findUnique({
      where: { id },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      fName: user.fName,
      lName: user.lName,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  async updateUser(user: IUser): Promise<IUser> {
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
    });
    
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    if (user.username && user.username !== existingUser.username) {
      const usernameExists = await db.user.findFirst({
        where: { 
          username: user.username,
          id: { not: existingUser.id } 
        },
      });
      
      if (usernameExists) {
        throw new Error("Username already taken");
      }
    }
    
    if (user.email && user.email !== existingUser.email) {
      const emailExists = await db.user.findFirst({
        where: { 
          email: user.email,
          id: { not: existingUser.id }
        },
      });
      
      if (emailExists) {
        throw new Error("Email already taken");
      }
    }
    
    type UserUpdate = Partial<Omit<IUser, 'id' | 'createdAt'>> & { updatedAt: string };

    const updateData: UserUpdate = {
      ...(user.username && user.username !== existingUser.username && { username: user.username }),
      ...(user.email && user.email !== existingUser.email && { email: user.email }),
      ...(user.fName && user.fName !== existingUser.fName && { fName: user.fName }),
      ...(user.lName && user.lName !== existingUser.lName && { lName: user.lName }),
      updatedAt: new Date().toISOString(),
    };
    
    if (user.password && user.password !== existingUser.password) {
      if (!user.password.startsWith('$2')) {
        updateData.password = await bcrypt.hash(user.password, this.SALT_ROUNDS);
      } else {
        updateData.password = user.password;
      }
    }

    const updatedUser = await db.user.update({
      where: { id: existingUser.id },
      data: updateData,
    });

      return {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        password: existingUser.password,
        fName: existingUser.fName,
        lName: existingUser.lName,
        createdAt: existingUser.createdAt.toISOString(),
        updatedAt: existingUser.updatedAt.toISOString()
      };
    }
  }