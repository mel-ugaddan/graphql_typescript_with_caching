export * from './errorcodes';

export const USER_RESOLVER_MESSAGES = {
  fetch_user_success: 'Fetch User Success !',
  fetch_user_w_posts_success: 'Fetch User with Posts Success !',
  fetch_all_success: 'Fetch all users Success !',
  fetch_all_w_posts_success: 'Fetch all users with Posts Success !',
  create_user_success: 'Create User Success !',
  update_user_success: 'Update User Success !',
  delete_user_success: 'Delete User Success !',
};

export const POST_RESOLVER_MESSAGES = {
  fetch_post_success: 'Fetch Post Success !',
  fetch_post_w_author_success: 'Fetch Posts with Author Success !',
  fetch_all_success: 'Fetch all Posts Success !',
  fetch_all_w_author_success: 'Fetch all Posts with Author Success !',
  create_post_success: 'Create Post Success !',
  update_post_success: 'Update Post Success !',
  delete_post_success: 'Delete Post Success !',
} as const;

export const REQUEST_MESSAGES = {
  error_message: 'Internal Service Error !',
};

export const VALIDATION_MESSAGES = {
  provide_at_least_one_field: `At least one field besides 'id' must be provided`,
};

export const USER_CACHE_LIMIT = 100;
export const POST_CACHE_LIMIT = 100;

export const REDIS_CACHE_PREFIX = {
  user: 'user',
  post: 'post',
};
