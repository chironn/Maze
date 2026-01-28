interface ControlPanelProps {
  onDivine: () => void;
  disabled?: boolean;
}

export function ControlPanel({ onDivine, disabled }: ControlPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-apple border-t border-primary/20">
      <div className="max-w-md mx-auto flex flex-col items-center gap-4">
        <div className="text-4xl">问</div>
        <div className="flex gap-4 w-full">
          <button
            onClick={onDivine}
            disabled={disabled}
            className="flex-1 py-4 bg-primary text-white rounded-apple font-semibold hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            卜卦
          </button>
          <button className="flex-1 py-4 bg-white/50 text-text rounded-apple font-semibold hover:bg-white/70 transition-colors">
            禅意
          </button>
        </div>
      </div>
    </div>
  );
}
