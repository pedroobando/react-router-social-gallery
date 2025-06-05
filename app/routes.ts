import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  //INFO: Home page
  index('routes/home.tsx'),

  ...prefix('/auth', [
    layout('layouts/auth-layout.tsx', [
      //INFO: ruta inicial
      index('routes/auth/auth-login.tsx'),
      //INFO: ruta de registro
      route('register', 'routes/auth/auth-register.tsx'),
    ]),
  ]),

  ...prefix('/gal', [
    layout('layouts/gallery-layout.tsx', [
      //INFO: ruta inicial
      index('routes/gallery/gallery-main.tsx'),
      //INFO: ruta de galeria
      route('presentations', 'routes/gallery/gallery-presentations.tsx'),

      route('others', 'routes/gallery/gallery-other-page.tsx'),

      //TODO: rutal de las galerias o  colecciones
      route('collect/:collectId', 'routes/gallery/gallery-collect.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
