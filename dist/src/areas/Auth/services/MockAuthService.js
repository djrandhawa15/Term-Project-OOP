import { db } from "../../../database/fakeDB";
export class MockAuthService {
    async findUserByEmailAndPassword(email, password) {
        return db.find((user) => user.email === email && user.password === password);
    }
    async createUser(user) {
        const newUser = { id: Date.now(), posts: [], ...user };
        db.push(newUser);
        return newUser;
    }
    async loginUser({ email, password }) {
        const foundUser = await this.findUserByEmailAndPassword(email, password);
        if (!foundUser)
            throw new Error("User not found");
        return foundUser;
    }
}
//# sourceMappingURL=MockAuthService.js.map