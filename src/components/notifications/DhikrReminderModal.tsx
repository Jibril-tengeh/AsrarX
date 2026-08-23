import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Bell, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { dispatchSystemNotification, getLocalizedNotificationText } from '../../utils/notificationLocalization';

export interface DhikrReminderData {
  type: 'dhikrDaily' | 'dhikrRecurring';
  label?: string;
  targetUrl?: string;
}

interface DhikrReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DhikrReminderData | null;
}

export const DhikrReminderModal: React.FC<DhikrReminderModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [snoozed, setSnoozed] = useState(false);

  if (!isOpen || !data) return null;

  const currentLang = (language === 'ha' ? 'ha' : language === 'en' ? 'en' : 'fr') as 'fr' | 'en' | 'ha';

  const strings = {
    fr: {
      title: 'Rappel de Zikr Spirituel',
      subtitle: data.label ? `Moment béni pour : ${data.label}` : 'Prenez une minute sacrée pour évoquer Allah.',
      openBtn: 'Faire le Zikr',
      snoozeBtn: 'Rappeler dans 15 min (Snooze)',
      snoozedNotice: 'Rappel reporté de 15 minutes avec succès !',
      dismiss: 'Plus tard',
    },
    en: {
      title: 'Spiritual Dhikr Reminder',
      subtitle: data.label ? `Blessed moment for: ${data.label}` : 'Take a sacred minute to remember Allah.',
      openBtn: 'Start Dhikr',
      snoozeBtn: 'Remind me in 15 min (Snooze)',
      snoozedNotice: 'Reminder delayed by 15 minutes!',
      dismiss: 'Dismiss',
    },
    ha: {
      title: 'Tunasatar Dhikri',
      subtitle: data.label ? `Lokaci mai albarka na: ${data.label}` : 'Samu minti daya don ambaton Allah.',
      openBtn: 'Fara Dhikri',
      snoozeBtn: 'Tuna min nan da minti 15 (Snooze)',
      snoozedNotice: 'An dage tunatarwa zuwa minti 15!',
      dismiss: 'Daga baya',
    }
  };

  const t = strings[currentLang];

  const handleOpen = () => {
    onClose();
    const target = data.targetUrl || (data.type === 'dhikrDaily' ? '/tools/daily-dhikr' : '/tools/tasbih');
    navigate(target);
  };

  const handleSnooze = async () => {
    setSnoozed(true);

    // Schedule delayed reminder in 15 minutes (900,000 ms)
    const snoozeTimeMs = 15 * 60 * 1000;
    
    // Save to localStorage for robust offline wake-up
    try {
      const snoozedReminders = JSON.parse(localStorage.getItem('asrar_snoozed_dhikr') || '[]');
      snoozedReminders.push({
        type: data.type,
        label: data.label,
        triggerAt: Date.now() + snoozeTimeMs,
        targetUrl: data.targetUrl
      });
      localStorage.setItem('asrar_snoozed_dhikr', JSON.stringify(snoozedReminders));
    } catch (e) {}

    // Setup browser timeout fallback
    setTimeout(() => {
      const { title, body } = getLocalizedNotificationText(data.type, currentLang, { label: data.label });
      dispatchSystemNotification(`[Snooze 15m] ${title}`, body, {
        type: data.type,
        label: data.label,
        targetUrl: data.targetUrl || (data.type === 'dhikrDaily' ? '/tools/daily-dhikr' : '/tools/tasbih'),
      });
    }, snoozeTimeMs);

    setTimeout(() => {
      setSnoozed(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-emerald-500/20 relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {t.title}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {data.type === 'dhikrDaily' ? '📿 Wird Quotidien' : '📿 Évocation Divine'}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800">
            {t.subtitle}
          </p>

          {snoozed ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-500 text-white rounded-2xl text-center font-bold text-xs flex items-center justify-center gap-2"
            >
              <Check size={16} />
              <span>{t.snoozedNotice}</span>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleOpen}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>{t.openBtn}</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={handleSnooze}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 font-bold text-xs border border-amber-200 dark:border-amber-800/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                <span>{t.snoozeBtn}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs font-semibold transition-colors"
              >
                {t.dismiss}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
