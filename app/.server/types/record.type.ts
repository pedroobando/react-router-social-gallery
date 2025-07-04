import type { Folder } from './folder.type';
import type { User } from './userTypes';

export interface Record {
  id: string;
  name: string;
  slug: string;
  folder: Folder;
  active: boolean;
  tags: string[];
  filename?: string | null;
  imageurl?: string | null;
  user: User;

  // createdAt: string;
  // updatedAt: string;
}

export interface createRecordDto {
  name: string;
  folderId: string;
  tags: string;
}

export interface updateRecordDto extends createRecordDto {
  active?: boolean;
}
