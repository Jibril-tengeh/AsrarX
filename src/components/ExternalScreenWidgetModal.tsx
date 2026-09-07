import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Smartphone, 
  Bell, 
  Sparkles, 
  Monitor, 
  Layers, 
  CheckCircle2, 
  ExternalLink, 
  Zap, 
  Info, 
  Sun, 
  Compass, 
  Share2, 
  Play
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCurrentPlanetaryHour, playNotificationTone } from '../utils/planetaryNotifications';
import { triggerSystemWidgetNotification, launchPictureInPictureWidget, isPictureInPictureSupported } from '../utils/externalWidgetSystem';

interface ExternalScreenWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sealData?: {
    titleFr: string;
    titleAr: string;
    abjadValue: number;
    talsamCode?: string;
  };
}

export const ExternalScreenWidgetModal: React.FC<ExternalScreenWidgetModalProps> = ({
  isOpen,
  onClose,
  sealData,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'pip' | 'notification' | 'pwa'>('pip');
  const [testSent, setTestSent] = useState<boolean>(false);
  const [pipActive, setPipActive] = useState<boolean>(false);

  const currentPlanet = getCurrentPlanetaryHour();

  const handleLaunchPip = async () => {
    playNotificationTone();
    const success = await launchPictureInPictureWidget({
      title: sealData?.titleFr || 'Sceau Sacré du Jour #15',
      arabicTitle: sealData?.titleAr || 'فتح مبين',
      abjadWeight: sealData?.abjadValue || 489,
      language: language as any,
    });
    if (success) {
      setPipActive(true);
    }
  };

  const handleSendSystemNotificationWidget = async () => {
    setTestSent(true);
    await triggerSystemWidgetNotification({
      title: sealData?.titleFr || '📜 Widget Sceau Sacré AsrarHub',
      arabicTitle: sealData?.titleAr || 'فتح مبين',
      abjadWeight: sealData?.abjadValue || 489,
      language: language as any,
    });
    setTimeout(() => setTestSent(false), 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl shadow-emerald-950/80 overflow-hidden text-slate-100 font-sans my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-400">
                <Layers className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-emerald-300">
                  {language === 'fr' 
                    ? 'Widget Écran & Arrière-Plan AsrarHub' 
                    : language === 'ha' 
                    ? 'Rikitan AsrarHub akan Allo' 
                    : 'AsrarHub Screen & External Widget'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'fr'
                    ? "Affichez votre Sceau Sacré, Zikr & Heure Planétaire hors de l'application"
                    : 'Ku kalla Hatimi, Zikiri da Tauraro ba tare da shiga sauran shafuka ba'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-950/60 border-b border-slate-800 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('pip')}
              className={`py-2.5 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pip'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Monitor className="w-4 h-4 text-amber-300" />
              <span>{language === 'fr' ? 'Widget Flottant (PIP)' : 'Floating PIP'}</span>
            </button>

            <button
              onClick={() => setActiveTab('notification')}
              className={`py-2.5 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'notification'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bell className="w-4 h-4 text-emerald-300" />
              <span>{language === 'fr' ? 'Notif Système' : 'System Notif'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pwa')}
              className={`py-2.5 px-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pwa'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4 text-cyan-300" />
              <span>{language === 'fr' ? "Écran d'Accueil" : 'Home Screen'}</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* LIVE PREVIEW BANNER */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950/40 to-slate-950 border border-emerald-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'fr' ? 'Aperçu du Widget Actif' : 'Active Widget Live Preview'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  Zimām {sealData?.abjadValue || 489}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-semibold">{sealData?.titleFr || 'Sceau d\'Ouverture & Victoire'}</div>
                  <div className="font-serif text-base text-amber-200 font-bold dir-rtl">{sealData?.titleAr || 'فتح مبين'}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-bold flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      {currentPlanet.planet.name} ({currentPlanet.planet.arabic})
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Heure #{currentPlanet.hourNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{currentPlanet.planet.favorability}</div>
                </div>
              </div>
            </div>

            {/* TAB 1: Floating Picture-in-Picture Widget */}
            {activeTab === 'pip' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Monitor className="w-4 h-4" />
                    <h4>{language === 'fr' ? 'Superposition Écran PIP (Picture-in-Picture)' : 'Screen Overlay PIP'}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'fr'
                      ? 'Ouvre un petit widget interactif flottant au-dessus de TOUTES vos applications (WhatsApp, YouTube, navigateur...). Il reste visible même quand AsrarHub est réduit.'
                      : 'Opens a small floating widget on top of all apps on your screen.'}
                  </p>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                    <p className="font-semibold text-emerald-300">✨ Contenu du Widget Flottant :</p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                      <li>Carré Sacré (Wafq) & Sceau Mystique</li>
                      <li>Heure Planétaire & Symboles du Jour</li>
                      <li>Compteur Zikr interactif (+1)</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleLaunchPip}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
                >
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>
                    {pipActive
                      ? (language === 'fr' ? 'Widget Flottant Déjà Actif !' : 'Floating Widget Active!')
                      : (language === 'fr' ? 'Lancer le Widget Flottant sur l\'Écran' : 'Launch Floating Screen Widget')}
                  </span>
                </button>
              </div>
            )}

            {/* TAB 2: System Notification Widget */}
            {activeTab === 'notification' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Bell className="w-4 h-4" />
                    <h4>{language === 'fr' ? 'Widget Notification sur Verrouillage' : 'Lockscreen Notification Widget'}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'fr'
                      ? 'Envoie une fiche notification-widget sur l\'écran de verrouillage et le volet de notification de votre appareil. Vous pouvez compter votre Zikr directement depuis la notification sans ouvrir l\'appli !'
                      : 'Sends a system notification widget card to your lockscreen with interactive Zikr counter buttons.'}
                  </p>

                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      {language === 'fr' ? (
                        <><strong>Boutons Interactifs :</strong> La notification contient un bouton <code>📿 Compter Zikr (+1)</code> qui incrémente directement votre score sur l'écran verrouillé.</>
                      ) : language === 'ha' ? (
                        <><strong>Maballin Aiki :</strong> Sanarwar tana ɗauke da maballin <code>📿 Ƙirga Zikiri (+1)</code> wanda ke ƙara maki kai tsaye.</>
                      ) : (
                        <><strong>Interactive Buttons:</strong> The notification contains a <code>📿 Count Zikr (+1)</code> button that increments your score on the lockscreen.</>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendSystemNotificationWidget}
                  disabled={testSent}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-gray-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {testSent ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-gray-950 animate-bounce" />
                      <span>{language === 'fr' ? 'Widget Envoyé ! (Regardez vos notifications)' : 'Widget Sent! Check your status bar'}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-5 h-5 text-gray-950" />
                      <span>{language === 'fr' ? 'Envoyer le Widget Système Maintenant' : 'Send System Widget Now'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: PWA Home Screen Widget Guide */}
            {activeTab === 'pwa' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <Smartphone className="w-4 h-4" />
                    <h4>{language === 'fr' ? 'Installer le Widget d\'Écran d\'Accueil' : 'Add to Home Screen Widget'}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {language === 'fr'
                      ? 'Épinglez AsrarHub directement sur l\'écran d\'accueil de votre téléphone ou ordinateur pour un accès instantané en 1 clic.'
                      : 'Pin AsrarHub to your home screen for instant one-tap access.'}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                      <span>Ouvrez le menu du navigateur (les 3 points <strong>⋮</strong> ou l'icône de partage <strong><Share2 className="inline w-3 h-3"/></strong>).</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                      <span>Appuyez sur <strong>« Ajouter à l'écran d'accueil »</strong> ou <strong>« Installer l'application »</strong>.</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">3</span>
                      <span>Profitez de l'accès instantané et des notifications d'arrière-plan automatisées.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>AsrarHub External Widget Engine v2.5</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
