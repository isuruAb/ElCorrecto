import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const blobClient = BlobServiceClient.fromConnectionString(
  process.env.BLOB_CONNECTION_STRING!
);

export const uploadResume = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const container =
    blobClient.getContainerClient(
      process.env.BLOB_CONTAINER_NAME!
    );

  const blobName =
    `${uuidv4()}-${fileName}`;

  const blockBlob =
    container.getBlockBlobClient(blobName);

  await blockBlob.uploadData(fileBuffer);

  return blockBlob.url;
}

export const downloadResume = async (blobUrl: string): Promise<Buffer> => {
  const container =
    blobClient.getContainerClient(
      process.env.BLOB_CONTAINER_NAME!
    );

  const containerUrlPrefix = `${container.url}/`;
  if (!blobUrl.startsWith(containerUrlPrefix)) {
    throw new Error("Resume blob URL is not recognized");
  }

  const blobName = decodeURIComponent(blobUrl.slice(containerUrlPrefix.length));
  const blockBlob = container.getBlockBlobClient(blobName);

  return blockBlob.downloadToBuffer();
}