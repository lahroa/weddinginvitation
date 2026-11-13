'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/config';
import AssetUrlField from './AssetUrlField';
import Button from '@/components/ui/Button';

const DEFAULT_IMAGE = '/images/og-image.jpg';
const LOCALES: { id: Locale; labelKey: 'languageSpanish' | 'languageEnglish' }[] = [
  { id: 'es', labelKey: 'languageSpanish' },
  { id: 'en', labelKey: 'languageEnglish' },
];

export default function SiteMetadataSettings() {
  const t = useTranslations('admin');
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [shareMessages, setShareMessages] = useState<Record<Locale, string>>({ es: '', en: '' });
  const messageRefs = useRef<Record<Locale, HTMLTextAreaElement | null>>({ es: null, en: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/site-settings', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || t('metadataLoadError'));
        }
        setImageUrl(result.data.ogImageUrl);
        setShareMessages(result.data.shareMessages);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t('metadataLoadError'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, [t]);

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ogImageUrl: imageUrl,
          shareMessageEs: shareMessages.es,
          shareMessageEn: shareMessages.en,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || t('metadataSaveError'));
      }
      setSuccess(t('metadataSaved'));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t('metadataSaveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const insertVariable = (locale: Locale, variable: 'nombre' | 'enlace') => {
    const textarea = messageRefs.current[locale];
    const currentMessage = shareMessages[locale];
    const start = textarea?.selectionStart ?? currentMessage.length;
    const end = textarea?.selectionEnd ?? currentMessage.length;
    const token = `[${variable}]`;

    setShareMessages((messages) => ({
      ...messages,
      [locale]: `${currentMessage.slice(0, start)}${token}${currentMessage.slice(end)}`,
    }));

    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <section className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-primary">{t('siteSettings')}</h2>
        <p className="mt-2 text-sm text-dark/60">{t('metadataImageDescription')}</p>
      </header>

      <form onSubmit={saveSettings} className="space-y-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        {isLoading ? (
          <p className="text-sm text-dark/60" role="status">{t('metadataLoading')}</p>
        ) : (
          <>
            <AssetUrlField
              label={t('metadataImage')}
              value={imageUrl}
              onChange={setImageUrl}
              type="image"
              placeholder={DEFAULT_IMAGE}
            />
            {imageUrl && (
              <div>
                <p className="mb-2 text-sm font-medium text-dark">{t('metadataPreview')}</p>
                <img
                  src={imageUrl}
                  alt={t('metadataPreview')}
                  className="aspect-[1200/630] w-full max-w-xl rounded-lg border border-gray-200 object-cover"
                />
              </div>
            )}
            <div className="space-y-6 border-t border-gray-100 pt-6">
              <div>
                <h3 className="text-lg font-medium text-dark">{t('shareMessage')}</h3>
                <p className="mt-1 text-sm text-dark/60">{t('shareMessageDescription')}</p>
              </div>
              {LOCALES.map(({ id, labelKey }) => (
                <div key={id}>
                  <label
                    htmlFor={`share-message-${id}`}
                    className="mb-2 block text-sm font-medium text-dark"
                  >
                    {t('shareMessageLanguage', { language: t(labelKey) })}
                  </label>
                  <textarea
                    ref={(element) => { messageRefs.current[id] = element; }}
                    id={`share-message-${id}`}
                    value={shareMessages[id]}
                    onChange={(event) => setShareMessages((messages) => ({
                      ...messages,
                      [id]: event.target.value,
                    }))}
                    maxLength={4000}
                    rows={7}
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 font-sans text-sm text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs text-dark/60">{t('insertVariable')}:</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => insertVariable(id, 'nombre')}>
                      [nombre]
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => insertVariable(id, 'enlace')}>
                      [enlace]
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            {success && <p className="text-sm font-medium text-accent" role="status">{success}</p>}
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={!imageUrl.trim() || !shareMessages.es.trim() || !shareMessages.en.trim()}
            >
              {t('saveSettings')}
            </Button>
          </>
        )}
      </form>
    </section>
  );
}
