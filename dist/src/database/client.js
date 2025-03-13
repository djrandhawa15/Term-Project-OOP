import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();
export const mockUsers = [
    {
        id: 1,
        username: "john123",
        email: "john123@gmail.com",
        password: "123456",
    },
];
//# sourceMappingURL=client.js.map