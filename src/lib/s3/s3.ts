import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand, DeleteObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'

export const MY_AWS_BUCKET_NAME = process.env.MY_AWS_BUCKET_NAME
const MY_AWS_BUCKET_REGION = process.env.MY_AWS_BUCKET_REGION
const MY_AWS_PUBLIC_KEY = process.env.MY_AWS_PUBLIC_KEY
const MY_AWS_SECRET_KEY = process.env.MY_AWS_SECRET_KEY

export const s3Client: S3ClientConfig = {
  region: MY_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: MY_AWS_PUBLIC_KEY || '',
    secretAccessKey: MY_AWS_SECRET_KEY || ''
  }
};

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



export const uploadFileToS3 = async (archivos: File[], folderName: String): Promise<string[]> => {

  const client = new S3Client(s3Client)


  const Bucket = MY_AWS_BUCKET_NAME;
  const keys = await Promise.all(
    archivos.map(async (file) => {
      const Body = (await file.arrayBuffer()) as Buffer;
      const Key = `${folderName}/${file.name}`;
      client.send(new PutObjectCommand({
        Bucket,
        Key,
        Body
      }));
      return Key;
    })
  );
  return keys;

}

export const getUrlFile = async (key: string): Promise<any> => {
  try {

    const s3 = new S3Client(s3Client)
    const url = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: MY_AWS_BUCKET_NAME,
      Key: key
    }), { expiresIn: 604800 }); // 7 days

    return url;
  } catch (error) {
    console.log('error', error);

  }
}




// export const deleteFiles = async (fileNames) => {
//   const promises = fileNames.map(async (fileName) => await deleteFile(fileName))
//   return await Promise.all(promises)
// }

// export const deleteFile = async (fileName) => {
//   const command = new DeleteObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: fileName })
//   return await client.send(command)
// }

//* Aux functions

