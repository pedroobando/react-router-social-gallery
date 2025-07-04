import { useState, type ChangeEvent } from 'react';
import { Form } from 'react-router';
import type { Route } from './+types/create.page';

import { type FileUpload, parseFormData } from '@mjackson/form-data-parser';
import { LocalFileStorage } from '@mjackson/file-storage/local';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { getSession } from '@/sessions.server';

const fileStorage = new LocalFileStorage('./uploads/avatars');

export const loader = async ({ request }: Route.LoaderArgs) => {};

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const userIdKey = session.get('userId');

  console.log(userIdKey);

  // const form = await request.formData();
  // const _folder = form.get('folder') ?? '';
  // const _files = form.get('file');
  // console.log(_folder);
  // console.log(_files);

  const uploadHandler = async (fileUpload: FileUpload) => {
    if (fileUpload.fieldName === 'my_file') {
      let storageKey = `user-${userIdKey}-avatar3`;
      await fileStorage.set(storageKey, fileUpload);
      return fileStorage.get(storageKey);
      // process the upload and return a File
    }
  };

  const formData = await parseFormData(request, uploadHandler);
  // 'avatar' has already been processed at this point
  const _file = formData.get('my_file');

  console.log(_file);
};

const folders = [
  { value: 'FOLDER_01', label: 'FOLDER_01' },
  { value: 'FOLDER_02', label: 'FOLDER_02' },
  { value: 'FOLDER_03', label: 'FOLDER_03' },
];

const GalleryCreate = () => {
  const [input, setInput] = useState({
    folder: '',
    description: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la selección del archivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.match('image.*')) {
        setSelectedFile(file);
        // Crear una URL para la imagen seleccionada
        setImageUrl(URL.createObjectURL(file));
      } else {
        alert('Por favor, selecciona un archivo de imagen.');
      }
    }
  };

  // Manejar la carga del archivo
  // const handleUpload = () => {
  //   if (!selectedFile) {
  //     alert('Por favor, selecciona un archivo primero!');
  //     return;
  //   }

  //   // Aquí puedes agregar la lógica para subir el archivo a un servidor
  //   console.log('Archivo a subir:', selectedFile);
  //   // Ejemplo: usar una API para subir el archivo
  //   // uploadFileToServer(selectedFile);
  // };

  // Función para subir el archivo a un servidor
  const uploadFileToServer = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('https://tu-servidor.com/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Éxito:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="flex items-center justify-center -mt-10 min-h-screen  p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Subir Archivo</CardTitle>
          <CardDescription>
            Completa el formulario para subir tu archivo a la carpeta seleccionada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            className="space-y-6"
            method="POST"
            action="/gal/create"
            encType="multipart/form-data"
          >
            <div className="grid gap-2">
              <Label htmlFor="folder">Folder</Label>
              <Input
                id="folder"
                type="text"
                placeholder="Folder"
                name="folder"
                onChange={handleChange}
                value={input.folder}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Description file"
                name="description"
                onChange={handleChange}
                value={input.description}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="file">Files</Label>
              <Input
                id="file"
                type="file"
                placeholder="Upload file"
                name="my_file"
                onChange={handleFileChange}
                accept="image/*"
              />

              {/* {selectedFile && (
                <div>
                  <p>Archivo seleccionado: {selectedFile.name}</p>
                </div>
              )} */}

              {imageUrl && (
                <div>
                  <h3>Vista previa de la imagen:</h3>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Enviar
              </Button>
              <Button type="reset" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryCreate;
