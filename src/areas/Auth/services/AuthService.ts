import { PrismaClient } from "@prisma/client";
import { db } from "../../../database/client";
import { IAuthService } from "../../../shared/interfaces";
import { IUser } from "../../../shared/dtos";
import bcrypt from "bcrypt";


export class AuthService implements IAuthService {
  private readonly SALT_ROUNDS = 10;

  async createUser(user: Omit<IUser, "id">): Promise<IUser> {
    const userExists = await db.user.findUnique({
      where: { email: user.email },
    });

    if (!userExists) {

      const partEmail = user.email.split('@')[0];
      let username = partEmail;
      let isUnique = false;

      while(!isUnique) {
        const usernameExists = await db.user.findUnique({
          where: { username },
        });

        if (!usernameExists) {
          isUnique = true;
        } else {
      const randomNumbers = Math.floor(Math.random() * 900 + 100);
      username = partEmail + randomNumbers;
        }
      }

      const hashedPassword = await bcrypt.hash(user.password, this.SALT_ROUNDS);
            
      const userData = {
          email: user.email,
          password: hashedPassword,
          username: username
      };

      const createdUser = await db.user.create({ data: userData });
      return createdUser;
    } else {
      throw new Error(
        "That email has already been taken. Please try another one."
      );
    }
  }

  async loginUser(user: IUser): Promise<IUser> {
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
    
    return foundUser;
  }
}

