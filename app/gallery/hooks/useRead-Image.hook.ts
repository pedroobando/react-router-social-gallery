import { useEffect, useState } from 'react';
import fendApi, { type CustomAxiosError } from '@/lib/frontend-api';

export interface ReadImageHookProps {
  token: string;
  filename: string;
}

export const useReadImage = ({ filename, token }: ReadImageHookProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      console.log('fetchImage');
      try {
        setLoading(true);
        // const response = await bckendApi.get<Auth>(`/auth/${id}`);
        // fetch('http://localhost:3000/api/image/record/20250630_135655_8402.jpeg', {
        //   headers:{

        //   }
        // });
        const response = await fendApi.get(`image/record/${filename}`, {
          headers: {
            Authorization: `Bearer ${token}`, // O tu método de autenticación
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        });

        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error al cargar la imagen:', err);
        setError('No se pudo cargar la imagen');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Limpieza al desmontar el componente
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []); // Añade dependencias si es necesario

  return { loading, error, imageUrl };
};
