export interface Folder {
  id: string;
  name: string;
  description: string;
  slug: string;
  active: boolean;
  // createdAt: string;
  // updatedAt: string;
}

export interface createFolderDto {
  name?: string;
  description?: string;
}

export interface updateFolderDto extends createFolderDto {
  active?: boolean;
}
