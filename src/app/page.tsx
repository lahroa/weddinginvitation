import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n/config';

export default function RootPage() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  let detectedLocale: typeof locales[number] = defaultLocale;
  
  if (acceptLanguage) {
    const browserLang = acceptLanguage.split(',')[0]?.split('-')[0];
    
    if (browserLang && locales.includes(browserLang as typeof locales[number])) {
      detectedLocale = browserLang as typeof locales[number];
    }
  }
  
  redirect(`/${detectedLocale}`);
}