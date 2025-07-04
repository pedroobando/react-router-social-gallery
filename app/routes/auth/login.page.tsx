import { data, Form, Link, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/login.page';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import placeholder from '~/assets/placeholder.svg';

import { userApi } from '~/.server/endpoints/auth.endpoint';
import { commitSession, getSession } from '~/sessions.server';
import { validateEmail } from '~/lib/valid-email';
import type { AuthResponse } from '~/.server/types/auth.type';

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

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const form = await request.formData();
  const email = form.get('email')?.toString() ?? '';
  const password = form.get('password')?.toString() ?? '';

  const { data, status } = await userApi.authLogin(email, password);

  if (status !== 200) {
    const data2 = data as { message: string };
    session.flash('error', data2.message);
  }

  if (status === 200) {
    const data2 = data as AuthResponse;
    session.set('userId', data2.id);
    session.set('name', data2.email);
    session.set('token', data2.token);
  }

  return redirect('/auth', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  let formData = await request.clone().formData();
  let dataObject = Object.fromEntries(formData);
  let { email, password } = dataObject;

  let errorsf: Map<string, string> = new Map([]);

  const { errorMessage: emailMsgError, isError: emailIsError } = validateEmail(
    email.toString(),
    'Correo electronico o email no valido.'
  );

  if (emailIsError) {
    errorsf.set('email', emailMsgError?.toString()!);
  }
  if (password.toString().length <= 2) {
    errorsf.set('password', 'El password debe contener mas de 2 caracteres.');
  }

  if (errorsf.size <= 0) {
    await serverAction();
  }
  return { errorsf, dataObject };
}

const AuthSignIn = ({ loaderData, actionData }: Route.ComponentProps) => {
  const navegation = useNavigation();
  const isPosting = navegation.state === 'submitting';
  const { error } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form method="post" action="/auth" className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Login to your Acme Inc account</p>
              </div>
              {error ? <span className="text-center text-red-400 italic text-sm">{error}</span> : null}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  tabIndex={1}
                  errState={actionData?.errorsf.has('email')}
                  errMessage={actionData?.errorsf.get('email')}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-xs underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  tabIndex={2}
                  errState={actionData?.errorsf.has('password')}
                  errMessage={actionData?.errorsf.get('password')}
                />
              </div>
              <Button tabIndex={3} type="submit" className="w-full duration-300 transition-all" disabled={isPosting}>
                Login
              </Button>

              <div className="text-center text-xs">
                Don&apos;t have an account?{' '}
                <Link className="underline underline-offset-4" to="/auth/register">
                  Sign up
                </Link>
              </div>
            </div>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={placeholder}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default AuthSignIn;
