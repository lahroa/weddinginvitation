'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { defaultLocale, locales, type Locale } from '@/i18n/config';
import { InvitacionConEventos } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import InvitacionForm from './InvitacionForm';
import Toast from '@/components/ui/Toast';
import MaterialIcon from '@/components/ui/MaterialIcon';

export default function InvitacionesList() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const shareLocale = locales.find((value) => value === locale) ?? defaultLocale;
  const [invitaciones, setInvitaciones] = useState<InvitacionConEventos[]>([]);
  const [shareMessages, setShareMessages] = useState<Record<Locale, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [openLanguageMenuId, setOpenLanguageMenuId] = useState<string | null>(null);
  const [editingInvitacion, setEditingInvitacion] = useState<InvitacionConEventos | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchInvitaciones = useCallback(async () => {
    try {
      const res = await fetch('/api/invitaciones');
      const data = await res.json();
      if (data.success) {
        setInvitaciones(data.data);
      }
    } catch {
      setToast({ message: 'Error al cargar invitaciones', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitaciones();
  }, [fetchInvitaciones]);

  useEffect(() => {
    const fetchShareMessages = async () => {
      try {
        const response = await fetch('/api/admin/site-settings', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || t('metadataLoadError'));
        }
        setShareMessages(result.data.shareMessages);
      } catch {
        setToast({ message: t('metadataLoadError'), type: 'error' });
      }
    };

    void fetchShareMessages();
  }, [t]);

  const handleToggleStatus = async (id: string, activa: boolean) => {
    try {
      const res = await fetch(`/api/invitaciones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: !activa }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ message: activa ? 'Invitación revocada' : 'Invitación reactivada', type: 'success' });
        fetchInvitaciones();
      }
    } catch {
      setToast({ message: 'Error al actualizar', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta invitación permanentemente?')) return;

    try {
      const res = await fetch(`/api/invitaciones/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ message: 'Invitación eliminada', type: 'success' });
        fetchInvitaciones();
      }
    } catch {
      setToast({ message: 'Error al eliminar', type: 'error' });
    }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/${shareLocale}?invitacion=${encodeURIComponent(token)}`;
    void navigator.clipboard.writeText(url).then(
      () => setToast({ message: 'Enlace copiado al portapapeles', type: 'success' }),
      () => setToast({ message: t('shareError'), type: 'error' }),
    );
  };

  const shareInvitation = async (invitation: InvitacionConEventos, language: Locale) => {
    if (!shareMessages) return;

    const invitationUrl = `${window.location.origin}/${language}?invitacion=${encodeURIComponent(invitation.token)}`;
    const text = shareMessages[language].replace(
      /\[(nombre|enlace)\]/g,
      (variable) => variable === '[nombre]' ? invitation.nombre_invitado : invitationUrl,
    );

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (shareError) {
        if (shareError instanceof Error && shareError.name === 'AbortError') return;
        setToast({ message: t('shareError'), type: 'error' });
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: t('shareMessageCopied'), type: 'success' });
    } catch {
      setToast({ message: t('shareError'), type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl text-dark">Invitaciones</h2>
          <p className="font-sans text-sm text-dark/50 mt-1">
            {invitaciones.length} invitación(es) creada(s)
          </p>
        </div>
        <Button onClick={() => { setEditingInvitacion(null); setShowForm(true); }}>
          + Nueva invitación
        </Button>
      </div>

      {/* Lista */}
      {invitaciones.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl">
          <MaterialIcon name="mail" className="w-12 h-12 mx-auto mb-4 text-primary" />
          <p className="font-serif text-xl text-dark/50">No hay invitaciones aún</p>
          <p className="font-sans text-dark/30 mt-2">Crea la primera invitación para empezar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {invitaciones.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-xl p-5 shadow-elegant hover:shadow-elegant-hover transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-sans font-medium text-dark text-lg">
                      {inv.nombre_invitado}
                    </h3>
                    <Badge variant={inv.activa ? 'success' : 'error'}>
                      {inv.activa ? 'Activa' : 'Revocada'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm font-sans text-dark/50">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {inv.token}
                    </span>
                    <span>·</span>
                    <span>Máx. {inv.max_acompanantes} acompañantes</span>
                    {inv.eventos_detalle.length > 0 && (
                      <>
                        <span>·</span>
                        <span>
                          {inv.eventos_detalle.map(e => e.nombre).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 flex-shrink-0">
                  <div className="relative flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!shareMessages}
                      onClick={() => void shareInvitation(inv, shareLocale)}
                    >
                      {t('shareInvitation')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={!shareMessages}
                      aria-expanded={openLanguageMenuId === inv.id}
                      onClick={() => setOpenLanguageMenuId((openId) => openId === inv.id ? null : inv.id)}
                    >
                      {t('shareInAnotherLanguage')}
                    </Button>
                    {openLanguageMenuId === inv.id && (
                      <div className="absolute right-0 top-full z-10 mt-2 min-w-44 rounded-lg border border-gray-100 bg-white p-2 shadow-lg">
                        {locales
                          .filter((language) => language !== shareLocale)
                          .map((language) => (
                            <button
                              key={language}
                              type="button"
                              className="block w-full rounded-md px-3 py-2 text-left text-sm text-dark hover:bg-gray-50"
                              onClick={() => {
                                setOpenLanguageMenuId(null);
                                void shareInvitation(inv, language);
                              }}
                            >
                              {t('shareLanguage', {
                                language: t(language === 'es' ? 'languageSpanish' : 'languageEnglish'),
                              })}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyLink(inv.token)}
                  >
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="copy" className="w-4 h-4" />
                      Copiar
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingInvitacion(inv); setShowForm(true); }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleStatus(inv.id, inv.activa)}
                  >
                    {inv.activa ? 'Revocar' : 'Activar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(inv.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal formulario */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} size="lg">
        <InvitacionForm
          invitacion={editingInvitacion}
          onSuccess={() => {
            setShowForm(false);
            fetchInvitaciones();
            setToast({ message: editingInvitacion ? 'Invitación actualizada' : 'Invitación creada', type: 'success' });
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}