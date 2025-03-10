import { db } from "../../../database/fakeDB";
import { IUser } from "../../../shared/dtos";
import { IAuthService } from "../../../shared/interfaces";

export class AuthService implements IAuthService {
 async findUserByEmail(email: String): Promise<IUser> {
  return new Promise((resolve, reject) => {

    const user = db.find( user => user.email === email);

    if (user) {
      resolve(user);
    }
      else {
        reject(new Error("Invalid Login Credentials"));
      }        
  });
}

async findUserByEmailAndPassword(email: string, password: string): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
try {
  const user = await this.findUserByEmail(email);

  if(user.password !== password) {
    reject(new Error("Invalid Login Credentials"));
          return;
  }        resolve(user);
} catch {
  reject(new Error ("Invalid Login Credentials"));
}
    });
    }

 async createUser(user: IUser): Promise<IUser> {
  try {
  const existingUser = await this.findUserByEmail(user.email);
  if(existingUser) {
    throw new Error(`User with email ${user.email} already exists`);
  }
    const newUser = { id: Date.now(), posts: [], ...user };
    db.push(newUser);
    return newUser
 } catch (error) {
  if (error instanceof Error && error.message === "Invalid Login Credentials") {
    const newUser = { id: Date.now(), posts: [], ...user };
    db.push(newUser);
    return newUser;
  } throw error;
}
 }

async  loginUser(user: IUser): Promise<IUser> {
  try {
  return await this.findUserByEmailAndPassword(user.email, user.password);
} catch (error) {
  throw error;
}
}
}