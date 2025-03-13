import { db } from "../../../database/client";
export class AuthService {
    async createUser(user) {
        const userExists = await db.user.findUnique({
            where: { email: user.email },
        });
        if (!userExists) {
            const username = user.email.split('@')[0];

            const userData = {
                ...user,
                username: username
            };
            
            const createdUser = await db.user.create({ data: userData });
            return createdUser;
        }
        else {
            throw new Error("That email has already been taken. Please try another one.");
        }
    }
    async loginUser(user) {
        const foundUser = await db.user.findUnique({
            where: { email: user.email, password: user.password },
        });
        if (!foundUser)
            throw new Error("User not found");
        return foundUser;
    }
}
//# sourceMappingURL=AuthService.js.map