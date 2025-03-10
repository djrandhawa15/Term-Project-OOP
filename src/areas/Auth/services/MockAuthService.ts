import { db } from "../../../database/fakeDB";
import { IUser } from "../../../shared/dtos";
import { IAuthService } from "../../../shared/interfaces";
import bcrypt from "bcrypt";

export class MockAuthService implements IAuthService {
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
    // return db.find(
    //   (user) => user.email === email && user.password === password
    // );
  }
  async createUser(user: IUser): Promise<IUser> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const newUser = { id: Date.now(), posts: [], ...user, password: hashedPassword };
    db.push(newUser);
    return newUser;
  }

  async loginUser({ email, password }: IUser): Promise<IUser> {
    const foundUser = await this.findUserByEmailAndPassword(email, password);
    if (!foundUser) throw new Error("User not found");
    return foundUser;
  }
}
