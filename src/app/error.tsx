'use client';

import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😔</div>
        <h2 className="font-serif text-3xl text-gold mb-4">Algo salió mal</h2>
        <p className="font-sans text-dark/60 mb-8">
          Ocurrió un error inesperado. Por favor, intenta de nuevo.
        </p>
        <Button onClick={reset} variant="primary">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}