import { Storage } from "@google-cloud/storage";

const BUCKET_NAME = process.env.COVER_IMAGES_BUCKET ?? "bookworld-283512-covers";
const storage = new Storage();

export const uploadCover = async (cover: File): Promise<string> => {
  const buffer = Buffer.from(await cover.arrayBuffer());
  const ext = cover.type === "image/png" ? "png" : "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;

  await storage.bucket(BUCKET_NAME).file(filename).save(buffer, {
    metadata: { contentType: cover.type },
  });

  return `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
};

export const deleteCover = async (coverUrl: string): Promise<void> => {
  const filename = coverUrl.split("/").pop();
  if (filename) {
    await storage.bucket(BUCKET_NAME).file(filename).delete({ ignoreNotFound: true });
  }
};
