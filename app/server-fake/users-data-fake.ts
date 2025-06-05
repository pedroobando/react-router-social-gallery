import { type User, type UserRegister, UserStatus } from '@/user/interfaces/user.interface';
import { sleep } from '@/lib/sleep';

export const validateCredentials = async (email: string, password: string) => {
  // Simulate a credential check

  await sleep(200);
  const findUser = await getUserByEmail(email);
  if (!findUser || findUser.password !== password) {
    return undefined;
  }
  return await loginUser(findUser);
};

// ! Auth
export const loginUser = async (user: User) => {
  await sleep(100);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: 'token-1234567890',
  };
};

export const checkAuth = async (token: string) => {
  await sleep(500);

  if (token !== 'token-1234567890') {
    throw new Error('Invalid token');
  }

  console.log('checkAuth', token);

  return {
    id: 'U1-12345',
    name: 'Fernando Herrera',
  };
};

//! ====== Users ======
const fakeUsers = {
  records: {} as Record<string, User>,
  getUser: (id: string) => fakeUsers.records[id],
  getUserByEmail: (email: string) => {
    return Object.values(fakeUsers.records).find((user) => user.email === email);
  },
  // Returns all clients sorted by memberSince date, most recent first
  getUsers: () => {
    return Object.values(fakeUsers.records).sort(
      (a, b) => b.memberSince.getTime() - a.memberSince.getTime()
    );
  },
  createEmptyUser: (userReg: UserRegister) => {
    const user: User = {
      id: `U1-${Math.floor(10000 + Math.random() * 90000)}`, // Generates U1-XXXXX format
      name: userReg.email.split('@')[0], // Use the email prefix as the name
      email: userReg.email,
      password: userReg.password, // Password should be hashed in a real application
      status: UserStatus.USER,
      memberSince: new Date(),
    };

    fakeUsers.setUser(user);

    return user;
  },
  setUser: (user: User) => {
    fakeUsers.records[user.id] = user;
  },
};

export const getUsers = async (): Promise<User[]> => {
  await sleep(500);
  return fakeUsers.getUsers();
};

export const getUser = async (id: string): Promise<User> => {
  await sleep(500);
  return fakeUsers.getUser(id);
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  await sleep(500);
  return fakeUsers.getUserByEmail(email);
};

export const createUser = async (user: UserRegister): Promise<User> => {
  await sleep(500);
  const existingUser = await getUserByEmail(user.email);
  if (!!existingUser) {
    throw new Error(`El email ${user.email}, ya esta registrado.`);
  }
  const newUser = fakeUsers.createEmptyUser(user); // Ensure we have an empty user to start with
  return newUser;
};
