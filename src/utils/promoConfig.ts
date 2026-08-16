export type PromoDurationHours = 2 | 4 | 6 | 8 | 10 | 12;

export const PROMO_HOURS_OPTIONS: PromoDurationHours[] = [2, 4, 6, 8, 10, 12];

export interface PromoHourMessage {
  hours: PromoDurationHours;
  labelFr: string;
  labelEn: string;
  labelHa: string;
  messageFr: string;
  messageEn: string;
  messageHa: string;
}

export const PROMO_HOURLY_OPTIONS: Record<PromoDurationHours, PromoHourMessage> = {
  2: {
    hours: 2,
    labelFr: "2 Heures (Pass Découverte)",
    labelEn: "2 Hours (Discovery Pass)",
    labelHa: "Awowi 2 (Damar Bincike)",
    messageFr: "🌟 Félicitations ! Votre Pass Découverte Premium de 2 heures est activé. Profitez d'un accès illimité à tous les secrets, outils et carrés magiques pendant 2 heures.",
    messageEn: "🌟 Congratulations! Your 2-Hour Premium Discovery Pass is activated. Enjoy unlimited access to all secrets, tools, and magic squares for the next 2 hours.",
    messageHa: "🌟 Taya murna! An kunna damar shiga Premium ta Awowi 2. Ji dadin shiga dukkan asirai, kayan aiki da khatimi na tsawon awowi 2."
  },
  4: {
    hours: 4,
    labelFr: "4 Heures (Accès Flash)",
    labelEn: "4 Hours (Flash Access)",
    labelHa: "Awowi 4 (Damar Flash)",
    messageFr: "✨ Magnifique ! Votre Accès Flash Premium de 4 heures est activé. Explorez en profondeur toutes les fonctionnalités exclusives et recettes mystiques pendant 4 heures.",
    messageEn: "✨ Wonderful! Your 4-Hour Premium Flash Access is activated. Deeply explore all exclusive features and mystical recipes for 4 hours.",
    messageHa: "✨ Madalla! An kunna damar Flash Premium ta Awowi 4. Binciki dukkan asirai da hanyoyin asiri na musamman na tsawon awowi 4."
  },
  6: {
    hours: 6,
    labelFr: "6 Heures (Session Spirituelle)",
    labelEn: "6 Hours (Spiritual Session)",
    labelHa: "Awowi 6 (Zaman Ibada)",
    messageFr: "🌙 Baraka Allahu Fik ! Votre Session Spirituelle Premium de 6 heures est active. Débloquez tous les calculs, talsams et zairjas sans aucune restriction pendant 6 heures.",
    messageEn: "🌙 Baraka Allahu Feek! Your 6-Hour Premium Spiritual Session is active. Unlock all calculations, talsams, and zairjas without restriction for 6 hours.",
    messageHa: "🌙 Albarka! An kunna zaman ibada na Premium na Awowi 6. Bude dukkan lissafi, talsam da zairja ba tare da wani shamaki ba na tsawon awowi 6."
  },
  8: {
    hours: 8,
    labelFr: "8 Heures (Accès Privilège)",
    labelEn: "8 Hours (Privilege Access)",
    labelHa: "Awowi 8 (Damar Musamman)",
    messageFr: "🔥 Excellent ! Votre Accès Privilège Premium de 8 heures est activé. Bénéficiez d'une immersion spirituelle complète et de tous les outils avancés durant 8 heures.",
    messageEn: "🔥 Excellent! Your 8-Hour Premium Privilege Access is activated. Enjoy full spiritual immersion and all advanced tools for 8 hours.",
    messageHa: "🔥 Madalla sosai! An kunna damar Premium ta Awowi 8. Ji dadin cikakken bincike na asiri da dukkan manyan kayan aiki na tsawon awowi 8."
  },
  10: {
    hours: 10,
    labelFr: "10 Heures (Pass Intensif)",
    labelEn: "10 Hours (Intensive Pass)",
    labelHa: "Awowi 10 (Damar Cikakken Aiki)",
    messageFr: "👑 Accès Royal ! Votre Pass Intensif Premium de 10 heures est débloqué. Tous les secrets sacrés, invocations et outils experts sont à votre disposition pendant 10 heures.",
    messageEn: "👑 Royal Access! Your 10-Hour Intensive Premium Pass is unlocked. All sacred secrets, invocations, and expert tools are at your disposal for 10 hours.",
    messageHa: "👑 Babbar Dama! An bude muku damar Premium ta Awowi 10. Dukkan asirai masu tsarki da manyan kayan aiki na karkashin ikonka na tsawon awowi 10."
  },
  12: {
    hours: 12,
    labelFr: "12 Heures (Demi-Journée VIP)",
    labelEn: "12 Hours (VIP Half-Day)",
    labelHa: "Awowi 12 (VIP Rabin Rana)",
    messageFr: "💎 Demi-Journée VIP ! Votre Pass Illimité Premium de 12 heures est activé avec succès. Accédez en toute liberté à l'ensemble du patrimoine ésotérique d'AsrarHub pendant 12 heures.",
    messageEn: "💎 VIP Half-Day! Your 12-Hour Unlimited Premium Pass is successfully activated. Freely access the entire AsrarHub esoteric heritage for 12 hours.",
    messageHa: "💎 Damar VIP ta Rabin Rana! An kunna damar Premium ta Awowi 12 cikin nasara. Shiga dukkan ilimin asiri na AsrarHub cikin cikakken 'yanci na tsawon awowi 12."
  }
};

export const getPromoHourMessage = (hours: number, language: 'fr' | 'en' | 'ha' = 'fr'): string => {
  const matched = PROMO_HOURLY_OPTIONS[hours as PromoDurationHours];
  if (!matched) {
    if (language === 'en') {
      return `🎉 Congratulations! Your ${hours}-hour Premium access is successfully activated.`;
    }
    if (language === 'ha') {
      return `🎉 Taya murna! An kunna damar Premium ta awowi ${hours} cikin nasara.`;
    }
    return `🎉 Félicitations ! Votre accès Premium de ${hours} heures est activé avec succès.`;
  }

  if (language === 'en') return matched.messageEn;
  if (language === 'ha') return matched.messageHa;
  return matched.messageFr;
};

export const getPromoHourLabel = (hours: number, language: 'fr' | 'en' | 'ha' = 'fr'): string => {
  const matched = PROMO_HOURLY_OPTIONS[hours as PromoDurationHours];
  if (!matched) return `${hours} h`;
  if (language === 'en') return matched.labelEn;
  if (language === 'ha') return matched.labelHa;
  return matched.labelFr;
};
