import { createCookieSessionStorage } from 'react-router';

type SessionData = {
  userId: string;
  name: string;
  token: string;
};

type SessionFlashData = {
  error: string;
};

const envSecrectCookies = import.meta.env.VITE_SESSION_SECRECT_KEY; // "123"

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  // console.log(import.meta.env.VITE_SOME_KEY); // "123"

  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: '__session',

    // all of these are optional
    domain: 'localhost',
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 60 * 60 * 24 * (1 / 24), //INFO: 1/2 dia
    path: '/',
    sameSite: 'lax',
    secrets: [envSecrectCookies], // TODO: Use strong secrect key for production.!
    secure: true,
  },
});

export { getSession, commitSession, destroySession };
