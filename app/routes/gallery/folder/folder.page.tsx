import { Form, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/folder.page';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import { CardFolder } from '~/gallery/components/Card-Folder';

import { commitSession, getSession } from '~/sessions.server';
import { folderApi } from '~/.server/endpoints/folder.endpoint';
import { useEffect, useRef } from 'react';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const token = session.get('token')!;
  const { data: folderList, status } = await folderApi.getfolders(token);

  return { folderList };
};

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token')!;
  let formData = await request.formData();
  let dataObject = Object.fromEntries(formData);
  let { folderName, folderDescription } = dataObject;

  const { data: userRegisted, status } = await folderApi.create(token, {
    name: folderName.toString(),
    description: folderDescription.toString(),
  });

  if (status !== 201) {
    // Adjust this according to the actual error property in AuthResponse
    const errorMsg = (userRegisted as any)?.message || 'Registration failed';
    session.flash('error', errorMsg);
    return redirect('/gal/folders', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });

    // return data(
    //   { error: errorMsg },
    //   {
    //     headers: {
    //       'Set-Cookie': await commitSession(session),
    //     },
    //   }
    // );
  }

  return redirect('/gal/folders', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  const formData = await request.clone().formData();
  const dataObject = Object.fromEntries(formData);
  const { folderName, folderDescription } = dataObject;

  console.log('ClientAction:', folderDescription, folderName);

  let errorsf: Map<string, string> = new Map([]);

  if (folderName.toString().length <= 5) {
    errorsf.set('folderName', 'El nombre debe ser mas de 2 caracteres.');
  }

  if (folderDescription.toString().length <= 2) {
    errorsf.set('folderDescription', 'La descripcion debe ser mayor a 2 caracteres.');
  }

  if (errorsf.size <= 0) {
    await serverAction();
  }
  return { errorsf, dataObject };
}

const FoldersPage = ({ actionData, loaderData }: Route.ComponentProps) => {
  const inputNombre = useRef<HTMLInputElement>(null);
  const inputDescri = useRef<HTMLInputElement>(null);

  const navegation = useNavigation();
  const isPosting = navegation.state === 'submitting';
  const { folderList } = loaderData;

  useEffect(() => {
    if (inputNombre.current) inputNombre.current.value = '';
    if (inputDescri.current) inputDescri.current.value = '';
  }, [loaderData]);

  return (
    <section className="flex flex-col  p-4 gap-4">
      <h2 className="text-2xl">Folder Page</h2>

      <Form method="POST" className="grid grid-cols-1 md:grid-cols-4 border-1 rounded-sm border-solid p-3 gap-2">
        <Input
          id="folderName"
          ref={inputNombre}
          name="folderName"
          type="text"
          placeholder="Folder name"
          autoComplete="off"
          errState={actionData?.errorsf.has('folderName')}
          errMessage={actionData?.errorsf.get('folderName')}
        />

        <div className="col-span-1 md:col-span-2">
          <Input
            id="folderDescription"
            ref={inputDescri}
            name="folderDescription"
            type="text"
            placeholder="Folder description"
            autoComplete="on"
            errState={actionData?.errorsf.has('folderDescription')}
            errMessage={actionData?.errorsf.get('folderDescription')}
          />
        </div>
        <Button disabled={isPosting} variant="outline" type="submit">
          Crear Folder
        </Button>
      </Form>

      <hr />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {folderList?.map((folderItem) => (
          <CardFolder key={folderItem.id} folderId={folderItem.id} {...folderItem} />
        ))}
      </div>
    </section>
  );
};
export default FoldersPage;
