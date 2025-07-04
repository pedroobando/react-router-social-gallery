import { data, Outlet, redirect } from 'react-router';
import type { Route } from './+types/auth-layout';
import { commitSession, getSession } from '~/sessions.server';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.get('userId')) {
    return redirect('/gal');
  }

  return data(
    { error: session.get('error') },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

const AuthLayout = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
