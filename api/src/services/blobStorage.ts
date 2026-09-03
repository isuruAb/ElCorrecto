import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const blobClient = BlobServiceClient.fromConnectionString(
  process.env.BLOB_CONNECTION_STRING!
);

export async function uploadResume(
  fileBuffer: Buffer,
  fileName: string
) {
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