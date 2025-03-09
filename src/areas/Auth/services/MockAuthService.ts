import { db } from "../../../database/fakeDB";
import { IUser } from "../../../shared/dtos";
import { IAuthService } from "../../../shared/interfaces";

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
    return db.find(
      (user) => user.email === email && user.password === password
    );
  }
  async createUser(user: IUser): Promise<IUser> {
    try {
    const existingUser = await this.findUserByEmail(user.email);
      throw new Error(`User with email ${user.email} already exists`);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid Login Credentials") {
      const newUser = { id: Date.now(), posts: [], ...user };
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
