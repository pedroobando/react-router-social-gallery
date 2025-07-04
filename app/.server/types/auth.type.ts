export interface Auth {
  id: string;
  email: string;
  roles: string;
  active: boolean;
  // createdAt: string;
  // updatedAt: string;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  roles: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  active?: string;
  roles?: boolean;
}

export interface AuthResponse extends Auth {
  token: string;
}
