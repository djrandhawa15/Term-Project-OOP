import { db } from "../../../database/fakeDB";
import { IUser } from "../../../shared/dtos";
import { IAuthService } from "../../../shared/interfaces";
import bcrypt from "bcrypt";


export class MockAuthService implements IAuthService {

  async findUserByEmail(email: String): Promise<IUser> {
    return new Promise((resolve, reject) => {
  
      const user = db.find( user => user.email === email);
  
      if (user) {
        resolve(user);
      } else {
        reject(new Error("Invalid Login Credentials"));
      }
    });
  }


  private async findUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<IUser | undefined> {
    for(const user of db) {
      if(user.email === email) {
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
          return user;
        }
      }
    }
    return undefined;
  }
  async createUser(user: IUser): Promise<IUser> {
    try {
    const existingUser = await this.findUserByEmail(user.email);
      throw new Error(`User with email ${user.email} already exists`);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid Login Credentials") {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const newUser = { id: Date.now(), posts: [], ...user, password: hashedPassword };
      db.push(newUser);
      return newUser
   } throw error;
  }
}

  async loginUser({ email, password }: IUser): Promise<IUser> {
    const foundUser = await this.findUserByEmailAndPassword(email, password);
    if (!foundUser) throw new Error("Invalid Login Credentials. Please try again." );
    return foundUser;
  }
}
