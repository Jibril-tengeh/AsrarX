import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFeatures } from '../contexts/FeatureContext';
import { calculateHijriDate } from '../utils/hijriDate';

export const HijriCalendarWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const { featureToggles } = useFeatures();
  const [hijriDate, setHijriDate] = useState<{ day: number, month: string, year: number } | null>(null);
  const [gregorianDate, setGregorianDate] = useState<string>('');
  
  useEffect(() => {
    try {
      const date = new Date();
      setGregorianDate(date.toLocaleDateString(t('locale', 'fr-FR'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      
      const offset = featureToggles?.hijriOffset || 0;
      const res = calculateHijriDate(date, offset);
      
      const monthName = language === 'en' ? res.monthNameEn : (language === 'ha' ? res.monthNameHa : res.monthNameFr);
      
      setHijriDate({ day: res.day, month: monthName, year: res.year });
    } catch (e) {
      console.error(e);
      setHijriDate({ day: 10, month: 'Ṣafar', year: 1448 });
    }
  }, [t, language, featureToggles]);

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-700 flex flex-col justify-center relative overflow-hidden text-white h-full">
      <Moon className="absolute -bottom-4 -right-4 text-emerald-700/50" size={100} />
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Calendar className="text-emerald-300" size={20} />
        <h3 className="font-bold text-emerald-50 text-sm uppercase tracking-wider">Calendrier Hijri</h3>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-black text-white mb-1">
          {hijriDate ? `${hijriDate.day} ${hijriDate.month}` : '...'}
        </div>
        <div className="text-emerald-200 font-bold mb-4">
          {hijriDate ? `${hijriDate.year} AH` : '...'}
        </div>
        
        <div className="text-sm text-emerald-100/80 bg-emerald-900/40 py-2 px-3 rounded-xl border border-emerald-800/50 inline-block">
          {gregorianDate}
        </div>
      </div>
    </div>
  );
};
