import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, Sparkles, X, ChevronUp, Play, Square, Disc } from 'lucide-react';
import { sacredAudioEngine } from '../utils/sacredAudio';
import { useFeatures } from '../contexts/FeatureContext';

export const SacredAudioPlayer: React.FC = () => {
  const { featureToggles } = useFeatures();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (featureToggles?.sacredAudioPlayerVisible === false) {
    return null;
  }
  const [activeFreq, setActiveFreq] = useState<number>(432);
  const [selectedBinaural, setSelectedBinaural] = useState<number>(4); // Theta 4Hz
  const [volume, setVolume] = useState<number>(0.2);

  const frequencies = [
    { freq: 432, label: '432 Hz', desc: 'Harmonie Universelle & Calme', color: 'from-amber-500 to-yellow-600' },
    { freq: 528, label: '528 Hz', desc: 'Transmutation & Énergie', color: 'from-emerald-500 to-teal-600' },
    { freq: 639, label: '639 Hz', desc: 'Connexion du Cœur & Paix', color: 'from-blue-500 to-indigo-600' },
    { freq: 852, label: '852 Hz', desc: 'Intuition & Éveil Spirituel', color: 'from-purple-500 to-violet-700' },
  ];

  const handleTogglePlay = (freq: number) => {
    if (isPlaying && activeFreq === freq) {
      sacredAudioEngine.stop();
      setIsPlaying(false);
    } else {
      setActiveFreq(freq);
      sacredAudioEngine.startFrequency(freq, selectedBinaural, volume);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    sacredAudioEngine.stop();
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 print:hidden">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl transition-all duration-300 border border-amber-400/40 cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-zinc-950 animate-pulse ring-4 ring-amber-400/30'
              : 'bg-zinc-900/90 text-amber-300 hover:bg-zinc-800 backdrop-blur-md'
          }`}
          title="Lecteur de Fréquences Sacrées & Ondes Méditatives"
        >
          <Radio className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="text-xs font-bold font-mono">
            {isPlaying ? `${activeFreq}Hz Vibe` : '432Hz Solfeggio'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        </button>
      )}

      {/* Expanded Floating Panel */}
      {isOpen && (
        <div className="w-80 bg-zinc-950/95 text-white p-5 rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Disc className={`w-5 h-5 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
              <h3 className="text-sm font-bold font-serif text-amber-200">Fréquences Sacrées 432Hz</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Sons synthétisés en temps réel pour élever l'état vibratoire pendant le Zikr, Tasbīḥ et la méditation.
          </p>

          {/* Frequencies List */}
          <div className="grid grid-cols-2 gap-2">
            {frequencies.map((item) => {
              const active = isPlaying && activeFreq === item.freq;
              return (
                <button
                  key={item.freq}
                  onClick={() => handleTogglePlay(item.freq)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 border-amber-300 font-bold shadow-lg scale-98'
                      : 'bg-zinc-900/80 text-zinc-200 border-zinc-800 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-bold">{item.label}</span>
                    {active ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  </div>
                  <span className="text-[9px] opacity-80 mt-1 line-clamp-1">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Controls */}
          {isPlaying && (
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                <span>Onde Thêta Binaurale: +{selectedBinaural}Hz</span>
                <button
                  onClick={handleStop}
                  className="px-2.5 py-1 bg-red-950 text-red-300 rounded-lg text-[10px] font-bold border border-red-800 hover:bg-red-900 cursor-pointer"
                >
                  Arrêter
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
