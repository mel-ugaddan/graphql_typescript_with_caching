import DataLoader from 'dataloader';
import type { UserModel } from '@lib/types/generated/prisma/models';
import { prisma } from '@lib/prisma';
import { lru } from 'tiny-lru';

const userCache = lru<Promise<UserModel>>(1_000);
const batchLoadUsers = async (arrayOfUserIds: readonly number[]): Promise<(UserModel | null)[]> => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [...arrayOfUserIds],
      },
    },
  });
  const userMap = new Map(
    users.map((user) => {
      return [user.id, user];
    })
  );

  return arrayOfUserIds.map((id) => userMap.get(id) || null);
};

async function demonstrateDataLoader(): Promise<void> {
  // const freshLoader = new DataLoader<number, UserModel | null>(
  //     batchLoadUsers, {
  //         cacheMap: userCache
  // });
  const freshLoader = new DataLoader<number, UserModel | null>(batchLoadUsers);
  // const multipleUsers     = await freshLoader.loadMany([1, 2, 3, 4]);
  // const newMultipleUsers  = await freshLoader.loadMany([1, 2, 6, 7]);

  // console.log(newMultipleUsers)
  //   console.log('\n\n--- Scenario 2: Loading same ID again (cached) ---');
  //   const user1Again = await userLoader.load(1);
  //   console.log('Called load(1) again - NO batch function call!');
  //   console.log('✅ Cached result:', user1Again);

  //   const user1AgainFromDirectPointer = await userCache.get(1);
  //   console.log("Cached Item",user1AgainFromDirectPointer)

  //   console.log('\n\n--- Scenario 3: Using loadMany() ---');
  //   const freshLoader = new DataLoader<number, UserModel | null>(batchLoadUsers);
  //   const multipleUsers = await freshLoader.loadMany([1, 2, 4]);
  //   console.log('\n✅ Results from loadMany([1, 2, 4]):');
  //   multipleUsers.forEach(user => console.log('   ', user));

  await prisma.$disconnect();
  // // --- SCENARIO 4: Handling missing data ---
  // console.log('\n\n--- Scenario 4: Loading non-existent ID ---');

  // const missingUser = await freshLoader.load(999);
  // console.log('✅ Result for ID 999:', missingUser);

  // --- SCENARIO 5: Prime the cache ---
  // console.log('\n\n--- Scenario 5: Priming the cache ---');
  // const primedLoader = new DataLoader<number, User | null>(batchLoadUsers);
  // // Manually add to cache
  // const manualUser: User = { id: 5, name: 'Eve', age: 32 };
  // primedLoader.prime(5, manualUser);
  // console.log('Primed cache with user 5');
  // const user5 = await primedLoader.load(5);
  // console.log('Called load(5) - used primed cache, no batch call!');
  // console.log('✅ Result:', user5);

  // // --- SCENARIO 6: Clear cache ---
  // console.log('\n\n--- Scenario 6: Clearing cache ---');

  // userLoader.clear(1); // Clear specific key
  // console.log('Cleared cache for user 1');

  // const user1Fresh = await userLoader.load(1);
  // console.log('✅ Loaded user 1 again (fresh from batch):', user1Fresh);
}

// Run the demo
demonstrateDataLoader().catch(console.error);
