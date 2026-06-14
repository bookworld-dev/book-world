export const generateCoverUrl = (bookId: string): string =>
  `${process.env.NEXT_PUBLIC_COVER_STORAGE_URL}/${bookId}`;
