'use client';

import { useRef, useState } from 'react';
import Input from '@/components/ui/Input';

interface AssetUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'image' | 'json';
  placeholder: string;
}

interface Asset {
  key: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  lastModified: string | null;
}

export default function AssetUrlField({
  label,
  value,
  onChange,
  type,
  placeholder,
}: AssetUrlFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [libraryError, setLibraryError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const accept = type === 'image' ? 'image/jpeg,image/png,image/webp,image/avif,image/gif' : '.json,application/json';

  const loadLibrary = async () => {
    setIsLibraryOpen(true);
    setIsLoadingLibrary(true);
    setLibraryError('');
    try {
      const response = await fetch(`/api/admin/uploads?type=${type}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        setLibraryError(result.error || 'No se pudo cargar la biblioteca');
        return;
      }
      setAssets(result.data.items);
      setNextCursor(result.data.nextCursor);
    } catch {
      setLibraryError('Error de conexión al cargar la biblioteca');
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    setIsLoadingLibrary(true);
    setLibraryError('');
    try {
      const response = await fetch(`/api/admin/uploads?type=${type}&cursor=${encodeURIComponent(nextCursor)}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        setLibraryError(result.error || 'No se pudieron cargar más archivos');
        return;
      }
      setAssets((current) => [...current, ...result.data.items]);
      setNextCursor(result.data.nextCursor);
    } catch {
      setLibraryError('Error de conexión al cargar más archivos');
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const response = await fetch('/api/admin/uploads', { method: 'POST', body: formData });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || 'No se pudo subir el archivo');
        return;
      }

      onChange(result.data.url);
      if (isLibraryOpen) await loadLibrary();
    } catch {
      setError('Error de conexión al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Input
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        helperText="También puedes pegar una URL existente."
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept={accept}
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={isUploading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-sans text-sm text-dark transition-colors hover:border-primary/50 disabled:cursor-wait disabled:opacity-60"
        >
          {isUploading ? 'Subiendo archivo...' : type === 'image' ? 'Subir imagen' : 'Subir archivo JSON'}
        </button>
        <button
          type="button"
          onClick={loadLibrary}
          className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 font-sans text-sm text-primary transition-colors hover:bg-primary/10"
        >
          {isLibraryOpen ? 'Actualizar biblioteca' : 'Ver biblioteca'}
        </button>
        <span className="text-xs text-gray-500">Máximo 4 MB</span>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500 font-sans">{error}</p>}
      {isLibraryOpen && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-sans text-sm font-medium text-dark">
              Biblioteca de {type === 'image' ? 'imágenes' : 'archivos JSON'}
            </p>
            <button
              type="button"
              onClick={() => setIsLibraryOpen(false)}
              className="px-2 py-1 font-sans text-xs text-gray-500 hover:text-dark"
            >
              Cerrar
            </button>
          </div>
          {isLoadingLibrary ? (
            <p className="py-4 text-center font-sans text-sm text-gray-500">Cargando biblioteca...</p>
          ) : libraryError ? (
            <p className="py-3 font-sans text-sm text-red-500">{libraryError}</p>
          ) : assets.length === 0 ? (
            <p className="py-4 text-center font-sans text-sm text-gray-500">
              No hay archivos disponibles de este tipo.
            </p>
          ) : type === 'image' ? (
            <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {assets.map((asset) => (
                <button
                  type="button"
                  key={asset.key}
                  onClick={() => { onChange(asset.url); setIsLibraryOpen(false); }}
                  className="overflow-hidden rounded-lg border border-gray-200 text-left transition-colors hover:border-primary"
                  title={`Usar ${asset.name}`}
                >
                  <img src={asset.url} alt={asset.name} className="h-24 w-full bg-gray-50 object-cover" />
                  <span className="block truncate px-2 py-1.5 font-sans text-xs text-dark">{asset.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto">
              {assets.map((asset) => (
                <li key={asset.key}>
                  <button
                    type="button"
                    onClick={() => { onChange(asset.url); setIsLibraryOpen(false); }}
                    className="w-full truncate rounded-lg border border-gray-200 px-3 py-2 text-left font-sans text-sm text-dark transition-colors hover:border-primary"
                    title={`Usar ${asset.name}`}
                  >
                    {asset.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {nextCursor && !isLoadingLibrary && !libraryError && (
            <button
              type="button"
              onClick={loadMore}
              className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-2 font-sans text-sm text-dark hover:border-primary"
            >
              Cargar más archivos
            </button>
          )}
        </div>
      )}
    </div>
  );
}
