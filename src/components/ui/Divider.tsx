interface DividerProps {
  className?: string;
}

export default function Divider({ className = '' }: DividerProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-px bg-gold/30" />
        <span className="text-gold text-lg font-serif">❦</span>
        <div className="w-12 h-px bg-gold/30" />
      </div>
    </div>
  );
}