import { z } from 'zod';
import { PostSafeCreateInput, PostSafeUpdateInput, UserSafeCreateInput, UserSafeUpdateInput } from '@lib/types';
import { VALIDATION_MESSAGES } from '@lib/constants';

const BaseUserInputSchema = z.object({
  name: z.string().min(2).max(150),
  bio: z.string().max(150).nullable().optional(),
  age: z.number().max(150).int().positive(),
}) satisfies z.ZodType<UserSafeCreateInput>;

export const CreateUserInputSchema = BaseUserInputSchema;

export const UpdateUserInputSchema = CreateUserInputSchema.partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.keys(rest).length > 0;
    },
    {
      message: VALIDATION_MESSAGES.provide_at_least_one_field,
    }
  ) satisfies z.ZodType<UserSafeUpdateInput>;

export const BasePostInputSchema = z.object({
  authorId: z.number().int().positive(),
  content: z.string().max(150),
  description: z.string().max(150).nullable().optional(),
  published: z.boolean().optional(),
  title: z.string().max(150),
}) satisfies z.ZodType<PostSafeCreateInput>;

export const CreatePostInputSchema = BasePostInputSchema;

export const UpdatePostInputSchema = BasePostInputSchema.partial()
  .extend({
    id: z.number().int().positive(),
  })
  .refine(
    (data) => {
      const { id, ...rest } = data;
      return Object.keys(rest).length > 0;
    },
    {
      message: VALIDATION_MESSAGES.provide_at_least_one_field,
    }
  ) satisfies z.ZodType<PostSafeUpdateInput>;
