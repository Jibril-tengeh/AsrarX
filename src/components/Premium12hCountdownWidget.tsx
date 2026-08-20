import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Crown, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFeatures } from '../contexts/FeatureContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { getTrialDurationHours } from '../utils/trialConfig';

interface Premium12hCountdownWidgetProps {
  className?: string;
  compact?: boolean;
}

export const Premium12hCountdownWidget: React.FC<Premium12hCountdownWidgetProps> = ({
  className = '',
  compact = false
}) => {
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const { t, language } = useLanguage();

  const trialDurationHours = getTrialDurationHours(featureToggles);
  const totalTrialMs = trialDurationHours * 60 * 60 * 1000;

  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    isExpired: boolean;
    formattedEndTime: string;
  }>({
    hours: trialDurationHours,
    minutes: 0,
    seconds: 0,
    totalMs: totalTrialMs,
    isExpired: false,
    formattedEndTime: ''
  });

  useEffect(() => {
    if (!user) return;

    // Helper to extract expiry Date
    const getExpiryDate = (): Date | null => {
      if (user.role === 'admin') return null;
      
      const rawTarget = user.freeTrialExpiresAt || user.premiumUntil;
      if (rawTarget) {
        if (typeof rawTarget === 'object' && rawTarget.toDate) {
          return rawTarget.toDate();
        }
        const parsed = new Date(rawTarget);
        if (!isNaN(parsed.getTime())) return parsed;
      }

      if (user.freeTrialActivatedAt) {
        const start = new Date(user.freeTrialActivatedAt);
        if (!isNaN(start.getTime())) {
          return new Date(start.getTime() + totalTrialMs);
        }
      }

      return null;
    };

    const updateTimer = () => {
      const expiry = getExpiryDate();
      if (!expiry) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMs: 0,
          isExpired: true,
          formattedEndTime: ''
        });
        return;
      }

      const now = new Date();
      const diffMs = expiry.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMs: 0,
          isExpired: true,
          formattedEndTime: expiry.toLocaleTimeString(language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr', {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      } else {
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalMs: diffMs,
          isExpired: false,
          formattedEndTime: expiry.toLocaleTimeString(language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr', {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user, language, totalTrialMs]);

  if (!user) return null;

  // Admin users have permanent premium
  if (user.role === 'admin') {
    return (
      <div className={`bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Crown size={22} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5">
              <span>{t('profile.countdown.adminTitle', 'Accès Premium Illimité')}</span>
              <span className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">Admin</span>
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {t('profile.countdown.adminDesc', 'Votre statut administrateur vous donne un accès permanent à toutes les fonctionnalités Premium.')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.max(0, (timeLeft.totalMs / totalTrialMs) * 100));

  const unitStr = trialDurationHours > 1 ? 'heures' : 'heure';

  if (compact) {
    return (
      <div className={`bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2 min-w-0">
          <Clock size={16} className="text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
            {t('profile.countdown.label', `Essai Premium (${trialDurationHours}h)`, { hours: trialDurationHours, unit: unitStr })} :
          </span>
        </div>
        {timeLeft.isExpired ? (
          <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-950/50 px-2 py-1 rounded-lg shrink-0">
            Expiré
          </span>
        ) : (
          <div className="flex items-center gap-1 font-mono font-bold text-xs text-amber-700 dark:text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg shrink-0">
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-amber-500/15 dark:from-amber-950/40 dark:via-emerald-950/20 dark:to-amber-950/50 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-md ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-md shadow-amber-500/20">
            <Clock size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg tracking-tight">
                {t('profile.countdown.title', `Compte à Rebours Premium (${trialDurationHours}h)`, { hours: trialDurationHours, unit: unitStr })}
              </h3>
              <span className="bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Sparkles size={10} />
                <span>{trialDurationHours} {trialDurationHours > 1 ? 'Heures' : 'Heure'}</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              {timeLeft.isExpired
                ? t('profile.countdown.expiredSub', `Votre période d'essai gratuit de ${trialDurationHours} ${unitStr} est terminée.`, { hours: trialDurationHours, unit: unitStr })
                : t('profile.countdown.activeSub', `Accès complet débloqué pendant votre période d'essai de ${trialDurationHours} ${unitStr}.`, { hours: trialDurationHours, unit: unitStr })}
            </p>
          </div>
        </div>

        {timeLeft.isExpired && (
          <Link
            to="/payment"
            className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Crown size={15} />
            <span>{t('profile.countdown.renewBtn', 'Devenir Premium')}</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {!timeLeft.isExpired ? (
        <div className="space-y-4 relative z-10">
          {/* Digit Counter Display */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto py-2">
            {/* Hours */}
            <div className="flex flex-col items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 shadow-inner">
              <span className="font-mono font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.countdown.hours', 'Heures')}
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 shadow-inner">
              <span className="font-mono font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.countdown.minutes', 'Minutes')}
              </span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 shadow-inner">
              <span className="font-mono font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.countdown.seconds', 'Secondes')}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>{t('profile.countdown.statusActive', `Temps restant sur votre essai de ${trialDurationHours}h`, { hours: trialDurationHours, unit: unitStr })}</span>
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {timeLeft.formattedEndTime && (
            <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 italic">
              {t('profile.countdown.expiresAt', 'Fin de l\'essai gratuit aujourd\'hui à')} <strong className="text-gray-700 dark:text-gray-200">{timeLeft.formattedEndTime}</strong>
            </p>
          )}
        </div>
      ) : (
        <div className="bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-red-900 dark:text-red-200 text-sm">
                {t('profile.countdown.trialEndedTitle', `Votre essai gratuit de ${trialDurationHours}h est expiré`, { hours: trialDurationHours, unit: unitStr })}
              </h4>
              <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                {t('profile.countdown.trialEndedDesc', 'Abonnez-vous pour conserver un accès illimité aux secrets avancés et aux outils.')}
              </p>
            </div>
          </div>
          <Link
            to="/payment"
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 transition-opacity shrink-0 flex items-center justify-center gap-1.5"
          >
            <Crown size={15} />
            <span>{t('profile.countdown.upgradeNow', 'Activer le Premium')}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
