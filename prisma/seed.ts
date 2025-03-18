import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create users with the correct fields
    const users = await Promise.all(
        Array.from({ length: 5 }).map(() =>
            prisma.user.create({
                data: {
                    username: faker.internet.username(), // ✅ Correct field
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                },
            })
        )
    );

    // Create posts for each user
    for (const user of users) {
        await Promise.all(
            Array.from({ length: 3 }).map(() =>
                prisma.post.create({
                    data: {
                        content: faker.lorem.paragraphs(2), // ✅ Your schema only has 'content'
                        userId: user.id,
                    },
                })
            )
        );
    }

    console.log('Database seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
