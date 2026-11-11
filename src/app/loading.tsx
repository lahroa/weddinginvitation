import Spinner from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 font-serif text-primary text-lg animate-pulse-soft">
          Cargando...
        </p>
      </div>
    </div>
  );
}