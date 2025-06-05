import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import placeholder from '~/assets/placeholder.svg'; // Adjust the path as necessary

function FileCard({
  title,
  metadata,
  thumbnail,
}: {
  title: string;
  metadata: string;
  thumbnail: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={thumbnail || placeholder}
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
    </div>
  );
}

const GalleryMain = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create
        </Button>
        <Button variant="outline" className="gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Upload
        </Button>
        <Button variant="outline" className="gap-2">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Create folder
        </Button>
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
        <FileCard
          title="Q4 Sales Deck"
          metadata="Shared folder • 8 presentations"
          thumbnail={placeholder}
        />
        <FileCard
          title="Product Videos"
          metadata="Shared folder • 5 videos"
          thumbnail={placeholder}
        />
        <FileCard title="ROI Calculator" metadata="Shared file • 1 Excel" thumbnail={placeholder} />
      </div>
    </div>
  );
};

export default GalleryMain;
