import { data, Link } from 'react-router';
import { Plus, FolderPlus, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardFile } from '@/gallery/components/Card-File';

import placeholder from '@/assets/placeholder.svg'; // Adjust the path as necessary
import type { Route } from './+types/main.page';
import { getSession } from '~/sessions.server';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const session = await getSession(cookieHeader);

  const token = session.get('token')!;

  return data({ token });
};

const GalleryMain = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/gal/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </Link>

        <Link to="/gal/create">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Upload
          </Button>
        </Link>
        <Link to="/gal/folders">
          <Button variant="outline" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Create folder
          </Button>
        </Link>
        <Button variant="outline" className="gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 14a2 2 0 100-4 2 2 0 000 4z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Record
        </Button>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardFile
          recordId="01"
          title="Q4 Sales Deck"
          metadata="Shared folder • 8 presentations"
          filename=""
          key={'1'}
        />
        <CardFile recordId="02" title="Product Videos" metadata="Shared folder • 5 videos" filename="" key={'2'} />
        <CardFile recordId="03" title="ROI Calculator" metadata="Shared file • 1 Excel" filename="" key={'3'} />
      </div>
    </div>
  );
};

export default GalleryMain;
