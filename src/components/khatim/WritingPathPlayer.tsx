import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Layers, Sparkles } from 'lucide-react';

interface WritingPathPlayerProps {
  gridSize: number;
  totalHouses: number;
  currentStep: number;
  onStepChange: (step: number) => void;
  className?: string;
}

export const WritingPathPlayer: React.FC<WritingPathPlayerProps> = ({
  gridSize,
  totalHouses,
  currentStep,
  onStepChange,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStep >= totalHouses) {
          setIsPlaying(false);
        } else {
          onStepChange(currentStep === 0 ? 1 : currentStep + 1);
        }
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentStep, totalHouses, onStepChange]);

  const handlePlayToggle = () => {
    if (currentStep >= totalHouses) {
      onStepChange(1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    onStepChange(0); // 0 means show all
  };

  return (
    <div className={`bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 text-amber-100 shadow-md ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-amber-400" />
          <span className="text-xs sm:text-sm font-black text-amber-200">
            Guide du Tracé Rituel Pas-à-Pas (طريق الكتابة والتعمير)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-black/60 text-amber-300 px-3 py-1 rounded-xl border border-amber-500/30">
            {currentStep === 0 ? 'Vue Globale (Tout)' : `Maison ${currentStep} / ${totalHouses}`}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handlePlayToggle}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isPlaying
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
          }`}
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          <span>{isPlaying ? 'Pause' : currentStep >= totalHouses ? 'Rejouer' : 'Animer Tracé'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.max(1, (currentStep || 1) - 1));
          }}
          disabled={currentStep <= 1}
          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white border border-zinc-700 cursor-pointer"
          title="Étape Précédente"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            onStepChange(Math.min(totalHouses, (currentStep === 0 ? 0 : currentStep) + 1));
          }}
          disabled={currentStep >= totalHouses}
          className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white border border-zinc-700 cursor-pointer"
          title="Étape Suivante"
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white border border-zinc-700 transition-all cursor-pointer flex items-center gap-1"
        >
          <RotateCcw size={12} />
          <span>Afficher Tout</span>
        </button>

        <div className="flex-1 min-w-[120px] ml-2">
          <input
            type="range"
            min="0"
            max={totalHouses}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              onStepChange(Number(e.target.value));
            }}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
