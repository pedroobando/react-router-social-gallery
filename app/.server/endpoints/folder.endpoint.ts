import type { AxiosResponse } from 'axios';
import bckendApi from '../apis/backend-api';
import { htoken } from '../utils/header.token';

// import type { Auth, AuthResponse, RegisterUserDto } from '../types/auth.type';
import type { createFolderDto, Folder, updateFolderDto } from '../types/folder.type';

// const tokenInternal = async () => {
//   const session = await getSession(request.headers.get('Cookie'));
//   const userIdKey = session.get('userId');
// };

export const folderApi = {
  // Obtener un usuario por ID
  // getUserById: async (id: string): Promise<AxiosResponse<Auth, any>> => {
  //   const response = await bckendApi.get<Auth>(`/auth/${id}`);
  //   return response;
  // },

  // Crear un nuevo folder
  create: async (token: string, createData: createFolderDto): Promise<AxiosResponse<Folder>> => {
    const response = await bckendApi.post<Folder>('/folder', createData, htoken(token));
    return response;
  },

  patch: async (token: string, folderId: string, updateData: updateFolderDto): Promise<AxiosResponse<Folder, any>> => {
    const response = await bckendApi
      .patch<Folder[]>(`/folder/${folderId}`, { ...updateData }, htoken(token))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return {
          ...error.response,
          data: {
            ...(error.response?.data || {}),
            message: error.response?.data?.message || 'Unknown error',
          },
        };
      });
    return response;
  },

  // Obtener todos los folder de un usuario
  getfolders: async (token: string): Promise<AxiosResponse<Folder[], any>> => {
    const response = bckendApi
      .get<Folder[]>('/folder', htoken(token))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        return {
          ...error.response,
          data: {
            ...(error.response?.data || {}),
            message: error.response?.data?.message || 'Unknown error',
          },
        };
      });

    // console.log(response);
    return response;
  },

  getfolderId: async (token: string, id: string) => {
    const folderId = id.trim();
    const response = bckendApi
      .get<Folder>(`/folder/${folderId}`, htoken(token))
      .then((result) => {
        return { data: result.data, status: result.status };
      })
      .catch((error) => {
        // console.log({ ...error.response.data });
        return { data: undefined, status: error.response.data.statusCode };
      });

    // console.log(response);
    return response;
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

  // authLogin: async (email: string, password: string): Promise<AxiosResponse<AuthResponse, any>> => {
  //   const response = await bckendApi.post<AuthResponse>('/auth/login', {
  //     email,
  //     password,
  //   });
  //   return response;
  // },

  // Obtener perfil del usuario actual
  // getProfile: async (): Promise<User> => {
  //   const response = await apiClient.get<User>('/auth/profile');
  //   return response;
  // },
};
