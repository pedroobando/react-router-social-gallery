import { type FC, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { cn } from '@/lib/utils';
import { Folder } from 'lucide-react';

export interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export interface FolderItem {
  id: string;
  name: string;
  slug: string;
}

export interface SidebarProps {
  navItemLists: NavItemProps[];
  folderItems: FolderItem[];
}

const _urlBaseFolder: string = '/gal/collect';

export const SidebarUser: FC<SidebarProps> = ({ navItemLists, folderItems }) => {
  return (
    <nav className="space-y-2 px-2">
      {navItemLists.map((navItem, keyId) => (
        <NavLink
          key={keyId}
          to={navItem.href}
          end
          className={({ isActive, isPending }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 text-sm text-primary rounded-lg transition-all duration-300',
              isActive && 'bg-primary/10',
              isPending && 'bg-primary/5 '
            )
          }
        >
          {navItem.icon}
          <span>{navItem.children}</span>
        </NavLink>
      ))}

      <div className="py-3">
        <div className="px-3 text-xs font-medium uppercase text-gray-500">Collections</div>
        <div className="mt-2">
          {folderItems.map((folderItem, keyId) => (
            <Link
              key={keyId}
              to={`${_urlBaseFolder}/${folderItem.slug}`.toLowerCase()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Folder className="w-4 h-4 text-primary/40" />
              <span>{folderItem.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
