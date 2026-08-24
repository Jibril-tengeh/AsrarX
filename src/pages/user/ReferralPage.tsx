import React from 'react';
import { ReferralCenter } from '../../components/ReferralCenter';
import { motion } from 'motion/react';
import { Gift, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReferralPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
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
              <span>Espace Parrainage & Récompenses</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Partagez votre code exclusif et débloquez du temps Premium illimité
            </p>
          </div>
        </div>

        {/* Main Referral Center Component */}
        <ReferralCenter />

      </div>
    </div>
  );
};

export default ReferralPage;
