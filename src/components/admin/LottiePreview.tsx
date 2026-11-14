'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DotLottieReact, type DotLottie } from '@lottiefiles/dotlottie-react';

interface LottieMarker {
  name: string;
  time: number;
  duration: number;
}

interface LottiePreviewProps {
  src: string;
}

export default function LottiePreview({ src }: LottiePreviewProps) {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [markers, setMarkers] = useState<LottieMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [loop, setLoop] = useState(false);
  const [delay, setDelay] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPlayerRef = useCallback((instance: DotLottie | null) => {
    setPlayer(instance);
    setIsReady(false);
    setMarkers([]);
  }, []);

  useEffect(() => {
    if (!player) return;

    const handleLoad = () => {
      const animationMarkers = player.markers();
      setMarkers(animationMarkers);
      setSelectedMarker((current) => (
        animationMarkers.some(({ name }) => name === current)
          ? current
          : animationMarkers.find(({ name }) => name.startsWith('default:hover-'))?.name
            ?? animationMarkers[0]?.name
            ?? ''
      ));
      setIsReady(true);
      setError('');
    };
    const handleLoadError = () => {
      setError('No se pudo cargar esta animación. Verifica que la URL sea accesible y que el archivo sea un Lottie JSON válido.');
      setIsReady(false);
    };

    player.addEventListener('load', handleLoad);
    player.addEventListener('loadError', handleLoadError);
    if (player.isLoaded) handleLoad();

    return () => {
      player.removeEventListener('load', handleLoad);
      player.removeEventListener('loadError', handleLoadError);
    };
  }, [player]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setIsWaiting(false);
  }, [src, selectedMarker, loop]);

  const playPreview = () => {
    if (!player?.isLoaded) return;

    if (timer.current) clearTimeout(timer.current);
    setIsWaiting(delay > 0);
    setError('');
    player.stop();

    timer.current = setTimeout(() => {
      setIsWaiting(false);
      if (selectedMarker) player.setMarker(selectedMarker);
      player.play();
      timer.current = null;
    }, delay);
  };

  return (
    <div className="mt-3 rounded-xl border border-primary/15 bg-white p-4">
      <p className="mb-3 font-sans text-sm font-semibold text-dark">Vista previa de la animación</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-36 w-full shrink-0 items-center justify-center rounded-lg bg-cream sm:w-36">
          <DotLottieReact
            key={`${src}:${selectedMarker}:${loop}`}
            src={src}
            autoplay={false}
            loop={loop}
            marker={selectedMarker || undefined}
            dotLottieRefCallback={setPlayerRef}
            style={{ width: '128px', height: '128px' }}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {markers.length > 0 && (
            <label className="block font-sans text-sm text-dark">
              Animación
              <select
                value={selectedMarker}
                onChange={(event) => setSelectedMarker(event.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none"
              >
                <option value="">Animación completa</option>
                {markers.map(({ name }) => (
                  <option value={name} key={name}>{name}</option>
                ))}
              </select>
            </label>
          )}

          <label className="flex items-center gap-2 font-sans text-sm text-dark">
            <input
              type="checkbox"
              checked={loop}
              onChange={(event) => setLoop(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            Repetir animación
          </label>

          <label className="block font-sans text-sm text-dark">
            Delay antes de reproducir (ms)
            <input
              type="number"
              min={0}
              max={10000}
              step={100}
              value={delay}
              onChange={(event) => setDelay(Math.min(10000, Math.max(0, Number(event.target.value) || 0)))}
              className="mt-1 block w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm text-dark focus:border-primary focus:outline-none"
            />
          </label>

          <button
            type="button"
            onClick={playPreview}
            disabled={!isReady}
            className="rounded-lg bg-primary px-4 py-2 font-sans text-sm text-light transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-50"
          >
            {!isReady ? 'Cargando...' : isWaiting ? 'Esperando delay...' : 'Reproducir vista previa'}
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 font-sans text-sm text-red-600">{error}</p>
      ) : (
        <p className="mt-3 font-sans text-xs text-gray-500">
          Los ajustes de repetición y delay solo afectan esta vista previa.
        </p>
      )}
    </div>
  );
}
