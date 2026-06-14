import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = process.env.COVER_IMAGES_BUCKET ?? "bookworld-283512-covers";
const storage = new Storage();

export const uploadCover = async (cover: File, bookId: string): Promise<void> => {
  const buffer = Buffer.from(await cover.arrayBuffer());

  await storage.bucket(BUCKET_NAME).file(bookId).save(buffer, {
    metadata: { contentType: cover.type },
  });
};

export const deleteCover = async (bookId: string): Promise<void> => {
  await storage.bucket(BUCKET_NAME).file(bookId).delete({ ignoreNotFound: true });
};
