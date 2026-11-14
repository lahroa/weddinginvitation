import { GlobalFonts, createCanvas, loadImage } from '@napi-rs/canvas';
import { getTranslations } from 'next-intl/server';
import { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { defaultLocale, locales } from '@/i18n/config';
import sql from '@/lib/db';
import { getInvitacionByToken } from '@/lib/invitaciones';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 80;
const MAX_BACKGROUND_BYTES = 10 * 1024 * 1024;
const COUPLE_NAMES = process.env.NEXT_PUBLIC_NOMBRES_NOVIOS || 'Luis & Daniela';
const DEFAULT_BACKGROUND_IMAGE = '/images/og-image.jpg';
const PUBLIC_DIRECTORY = resolve(process.cwd(), 'public');
const FONT_DIRECTORY = resolve(PUBLIC_DIRECTORY, 'fonts');
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

if (!GlobalFonts.registerFromPath(resolve(FONT_DIRECTORY, 'playfair-latin.ttf'), 'Playfair')) {
  throw new Error('No se pudo registrar la fuente Playfair');
}
if (!GlobalFonts.registerFromPath(resolve(FONT_DIRECTORY, 'montecarlo-latin.ttf'), 'MonteCarlo')) {
  throw new Error('No se pudo registrar la fuente MonteCarlo');
}

async function loadBackgroundImage(source: string, requestUrl: URL): Promise<Buffer> {
  const imageUrl = new URL(source, requestUrl);
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : null;

  if (imageUrl.origin === requestUrl.origin || imageUrl.origin === configuredOrigin) {
    const imagePath = resolve(PUBLIC_DIRECTORY, `.${decodeURIComponent(imageUrl.pathname)}`);
    const relativePath = relative(PUBLIC_DIRECTORY, imagePath);
    if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
      throw new Error('La ruta de la imagen Open Graph no es válida');
    }

    const contentType = MIME_TYPES[extname(imagePath).toLowerCase()];
    if (!contentType) throw new Error('Formato de imagen de fondo no compatible');

    const image = await readFile(imagePath);
    if (image.byteLength > MAX_BACKGROUND_BYTES) {
      throw new Error('La imagen de fondo Open Graph excede el tamaño máximo de 10 MB');
    }
    return image;
  }

  if (!['http:', 'https:'].includes(imageUrl.protocol)) {
    throw new Error('La URL de la imagen de fondo debe usar HTTP o HTTPS');
  }

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`No se pudo cargar la imagen de fondo Open Graph (${response.status})`);
  }

  const contentType = response.headers.get('content-type')?.split(';')[0].trim();
  if (!contentType || !Object.values(MIME_TYPES).includes(contentType)) {
    throw new Error('Formato de imagen de fondo remoto no compatible');
  }
  const image = Buffer.from(await response.arrayBuffer());
  if (image.byteLength > MAX_BACKGROUND_BYTES) {
    throw new Error('La imagen de fondo Open Graph excede el tamaño máximo de 10 MB');
  }
  return image;
}

function wrapText(context: ReturnType<ReturnType<typeof createCanvas>['getContext']>, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawLines(
  context: ReturnType<ReturnType<typeof createCanvas>['getContext']>,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const locale = locales.find((value) => value === url.searchParams.get('lang')) ?? defaultLocale;
    const t = await getTranslations({ locale, namespace: 'invitationImage' });
    const token = url.searchParams.get('invitacion')?.trim().toUpperCase();
    const invitation = token ? await getInvitacionByToken(token) : null;
    let backgroundImage = DEFAULT_BACKGROUND_IMAGE;

    try {
      const settings = await sql`
        SELECT og_image_url FROM configuracion_sitio WHERE id = 1
      `;
      backgroundImage =
        (settings[0] as { og_image_url: string } | undefined)?.og_image_url ??
        DEFAULT_BACKGROUND_IMAGE;
    } catch (error) {
      console.error('No se pudo cargar la imagen de fondo Open Graph configurada:', error);
    }

    const backgroundData = await loadBackgroundImage(backgroundImage, url);
    const image = await loadImage(backgroundData);
    const canvas = createCanvas(WIDTH, HEIGHT);
    const context = canvas.getContext('2d');
    const scale = Math.max(WIDTH / image.width, HEIGHT / image.height);
    const sourceWidth = WIDTH / scale;
    const sourceHeight = HEIGHT / scale;
    context.drawImage(
      image,
      (image.width - sourceWidth) / 2,
      (image.height - sourceHeight) / 2,
      sourceWidth,
      sourceHeight,
      0,
      0,
      WIDTH,
      HEIGHT,
    );

    context.textBaseline = 'top';
    context.fillStyle = '#fff8e8';
    context.shadowColor = 'rgba(0, 0, 0, 0.4)';
    context.shadowBlur = 12;
    context.shadowOffsetY = 2;
    context.font = '56px MonteCarlo';
    context.fillText(COUPLE_NAMES, 72, 54);

    const textX = 76;
    const maxTextWidth = 1060;
    const lines: { text: string; font: string; fontSize: number; lineHeight: number }[] = [];
    if (invitation) {
      lines.push({ text: t('forGuest'), font: 'Playfair', fontSize: 58, lineHeight: 61 });
      const nameSize =
        invitation.nombre_invitado.length > 28
          ? 56
          : invitation.nombre_invitado.length > 18
            ? 76
            : 104;
      lines.push({
        text: invitation.nombre_invitado,
        font: 'Playfair',
        fontSize: nameSize,
        lineHeight: Math.round(nameSize * 1.05),
      });
    } else {
      lines.push({ text: t('forYou'), font: 'Playfair', fontSize: 76, lineHeight: 82 });
    }

    context.shadowColor = 'rgba(0, 0, 0, 0.55)';
    context.shadowBlur = 12;
    context.shadowOffsetY = 2;
    const textBlocks = lines.map((block) => {
      context.font = `${block.fontSize}px ${block.font}`;
      return {
        ...block,
        wrapped: wrapText(context, block.text, maxTextWidth),
      };
    });
    const blockHeight = textBlocks.reduce(
      (height, block) => height + block.wrapped.length * block.lineHeight,
      0,
    );
    const textY = HEIGHT - 82 - blockHeight;

    context.shadowColor = 'transparent';
    context.fillStyle = '#e58ab1';
    context.fillRect(60, textY, 5, blockHeight);
    context.fillStyle = '#fff8e8';
    let currentY = textY;
    for (const block of textBlocks) {
      context.font = `${block.fontSize}px ${block.font}`;
      context.shadowColor = 'rgba(0, 0, 0, 0.55)';
      drawLines(context, block.wrapped, textX, currentY, block.lineHeight);
      currentY += block.wrapped.length * block.lineHeight;
    }

    const webp = await canvas.encode('webp', QUALITY);
    const body = new ArrayBuffer(webp.byteLength);
    new Uint8Array(body).set(webp);
    return new Response(body, {
      headers: {
        'content-type': 'image/webp',
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    console.error('No se pudo generar la imagen Open Graph:', error);
    return new Response('No se pudo generar la imagen Open Graph', { status: 500 });
  }
}
