import axios, {
  AxiosError,
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

// Definimos una interfaz para la estructura personalizada de error que manejaremos
export interface CustomAxiosError<T = any> extends Error {
  config: AxiosRequestConfig;
  code?: string;
  request?: any;
  response?: AxiosResponse<T>;
  isAxiosError: boolean;
  status?: number;
  data?: T;
}

// Función para determinar si un error es de tipo AxiosError
// function isAxiosError(error: any): error is AxiosError {
//   return error.isAxiosError === true;
// }

// Configuración base de Axios
const bckApi: AxiosInstance = axios.create({
  baseURL: process.env.VITE_BASE_URL_API || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status: number) => {
    return status >= 200 && status < 400; // Por defecto, considera exitosos los códigos 2xx y 3xx
  },
});

// Interceptor para requests
bckApi.interceptors.request.use(
  (config) => {
    // Puedes agregar lógica para auth tokens aquí
    // const token = localStorage.getItem('authToken') || '';
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
bckApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError | any) => {
    if (isAxiosError(error)) {
      const customError: CustomAxiosError = {
        ...error,
        name: 'CustomAxiosError',
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config as AxiosRequestConfig, // Ensure config is always defined
      };

      // Aquí puedes manejar diferentes códigos de estado
      if (error.response) {
        const errMessage = error.response.data.message;
        switch (error.response.status) {
          case 400:
            customError.message = errMessage || 'Petición incorrecta';
            break;
          case 401:
            customError.message = errMessage || 'No autorizado';
            break;
          case 403:
            customError.message = errMessage || 'Prohibido';
            break;
          case 404:
            customError.message = errMessage || 'Recurso no encontrado';
            break;
          case 500:
            customError.message = 'Error interno del servidor';
            break;
          case 503:
            customError.message = 'Not conection server';
            break;
          default:
            customError.message = `Error ${error.response.status}`;
        }
      }
      return Promise.reject(customError);
    }

    // Si no es un error de Axios, lo pasamos tal cual
    return Promise.reject(error);
  }
);

export default bckApi;
