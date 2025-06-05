import { createCookie, createCookieSessionStorage, Outlet, redirect } from 'react-router';
import { Bell, Grid, Search } from 'lucide-react';

import type { Route } from './+types/gallery-layout';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import placeholder from '@/assets/placeholder.svg';
import { getSession } from '~/sessions.server';
import { SidebarUser } from '~/gallery/components/Sidebar-User';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Gallery' }, { name: 'description', content: 'Gallery from users arts' }];
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  // const { clientId } = params;

  if (!session.has('userId')) {
    return redirect('/auth');
  }

  const userName = session.get('name');
  // const clients = await getClients();
  // if (clientId) {
  //   const client = clients.find((c) => c.id === clientId);

  //   return {
  //     clients,
  //     userName,
  //     client,
  //   };
  // }

  // console.log('ChatLayout loader called');

  return {
    // clients,
    userName,
  };
};

const GalleryLayout = ({ loaderData }: Route.ComponentProps) => {
  const { userName } = loaderData;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <SidebarUser />

      {/* Main content */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div className="w-96">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search files..." className="pl-9" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img
                src={placeholder}
                alt="Avatar"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default GalleryLayout;
