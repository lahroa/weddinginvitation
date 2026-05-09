import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/config';

export default function RootPage() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Detectar idioma del navegador
  let detectedLocale = defaultLocale;
  
  if (acceptLanguage) {
    // Tomar el primer idioma de la lista
    const browserLang = acceptLanguage.split(',')[0].split('-')[0];
    
    // Verificar si existe en nuestros locales
    if (locales.includes(browserLang as typeof locales[number])) {
      detectedLocale = browserLang;
    }
  }
  
  redirect(`/${detectedLocale}`);
}