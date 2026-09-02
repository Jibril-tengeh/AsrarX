import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, Radio, Sparkles, X, Play, Square, Disc, 
  Moon, Maximize2, Minimize2, 
  BookOpen, Zap, Globe, Music, Upload, Trash2, Clock, Check, AlertCircle, Headphones
} from 'lucide-react';
import { 
  sacredAudioEngine, 
  CustomUploadedSound, 
  PRESET_BACKGROUND_MUSIC,
  AudioEngineState 
} from '../utils/sacredAudio';
import { useFeatures } from '../contexts/FeatureContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getSacredFrequencies, 
  getPlanetaryDaysInfo, 
  calculateLunarInfo
} from '../data/celestialAudioData';

export const SacredAudioPlayer: React.FC = () => {
  const { featureToggles } = useFeatures();
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpandedModal, setIsExpandedModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'player' | 'ambiance' | 'uploaded' | 'celestial' | 'science'>('presets');

  // Engine state subscription
  const [engineState, setEngineState] = useState<AudioEngineState>(() => sacredAudioEngine.getState());

  const [selectedBinaural, setSelectedBinaural] = useState<number>(4); // Theta 4Hz
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>('');
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>('');

  // Uploaded audio tracks state
  const [customAudios, setCustomAudios] = useState<CustomUploadedSound[]>(() => {
    return sacredAudioEngine.getSavedCustomTracks();
  });

  const [newAudioName, setNewAudioName] = useState('');
  const [newAudioUrl, setNewAudioUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Subscribe to audio engine changes
  useEffect(() => {
    const unsubscribe = sacredAudioEngine.subscribe((state) => {
      setEngineState(state);
    });
    return () => unsubscribe();
  }, []);

  // Reload custom tracks on mount
  useEffect(() => {
    setCustomAudios(sacredAudioEngine.getSavedCustomTracks());
  }, []);

  // Live Localized Celestial Info
  const now = new Date();
  const dayIndex = now.getDay();
  const sacredFrequencies = getSacredFrequencies(language);
  const planetaryDaysInfo = getPlanetaryDaysInfo(language);
  const planetaryInfo = planetaryDaysInfo[dayIndex] || planetaryDaysInfo[0];
  const lunarInfo = calculateLunarInfo(now, language);

  // Show unless explicitly disabled in feature toggles
  if (featureToggles?.sacredAudioPlayerVisible === false) {
    return null;
  }

  // Get admin configured scale percentage (default 100%)
  const rawScale = featureToggles?.sacredAudioPlayerScale ?? featureToggles?.sacredAudioPlayerSize ?? 100;
  const playerScale = typeof rawScale === 'number' ? rawScale : (parseInt(String(rawScale), 10) || 100);
  const scaleRatio = Math.max(0.5, Math.min(2.0, playerScale / 100));

  const isPlaying = engineState.isPlaying;
  const activeFreqData = sacredFrequencies.find(f => f.freq === engineState.currentFreq) || sacredFrequencies[4];

  const soundscapes = [
    {
      id: 'ney_flute',
      name: 'Flûte Ney Mystique & Harmoniques Soufies',
      description: 'Résonance apaisante de roseau à 293Hz avec vibrato naturel et harmoniques méditatives.',
      icon: '🎵',
      badge: 'Soufi & Zikr'
    },
    {
      id: 'sacred_drone',
      name: 'Bourdonnement Sacré Hijaz & Sub-Bass',
      description: 'Basse profonde à 136.1Hz avec quinte céleste favorisant l\'ancrage et la contemplation.',
      icon: '🧘',
      badge: 'Contemplation'
    },
    {
      id: 'mystic_wind',
      name: 'Souffle du Désert & Brise Spirituelle',
      description: 'Générateur de souffle harmonique procédural filtré évoquant la paix du désert nocturne.',
      icon: '🌬️',
      badge: 'Apaisement'
    }
  ];

  const handleTogglePlayFrequency = (freq: number) => {
    if (isPlaying && engineState.mode === 'frequency' && engineState.currentFreq === freq) {
      sacredAudioEngine.stop();
    } else {
      sacredAudioEngine.startFrequency(freq, selectedBinaural, engineState.volume, timerMinutes);
    }
  };

  const handleToggleSoundscape = (soundscapeId: string) => {
    if (isPlaying && engineState.mode === 'soundscape' && engineState.currentSoundscapeId === soundscapeId) {
      sacredAudioEngine.stop();
    } else {
      sacredAudioEngine.startSoundscape(soundscapeId, engineState.volume, timerMinutes);
    }
  };

  const handleToggleTrack = async (track: CustomUploadedSound) => {
    if (isPlaying && engineState.activeTrackId === track.id) {
      sacredAudioEngine.stop();
    } else {
      await sacredAudioEngine.playAudioTrack(track, engineState.volume, timerMinutes);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check audio type or extension
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg|webm|flac)$/i)) {
      setUploadErrorMessage('Veuillez sélectionner un fichier audio valide (MP3, WAV, M4A, AAC, OGG).');
      setTimeout(() => setUploadErrorMessage(''), 5000);
      return;
    }

    setIsUploading(true);
    setUploadErrorMessage('');
    setUploadSuccessMessage('');

    try {
      const newTrack = await sacredAudioEngine.saveUploadedAudioFile(file);
      setCustomAudios(sacredAudioEngine.getSavedCustomTracks());
      setIsUploading(false);
      setUploadSuccessMessage(`Morceau "${newTrack.name}" importé avec succès !`);
      setTimeout(() => setUploadSuccessMessage(''), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Auto-play the newly uploaded track
      await sacredAudioEngine.playAudioTrack(newTrack, engineState.volume, timerMinutes);
    } catch (err: any) {
      console.error("Upload error:", err);
      setIsUploading(false);
      setUploadErrorMessage("Erreur lors de l'enregistrement de l'audio.");
      setTimeout(() => setUploadErrorMessage(''), 5000);
    }
  };

  const handleAddUrlAudio = async () => {
    if (!newAudioUrl.trim()) return;
    try {
      const newTrack = sacredAudioEngine.saveCustomAudioUrl(newAudioName, newAudioUrl);
      setCustomAudios(sacredAudioEngine.getSavedCustomTracks());
      setNewAudioName('');
      setNewAudioUrl('');
      setUploadSuccessMessage(`Morceau ajouté par URL avec succès !`);
      setTimeout(() => setUploadSuccessMessage(''), 4000);

      // Auto-play track
      await sacredAudioEngine.playAudioTrack(newTrack, engineState.volume, timerMinutes);
    } catch (e) {
      setUploadErrorMessage("Impossible d'ajouter cette URL.");
    }
  };

  const handleDeleteCustomAudio = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await sacredAudioEngine.deleteCustomTrack(id);
    setCustomAudios(sacredAudioEngine.getSavedCustomTracks());
  };

  const handleStop = () => {
    sacredAudioEngine.stop();
  };

  const handleVolumeChange = (newVol: number) => {
    sacredAudioEngine.setVolume(newVol);
  };

  const handleTimerChange = (minutes: number) => {
    setTimerMinutes(minutes);
    sacredAudioEngine.setTimer(minutes);
  };

  const formatRemainingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div 
        className="fixed bottom-20 right-4 z-40 print:hidden transition-transform duration-300 origin-bottom-right"
        style={{ transform: `scale(${scaleRatio})` }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 border cursor-pointer group ${
              isPlaying
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 border-amber-300 ring-4 ring-amber-400/30 animate-pulse'
                : 'bg-zinc-950/90 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-zinc-900 backdrop-blur-xl'
            }`}
            title={t('sacredAudio.title', 'Musiques d\'Arrière-Plan & Fréquences')}
          >
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-spin text-zinc-950' : 'text-amber-400'}`} />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold font-mono leading-none">
                {isPlaying 
                  ? `${engineState.activeTrackName || 'Audio'} En Lecture` 
                  : 'Fonds Sonores & 432Hz'}
              </span>
              <span className="text-[9px] opacity-80 font-serif">
                {lunarInfo.phaseName.split(' ')[0]} • {planetaryInfo.symbol} {planetaryInfo.planetName}
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Widget or Full Modal Overlay */}
      {isOpen && (
        <div 
          className={
            isExpandedModal 
              ? "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
              : "fixed bottom-20 right-4 z-40 w-80 sm:w-96 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200 print:hidden transition-transform duration-300 origin-bottom-right"
          }
          style={isExpandedModal ? {} : { transform: `scale(${scaleRatio})` }}
        >
          <div className={`bg-zinc-950 text-zinc-100 border border-amber-500/30 shadow-2xl backdrop-blur-2xl flex flex-col transition-all duration-300 ${
            isExpandedModal 
              ? "w-full max-w-4xl rounded-3xl p-6 sm:p-8 my-auto max-h-[90vh] overflow-y-auto" 
              : "w-full rounded-3xl p-5 space-y-4"
          }`}>
            
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 ${isPlaying ? 'animate-pulse' : ''}`}>
                  <Disc className={`w-5 h-5 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-serif text-amber-200 flex items-center gap-2">
                    Musique de Fond & Fréquences
                  </h3>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <span>{lunarInfo.icon} {lunarInfo.phaseName}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{planetaryInfo.symbol} {planetaryInfo.dayName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpandedModal(!isExpandedModal)}
                  className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title={isExpandedModal ? "Réduire" : "Agrandir"}
                >
                  {isExpandedModal ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsExpandedModal(false);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Playback Banner (Global Top) */}
            {isPlaying && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/60 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {/* Animated Equalizer Bars */}
                    <div className="flex items-end gap-0.5 h-3.5 shrink-0">
                      <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ height: '70%' }} />
                      <span className="w-1 bg-amber-300 rounded-full animate-[bounce_1.1s_infinite_ease-in-out]" style={{ height: '100%' }} />
                      <span className="w-1 bg-amber-500 rounded-full animate-[bounce_0.6s_infinite_ease-in-out]" style={{ height: '40%' }} />
                      <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.9s_infinite_ease-in-out]" style={{ height: '85%' }} />
                    </div>
                    <span className="font-bold text-amber-300 truncate">
                      {engineState.activeTrackName || 'Audio en cours'}
                    </span>
                  </div>
                  {engineState.remainingSeconds > 0 && (
                    <span className="text-[10px] text-amber-300/90 font-mono flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Clock className="w-3 h-3" /> {formatRemainingTime(engineState.remainingSeconds)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px]">
                  <span className="text-zinc-400">
                    Mode: <strong className="text-amber-200 font-mono">
                      {engineState.mode === 'preset_music' ? 'Musique d\'Ambiance' :
                       engineState.mode === 'frequency' ? 'Fréquence Solfège' :
                       engineState.mode === 'soundscape' ? 'Générateur Procédural' : 'Morceau Personnalisé'}
                    </strong>
                  </span>
                  <button
                    onClick={handleStop}
                    className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg font-bold border border-red-800 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Arrêter</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-medium overflow-x-auto gap-1">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeTab === 'presets' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Musiques</span>
              </button>
              <button
                onClick={() => setActiveTab('player')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeTab === 'player' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Fréquences</span>
              </button>
              <button
                onClick={() => setActiveTab('ambiance')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ambiance' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ambiances</span>
              </button>
              <button
                onClick={() => setActiveTab('uploaded')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeTab === 'uploaded' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Mes Pistes</span>
              </button>
              <button
                onClick={() => setActiveTab('celestial')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                  activeTab === 'celestial' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Planètes</span>
              </button>
            </div>

            {/* TAB 1: CURATED PRESET BACKGROUND MUSICS */}
            {activeTab === 'presets' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Pistes spirituelles et contemplatives en continu :</span>
                </div>

                <div className="space-y-2">
                  {PRESET_BACKGROUND_MUSIC.map((track, trIdx) => {
                    const active = isPlaying && engineState.activeTrackId === track.id;
                    return (
                      <div
                        key={`preset-track-${track.id}-${trIdx}`}
                        onClick={() => handleToggleTrack(track)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          active
                            ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-yellow-600/20 border-amber-400 shadow-lg scale-[0.99]'
                            : 'bg-zinc-900/60 text-zinc-200 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <span className="text-2xl shrink-0">{track.presetIcon || '🎵'}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-zinc-100 truncate">{track.name}</h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{track.presetDescription}</p>
                          </div>
                        </div>

                        <button className={`p-2 rounded-full shrink-0 transition-colors ${active ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`}>
                          {active ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SACRED SOLFEGGIO FREQUENCIES */}
            {activeTab === 'player' && (
              <div className="space-y-4">
                {/* Daily Cosmic Recommendation Box */}
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{planetaryInfo.symbol}</span>
                    <div>
                      <p className="text-[10px] text-zinc-400">Recommandé aujourd'hui ({planetaryInfo.dayName}):</p>
                      <p className="font-bold text-amber-300">{planetaryInfo.recommendedFreq} Hz • {planetaryInfo.planetName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePlayFrequency(planetaryInfo.recommendedFreq)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl border border-amber-500/40 transition-colors cursor-pointer text-[10px]"
                  >
                    Lancer {planetaryInfo.recommendedFreq}Hz
                  </button>
                </div>

                {/* Binaural Beat Selector */}
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-amber-400" /> Battement Binaural:
                  </span>
                  <div className="flex gap-1">
                    {[
                      { hz: 2, label: 'Delta (2Hz)', desc: 'Sommeil' },
                      { hz: 4, label: 'Theta (4Hz)', desc: 'Zikr' },
                      { hz: 8, label: 'Alpha (8Hz)', desc: 'Calme' },
                      { hz: 14, label: 'Beta (14Hz)', desc: 'Focus' }
                    ].map((b, bIdx) => (
                      <button
                        key={`binaural-${b.hz}-${bIdx}`}
                        onClick={() => setSelectedBinaural(b.hz)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                          selectedBinaural === b.hz
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                        title={b.desc}
                      >
                        {b.hz}Hz
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequencies Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">
                    Bibliothèque Solfèges & Harmoniques ({sacredFrequencies.length})
                  </span>
                  <div className={`grid gap-2 ${isExpandedModal ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {sacredFrequencies.map((item, freqIdx) => {
                      const active = isPlaying && engineState.mode === 'frequency' && engineState.currentFreq === item.freq;
                      return (
                        <div
                          key={`freq-${item.freq}-${freqIdx}`}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            active
                              ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-yellow-600/20 border-amber-400 shadow-lg scale-[0.99]'
                              : 'bg-zinc-900/60 text-zinc-200 border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900'
                          }`}
                          onClick={() => handleTogglePlayFrequency(item.freq)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-bold font-mono text-amber-400">{item.label}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${item.badgeBg}`}>
                                {item.planetSymbol} {item.planet.split('/')[0]}
                              </span>
                            </div>
                            <button className={`p-1.5 rounded-full transition-colors ${active ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`}>
                              {active ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                            </button>
                          </div>
                          <p className="text-[11px] font-semibold text-zinc-300 mt-1.5">{item.name}</p>
                          <p className="text-[9px] text-zinc-400 line-clamp-1 mt-0.5">{item.spiritualEffect}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROCEDURAL AMBIANCES */}
            {activeTab === 'ambiance' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Générateurs sonores procéduraux 100% hors-ligne pour la méditation, la lecture de secrets et le Zikr.
                </p>

                <div className="space-y-2">
                  {soundscapes.map((sc, scIdx) => {
                    const active = isPlaying && engineState.mode === 'soundscape' && engineState.currentSoundscapeId === sc.id;
                    return (
                      <div
                        key={`soundscape-${sc.id}-${scIdx}`}
                        onClick={() => handleToggleSoundscape(sc.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          active
                            ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-yellow-600/20 border-amber-400 shadow-lg'
                            : 'bg-zinc-900/60 text-zinc-200 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{sc.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-zinc-100">{sc.name}</h4>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                {sc.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{sc.description}</p>
                          </div>
                        </div>

                        <button className={`p-2 rounded-full shrink-0 transition-colors ${active ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`}>
                          {active ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: CUSTOM UPLOADED AUDIO */}
            {activeTab === 'uploaded' && (
              <div className="space-y-4 text-xs">
                {/* Upload Form Box */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <h4 className="font-bold text-amber-200 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" /> Téléverser ou ajouter une musique d'ambiance
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Importez votre propre fichier audio (MP3, WAV, M4A) ou indiquez un lien audio pour le jouer en boucle en arrière-plan pendant la navigation.
                  </p>

                  {/* Feedback Messages */}
                  {uploadSuccessMessage && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-2 text-xs">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{uploadSuccessMessage}</span>
                    </div>
                  )}

                  {uploadErrorMessage && (
                    <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 flex items-center gap-2 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{uploadErrorMessage}</span>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Importation en cours...' : 'Choisir un fichier audio local'}</span>
                    </button>
                  </div>

                  {/* URL Input */}
                  <div className="pt-2 border-t border-zinc-800 space-y-2">
                    <span className="text-[10px] text-zinc-400 block font-semibold uppercase tracking-wider">Ou ajouter par lien URL direct</span>
                    <input
                      type="text"
                      placeholder="Nom du morceau (ex: Doux Zikr Méditatif)"
                      value={newAudioName}
                      onChange={(e) => setNewAudioName(e.target.value)}
                      className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://exemple.com/musique.mp3"
                        value={newAudioUrl}
                        onChange={(e) => setNewAudioUrl(e.target.value)}
                        className="flex-1 p-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleAddUrlAudio}
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

                {/* List of Custom Audios */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">
                    Mes Musiques Sauvegardées ({customAudios.length})
                  </span>

                  {customAudios.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 bg-zinc-900/40 rounded-2xl border border-zinc-800/60">
                      <Music className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
                      <p>Aucune musique personnalisée téléversée pour l'instant.</p>
                      <p className="text-[10px] mt-1">Utilisez le bouton ci-dessus pour importer vos pistes préférées.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customAudios.map((item, caIdx) => {
                        const active = isPlaying && engineState.activeTrackId === item.id;
                        return (
                          <div
                            key={`custom-audio-${item.id}-${caIdx}`}
                            onClick={() => handleToggleTrack(item)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              active
                                ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-yellow-600/20 border-amber-400 shadow-lg'
                                : 'bg-zinc-900/60 text-zinc-200 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <button className={`p-2 rounded-full shrink-0 transition-colors ${active ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300'}`}>
                                {active ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                              </button>
                              <div className="min-w-0">
                                <p className="font-semibold text-xs text-zinc-100 truncate">{item.name}</p>
                                <span className="text-[10px] text-zinc-500 font-mono">Lecture continue en fond</span>
                              </div>
                            </div>

                            <button
                              onClick={(e) => handleDeleteCustomAudio(item.id, e)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: CELESTIAL ALIGNMENT */}
            {activeTab === 'celestial' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-amber-950/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lunarInfo.icon}</span>
                      <div>
                        <h4 className="font-bold text-amber-200 text-sm">{lunarInfo.phaseName}</h4>
                        <p className="text-[10px] text-zinc-400 font-serif">{lunarInfo.arabicPhase} • Jour lunaire ~{lunarInfo.ageDays} / 29.5</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">{lunarInfo.illumination}% Illuminée</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                    {lunarInfo.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 text-amber-300">
                    <span>Fréquence conseillée :</span>
                    <button
                      onClick={() => {
                        setActiveTab('player');
                        handleTogglePlayFrequency(lunarInfo.recommendedFreq);
                      }}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg font-bold border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      Activer {lunarInfo.recommendedFreq} Hz
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-amber-400">{planetaryInfo.symbol}</span>
                      <div>
                        <h4 className="font-bold text-zinc-100 text-sm">Planète Régente : {planetaryInfo.planetName}</h4>
                        <p className="text-[10px] text-zinc-400">{planetaryInfo.arabicName} • {planetaryInfo.dayName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                      {planetaryInfo.recommendedFreq} Hz
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Ange Gouverneur:</span>
                      <span className="font-bold text-amber-300">{planetaryInfo.angelRuler}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Élément Subtil:</span>
                      <span className="font-bold text-zinc-200">{planetaryInfo.element}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SHARED CONTROLS: VOLUME & SLEEP TIMER */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              {/* Volume */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Volume Musique de Fond
                </span>
                <span className="font-mono text-amber-300">{Math.round(engineState.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={engineState.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              {/* Sleep Timer */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Minuteur d'arrêt
                </span>
                <div className="flex gap-1">
                  {[
                    { m: 0, label: 'Off' },
                    { m: 15, label: '15m' },
                    { m: 30, label: '30m' },
                    { m: 45, label: '45m' },
                    { m: 60, label: '1h' }
                  ].map((tOpt, toIdx) => (
                    <button
                      key={`timer-opt-${tOpt.m}-${toIdx}`}
                      onClick={() => handleTimerChange(tOpt.m)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                        timerMinutes === tOpt.m
                          ? 'bg-amber-500 text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {tOpt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Lecteur Audio & Acoustique Sacrée</span>
              <span className="text-amber-400/80 font-serif">AsrarHub Audio Engine</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
