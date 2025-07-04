import { data, Form, redirect, useNavigation } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type { Route } from './+types/testing.arg.page';
import { sleep } from '~/lib/sleep';
import { commitSession, getSession } from '~/sessions.server';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  // if (session.has('userId')) {
  //   return redirect('/');
  // }

  const resultado = [{ no: 'pedro', pais: 'venexul' }];

  return data(
    { error: session.get('error'), resultado: resultado },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  let formData = await request.formData();
  let dataObject = Object.fromEntries(formData);
  const { nombre, pais } = dataObject;
  // console.log(dataObject);

  const actionResultBack = await sleep(500);

  // Si el backend presento problemas
  if (nombre !== 'pedro' || pais !== 'venezuela') {
    session.flash('error', 'Invalid username/password');

    // Redirect back to the login page with errors.
    return redirect('/testing', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  // si paso todo bien lo enviamos a la siguiente pagina
  // session.set('userId', userId);
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  // const session = await getSession(request.headers.get('Cookie'));
  let formData = await request.clone().formData();
  let dataObject = Object.fromEntries(formData);

  let { nombre, pais, inicio } = dataObject;

  // Convierte el valor a un objeto Date
  const fechaUTC = new Date(inicio.toString());
  // Convierte la fecha a la zona horaria local
  const fechaLocal = new Date(fechaUTC.getTime() + fechaUTC.getTimezoneOffset() * 60000);

  let errorsf: Map<string, string> = new Map([]);

  if (nombre.toString().length <= 4) {
    errorsf.set('nombre', 'El nombre debe ser mayor de 4 caracteres');
  }
  if (pais.toString().length <= 6) {
    errorsf.set('pais', 'El pais debe contener mas de 6 caracteres');
  }

  if (errorsf.size <= 0) {
    await serverAction();
  }

  return { errorsf, dataObject };
}

// Estudias Session Server - Servidor de manejo de sesiones
// Detalles

export default function TestingPage({ loaderData, actionData }: Route.ComponentProps) {
  const navegation = useNavigation();
  const isPosting = navegation.state === 'submitting';
  // console.log(loaderData.error);

  const { error } = loaderData;

  // console.log(actionData?.errorsf.has('nombre'));

  return (
    <div className="p-10">
      <h1 className="text-blue-500 text-4xl">Pagina Testing</h1>
      {error ? <div className="error">{error}</div> : null}
      <Form id="formRouter" method="POST">
        <section className="flex flex-col p-4 m-y-2 gap-4">
          <div>
            <Input
              id="nombre"
              name="nombre"
              placeholder="nombre"
              autoComplete="on"
              errState={actionData?.errorsf.has('nombre')}
              errMessage={actionData?.errorsf?.get('nombre')}
            />
          </div>

          <Input
            id="pais"
            name="pais"
            placeholder="Pais"
            autoComplete="on"
            errState={actionData?.errorsf?.has('pais')}
            errMessage={actionData?.errorsf?.get('pais')}
          />
          <Input
            id="inicio"
            name="inicio"
            type="date"
            // errState={actionData?.errorsf?.has('inicio')}
            // errMessage={actionData?.errorsf?.get('inicio')}
          />
        </section>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="submit"
            variant="default"
            disabled={isPosting}
            className="duration-300 transition-all"
          >
            Enviar
          </Button>
          <Button type="reset" variant="secondary">
            Limpiar
          </Button>
        </div>
      </Form>
    </div>
  );
}
