import { data, Form, Link, redirect, useNavigation } from 'react-router';
import type { Route } from './+types/register.page';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import placeholder from '~/assets/placeholder.svg';

import { commitSession, getSession } from '~/sessions.server';

import { userApi } from '~/.server/endpoints/auth.endpoint';
import { validateEmail } from '~/lib/valid-email';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

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

  const { data: userRegisted, status } = await userApi.authRegister(email, password);

  if (status !== 201) {
    // Adjust this according to the actual error property in AuthResponse
    const errorMsg = (userRegisted as any)?.message || 'Registration failed';
    session.flash('error', errorMsg);
    return redirect('/auth/register', {
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

  if (status === 201) {
    session.set('userId', userRegisted.id);
    session.set('name', userRegisted.email);
    session.set('token', userRegisted.token);
  }

  return redirect('/gal', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export async function clientAction({ request, serverAction }: Route.ClientActionArgs) {
  let formData = await request.clone().formData();
  let dataObject = Object.fromEntries(formData);
  let { email, password, passveri } = dataObject;

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
  if (passveri.toString().length <= 2) {
    errorsf.set('passveri', 'La verificacion debe contener mas de 2 caracteres.');
  }
  if (passveri.toString() !== password.toString()) {
    errorsf.set('passveri', 'El password no coincide con la verificación.');
  }

  if (errorsf.size <= 0) {
    await serverAction();
  }
  return { errorsf, dataObject };
}

const AuthSignUp = ({ actionData, loaderData }: Route.ComponentProps) => {
  const navegation = useNavigation();
  const isPosting = navegation.state === 'submitting';
  const { error } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form method="post" action="/auth/register" className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Register user</h1>
                <p className="text-balance text-muted-foreground">
                  Register to your Acme Inc account
                </p>
              </div>
              {error ? (
                <span className="text-center text-red-400 italic text-sm">{error}</span>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="on"
                  errState={actionData?.errorsf.has('email')}
                  errMessage={actionData?.errorsf.get('email')}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  errState={actionData?.errorsf.has('password')}
                  errMessage={actionData?.errorsf.get('password')}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="verifypass">Password Verify</Label>
                </div>
                <Input
                  id="passveri"
                  name="passveri"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  errState={actionData?.errorsf.has('passveri')}
                  errMessage={actionData?.errorsf.get('passveri')}
                />
              </div>

              <Button
                type="submit"
                className="w-full transition-opacity duration-75"
                disabled={isPosting}
              >
                Register
              </Button>

              <div className="text-center text-sm">
                I have an account?{' '}
                <Link className="underline underline-offset-4" to="/auth">
                  Sign in
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
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default AuthSignUp;
