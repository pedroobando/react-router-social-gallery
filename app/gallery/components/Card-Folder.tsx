import type { FC } from 'react';
import { Link, useNavigate } from 'react-router';

import { Folder } from 'lucide-react';

interface CardFolderProps {
  folderId: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

export const CardFolder: FC<CardFolderProps> = ({ folderId, name, description, slug, active }) => {
  const descriptionLimit = 35;
  const _metadata =
    !!description && description.length > descriptionLimit
      ? description.slice(0, descriptionLimit) + '...'
      : description;
  return (
    <>
      <Link to={`/gal/folders/${slug}`} className="overflow-hidden flex flex-row gap-2 items-center">
        <Folder className="h-8 w-8 text-primary/40" />
        <h3 className={`font-medium text-sm ${active ? 'text-gray-900' : 'text-gray-900/50'}`}>{name}</h3>
        {/* <div className="">
          <p className="text-xs text-gray-500">{_metadata}</p>
        </div> */}
      </Link>
    </>
  );
};
