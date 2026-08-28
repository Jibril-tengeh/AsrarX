import React from 'react';
import { ReferralDashboard } from '../../components/ReferralDashboard';
import { motion } from 'motion/react';
import { Gift, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export const ReferralPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 pt-16 sm:pt-20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top bar back button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Gift className="text-amber-500" size={24} />
              <span>{t('referralDashboard.pageTitle', 'Tableau de Bord de Parrainage')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t('referralDashboard.pageSubtitle', 'Invitez vos proches, gagnez des heures Premium gratuites et progressez dans les rangs Ambassadeur.')}
            </p>
          </div>
        </div>

        {/* Full Referral Dashboard Component */}
        <ReferralDashboard />

      </div>
    </div>
  );
};

export default ReferralPage;

