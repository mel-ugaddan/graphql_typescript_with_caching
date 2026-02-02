import { prisma } from '../src/lib/prisma';
import type { UserCreateInput, PostUncheckedCreateInput } from '@lib/types/generated/prisma/models';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main(): Promise<void> {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "User_id_seq" RESTART WITH 1;');
  await prisma.$executeRawUnsafe('ALTER SEQUENCE "Post_id_seq" RESTART WITH 1;');

  const no_of_users = 5;
  const no_of_posts = 15;

  const users_to_create: UserCreateInput[] = Array.from({ length: no_of_users }, (_, i) => ({
    name: `User ${i + 1}`,
    age: Math.floor(Math.random() * 31) + 20,
  }));

  const create_users_result = await prisma.user.createMany({
    data: users_to_create,
  });

  const created_users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  const posts_to_create: PostUncheckedCreateInput[] = Array.from({ length: no_of_posts }, (_, i) => ({
    title: `Post Title ${i}`,
    content: `Content ${i}`,
    published: true,
    authorId: created_users[randomInt(0, no_of_users - 1)]!.id,
  }));

  const created_posts = await prisma.post.createMany({
    data: posts_to_create,
  });

  const user = await prisma.user.findMany({
    where: {
      id: 1,
    },
  });

  console.log(user);
  console.log(`No of created Users : ${create_users_result.count}`);
  console.log(`No of created Posts : ${created_posts.count}`);
}

main()
  .then(async () => {
    console.log(1);
    await prisma.$disconnect();
  })
  .catch(async (_) => {
    console.log(2);
    await prisma.$disconnect();
  })
  .finally(async () => {
    console.log(3);
    await prisma.$disconnect();
  });
