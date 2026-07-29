import React, { useState } from 'react';
import { 
  Volume2, Radio, Sparkles, X, Play, Square, Disc, 
  Moon, Maximize2, Minimize2, 
  BookOpen, Zap, Globe
} from 'lucide-react';
import { sacredAudioEngine } from '../utils/sacredAudio';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'celestial' | 'science'>('player');

  const [activeFreq, setActiveFreq] = useState<number>(432);
  const [selectedBinaural, setSelectedBinaural] = useState<number>(4); // Theta 4Hz
  const [volume, setVolume] = useState<number>(0.25);
  const [timerMinutes, setTimerMinutes] = useState<number>(0);

  // Live Localized Celestial Info
  const now = new Date();
  const dayIndex = now.getDay();
  const sacredFrequencies = getSacredFrequencies(language);
  const planetaryDaysInfo = getPlanetaryDaysInfo(language);
  const planetaryInfo = planetaryDaysInfo[dayIndex] || planetaryDaysInfo[0];
  const lunarInfo = calculateLunarInfo(now, language);

  if (featureToggles?.sacredAudioPlayerVisible !== true) {
    return null;
  }

  // Get admin configured scale percentage (default 100%)
  const rawScale = featureToggles?.sacredAudioPlayerScale ?? featureToggles?.sacredAudioPlayerSize ?? 100;
  const playerScale = typeof rawScale === 'number' ? rawScale : (parseInt(String(rawScale), 10) || 100);
  const scaleRatio = Math.max(0.5, Math.min(2.0, playerScale / 100));

  const activeFreqData = sacredFrequencies.find(f => f.freq === activeFreq) || sacredFrequencies[4];

  const handleTogglePlay = (freq: number) => {
    if (isPlaying && activeFreq === freq) {
      sacredAudioEngine.stop();
      setIsPlaying(false);
    } else {
      setActiveFreq(freq);
      sacredAudioEngine.startFrequency(freq, selectedBinaural, volume, timerMinutes);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    sacredAudioEngine.stop();
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sacredAudioEngine.setVolume(newVol);
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
            title={t('sacredAudio.title', 'Fréquences Sacrées & Harmoniques Célestes')}
          >
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-spin text-zinc-950' : 'text-amber-400'}`} />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold font-mono leading-none">
                {isPlaying 
                  ? `${activeFreq}Hz ${t('sacredAudio.inRecitation', 'en Récitation')}` 
                  : t('sacredAudio.triggerBtn', '432Hz & Ciel')}
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
                    {t('sacredAudio.title', 'Fréquences Sacrées & Harmoniques Célestes')}
                  </h3>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <span>{lunarInfo.icon} {lunarInfo.phaseName} ({lunarInfo.illumination}%)</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{planetaryInfo.symbol} {planetaryInfo.dayName} ({planetaryInfo.planetName})</span>
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

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between bg-zinc-900/80 p-1 rounded-xl border border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('player')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'player' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{t('sacredAudio.playerTab', 'Lecteur')}</span>
              </button>
              <button
                onClick={() => setActiveTab('celestial')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'celestial' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t('sacredAudio.celestialTab', 'Lune & Planètes')}</span>
              </button>
              <button
                onClick={() => setActiveTab('science')}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'science' 
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('sacredAudio.scienceTab', 'Sciences 432Hz')}</span>
              </button>
            </div>

            {/* TAB 1: PLAYER */}
            {activeTab === 'player' && (
              <div className="space-y-4">
                {/* Active Playing Banner & Wave Animation */}
                {isPlaying && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-zinc-900 to-amber-950/40 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-mono font-bold text-amber-300">{activeFreqData.label} — {activeFreqData.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{activeFreqData.planetSymbol} {activeFreqData.planet}</span>
                    </div>

                    {/* Wave visualizer */}
                    <div className="flex items-center justify-center gap-1 h-6 py-1">
                      {[40, 70, 30, 90, 50, 100, 60, 80, 40, 95, 65, 30, 85, 50].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-amber-400/80 rounded-full animate-pulse"
                          style={{
                            height: `${h}%`,
                            animationDuration: `${0.4 + (i % 5) * 0.2}s`
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px]">
                      <span className="text-zinc-400">{t('sacredAudio.effectLabel', 'Effet')}: <strong className="text-amber-200">{activeFreqData.spiritualEffect}</strong></span>
                      <button
                        onClick={handleStop}
                        className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg font-bold border border-red-800 transition-colors cursor-pointer"
                      >
                        {t('sacredAudio.stopBtn', 'Arrêter')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Daily Cosmic Recommendation Box */}
                <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{planetaryInfo.symbol}</span>
                    <div>
                      <p className="text-[10px] text-zinc-400">{t('sacredAudio.todayRecommendation', 'Recommandation pour aujourd\'hui')} ({planetaryInfo.dayName}):</p>
                      <p className="font-bold text-amber-300">{planetaryInfo.recommendedFreq} Hz • {planetaryInfo.planetName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTogglePlay(planetaryInfo.recommendedFreq)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-xl border border-amber-500/40 transition-colors cursor-pointer text-[10px]"
                  >
                    {t('sacredAudio.launchBtn', 'Lancer')} {planetaryInfo.recommendedFreq}Hz
                  </button>
                </div>

                {/* Frequencies Grid */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1">
                    {t('sacredAudio.solfeggioLibrary', 'Bibliothèque des Solfèges & Planètes')} ({sacredFrequencies.length})
                  </span>
                  <div className={`grid gap-2 ${isExpandedModal ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {sacredFrequencies.map((item) => {
                      const active = isPlaying && activeFreq === item.freq;
                      return (
                        <div
                          key={item.freq}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            active
                              ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-yellow-600/20 border-amber-400 shadow-lg scale-[0.99]'
                              : 'bg-zinc-900/60 text-zinc-200 border-zinc-800/80 hover:border-amber-500/50 hover:bg-zinc-900'
                          }`}
                          onClick={() => handleTogglePlay(item.freq)}
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
                          <p className="text-[9px] text-zinc-400 line-clamp-1 mt-0.5">{item.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audio Controls (Volume & Binaural Offset & Timer) */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" /> {t('sacredAudio.volumeLabel', 'Volume Synthétiseur')}
                    </span>
                    <span className="font-mono text-amber-300">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">{t('sacredAudio.binauralLabel', 'Onde Binaurale Thêta/Alpha')}:</label>
                      <select
                        value={selectedBinaural}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setSelectedBinaural(val);
                          if (isPlaying) {
                            sacredAudioEngine.startFrequency(activeFreq, val, volume, timerMinutes);
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-zinc-200 text-xs"
                      >
                        <option value={2}>+2 Hz (Delta)</option>
                        <option value={4}>+4 Hz (Thêta)</option>
                        <option value={8}>+8 Hz (Alpha)</option>
                        <option value={14}>+14 Hz (Bêta)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">{t('sacredAudio.timerLabel', 'Minuteur de Méditation')}:</label>
                      <select
                        value={timerMinutes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setTimerMinutes(val);
                          if (isPlaying) {
                            sacredAudioEngine.startFrequency(activeFreq, selectedBinaural, volume, val);
                          }
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-1.5 text-zinc-200 text-xs"
                      >
                        <option value={0}>{t('sacredAudio.infiniteTimer', 'Infini / Continu')}</option>
                        <option value={15}>{t('sacredAudio.min15', '15 Minutes')}</option>
                        <option value={30}>{t('sacredAudio.min30', '30 Minutes')}</option>
                        <option value={60}>{t('sacredAudio.min60', '60 Minutes')}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CELESTIAL & MOON ALIGNMENT */}
            {activeTab === 'celestial' && (
              <div className="space-y-4">
                {/* Live Lunar Status Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-amber-950/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lunarInfo.icon}</span>
                      <div>
                        <h4 className="font-bold text-amber-200 text-sm">{lunarInfo.phaseName}</h4>
                        <p className="text-[10px] text-zinc-400 font-serif">{lunarInfo.arabicPhase} • {t('sacredAudio.lunarDay', 'Jour lunaire')} ~{lunarInfo.ageDays} / 29.5</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400">{lunarInfo.illumination}% {t('sacredAudio.illuminated', 'Illuminée')}</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                    {lunarInfo.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 text-amber-300">
                    <span>{t('sacredAudio.recommendedFreqPhase', 'Fréquence conseillée pour cette phase')} :</span>
                    <button
                      onClick={() => {
                        setActiveTab('player');
                        handleTogglePlay(lunarInfo.recommendedFreq);
                      }}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg font-bold border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      {t('sacredAudio.activateBtn', 'Activer')} {lunarInfo.recommendedFreq} Hz
                    </button>
                  </div>
                </div>

                {/* Planetary Ruler Card */}
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-amber-400">{planetaryInfo.symbol}</span>
                      <div>
                        <h4 className="font-bold text-zinc-100 text-sm">{t('sacredAudio.rulingPlanet', 'Planète Régente')} : {planetaryInfo.planetName}</h4>
                        <p className="text-[10px] text-zinc-400">{planetaryInfo.arabicName} • {planetaryInfo.dayName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                      {planetaryInfo.recommendedFreq} Hz
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">{t('sacredAudio.rulingAngel', 'Ange Gouverneur')}:</span>
                      <span className="font-bold text-amber-300">{planetaryInfo.angelRuler}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">{t('sacredAudio.subtleElement', 'Élément Subtil')}:</span>
                      <span className="font-bold text-zinc-200">{planetaryInfo.element}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                    <strong>{t('sacredAudio.zikrOrientation', 'Orientation du Zikr')} :</strong> {planetaryInfo.spiritualFocus}. {planetaryInfo.description}
                  </div>
                </div>

                {/* Planetary Spheres Summary Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
                    {t('sacredAudio.planetaryCorrespondence', 'Correspondance des 7 Planètes & Fréquences')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.values(planetaryDaysInfo).map((p) => (
                      <div
                        key={p.dayIndex}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                          p.dayIndex === dayIndex 
                            ? 'bg-amber-500/10 border-amber-500/50 text-amber-200' 
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p.symbol}</span>
                          <div>
                            <p className="font-bold">{p.dayName} • {p.planetName}</p>
                            <p className="text-[10px] text-zinc-400">{p.spiritualFocus.split(',')[0]}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-400 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                          {p.recommendedFreq}Hz
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SCIENCE OF 432HZ & CELESTIAL MECHANICS */}
            {activeTab === 'science' && (
              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> {t('sacredAudio.scienceTitle1')}
                  </h4>
                  <p>
                    {t('sacredAudio.scienceText1')}
                  </p>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5 font-mono text-[11px] text-amber-200">
                    <p>• {t('sacredAudio.schumannBullet')}</p>
                    <p>• {t('sacredAudio.earthMultipleBullet')}</p>
                    <p>• {t('sacredAudio.moonDiameterBullet')}</p>
                    <p>• {t('sacredAudio.sunDiameterBullet')}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-amber-400" /> {t('sacredAudio.scienceTitle2')}
                  </h4>
                  <p>
                    {t('sacredAudio.scienceText2')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" /> {t('sacredAudio.scienceTitle3')}
                  </h4>
                  <p>
                    {t('sacredAudio.scienceText3')}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
              <span>{t('sacredAudio.footerGenerator', 'Générateur Acoustique & Synthèse Audio Web API')}</span>
              <span className="text-amber-400/80 font-serif">{t('sacredAudio.footerTitle', 'AsrarHub Sacred Acoustics')}</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
