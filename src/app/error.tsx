'use client';

import Button from '@/components/ui/Button';
import MaterialIcon from '@/components/ui/MaterialIcon';

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
        <MaterialIcon name="error" className="w-14 h-14 mx-auto mb-6 text-primary" />
        <h2 className="font-serif text-3xl text-primary mb-4">Algo salió mal</h2>
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