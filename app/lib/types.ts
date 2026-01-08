type UUIDPrimaryKey = { id: string; }

export type BookRequest = {
  title: string;
  author: string;
  coverUrl: string;
}

export type BookAPIRequest = {
  title: string;
  author: string;
  cover: File;
}

export type Book = BookRequest & UUIDPrimaryKey

export type LocationLevel = 'country' | 'state' | 'region';

export type LocationRequest = {
  level: LocationLevel;
  code: string;
  name: string;
  parentId: string | null;
}

export type Location = LocationRequest & UUIDPrimaryKey