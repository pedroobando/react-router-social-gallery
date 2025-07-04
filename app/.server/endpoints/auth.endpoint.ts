import type { AxiosResponse } from 'axios';
import bckendApi, { type CustomAxiosError } from '../apis/backend-api';
import { htoken } from '../utils/header.token';

import type { Auth, AuthResponse, RegisterUserDto } from '../types/auth.type';

export const userApi = {
  // Obtener todos los usuarios
  getAllUsers: async (token: string): Promise<AxiosResponse<Auth[], any>> => {
    const response = await bckendApi.get<Auth[]>('/auth', htoken(token));
    return response;
  },

  // Obtener un usuario por ID
  getUserById: async (id: string): Promise<AxiosResponse<Auth, any>> => {
    const response = await bckendApi.get<Auth>(`/auth/${id}`);
    return response;
  },

  // Crear un nuevo usuario
  authRegister: async (email: string, password: string): Promise<AxiosResponse<AuthResponse, any>> => {
    const userData: RegisterUserDto = {
      email,
      password,
      roles: 'admin',
    };
    try {
      const response = await bckendApi.post<AuthResponse>('/auth/register', userData);
      return response;
    } catch (error: any) {
      return {
        ...error.response,
        data: {
          ...(error.response?.data || {}),
          message: error.response?.data?.message || 'Unknown error',
        },
      };
    }
  },

  // Actualizar un usuario
  // updateUser: async (id: string, userData: UpdateUserDto): Promise<User> => {
  //   const response = await apiClient.patch<User>(`/users/${id}`, userData);
  //   return response;
  // },

  // Eliminar un usuario
  // deleteUser: async (id: string): Promise<void> => {
  //   await apiClient.delete(`/users/${id}`);
  // },

  authLogin: async (email: string, password: string) => {
    return bckendApi
      .post<AuthResponse>('/auth/login', {
        email,
        password,
      })
      .then((response) => {
        // console.log('Respuesta exitosa:', response.data);
        // return { data: response.data as AuthResponse, status: response.status, statusText: response.statusText };
        return response;
      })
      .catch((error: CustomAxiosError) => {
        // if (error.status) {
        //   console.error(`Error ${error.status}: ${error.message}`);
        //   console.error('Detalles:', error.data);
        // } else {
        //   console.error('Error de conexión:', error.message);
        // }
        return {
          data: { message: error.message },
          status: error.status,
          statusText: error.name,
        };
      });
  },

  // Obtener perfil del usuario actual
  // getProfile: async (): Promise<User> => {
  //   const response = await apiClient.get<User>('/auth/profile');
  //   return response;
  // },
};
