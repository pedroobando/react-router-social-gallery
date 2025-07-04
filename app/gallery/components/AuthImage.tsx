import { useState, useEffect, type FC } from 'react';
import axios from 'axios';
import placeholder from '@/assets/placeholder.svg';

const endPointUrl: string = 'http://localhost:3000/api/image/record';

export interface IImageAuth extends React.ComponentProps<'img'> {
  imageName: string;
  token: string;
}

const ImageAuth: FC<IImageAuth> = ({ imageName, token, ...props }) => {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        let url: string;
        if (imageName.length !== 0) {
          const response = await axios.get(`${endPointUrl}/${imageName}`, {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          url = URL.createObjectURL(response.data);
          setObjectUrl(url);
        } else {
          setObjectUrl(placeholder);
        }

        // Limpieza cuando el componente se desmonte
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    fetchImage();
  }, [imageName]);

  // {...props}
  return <img src={objectUrl} {...props} />;
};

export default ImageAuth;
