import type { PostModel, UserModel } from '@lib/types/generated/prisma/models.ts';
import type { Prisma } from '@lib/types/generated/prisma/client.ts';

export type * from '@lib/types/generated/prisma/client';
export type * from '@lib/types/generated/prisma/models';

type Override<T, R> = Omit<T, keyof R> & R;

export type PostSafeCreateInput = Prisma.PostUncheckedCreateInput;

export type PostSafeUpdateInput = Override<
  Prisma.PostUncheckedUpdateInput,
  {
    authorId?: number;
  }
>;

export type UserSafeCreateInput = Prisma.UserCreateWithoutPostsInput;

export type UserSafeUpdateInput = Prisma.UserUpdateWithoutPostsInput;

export type PostModelId = PostModel['id'];

export type UserModelId = UserModel['id'];

export type PrismaDelegates = {
  post: Prisma.PostDelegate;
  user: Prisma.UserDelegate;
};
