'use client';

import LottieIcon from '@/components/events/LottieIcon';

interface LoadingScreenProps {
  isReady?: boolean;
  preparingText?: string;
  greetingText?: string | null;
  openText?: string;
  onOpen?: () => void;
}

export default function LoadingScreen({
  isReady = false,
  preparingText = 'Preparando tu invitación',
  greetingText,
  openText = 'Toca para abrir',
  onOpen,
}: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-cream px-6"
    >
      <div className="text-center">
        <div aria-live="polite">
          {!isReady ? (
            <>
              <div aria-hidden="true" className="mb-6">
                <LottieIcon
                  src="/lottie/472-hourglass.json"
                  size={220}
                  marker='cycle'
                  loop
                />
              </div>
              <p className="font-serif text-primary text-2xl">
                {preparingText}
              </p>
            </>
          ) : (
            <>
              {greetingText && (
                <p className="mb-2 font-serif text-primary text-3xl">
                  {greetingText}
                </p>
              )}
              {onOpen && (
                <button
                  type="button"
                  onClick={onOpen}
                  className="rounded-full bg-primary px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-light transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  {openText}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
