import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const users = await Promise.all(
        Array.from({ length: 5 }).map(() =>
            prisma.user.create({
                data: {
                    username: faker.internet.username(), 
                    fName: faker.person.firstName(),
                    lName: faker.person.lastName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                },
            })
        )
    );

    const posts = [];
    for (const user of users) {
        const userPosts = await Promise.all(
            Array.from({ length: 3 }).map(() =>
                prisma.post.create({
                    data: {
                        content: faker.lorem.paragraphs(2), 
                        userId: user.id,
                    },
                })
            )
        );
        posts.push(...userPosts);
    }

    for (const post of posts) {
        const commentCount = Math.floor(Math.random() * 5) + 1;
        
        await Promise.all(
            Array.from({ length: commentCount }).map(() => {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                
                return prisma.comment.create({
                    data: {
                        text: faker.lorem.paragraph(),
                        userId: randomUser.id,
                        postId: post.id
                    }
                });
            })
        );
        
        const likeCount = Math.floor(Math.random() * users.length); 
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        const usersWhoLiked = shuffledUsers.slice(0, likeCount);
        
        await Promise.all(
            usersWhoLiked.map(async (user) => {
                await prisma.like.create({
                    data: {
                        userId: user.id,
                        postId: post.id
                    }
                });
            })
        );
        
        await prisma.post.update({
            where: { id: post.id },
            data: { likesCount: likeCount }
        });
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