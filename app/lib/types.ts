export type Book = {
  id: string;
  title: string;
  author: string;
  country: string;
  coverUrl: string;
};

export type LocationLevel = 'country' | 'state' | 'region';

export type Location = {
  id: string;
  level: LocationLevel;
  code: string;
  name: string;
  parentId: string | null;
}