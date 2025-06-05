import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  //INFO: Home page
  index('routes/home.tsx'),

  ...prefix('auth', [
    layout('layouts/auth-layout.tsx', [
      //INFO: ruta inicial
      index('routes/auth/auth-login.tsx'),
      //INFO: ruta de registro
      route('register', 'routes/auth/auth-register.tsx'),
    ]),
  ]),

  ...prefix('home', [
    layout('layouts/gallery-layout.tsx', [
      //INFO: ruta inicial
      index('routes/gallery/gallery-main.tsx'),
      //INFO: ruta de galeria
      route('presentations', 'routes/gallery/gallery-presentations.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
