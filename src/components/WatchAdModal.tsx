import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, VolumeX, Sparkles, Trophy, ShieldAlert, BadgeCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { earnPoints } from '../lib/points';

interface WatchAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardClaimed?: (points: number) => void;
}

const AD_SPONSORS = [
  {
    name: "Asrar Premium Circle",
    tagline: "Rejoignez le cercle des initiés de la spiritualité pure.",
    logo: Sparkles,
    color: "from-amber-400 via-yellow-500 to-orange-500",
    videoText: "Découvrez des secrets jamais révélés, des outils astronomiques avancés et des rituels authentiques de protection.",
    actionText: "Devenir Membre Premium"
  },
  {
    name: "L'Huile d'Olive Coranisée Bio",
    tagline: "Sélectionnée avec soin pour vos séances de Ruqyah.",
    logo: BadgeCheck,
    color: "from-emerald-400 via-teal-500 to-green-600",
    videoText: "Une pureté inégalée pour accompagner vos versets de guérison et purifier votre foyer contre le mauvais œil.",
    actionText: "Visiter la Boutique"
  },
  {
    name: "Kitab Al-Asrar (Le Livre des Secrets)",
    tagline: "L'encyclopédie numérisée de la numérologie arabe.",
    logo: Trophy,
    color: "from-violet-500 via-fuchsia-500 to-pink-500",
    videoText: "Calculez le poids mystique de n'importe quel verset en un instant avec notre moteur d'intelligence spirituelle.",
    actionText: "Explorer l'Outil Abjad"
  }
];

export const WatchAdModal: React.FC<WatchAdModalProps> = ({ isOpen, onClose, onRewardClaimed }) => {
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  
  const pointsPerAd = featureToggles['pointsPerAd'] === undefined ? 10 : Number(featureToggles['pointsPerAd']);

  const [sponsor, setSponsor] = useState(AD_SPONSORS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isMuted, setIsMuted] = useState(false);
  const [adFinished, setAdFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pick a random sponsor when modal opens
      const randomSponsor = AD_SPONSORS[Math.floor(Math.random() * AD_SPONSORS.length)];
      setSponsor(randomSponsor);
      setIsPlaying(false);
      setCountdown(15);
      setAdFinished(false);
      setClaimed(false);
      setIsSaving(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setAdFinished(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, countdown]);

  if (!isOpen) return null;

  const handleStartAd = () => {
    setIsPlaying(true);
  };

  const handleClaimReward = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    try {
      await earnPoints(user.uid, pointsPerAd, `Visionnage publicité sponsorisée : ${sponsor.name}`);
      setClaimed(true);
      if (onRewardClaimed) {
        onRewardClaimed(pointsPerAd);
      }
    } catch (e) {
      console.error("Error rewarding points:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-800 text-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-gray-400">Sponsorisé • Visionner pour Gagner</span>
          </div>
          {!isPlaying && !claimed && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Video Screen */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center overflow-hidden border-b border-gray-800">
          
          <AnimatePresence mode="wait">
            {!isPlaying && !adFinished && !claimed && (
              <motion.div 
                key="start-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent"
              >
                <div className={`p-4 rounded-3xl bg-gradient-to-br ${sponsor.color} text-white mb-4 shadow-lg`}>
                  <sponsor.logo size={36} />
                </div>
                <h3 className="font-extrabold text-xl mb-1">{sponsor.name}</h3>
                <p className="text-xs text-gray-300 max-w-sm mb-4 leading-relaxed">{sponsor.tagline}</p>
                
                <button
                  onClick={handleStartAd}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Play size={18} fill="currentColor" /> Lancer la Publicité (15s)
                </button>
                <p className="text-[10px] text-gray-500 mt-3">Gagnez +{pointsPerAd} Points Spirituels à la fin du visionnage.</p>
              </motion.div>
            )}

            {isPlaying && !adFinished && (
              <motion.div 
                key="playing-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 to-black/30"
              >
                {/* Audio and timer header */}
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="p-2 bg-black/60 hover:bg-black/80 rounded-xl text-white transition-colors"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <div className="px-3 py-1.5 bg-black/60 rounded-xl text-xs font-bold font-mono text-amber-400 flex items-center gap-1">
                    Publicité: {countdown}s
                  </div>
                </div>

                {/* Simulated video playback content */}
                <div className="text-center px-6">
                  <motion.p 
                    animate={{ scale: [0.98, 1.02, 0.98] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="text-base sm:text-lg font-bold leading-relaxed max-w-md mx-auto text-amber-100 drop-shadow-md"
                  >
                    "{sponsor.videoText}"
                  </motion.p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: `${((15 - countdown) / 15) * 100}%` }}
                    transition={{ ease: 'linear', duration: 1 }}
                    className={`h-full bg-gradient-to-r ${sponsor.color}`}
                  />
                </div>
              </motion.div>
            )}

            {adFinished && !claimed && (
              <motion.div 
                key="reward-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-gradient-to-t from-gray-950 via-gray-900 to-transparent"
              >
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 animate-bounce">
                  <Trophy size={36} />
                </div>
                <h3 className="font-extrabold text-lg text-emerald-400">Publicité terminée !</h3>
                <p className="text-xs text-gray-300 max-w-xs mt-1 mb-4">Votre récompense de {pointsPerAd} points spirituels est prête à être créditée.</p>
                
                <button
                  onClick={handleClaimReward}
                  disabled={isSaving}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  {isSaving ? "Crédit en cours..." : "Réclamer mes Points"} <Sparkles size={18} />
                </button>
              </motion.div>
            )}

            {claimed && (
              <motion.div 
                key="claimed-screen"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-gray-950"
              >
                <motion.div 
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4"
                >
                  <Sparkles size={28} className="text-white" />
                </motion.div>
                <h3 className="font-black text-xl text-amber-400">Succès !</h3>
                <p className="text-sm font-semibold text-white mt-1">+{pointsPerAd} Points Spirituels ajoutés</p>
                <p className="text-xs text-gray-400 mt-2 max-w-xs">Votre nouveau solde est de : <span className="text-emerald-400 font-bold">{ (user?.spiritualPoints || 0) + pointsPerAd } points</span>.</p>
                
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2 bg-gray-850 hover:bg-gray-800 text-gray-200 hover:text-white font-bold rounded-xl text-xs border border-gray-750 transition-colors"
                >
                  Fermer
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Info panel below video */}
        <div className="p-5 bg-gray-950 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-amber-500 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200">Solde de Points Spirituels</h4>
            <p className="text-xs text-gray-400 mt-0.5">Actuel : <span className="text-emerald-400 font-bold">{user?.spiritualPoints || 0} pts</span> • Besoin d'aide ?</p>
          </div>
        </div>

      </div>
    </div>
  );
};
