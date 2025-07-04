import { createCookie } from 'react-router';

const envSecrectCookies = import.meta.env.VITE_COOKIES_SOME_KEY; // "123"

export const cokSlug = createCookie('apgfslugll', {
  // maxAge: 604_800, // one week
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 1, //INFO: 1/2 dia
  // expires: new Date(Date.now() + 60_000),
  // maxAge: 60 * 60 * 24 * (1 / 12), //INFO: 1/2 dia
  secrets: [envSecrectCookies],
});
