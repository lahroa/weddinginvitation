import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 font-serif text-accent/30">404</div>
        <h2 className="font-serif text-3xl text-primary mb-4">Página no encontrada</h2>
        <p className="font-sans text-dark/60 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link href="/">
          <Button variant="primary">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}