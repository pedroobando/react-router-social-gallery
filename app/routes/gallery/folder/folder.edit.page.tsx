import { useEffect, useRef, useState } from 'react';
import { data, Form, redirect, useNavigate, useNavigation } from 'react-router';
import type { Route } from './+types/folder.edit.page';

import { commitSession, getSession } from '~/sessions.server';
import { cokSlug } from '~/cookies.server';

import { folderApi } from '~/.server/endpoints/folder.endpoint';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '~/components/ui/input';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);
  const cookie = (await cokSlug.parse(cookieHeader)) || {};

  const token = session.get('token')!;
  const folderId = params.folderId!;
  const { data: folder, status } = await folderApi.getfolderId(token, folderId);
  cookie.folderId2 = folder?.id;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  return data(
    { folder, errorsf: undefined },
    {
      headers: {
        'Set-Cookie': await cokSlug.serialize(cookie, { expires: expirationDate }),
      },
    }
  );
}

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);
  const cookie = (await cokSlug.parse(cookieHeader)) || {};
  const token = session.get('token')!;

  const folderId = cookie.folderId2;
  let formData = await request.formData();
  let dataObject = Object.fromEntries(formData);
  let { folderName, folderDescription, active } = dataObject;

  const isActive = active ? true : false;

  const { data: patchFolder, status } = await folderApi.patch(token, folderId, {
    name: folderName.toString(),
    description: folderDescription.toString(),
    active: isActive,
  });

  return redirect('/gal/folders', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  const formData = await request.clone().formData();
  const dataObject = Object.fromEntries(formData);
  const { folderName } = dataObject;

  let errorsf: Map<string, string> = new Map([]);

  if (folderName.toString().length <= 5) {
    errorsf.set('folderName', 'El nombre debe ser mas de 5 caracteres.');
  }

  if (errorsf.size <= 0) {
    await serverAction();
  }
  return { errorsf, dataObject };
}

export default function FoldersEditPage({ actionData, loaderData }: Route.ComponentProps) {
  const inputNombre = useRef<HTMLInputElement>(null);
  const inputDescri = useRef<HTMLTextAreaElement>(null);
  const [active, setActive] = useState<boolean>(loaderData.folder?.active ? true : false);

  const navegation = useNavigation();
  const navegate = useNavigate();
  const isSubmitting = navegation.state === 'submitting';

  useEffect(() => {
    if (inputNombre.current) inputNombre.current.value = loaderData.folder?.name || '';
    if (inputDescri.current) inputDescri.current.value = loaderData.folder?.description || '';
  }, [loaderData && !loaderData.errorsf]);

  return (
    <div className="flex items-center justify-center mt-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Actualizar Folder</CardTitle>
          <CardDescription>Actualizar los datos del formulario.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="PATCH" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm pl-2" htmlFor="folderName">
                Nombre
              </Label>
              <Input
                id="folderName"
                name="folderName"
                ref={inputNombre}
                type="text"
                placeholder="Actualizar nombre"
                autoComplete="on"
                errState={actionData?.errorsf.has('folderName')}
                errMessage={actionData?.errorsf.get('folderName')}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm pl-2" htmlFor="folderDescription">
                Descripción
              </Label>
              <Textarea
                id="folderDescription"
                name="folderDescription"
                ref={inputDescri}
                placeholder="Folder description"
                autoComplete="on"
                rows={4}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="active" className="text-base">
                  Estado Activo
                </Label>
                <p className="text-sm text-muted-foreground">Activa o desactiva este elemento.</p>
              </div>
              <Switch id="active" name="active" checked={active} onCheckedChange={(checked) => setActive(checked)} />
            </div>
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Actualizar'}
              </Button>
              <Button
                type="submit"
                className="w-full"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => navegate(-1)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="w-full border-red-400 border-2 md:col-span-2"
                variant="outline"
                disabled={isSubmitting}
                // onClick={() => navegate(-1)}
              >
                Remover
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
