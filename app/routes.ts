import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  //INFO: Home page
  index('routes/home.tsx'),
  route('testing', 'routes/testing.arg.page.tsx'),
  route('image', 'routes/image.load.page.tsx'),
  route('image/:filename', 'routes/image.arg.page.tsx'),

  ...prefix('/auth', [
    layout('layouts/auth-layout.tsx', [
      //INFO: ruta inicial
      index('routes/auth/login.page.tsx'),
      //INFO: ruta de registro
      route('register', 'routes/auth/register.page.tsx'),
      // action de logout
      route('logout', 'auth/actions/logout.action.ts'),
    ]),
  ]),

  ...prefix('/gal', [
    layout('layouts/gallery-layout.tsx', [
      //INFO: ruta inicial
      index('routes/gallery/main.page.tsx'),
      //INFO: ruta de galeria

      route('folders', 'routes/gallery/folder/folder.page.tsx'),
      route('folders/:folderId', 'routes/gallery/folder/folder.edit.page.tsx'),

      //TODO: rutal de las galerias o  colecciones
      route('collect/:folderSlug', 'routes/gallery/collect/collect.page.tsx'),
      route('create', 'routes/gallery/create.page.tsx'),
      route('collect/image/:filename', 'routes/gallery/collect/image.page.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
