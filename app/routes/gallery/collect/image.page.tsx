import { commitSession, getSession } from '~/sessions.server';
// import { recordApi } from '~/.server/endpoints';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { data, redirect } from 'react-router';
import type { Route } from './+types/image.page';
import ImageAuth from '~/gallery/components/AuthImage';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token')!;

  if (!session.get('userId')) {
    return redirect('/auth');
  }

  return data(
    { error: session.get('error'), token },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
//   const cookieHeader = request.headers.get('Cookie');
//   const session = await getSession(cookieHeader);

//   const { filename } = params;
//   const token = session.get('token')!;

//   console.log('consola.');
//   // const { data: dataFile, status: fStatus } = await recordApi.getrecordImage(token, filename);

//   // const bfile = new Blob(dataFile);

//   // const imagenUrl = URL.createObjectURL(dataFile);

//   // console.log('loader', fStatus);

//   return { token, filename };
// }

// export async function clientLoader({ params }: Route.ClientLoaderArgs) {
//   // const { filename, token } = await serverLoader();
//   // const { data: dataFile, status: fStatus } = await recordApi.getrecordImage(token, filename);

//   // console.log(fStatus);

//   return { filename: 23232323, dataFile: params.filename };
// }

export default function Product({ params, loaderData }: Route.ComponentProps) {
  const fileName: string = params.filename || '';

  const { token } = loaderData;

  // const urlbackend = `http://localhost:3000/api/image/record/${fileName}`;
  return (
    <div className="m-2 p-4 flex md:justify-center">
      <div className="my-2 border-2 p-2 rounded-md w-xs md:w-md lg:w-lg shadow-lg">
        <Zoom>
          <ImageAuth
            imageName={fileName}
            token={token}
            alt={`Imagen para hacer zoom ${fileName}`}
            className="rounded-md w-full"
          />
          {/* <img src={urlbackend} alt={`Imagen para hacer zoom ${fileName}`} className="rounded-md w-full" /> */}
          {/* <img alt="Imagen para hacer zoom" src="/tu-imagen.jpg" width="500" /> */}
        </Zoom>

        <hr className="mt-4" />
        <h2 className="text-xl mt-2 text-right mr-2">{fileName}</h2>
      </div>
    </div>
  );
}
