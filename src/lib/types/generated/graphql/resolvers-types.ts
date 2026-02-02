import type { GraphQLResolveInfo } from 'graphql';
import type { GraphQLContext } from '../../../../graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AllPostQueryResponse = {
  __typename?: 'AllPostQueryResponse';
  message: Scalars['String']['output'];
  result?: Maybe<Array<PostWithAuthor>>;
  success: Scalars['Boolean']['output'];
};

export type AllUserQueryResponse = {
  __typename?: 'AllUserQueryResponse';
  message: Scalars['String']['output'];
  result?: Maybe<Array<UserWithPosts>>;
  success: Scalars['Boolean']['output'];
};

export type CreatePost = {
  authorId: Scalars['Int']['input'];
  content: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  title: Scalars['String']['input'];
};

export type CreateUser = {
  age: Scalars['Int']['input'];
  bio?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: PostMutationResponse;
  createUser: UserMutationResponse;
  deletePost: PostMutationResponse;
  deleteUser: UserMutationResponse;
  updatePost: PostMutationResponse;
  updateUser: UserMutationResponse;
};

export type MutationCreatePostArgs = {
  input: CreatePost;
};

export type MutationCreateUserArgs = {
  input: CreateUser;
};

export type MutationDeletePostArgs = {
  id: Scalars['Int']['input'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};

export type MutationUpdatePostArgs = {
  input: UpdatePost;
};

export type MutationUpdateUserArgs = {
  input: UpdateUser;
};

export type Post = {
  __typename?: 'Post';
  authorId?: Maybe<Scalars['Int']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  published?: Maybe<Scalars['Boolean']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type PostMutationResponse = {
  __typename?: 'PostMutationResponse';
  message: Scalars['String']['output'];
  result?: Maybe<Post>;
  success: Scalars['Boolean']['output'];
};

export type PostQueryResponse = {
  __typename?: 'PostQueryResponse';
  message: Scalars['String']['output'];
  result?: Maybe<Post>;
  success: Scalars['Boolean']['output'];
};

export type PostWithAuthor = {
  __typename?: 'PostWithAuthor';
  author?: Maybe<User>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<PostQueryResponse>;
  posts: AllPostQueryResponse;
  user?: Maybe<UserQueryResponse>;
  users?: Maybe<AllUserQueryResponse>;
};

export type QueryPostArgs = {
  id: Scalars['Int']['input'];
};

export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  User = 'USER',
}

export type UpdatePost = {
  authorId?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  published?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUser = {
  age?: InputMaybe<Scalars['Int']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserMutationResponse = {
  __typename?: 'UserMutationResponse';
  message: Scalars['String']['output'];
  result?: Maybe<User>;
  success: Scalars['Boolean']['output'];
};

export type UserQueryResponse = {
  __typename?: 'UserQueryResponse';
  message: Scalars['String']['output'];
  result?: Maybe<UserWithPosts>;
  success: Scalars['Boolean']['output'];
};

export type UserWithPosts = {
  __typename?: 'UserWithPosts';
  posts?: Maybe<Array<Post>>;
  user?: Maybe<User>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<
  TResult,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = Record<PropertyKey, never>,
  TParent = Record<PropertyKey, never>,
  TContext = Record<PropertyKey, never>,
  TArgs = Record<PropertyKey, never>,
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AllPostQueryResponse: ResolverTypeWrapper<AllPostQueryResponse>;
  AllUserQueryResponse: ResolverTypeWrapper<AllUserQueryResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreatePost: CreatePost;
  CreateUser: CreateUser;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Post: ResolverTypeWrapper<Post>;
  PostMutationResponse: ResolverTypeWrapper<PostMutationResponse>;
  PostQueryResponse: ResolverTypeWrapper<PostQueryResponse>;
  PostWithAuthor: ResolverTypeWrapper<PostWithAuthor>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Role: Role;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdatePost: UpdatePost;
  UpdateUser: UpdateUser;
  User: ResolverTypeWrapper<User>;
  UserMutationResponse: ResolverTypeWrapper<UserMutationResponse>;
  UserQueryResponse: ResolverTypeWrapper<UserQueryResponse>;
  UserWithPosts: ResolverTypeWrapper<UserWithPosts>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AllPostQueryResponse: AllPostQueryResponse;
  AllUserQueryResponse: AllUserQueryResponse;
  Boolean: Scalars['Boolean']['output'];
  CreatePost: CreatePost;
  CreateUser: CreateUser;
  Int: Scalars['Int']['output'];
  Mutation: Record<PropertyKey, never>;
  Post: Post;
  PostMutationResponse: PostMutationResponse;
  PostQueryResponse: PostQueryResponse;
  PostWithAuthor: PostWithAuthor;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  UpdatePost: UpdatePost;
  UpdateUser: UpdateUser;
  User: User;
  UserMutationResponse: UserMutationResponse;
  UserQueryResponse: UserQueryResponse;
  UserWithPosts: UserWithPosts;
};

export type AuthDirectiveArgs = {
  requires?: Maybe<Role>;
};

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = GraphQLContext,
  Args = AuthDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AllPostQueryResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['AllPostQueryResponse'] = ResolversParentTypes['AllPostQueryResponse'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<Array<ResolversTypes['PostWithAuthor']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AllUserQueryResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['AllUserQueryResponse'] = ResolversParentTypes['AllUserQueryResponse'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<Array<ResolversTypes['UserWithPosts']>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  createPost?: Resolver<
    ResolversTypes['PostMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, 'input'>
  >;
  createUser?: Resolver<
    ResolversTypes['UserMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >;
  deletePost?: Resolver<
    ResolversTypes['PostMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostArgs, 'id'>
  >;
  deleteUser?: Resolver<
    ResolversTypes['UserMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, 'id'>
  >;
  updatePost?: Resolver<
    ResolversTypes['PostMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePostArgs, 'input'>
  >;
  updateUser?: Resolver<
    ResolversTypes['UserMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >;
};

export type PostResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post'],
> = {
  authorId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  published?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PostMutationResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['PostMutationResponse'] = ResolversParentTypes['PostMutationResponse'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type PostQueryResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['PostQueryResponse'] = ResolversParentTypes['PostQueryResponse'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type PostWithAuthorResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['PostWithAuthor'] = ResolversParentTypes['PostWithAuthor'],
> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  post?: Resolver<
    Maybe<ResolversTypes['PostQueryResponse']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, 'id'>
  >;
  posts?: Resolver<ResolversTypes['AllPostQueryResponse'], ParentType, ContextType>;
  user?: Resolver<
    Maybe<ResolversTypes['UserQueryResponse']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, 'id'>
  >;
  users?: Resolver<Maybe<ResolversTypes['AllUserQueryResponse']>, ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  age?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type UserMutationResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserMutationResponse'] = ResolversParentTypes['UserMutationResponse'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type UserQueryResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserQueryResponse'] = ResolversParentTypes['UserQueryResponse'],
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['UserWithPosts']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type UserWithPostsResolvers<
  ContextType = GraphQLContext,
  ParentType extends ResolversParentTypes['UserWithPosts'] = ResolversParentTypes['UserWithPosts'],
> = {
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  AllPostQueryResponse?: AllPostQueryResponseResolvers<ContextType>;
  AllUserQueryResponse?: AllUserQueryResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostMutationResponse?: PostMutationResponseResolvers<ContextType>;
  PostQueryResponse?: PostQueryResponseResolvers<ContextType>;
  PostWithAuthor?: PostWithAuthorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserMutationResponse?: UserMutationResponseResolvers<ContextType>;
  UserQueryResponse?: UserQueryResponseResolvers<ContextType>;
  UserWithPosts?: UserWithPostsResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = GraphQLContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};
