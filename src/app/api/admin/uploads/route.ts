import { randomUUID } from 'crypto';
import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';

const BUCKET = 'files';
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

function getPublicUrl(endpoint: string, key: string) {
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  return `${endpoint.replace(/\/+$/, '')}/${BUCKET}/${encodedKey}`;
}

function getStorageClient() {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_REGION } = process.env;
  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_ENDPOINT_URL_S3 || !AWS_REGION) {
    throw new Error('Neon Object Storage environment variables are not configured');
  }

  return {
    client: new S3Client({
      endpoint: AWS_ENDPOINT_URL_S3,
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    }),
    endpoint: AWS_ENDPOINT_URL_S3,
  };
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get('type');
  if (type !== 'image' && type !== 'json') {
    return NextResponse.json({ success: false, error: 'Tipo de archivo no válido' }, { status: 400 });
  }

  try {
    const { client, endpoint } = getStorageClient();
    const cursor = request.nextUrl.searchParams.get('cursor') || undefined;
    const result = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: cursor,
    }));

    const items = [];
    for (const object of result.Contents ?? []) {
      if (!object.Key) continue;
      const extension = object.Key.slice(object.Key.lastIndexOf('.')).toLowerCase();
      const contentType = ALLOWED_CONTENT_TYPES[extension];
      const isImage = contentType?.startsWith('image/');
      if (type === 'image' ? !isImage : extension !== '.json') continue;

      items.push({
        key: object.Key,
        name: object.Key.split('/').pop() || object.Key,
        url: getPublicUrl(endpoint, object.Key),
        contentType,
        size: object.Size ?? 0,
        lastModified: object.LastModified?.toISOString() ?? null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        items,
        nextCursor: result.IsTruncated ? result.NextContinuationToken ?? null : null,
      },
    });
  } catch (error) {
    console.error('Error al listar archivos de Neon Object Storage:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo cargar la biblioteca. Verifica la configuración de Neon Object Storage.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (file === null || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'Selecciona un archivo' }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe pesar entre 1 byte y 4 MB' },
        { status: 400 }
      );
    }

    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const contentType = ALLOWED_CONTENT_TYPES[extension];
    if (!contentType || (file.type && file.type !== contentType)) {
      return NextResponse.json(
        { success: false, error: 'Solo se permiten imágenes JPG, PNG, WEBP, AVIF, GIF y archivos JSON' },
        { status: 400 }
      );
    }

    const body = Buffer.from(await file.arrayBuffer());
    if (extension === '.json') {
      try {
        JSON.parse(body.toString('utf8'));
      } catch {
        return NextResponse.json({ success: false, error: 'El archivo JSON no es válido' }, { status: 400 });
      }
    }

    const { client, endpoint } = getStorageClient();
    const key = `admin/${randomUUID()}${extension}`;
    await client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    return NextResponse.json({
      success: true,
      data: { url: getPublicUrl(endpoint, key) },
    });
  } catch (error) {
    console.error('Error al subir archivo a Neon Object Storage:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo subir el archivo. Verifica la configuración de Neon Object Storage.' },
      { status: 500 }
    );
  }
}
