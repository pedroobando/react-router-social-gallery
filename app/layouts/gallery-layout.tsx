import { Outlet, redirect } from 'react-router';
import { Bell, Grid, LayoutGrid, Search } from 'lucide-react';

import type { Route } from './+types/gallery-layout';
import { getSession } from '~/sessions.server';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import placeholder from '@/assets/placeholder.svg';

import { SidebarUser, type FolderItem, type NavItemProps } from '~/gallery/components/Sidebar-User';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Gallery' }, { name: 'description', content: 'Gallery from users arts' }];
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  // console.log({ request });

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

const navItem: NavItemProps[] = [
  { children: 'All Contents', href: '/gal', icon: <LayoutGrid className="h-4 w-4" /> },
  {
    children: 'Presentation',
    href: 'gal/presentations',
    icon: <LayoutGrid className="h-4 w-4" />,
  },
  {
    children: 'Others',
    href: 'gal/others',
    icon: <LayoutGrid className="h-4 w-4" />,
  },
];

const folderItem: FolderItem[] = [
  { children: 'Photo Family', href: 'family' },
  { children: 'Card Buys', href: 'carsbuys' },
  { children: 'Running frends', href: 'running' },
  { children: 'Private Album', href: 'private_Album' },
];

const GalleryLayout = ({ loaderData }: Route.ComponentProps) => {
  const { userName } = loaderData;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      {/* <SidebarUser /> */}
      <div className="w-64 border-r bg-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">
            Gallery <span className="text-base font-thin">- {userName}</span>
          </h1>
        </div>
        <SidebarUser navItemLists={navItem} folderItems={folderItem} />
      </div>

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
