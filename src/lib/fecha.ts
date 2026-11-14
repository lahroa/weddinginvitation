export function formatFechaBoda(lang: string): string {
  const iso = process.env.NEXT_PUBLIC_FECHA_BODA || '2026-07-27T16:00:00-04:00';
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return iso;

  const locale = lang === 'en' ? 'en-US' : 'es-VE';
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'America/Caracas',
  }).format(fecha);
}
