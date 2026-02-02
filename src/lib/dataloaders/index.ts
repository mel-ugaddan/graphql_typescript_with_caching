import { PostDataLoader } from '@lib/dataloaders/post';
import { UserDataLoader } from '@lib/dataloaders/user';
import { userCache, postCache } from '@lib/cachemap/cachemaps';
import { prisma } from '@lib/prisma/index';

export const createDataLoaders = () => ({
  userLoader: new UserDataLoader(prisma, userCache),
  postLoader: new PostDataLoader(prisma, postCache),
});

export type DataLoaders = ReturnType<typeof createDataLoaders>;
