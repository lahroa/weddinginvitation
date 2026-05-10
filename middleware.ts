import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Rutas internacionalizadas
    '/(es|en)/:path*',
    // Raíz
    '/',
    // Excluir explícitamente rutas de API, archivos estáticos e internos de Next.js
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
};