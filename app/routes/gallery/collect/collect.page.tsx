import { useRef, useState } from 'react';
import { data, Form, Link, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/collect.page';
import type { Record } from '~/.server/types/record.type';
import { type FileUpload, parseFormData } from '@mjackson/form-data-parser';
import { MemoryFileStorage } from '@mjackson/file-storage/memory';

import { commitSession, getSession } from '~/sessions.server';
import { cokSlug } from '~/cookies.server';

import { folderApi, recordApi } from '~/.server/endpoints';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { CardFile } from '~/gallery/components/Card-File';
import { imgtodata } from '~/.server/utils/imgtodata';

interface FolderPass {
  slug: string;
  name: string;
  description: string;
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);
  const cookie = (await cokSlug.parse(cookieHeader)) || {};

  const token = session.get('token')!;
  const folderSlug = params.folderSlug;
  const { data: folder, status: fStatus } = await folderApi.getfolderId(token, folderSlug);
  const { data: tRecord, status: rStatus } = await recordApi.getrecordsbyFolder(token, folder?.id!);
  cookie.folderId2 = folder?.id;

  const folderPass: FolderPass = { description: folder?.description!, name: folder?.name!, slug: folder?.slug! };
  const recordInfolder: Record[] = tRecord;

  // const recordInfolder: any[] = tRecord.map((item) => {
  //   const findImage = async (filename: string | undefined | null) => {
  //     if (!filename) {
  //       return '';
  //     }
  //     let imagedata;
  //     let imageDataUri;
  //     const { data, status } = await recordApi.getrecordImage(token, filename);
  //     if (status == 200) {
  //       imagedata = data;

  //       imageDataUri = await imgtodata(data);
  //       console.log(imageDataUri);
  //       console.log('first');
  //     } else {
  //       imagedata = '';
  //     }

  //     return status === 200 ? imageDataUri : imagedata;
  //   };

  //   return {
  //     ...item,
  //     imageDataUri: findImage(item.filename)
  //       .then((result) => result)
  //       .catch((error) => error),
  //   };
  // });

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  return data(
    { folderPass, recordInfolder, token },
    {
      headers: {
        'Set-Cookie': await cokSlug.serialize(cookie, { expires: expirationDate }),
      },
    }
  );
};

export async function action({ request, params }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);
  const cookie = (await cokSlug.parse(cookieHeader)) || {};
  const token = session.get('token')!;
  const folderSlug = params.folderSlug;

  const folderId = cookie.folderId2;

  const uploadHandler = async (fileUpload: FileUpload) => {
    const fileStorage = new MemoryFileStorage();
    if (fileUpload.fieldName === 'my_file') {
      let storageKey = `user-${token}-avatar`;
      await fileStorage.set(storageKey, fileUpload);
      return fileStorage.get(storageKey);
    }
    // Ignore any files we don't recognize the name of...
  };

  const formData = await parseFormData(request, uploadHandler);
  const recordName = formData.get('recordName')?.toString() ?? '';
  const uploadfile = formData.get('my_file');

  const formData2 = new FormData();
  formData2.append('photo', uploadfile!);
  formData2.append('folderId', folderId);
  formData2.append('name', recordName);
  formData2.append('tags', 'ron internaciona familia grupo clasico');

  const { data: createdRecord, status } = await recordApi.create(token, formData2);

  return redirect(`/gal/collect/${folderSlug}`, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  // const { recordInfolder } = serverData;
  return serverData;
}

clientLoader.hydrate = true as const;

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  const formData = await request.clone().formData();
  const dataObject = Object.fromEntries(formData);
  const { recordName } = dataObject;

  let errorsf: Map<string, string> = new Map([]);

  if (recordName.toString().length <= 5) {
    errorsf.set('recordName', 'El nombre debe contener mas de 5 caracteres.');
  }

  if (recordName.toString().length >= 41) {
    errorsf.set('recordName', 'El nombre debe contener menos de 40 caracteres.');
  }

  if (errorsf.size <= 0) {
    await serverAction();
  }
  return { errorsf, dataObject };
}

export default function GalleryCollectPage({ loaderData, actionData }: Route.ComponentProps) {
  const inputNombre = useRef<HTMLInputElement>(null);
  const navegation = useNavigation();

  const { folderPass, recordInfolder } = loaderData;

  // console.log(recordInfolder[1].imageDataUri!);
  const folderUrl = `/gal/folders/${folderPass.slug}`;

  const isSubmitting = navegation.state === 'submitting';

  return (
    <section className="p-4">
      <header className="flex flex-row items-baseline justify-between">
        <Link to={folderUrl}>
          <h1 className="text-2xl mb-2 underline  hover:text-blue-400">{folderPass.name}</h1>
        </Link>
        <span className="">{folderPass.description}</span>
      </header>

      <Card className="bg-gray-50/30 p-4">
        <Form className="flex gap-2" method="POST" encType="multipart/form-data">
          <Input
            id="recordName"
            className="w-2/5 "
            type="text"
            name="recordName"
            placeholder="documentos personales"
            errState={actionData?.errorsf.has('recordName')}
            errMessage={actionData?.errorsf.get('recordName')}
          />

          <Input id="file" type="file" className="w-2/5" placeholder="Upload file" name="my_file" accept="image/*" />

          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            Enviar
          </Button>
        </Form>
      </Card>

      <hr className="my-2" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recordInfolder.map((trecord) => (
          <CardFile
            recordId={trecord.id}
            title={trecord.name}
            metadata={trecord.filename ? trecord.filename : ''}
            key={trecord.id}
            filename={trecord.filename ? trecord.filename : undefined}
            // token={token}
          />
        ))}

        {/* <Card className="w-3/10 bg-gray-100/40 shadow-lg">
          <CardContent> */}
        {/* encType="multipart/form-data"> */}

        {/* {imageUrl && (
                  <div>
                    <h3>Vista previa de la imagen:</h3>
                    <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                  </div>
                )} */}
        {/* </CardContent>
        </Card> */}
      </div>
    </section>
  );
}
