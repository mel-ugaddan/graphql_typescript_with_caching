type Roles = 'admin' | 'user' | 'guest';

type RolePermissions = Record<PropertyKey, 'input'>;

const roles_constants: RolePermissions = {
  admin: 'input',
  user: 'input',
  guest: 'input',
};

// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
// };
// type Exclude<T, U> = T extends U ? never : T;
// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
// type NonNullable<T> = T & {};
type User = {
  id: number;
  name: string;
  email: string;
};

type UserNameOnly = Pick<User, 'name'>;

const test: UserNameOnly = {
  name: 'Name',
};

type UserIdAndEmail = Pick<User, 'id' | 'email'>;

type UserWithoutIdAndEmail = Omit<User, 'id' | 'email'>;

type A = string | null | undefined;

type MyNonNullable = A & {};
// Result: string | null | undefined (same as A)

type TSNonNullable = NonNullable<A>;
// Using built-in NonNullable
// Result: string

type User2 = {
  id?: number;
  name?: string;
  email?: string;
};

type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

type UserWithRequiredName = RequireFields<User2, 'name' | 'email'>;

type UserPickKey = Pick<User2, 'name' | 'email'>;

// Instantiate a constant
const userRequiredName: UserWithRequiredName = {
  name: 'Charlie', // required
  id: 2, // optional
  email: 'charlie@example.com', // optional
};

interface User3 {
  id: number;
  name: string;
  email: string;
}

type UserRecord = Record<keyof User3, string>;
/*
Equivalent to:
type UserRecord = {
    id: string;
    name: string;
    email: string;
}
*/

const userStrings: UserRecord = {
  id: '123',
  name: 'Alice',
  email: 'alice@example.com',
};

function doNothing(test: string, params: Record<PropertyKey, never>) {
  console.log('Nothing to see here!', params);
}

// doNothing("test",{}); // ✅ OK
// doNothing("test",{ foo: 123 }

type TArgs = {
  input: string;
  limit?: number;
};

type TRequired = keyof TArgs;

const requiredKey: TRequired = 'input'; // ✅ OK
const requiredKey2: TRequired = 'limit'; // ✅ OK
// const requiredKey3: TRequired = "foo"    // ❌ Error

type Example<TRequired extends keyof TArgs> = {
  required: TRequired;
};

const ex1: Example<'input'> = {
  required: 'input',
}; // ✅

const ex2: Example<'input' | 'limit'> = {
  required: 'limit',
}; // ✅
// const ex3: Example<"foo"> = {
//   required: "foo"
// }
// ❌ Error: Type '"foo"' does not satisfy constraint 'keyof TArgs'

type FindManyUnion =
  // Post version
  | (<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs>) => Promise<Post[]>)
  // User version
  | (<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs>) => Promise<User[]>);
