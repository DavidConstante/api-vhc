import { NextResponse, NextRequest } from 'next/server'
import { connectDB, disconnectDB } from '@/lib/mongoDB'
import { Pqrs } from '@/models/pqrs'

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import {
  client,
  AWS_BUCKET_NAME,

} from '@/lib/s3/s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



export async function POST(request: Request) {
  try {


    await connectDB();
    const data = await request.formData();
    const archivos = data.getAll('archivos') as File[];





    const lastNumSolicitud = await Pqrs.findOne().sort({ numeroSolicitud: -1 }).limit(1);
    const numeroSolicitud = lastNumSolicitud ? lastNumSolicitud.numeroSolicitud + 1 : 1;

    data.append('numeroSolicitud', numeroSolicitud.toString());

    const filesS3 = await uploadFileToS3(archivos, numeroSolicitud.toString());
    const filesS3String = filesS3.join('<@>');

    data.delete('archivos');

    data.append('archivos', filesS3String)


    const newPqrs = new Pqrs(Object.fromEntries(data));

    const res = await newPqrs.save();




    return NextResponse.json({
      message: 'PQRS guardado exitosamente',
      data: res,
    });

  } catch (error) {
    return NextResponse.json({ message: 'Error al guardar PQRS', error });
  }
}




export async function GET(request: Request) {
  try {
    await connectDB()
    const pqrs = await Pqrs.find()

    const data = pqrs.map(async (pqrs) => {
      const archivos = pqrs.archivos.split('<@>');

      const archivosS3 = await Promise.all(archivos.map(async (archivo: string) => {
        const url = await getSignedUrl(client, new GetObjectCommand({
          Bucket: AWS_BUCKET_NAME,
          Key: archivo
        }), { expiresIn: 3600 });

        return url;
      })
      )

      return {
        ...pqrs._doc,
        archivos: archivosS3
      }
    })

    const res = await Promise.all(data);

    return NextResponse.json({
      message: 'Listado de PQRS',
      res,
    })


    await disconnectDB()
  } catch (error) {
    return NextResponse.json({ message: error });

  }
}


// * Function AUX
export const uploadFileToS3 = async (archivos: File[], folderName: String): Promise<string[]> => {

  const Bucket = AWS_BUCKET_NAME;
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

