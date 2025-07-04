import type { AxiosResponse } from 'axios';
import bckendApi from '../apis/backend-api';
import { htoken, htokenI } from '../utils/header.token';

import type { createRecordDto, Record, updateRecordDto } from '../types/record.type';

const apirouteurl: string = '/record';

export const recordApi = {
  // Crear un nuevo folder
  create: async (token: string, createData: any): Promise<AxiosResponse<Record, any>> => {
    return await bckendApi
      .post<Record>(apirouteurl, createData, htokenI(token))
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
  },

  patch: async (token: string, recordId: string, updateData: updateRecordDto): Promise<AxiosResponse<Record, any>> => {
    return await bckendApi
      .patch<Record>(`${apirouteurl}/${recordId}`, { ...updateData }, htoken(token))
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
  },

  // Obtener todos los registro de un usuario
  getrecords: async (token: string): Promise<AxiosResponse<Record[], any>> => {
    return await bckendApi
      .get<Record[]>(apirouteurl, htoken(token))
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
  },

  // Obtener todos los registro de una carpeta de un usuario
  getrecordsbyFolder: async (token: string, folderId: string): Promise<AxiosResponse<Record[], any>> => {
    return await bckendApi
      .get<Record[]>(`${apirouteurl}/folder/${folderId}`, htoken(token))
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
  },

  getrecord: async (token: string, term: string): Promise<AxiosResponse<Record, any>> => {
    return await bckendApi
      .get<Record>(`${apirouteurl}/${term}`, htoken(token))
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
  },

  getrecordImage: async (token: string, filename: string) => {
    return await bckendApi
      .get(`${apirouteurl}/image/${filename}`, { ...htokenI(token) })
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
  },
};
