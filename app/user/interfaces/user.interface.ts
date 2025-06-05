export enum UserStatus {
  USER = 'user',
  ADMIN = 'admin',
  SUPER = 'super',
}

export interface UserRegister {
  email: string;
  password: string;
}

export interface User extends UserRegister {
  id: string; // C1-12345
  name: string;
  memberSince: Date;
  status: UserStatus;
}

export interface Message {
  id: string;
  clientId: string;
  content: string;
  createdAt: Date;
  sender: 'agent' | 'client';
  like: 'liked' | 'disliked' | 'neutral';
}
