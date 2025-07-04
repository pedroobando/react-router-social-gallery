import { type FC } from 'react';
import { Link, useLoaderData } from 'react-router';
import ImageAuth from './AuthImage';
import type { loader } from '~/routes/gallery/collect/collect.page';

interface CardFolderProps {
  recordId: string;
  title: string;
  metadata: string;
  filename: string | undefined;
}

export const CardFile: FC<CardFolderProps> = ({ recordId, title, metadata, filename }) => {
  const { token } = useLoaderData<typeof loader>();

  return (
    <Link to={`/gal/collect/image/${filename}`} className="group relative overflow-hidden rounded-lg border bg-white">
      <div className="aspect-[4/3] overflow-hidden">
        <ImageAuth
          imageName={filename ? filename : ''}
          token={token}
          alt={title}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{metadata}</p>
      </div>
    </Link>
  );
};
