import type { AxiosRequestConfig } from 'axios';

export const htoken = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const htokenI = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
      // Accept: 'image/*',
    },
  };
};

export const htokenIM = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${token}`, // O tu método de autenticación
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  };
};

// export const headerAx = {
//   htoken: (token: string): AxiosRequestConfig => {
//     return {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//   },

//   htokenBody:(token:string): AxiosRequestConfig =>{
//     htoken(token).

//   }
// };
