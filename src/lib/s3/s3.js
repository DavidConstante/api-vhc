import fs from 'fs'
import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
export const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY

export const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
})






export const getFiles = async () => {
  const command = new ListObjectsCommand({ Bucket: AWS_BUCKET_NAME })
  return await client.send(command)
}

export const getFileURL = async (filename) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename
  })
  return await getSignedUrl(client, command, { expiresIn: 3600 })
}

export const deleteFiles = async (fileNames) => {
  const promises = fileNames.map(async (fileName) => await deleteFile(fileName))
  return await Promise.all(promises)
}

export const deleteFile = async (fileName) => {
  const command = new DeleteObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: fileName })
  return await client.send(command)
}

//* Aux functions

