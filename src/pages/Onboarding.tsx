import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Globe,
  Sparkles,
  Calculator,
  Grid,
  CircleDot,
  Compass,
  Moon,
  BookMarked,
  Key,
  Bot,
  Flame,
  Layers,
  Wind,
  Award,
  Users,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Check,
  Shield,
  Star,
  CheckCircle2
} from 'lucide-react';
import { requestAllPermissions } from '../utils/planetaryNotifications';

// ---------------------------------------------------------------------------
// 1. Procedural 3D/Video Canvas Animation Component
// ---------------------------------------------------------------------------
const IconCanvas3D: React.FC<{ type: string; colorHex: string }> = ({ type, colorHex }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 300);
    let height = (canvas.height = 300);

    // Generate themed particle objects
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.8 + 0.2,
      orbitRadius: Math.random() * 80 + 20,
      opacity: Math.random() * 0.7 + 0.3
    }));

    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw background ambient radial glow
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
      grad.addColorStop(0, colorHex + '40');
      grad.addColorStop(0.6, colorHex + '10');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render theme-specific 3D geometric energy structures
      ctx.save();
      ctx.translate(centerX, centerY);

      if (type === 'abjad' || type === 'jafar') {
        // Rotating 3D matrix / letter ring
        ctx.rotate(t * 0.3);
        ctx.strokeStyle = colorHex + '80';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, 45 + i * 18, 0, Math.PI * 1.5);
          ctx.stroke();
        }
      } else if (type === 'khatim' || type === 'seals') {
        // Pulsating Wafq square matrix rotation
        ctx.rotate(-t * 0.2);
        ctx.strokeStyle = colorHex + '90';
        ctx.lineWidth = 2;
        const size = 65 + Math.sin(t * 2) * 8;
        ctx.strokeRect(-size / 2, -size / 2, size, size);
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = colorHex + '50';
        ctx.strokeRect(-size / 2.2, -size / 2.2, size / 1.1, size / 1.1);
      } else if (type === 'calendar' || type === 'moon') {
        // Celestial orbits with rotating lunar phases
        ctx.strokeStyle = colorHex + '70';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 85, 40, t * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 85, -t * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Default floating energy torus / rings
        ctx.rotate(t * 0.4);
        ctx.strokeStyle = colorHex + '80';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 60 + Math.sin(t * 1.5) * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Render floating 3D particle dust
      particles.forEach((p, idx) => {
        p.angle += p.speed * 0.02;
        const pX = centerX + Math.cos(p.angle + idx) * (p.orbitRadius + Math.sin(t + idx) * 15);
        const pY = centerY + Math.sin(p.angle * 1.2 + idx) * (p.orbitRadius + Math.cos(t + idx) * 15);

        ctx.beginPath();
        ctx.arc(pX, pY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.globalAlpha = p.opacity * (0.6 + Math.sin(t * 2 + idx) * 0.4);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, colorHex]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl"
    />
  );
};

// ---------------------------------------------------------------------------
// 2. 3D Tilt Card Container
// ---------------------------------------------------------------------------
const Card3D: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  bgGlow?: string;
}> = ({ children, className = '', onClick, bgGlow = 'rgba(16,185,129,0.2)' }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / (rect.height / 2)) * 12,
      y: (x / (rect.width / 2)) * 12
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative rounded-3xl transition-shadow duration-300 ${className}`}
    >
      {/* Glow aura */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-60 blur-xl transition-all duration-500 pointer-events-none"
        style={{ background: bgGlow }}
      />
      {children}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// 3. Main Onboarding Component (15 Detailed Home Screen Cards)
// ---------------------------------------------------------------------------
export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState(0); // 0 = Language, 1..15 = Feature Cards

  // 15 Comprehensive Feature Slides for AsrarHub with deep descriptions & 3 feature bullet points in FR, EN, HA
  const slides = [
    {
      id: 'welcome',
      icon: Sparkles,
      badgeIcon: Star,
      titleFr: "1. Bienvenue sur AsrarHub",
      titleEn: "1. Welcome to AsrarHub",
      titleHa: "1. Barka da zuwa AsrarHub",
      badgeFr: "ÉCOSYSSTÈME GLOBAL",
      badgeEn: "GLOBAL ECOSYSTEM",
      badgeHa: "TSILLIN ANNOJI DA SIRRI",
      descFr: "Bienvenue sur la plateforme centrale d'études et de pratiques spirituelles. AsrarHub réunit dans une interface moderne et sécurisée l'ensemble des outils théurgiques, coraniques et ésotériques traditionnels pour éclairer votre cheminement.",
      descEn: "Welcome to the central platform for spiritual studies and practice. AsrarHub brings together traditional Islamic, esoteric, and quranic tools in a modern, secure interface designed to illuminate your daily practice.",
      descHa: "Barka da zuwa babbar cibiyar karatu da aikin ruhaniya. AsrarHub yana haɗa duk kayan aikin asiri, Alkur'ani da zikiri a wuri guda domin inganta rayuwar ku.",
      featuresFr: [
        "Navigation fluide & personnalisée selon votre profil",
        "Espace sécurisé et protection stricte de vos données",
        "Accès instantané à plus de 15 outils et calculateurs"
      ],
      featuresEn: [
        "Fluid & personalized navigation based on your profile",
        "Secure space with strict privacy & data protection",
        "Instant access to 15+ specialized mystical tools"
      ],
      featuresHa: [
        "Sadarwa mai sauki da sauri ta hanyar komai",
        "Kariya da amincin bayanan mai amfani a cikin sirri",
        "Sama da kayan aiki 15 na asiri da hisabi"
      ],
      color: 'text-amber-500 dark:text-amber-400',
      colorHex: '#F59E0B',
      bg: 'bg-gradient-to-br from-amber-500/10 via-amber-900/5 to-amber-500/20 border-amber-500/30',
      glow: 'rgba(245, 158, 11, 0.35)',
      type: 'energy'
    },
    {
      id: 'abjad',
      icon: Calculator,
      badgeIcon: Sparkles,
      titleFr: "2. Calculateur Abjad (Ilm al-Huruf)",
      titleEn: "2. Abjad Calculator (Science of Letters)",
      titleHa: "2. Kintataccen Hisabin Abjadi",
      badgeFr: "SCIENCE DES LETTRES",
      badgeEn: "SCIENCE OF LETTERS",
      badgeHa: "ILMIN ABJADI",
      descFr: "Explorez la valeur numérique sacrée des mots et des noms. Le calculateur Abjad détermine instantanément le poids Kabir (Grand) et Saghir (Petit), analyse la dominance des 4 éléments et propose les correspondances avec les Noms Divins.",
      descEn: "Explore the sacred numerical value of names and phrases. The Abjad calculator computes the Kabir (Major) and Saghir (Minor) weights, analyzes elemental dominance (Fire, Air, Water, Earth), and highlights divine matches.",
      descHa: "Gano nauyin hisabi na kowane suna ko rubutu. Na'urar tana lissafa Kabir da Saghir, da bincika abubuwa guda hudu (Wuta, Iska, Ruwa, Kasa) da Asma'ul Husna masu dacewa.",
      featuresFr: [
        "Calcul automatique Kabir (Grand) et Saghir (Petit)",
        "Répartition exacte des 4 Éléments (Feu, Air, Eau, Terre)",
        "Suggestions personnalisées de Versets & Noms Divins"
      ],
      featuresEn: [
        "Automatic Kabir (Major) and Saghir (Minor) calculations",
        "Exact 4 Elements breakdown (Fire, Air, Water, Earth)",
        "Smart suggestions for Verses & Divine Names"
      ],
      featuresHa: [
        "Cikakken lissafin Hisabi Kabir da Saghir ba tare da kuskure ba",
        "Binciken abubuwa guda 4 (Wuta, Iska, Ruwa, Kasa)",
        "Daidaitawa da Asmya'ul Husna da Ayoyin Alkur'ani"
      ],
      color: 'text-emerald-500 dark:text-emerald-400',
      colorHex: '#10B981',
      bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-900/5 to-emerald-500/20 border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.35)',
      type: 'abjad'
    },
    {
      id: 'khatim',
      icon: Grid,
      badgeIcon: Shield,
      titleFr: "3. Générateur de Khatim & Wafq",
      titleEn: "3. Sacred Seal & Khatim Generator",
      titleHa: "3. Mai Sarrafa Khatimi da Wafq",
      badgeFr: "THÉURGIE & SCEAUX",
      badgeEn: "SACRED SEALS & KHATIMS",
      badgeHa: "KHATIMI DA WAFQ",
      descFr: "Créez des carrés magiques authentiques (3x3 Ghazali, 4x4, 9x9) pour vos travaux spirituels. Le générateur vérifie les sommes arithmétiques, génère des parchemins sacrés personnalisés et vous permet de les télécharger en haute définition.",
      descEn: "Generate authentic sacred magic squares (3x3 Ghazali, 4x4, 9x9). The generator ensures strict arithmetic balance, renders custom sacred parchments, and lets you download HD printable digital seals.",
      descHa: "Sarrafa Katangar Khatimi mai albarka (3x3, 4x4 zuwa 9x9). Na'urar tana tabbatar da daidaiton hisabi, tana fidda parchemins na HD domin saukewa da amfani.",
      featuresFr: [
        "Matrices 3x3 Ghazali, 4x4, 9x9 avec contrôle d'équilibre",
        "Rendu visuel style Parchemin Sacré d'époque ou Doré",
        "Exportation d'images HD pour impression et talismanie"
      ],
      featuresEn: [
        "3x3 Ghazali, 4x4, 9x9 matrices with sum verification",
        "Sacred Parchment & Gold parchment visual styling",
        "HD image export for high quality printing and practice"
      ],
      featuresHa: [
        "Sarrafa Khatimi 3x3, 4x4 zuwa 9x9 mai daidaitaccen hisabi",
        "Zane na musamman na Parchemin ko Zinare mai ban sha'awa",
        "Sauke hotuna masu inganci na HD domin aiki"
      ],
      color: 'text-indigo-500 dark:text-indigo-400',
      colorHex: '#6366F1',
      bg: 'bg-gradient-to-br from-indigo-500/10 via-indigo-900/5 to-indigo-500/20 border-indigo-500/30',
      glow: 'rgba(99, 102, 241, 0.35)',
      type: 'khatim'
    },
    {
      id: 'zikr',
      icon: CircleDot,
      badgeIcon: Volume2,
      titleFr: "4. Compteur de Zikr & Tasbih Digital",
      titleEn: "4. Zikr Counter & Digital Tasbih",
      titleHa: "4. Na’urar Kirga Zikiri mai Ji",
      badgeFr: "PRATIQUE QUOTIDIENNE",
      badgeEn: "DAILY PRACTICE",
      badgeHa: "TASBIHI DA ZIKIRI",
      descFr: "Un chapelet numérique haut de gamme conçu pour une concentration totale. Bénéficiez d'un retour haptique discret à chaque incrément, de sons de résonance apaisants, de fixations d'objectifs précises et d'un suivi quotidien de vos séries.",
      descEn: "A premium digital tasbih built for maximum focus. Enjoy subtle haptic vibration feedback on every count, soothing acoustic resonance, custom target numbers, and daily streak tracking.",
      descHa: "Na'urar tasbihi na zamani domin samun natsuwa. Tana ba da girgiza mai sauki wajen kirga zikiri, muryoyin ruhi, da adana adadin zikirin da kake yi kullum.",
      featuresFr: [
        "Vibrations haptiques discrètes & personnalisables",
        "Sons d'ambiance et résonance pour méditation",
        "Historique des séances & sauvegarde automatique"
      ],
      featuresEn: [
        "Discreet, customizable haptic vibration feedback",
        "Ambient acoustic resonance for deep meditation",
        "Session history logging & automatic Cloud sync"
      ],
      featuresHa: [
        "Cikakken girgiza na musamman da sauti mai daɗi",
        "Muryoyin tasbihi na kwantar da hankali da tunani",
        "Adana adadin zikiri da bibiyar nasara"
      ],
      color: 'text-teal-500 dark:text-teal-400',
      colorHex: '#14B8A6',
      bg: 'bg-gradient-to-br from-teal-500/10 via-teal-900/5 to-teal-500/20 border-teal-500/30',
      glow: 'rgba(20, 184, 166, 0.35)',
      type: 'energy'
    },
    {
      id: 'asma',
      icon: Compass,
      badgeIcon: Star,
      titleFr: "5. Noms Divins (Asma al-Husna)",
      titleEn: "5. Divine Names (Asma al-Husna)",
      titleHa: "5. Asmya’ul Husna da Sirruruwa",
      badgeFr: "MÉRITES DIVINS",
      badgeEn: "DIVINE VIRTUES",
      badgeHa: "ASMA'UL HUSNA",
      descFr: "Explorez les 99 Beaux Noms d'Allah avec leurs traductions, leurs significations profondes, leurs poids Abjad et leurs secrets ésotériques. Découvrez quel Nom Divin vibre en harmonie directe avec votre prénom.",
      descEn: "Explore the 99 Most Beautiful Names of Allah with deep spiritual meanings, Abjad numerical weights, and esoteric virtues. Find out which Divine Name vibrates in exact harmony with your personal name.",
      descHa: "Binciki Sunaye 99 na Allah madaukaki tare da fassarorinsu, nauyin lissafinsu, da asirinsu. Gano sunan da ya fi dacewa da sunanka domin yi masa zikiri.",
      featuresFr: [
        "Fiches détaillées pour les 99 Noms d'Allah",
        "Poids Abjad Kabir/Saghir et vertus rituelles",
        "Calcul de concordance avec le prénom de l'utilisateur"
      ],
      featuresEn: [
        "Comprehensive profiles for all 99 Divine Names",
        "Abjad numerical weights & traditional benefits",
        "Harmonic match engine with user's personal name"
      ],
      featuresHa: [
        "Cikakken bayani a kan sunaye 99 na Allah",
        "Nauyin lissafin Abjadi da albarkar kowane suna",
        "Neman sunan da ya dace da sunanka"
      ],
      color: 'text-amber-500 dark:text-amber-400',
      colorHex: '#F59E0B',
      bg: 'bg-gradient-to-br from-amber-500/10 via-amber-900/5 to-amber-500/20 border-amber-500/30',
      glow: 'rgba(245, 158, 11, 0.35)',
      type: 'energy'
    },
    {
      id: 'calendar',
      icon: Moon,
      badgeIcon: Compass,
      titleFr: "6. Calendrier & Transits Célestes",
      titleEn: "6. Celestial Calendar & Transits",
      titleHa: "6. Taswirar Ranar Wata da Taurari",
      badgeFr: "ASTROLOGIE SPIRITUELLE",
      badgeEn: "CELESTIAL ASTROLOGY",
      badgeHa: "TASWIRAR TAURARI",
      descFr: "Anticipez les moments d'ouverture spirituelle. Suivez les 28 demeures lunaires (Manazil al-Qamar), les heures planétaires en temps réel et identifiez les créneaux propices aux invocations et aux opérations théurgiques.",
      descEn: "Anticipate divine timing windows. Track the 28 Lunar Mansions (Manazil al-Qamar), live planetary hours, and identify propitious time windows for supplications and spiritual consecrations.",
      descHa: "Bibiyar lokuta masu albarka. Gano wuraren wata guda 28, sa'o'in taurari na yau da kullum, da ranakun da aka fi amsa addu'a domin gudanar da ayyukanka.",
      featuresFr: [
        "Position exacte des 28 Demeures Lunaires en direct",
        "Calculateur d'Heures Planétaires & Régents du jour",
        "Indicateur de fenêtres propices / défavorables"
      ],
      featuresEn: [
        "Live tracking of the 28 Lunar Mansions (Manazil)",
        "Real-time Planetary Hours & Daily Ruler calculator",
        "Propitious / auspicious timing window indicator"
      ],
      featuresHa: [
        "Gano wuraren wata guda 28 na gaske a kowane lokaci",
        "Sa'o'in taurari da sarakunan ranar na yau da kullum",
        "Ranaku da lokutan da aka fi amsa addu'a"
      ],
      color: 'text-blue-500 dark:text-blue-400',
      colorHex: '#3B82F6',
      bg: 'bg-gradient-to-br from-blue-500/10 via-blue-900/5 to-blue-500/20 border-blue-500/30',
      glow: 'rgba(59, 130, 246, 0.35)',
      type: 'calendar'
    },
    {
      id: 'quran',
      icon: BookMarked,
      badgeIcon: Volume2,
      titleFr: "7. Saint Coran & Récitations",
      titleEn: "7. Holy Quran & Recitations",
      titleHa: "7. Alkur’ani Mai Girma",
      badgeFr: "RÉCITATION SACRÉE",
      badgeEn: "SACRED RECITATION",
      badgeHa: "ALKUR'ANI MAI GIRMA",
      descFr: "Le Saint Coran dans son intégralité avec coloriage Tajweed, récitation audio synchronisée verset par verset, traductions précises en Français, Anglais et Hausa, et accès rapide aux versets d'évocation (Ayat al-Shifa, Ayat al-Hifz).",
      descEn: "The complete Holy Quran featuring Tajweed rules coloring, verse-by-verse audio synchronization, precise translations in French, English, and Hausa, and quick access to healing and protection verses.",
      descHa: "Karanta Alkur'ani mai girma mai labon Tajweed, saurari karatu verset ta verset, tare da fassarar Hausa, Faransanci da Turanci, da ayoyin waraka da kariya.",
      featuresFr: [
        "Coran complet avec règles de Tajweed intégrées",
        "Lecteur audio synchronisé avec réciteurs célèbres",
        "Traductions complètes en Français, Anglais & Hausa"
      ],
      featuresEn: [
        "Complete Holy Quran with built-in Tajweed rules",
        "Synchronized audio player featuring famous reciters",
        "Full translations in French, English & Hausa"
      ],
      featuresHa: [
        "Karanta cikakken Alkur'ani mai girma mai Tajweed",
        "Sauraren karatun qari verset ta verset cikin sauki",
        "Fassarar Hausa, Faransanci da Turanci"
      ],
      color: 'text-emerald-500 dark:text-emerald-400',
      colorHex: '#10B981',
      bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-900/5 to-emerald-500/20 border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.35)',
      type: 'energy'
    },
    {
      id: 'secrets',
      icon: Key,
      badgeIcon: Sparkles,
      titleFr: "8. Sirr Al-Asrar & Secrets Divins",
      titleEn: "8. Sirr Al-Asrar & Divine Secrets",
      titleHa: "8. Sirrin AsrarHub da Sirru",
      badgeFr: "SAGESSE ANCESTRALE",
      badgeEn: "ANCESTRAL WISDOM",
      badgeHa: "SIRRIRIN ASRAR",
      descFr: "Accédez à un répertoire confidentiel de recettes spirituelles éprouvées, d'invocations de déblocage, de prières de protection (Tahseen) et de wirds traditionnels issus des grands maîtres de la sagesse ésotérique.",
      descEn: "Access a confidential repository of verified spiritual recipes, unblocking supplications, protection barriers (Tahseen), and traditional wirds handed down by masters of esoteric wisdom.",
      descHa: "Taskar sirru da fa'idodi na ingantattun magabata, addu'o'in kariya, samun nasara, da bude kofofin alheri da aka tabbatar.",
      featuresFr: [
        "Bibliothèque de recettes spirituelles vérifiées",
        "Protocoles de Conscription & Protection (Tahseen)",
        "Instructions pas-à-pas avec carrés & azkar"
      ],
      featuresEn: [
        "Verified repository of authentic spiritual recipes",
        "Protection & Conscription protocols (Tahseen)",
        "Step-by-step instructions with squares & azkar"
      ],
      featuresHa: [
        "Fa'idodi da asirai ingantattu na magabata",
        "Addu'o'in kariya (Tahseen) da bude kofofin alheri",
        "Sharudda da hanyoyin yin aiki daki-daki"
      ],
      color: 'text-purple-500 dark:text-purple-400',
      colorHex: '#A855F7',
      bg: 'bg-gradient-to-br from-purple-500/10 via-purple-900/5 to-purple-500/20 border-purple-500/30',
      glow: 'rgba(168, 85, 247, 0.35)',
      type: 'seals'
    },
    {
      id: 'ai_guide',
      icon: Bot,
      badgeIcon: Sparkles,
      titleFr: "9. Guide IA Spirituel & Faal Coranique",
      titleEn: "9. Spiritual AI Guide & Quranic Faal",
      titleHa: "9. Jagoran IA da Fa’ali na Alkur’ani",
      badgeFr: "INTELLIGENCE ARTIFICIELLE",
      badgeEn: "SPIRITUAL AI",
      badgeHa: "BASIRAR IA",
      descFr: "Interrogez l'intelligence artificielle d'AsrarHub entraînée sur les sciences coraniques et mystiques. Obtenez une interprétation spirituelle de vos rêves et effectuez des tirages de Faal Coranique éclairés.",
      descEn: "Consult AsrarHub's spiritual AI, trained on quranic and esoteric texts. Receive spiritual dream interpretations, search for specific wirds, and conduct guided Quranic Faal consultations.",
      descHa: "Tambayi basirar IA domin samun amsa game da zikiri, fassarar mafarki, ko gudanar da fa'ali na Alkur'ani tare da jagora mai kyau.",
      featuresFr: [
        "Assistant conversationnel spécialisé 24/7",
        "Moteur d'interprétation spirituelle des rêves",
        "Consultation guidée du Faal Coranique"
      ],
      featuresEn: [
        "Specialized 24/7 spiritual assistant chatbot",
        "Spiritual dream interpretation engine",
        "Guided Quranic Faal consultation interface"
      ],
      featuresHa: [
        "Neman shawara da gano amsoshi daga IA a kowane lokaci",
        "Fassarar mafarki ta hanyar ruhaniya",
        "Yin fa'ali na Alkur'ani tare da jagora"
      ],
      color: 'text-cyan-500 dark:text-cyan-400',
      colorHex: '#06B6D4',
      bg: 'bg-gradient-to-br from-cyan-500/10 via-cyan-900/5 to-cyan-500/20 border-cyan-500/30',
      glow: 'rgba(6, 182, 212, 0.35)',
      type: 'energy'
    },
    {
      id: 'elements',
      icon: Flame,
      badgeIcon: Compass,
      titleFr: "10. Analyseur des 4 Éléments",
      titleEn: "10. Four Elements Analyzer",
      titleHa: "10. Hisabin Elementi Guda Hudu",
      badgeFr: "ÉQUILIBRE CÉLESTE",
      badgeEn: "ELEMENTAL BALANCE",
      badgeHa: "ELEMENTI 4",
      descFr: "Évaluez l'équilibre des 4 éléments (Feu, Air, Eau, Terre) contenus dans votre nom, un verset ou une intention. Obtenez des conseils d'harmonisation, le choix des encens appropriés et l'orientation optimale.",
      descEn: "Evaluate the balance of the 4 elements (Fire, Air, Water, Earth) in your name, a verse, or an intention. Receive temperament balancing guidance, recommended incenses, and optimal directions.",
      descHa: "Bincika daidaiton Wuta, Iska, Ruwa da Kasa a cikin hisabinka. Gano turare da duwatsu da za su taimake ka wajen daidaita ruhinka.",
      featuresFr: [
        "Bilan comparatif des 4 Éléments (Feu, Air, Eau, Terre)",
        "Recommandations d'encens et de minéraux sacrés",
        "Harmonisation des tempéraments énergétiques"
      ],
      featuresEn: [
        "4 Elements comparative balance breakdown",
        "Sacred incense & stone recommendations",
        "Energetic temperament balancing guidance"
      ],
      featuresHa: [
        "Binciken Wuta, Iska, Ruwa da Kasa daki-daki",
        "Turare da duwatsu masu dacewa da hisabinka",
        "Daidaita halayyar dan adam ta hanyar asiri"
      ],
      color: 'text-orange-500 dark:text-orange-400',
      colorHex: '#F97316',
      bg: 'bg-gradient-to-br from-orange-500/10 via-orange-900/5 to-orange-500/20 border-orange-500/30',
      glow: 'rgba(249, 115, 22, 0.35)',
      type: 'energy'
    },
    {
      id: 'jafar',
      icon: Layers,
      badgeIcon: Sparkles,
      titleFr: "11. Science du Jafar & Za’irajah",
      titleEn: "11. Science of Jafar & Za’irajah",
      titleHa: "11. Ilmin Ja’fari da Zairaja",
      badgeFr: "MATHÉMATIQUES SACRÉES",
      badgeEn: "SACRED MATHEMATICS",
      badgeHa: "ILMIN JA'FARI",
      descFr: "Plongez au cœur de l'arithmancie avancée. Utilisez l'algorithme d'Istikhraj pour extraire les noms d'anges (Amlak) et de serviteurs spirituels (Khuddam), et construisez des tables de Taksir spirale authentiques.",
      descEn: "Dive into advanced spiritual arithmetic. Use the Istikhraj algorithm to extract divine Angelic names (Amlak) and Spiritual Servants (Khuddam), and construct authentic spiral Taksir matrices.",
      descHa: "Ilimi mai zurfi na lissafin ja'fari. Cire sunayen mala'iku da khuddam ta hanyar Istikhraj, da sarrafa teburin Taksir na musamman.",
      featuresFr: [
        "Extraction d'Anges (Amlak) & Khuddam selon le texte",
        "Générateur de grilles de Taksir spirale complexes",
        "Algorithme traditionnel de la Za'irajah"
      ],
      featuresEn: [
        "Angelic (Amlak) & Khuddam extraction algorithms",
        "Complex spiral Taksir grid generator",
        "Traditional Za'irajah esoteric engine"
      ],
      featuresHa: [
        "Cire sunayen mala'iku da khuddam daga rubutu",
        "Teburin Taksir na musamman na ilmin ja'fari",
        "Amsa tambayoyi ta hanyar Zairaja"
      ],
      color: 'text-rose-500 dark:text-rose-400',
      colorHex: '#F43F5E',
      bg: 'bg-gradient-to-br from-rose-500/10 via-rose-900/5 to-rose-500/20 border-rose-500/30',
      glow: 'rgba(244, 63, 94, 0.35)',
      type: 'jafar'
    },
    {
      id: 'muraqabah',
      icon: Wind,
      badgeIcon: Volume2,
      titleFr: "12. Espace Muraqabah & Respiration",
      titleEn: "12. Muraqabah & Meditation Sanctuary",
      titleHa: "12. Dandalin Muraqabah da Numfashi",
      badgeFr: "MÉDITATION SUFIE",
      badgeEn: "SUFI MEDITATION",
      badgeHa: "MURAQABAH DA NUMFASHI",
      descFr: "Un sanctuaire de paix intérieure dédié à la contemplation. Pratiquez les cycles de respiration guidée (4-7-8, cohérence cardiaque), écoutez des fréquences hertziennes apaisantes et notez vos expériences dans votre journal.",
      descEn: "A sanctuary for inner peace and contemplation. Practice guided rhythmic breathing cycles (4-7-8, coherence), listen to calming Hertz frequencies, and journal your spiritual reflections.",
      descHa: "Dandalin samun kwanciyar hankali. Gudanar da numfashi mai tsari, saurari muryoyin natsuwa, da adana bayanan muraqabah a littafinka.",
      featuresFr: [
        "Exercices de respiration rythmique guidée (Cohérence)",
        "Générateur de fréquences audio sacrées & d'ambiance",
        "Journal de contemplation & états d'âme"
      ],
      featuresEn: [
        "Rhythmic guided breathing exercises (Coherence)",
        "Sacred audio frequencies & ambient sound generator",
        "Contemplation log & spiritual states journal"
      ],
      featuresHa: [
        "Bada numfashi mai tsari domin natsuwa da sauri",
        "Muryoyi da sautunan sanya sakankancewa",
        "Adana bayanan muraqabah a littafin ruhi"
      ],
      color: 'text-sky-500 dark:text-sky-400',
      colorHex: '#0EA5E9',
      bg: 'bg-gradient-to-br from-sky-500/10 via-sky-900/5 to-sky-500/20 border-sky-500/30',
      glow: 'rgba(14, 165, 233, 0.35)',
      type: 'energy'
    },
    {
      id: 'personal_wird',
      icon: Award,
      badgeIcon: Star,
      titleFr: "13. Générateur de Wird Personnel",
      titleEn: "13. Personal Wird Generator",
      titleHa: "13. Mai Ba da Wirdin Kanka",
      badgeFr: "PROGRAMME SUR-MESURE",
      badgeEn: "CUSTOM ROUTINE",
      badgeHa: "WIRDIN KANKA",
      descFr: "Obtenez un programme d'invocations sur-mesure calculé spécifiquement d'après votre prénom, votre intention (paix, protection, prospérité) et vos disponibilités quotidiennes, avec suivi de répétition automatique.",
      descEn: "Receive a custom invocation program tailored specifically to your name, spiritual intention (peace, protection, prosperity), and daily schedule, featuring automatic progress tracking.",
      descHa: "Gano wirdin da ya fi dacewa da kai. Na'urar tana tsarawa kanka wirdi dangane da sunanka da abin da kake bukata tare da tunatarwa.",
      featuresFr: [
        "Programme d'invocations calculé selon votre prénom",
        "Ajustement de la durée et du nombre de répétitions",
        "Rappels quotidiens et notifications programmées"
      ],
      featuresEn: [
        "Custom invocation plan calculated from your name",
        "Adjustable duration and target count settings",
        "Daily reminder alerts & scheduled notifications"
      ],
      featuresHa: [
        "Tsarawa kanka wirdin yau da kullum ta lissafi",
        "Daidaita adadi da lokacin gudanar da aiki",
        "Tunatarwa a kowane lokaci domin kiyaye wirdi"
      ],
      color: 'text-violet-500 dark:text-violet-400',
      colorHex: '#8B5CF6',
      bg: 'bg-gradient-to-br from-violet-500/10 via-violet-900/5 to-violet-500/20 border-violet-500/30',
      glow: 'rgba(139, 92, 246, 0.35)',
      type: 'energy'
    },
    {
      id: 'community',
      icon: Users,
      badgeIcon: Users,
      titleFr: "14. Communauté & Cercles (Halaqat)",
      titleEn: "14. Community & Dhikr Circles (Halaqat)",
      titleHa: "14. Al’umma da Halakokin Zikiri",
      badgeFr: "PARTAGE & DHIKR",
      badgeEn: "COMMUNITY & CIRCLES",
      badgeHa: "AL'UMMA DA HALAKAT",
      descFr: "Rejoignez un espace de fraternité spirituelle. Participez à des cercles de dhikr collectif en direct (Halaqat), échangez des conseils d'apprentissage avec d'autres membres et progressez ensemble en toute sérénité.",
      descEn: "Join a supportive community of spiritual seekers. Participate in live collective dhikr circles (Halaqat), share insights, ask questions, and progress together in peace and mutual respect.",
      descHa: "Shiga cikin halakar al'umma. Gudanar da zikirin haɗin gwiwa, yi tambayoyi da musayar tunani tare da 'yan uwa a tafarkin alheri.",
      featuresFr: [
        "Cercles de dhikr collectifs et comptage partagé",
        "Forums de discussions fraternelles et d'entraide",
        "Accompagnement et partage d'expériences"
      ],
      featuresEn: [
        "Live collective dhikr circles with shared counters",
        "Fraternal discussion forums & mutual help",
        "Supportive guidance & experience sharing"
      ],
      featuresHa: [
        "Halakokin zikirin haɗin gwiwa na al'umma",
        "Musayar tunani da amfani tsakanin 'yan uwa",
        "Taimakon juna a kan tafarkin alheri da aminci"
      ],
      color: 'text-emerald-500 dark:text-emerald-400',
      colorHex: '#10B981',
      bg: 'bg-gradient-to-br from-emerald-500/10 via-emerald-900/5 to-emerald-500/20 border-emerald-500/30',
      glow: 'rgba(16, 185, 129, 0.35)',
      type: 'energy'
    },
    {
      id: 'store_journal',
      icon: ShoppingBag,
      badgeIcon: Sparkles,
      titleFr: "15. Boutique Sacrée & Suivi Personnel",
      titleEn: "15. Sacred Store & Gratitude Journal",
      titleHa: "15. Shagaggen Wuri da Littafin Gratitude",
      badgeFr: "ACCOMPLISSEMENT",
      badgeEn: "SACRED ACCOMPLISHMENT",
      badgeHa: "KAMMALAWA DA SHAGO",
      descFr: "Commandez vos talismans sacrés physiques, parchemins consacrés et bagues personnalisées gravées. Consignez vos réflexions, vos prières exaucées et vos bénédictions dans votre journal spirituel sécurisé.",
      descEn: "Order authentic physical talismans, consecrated parchments, and custom engraved rings. Record your prayers, reflections, and spiritual blessings in your encrypted private journal.",
      descHa: "Sayan takardun kariya, parchemins da zobe na gaske. Adana addu'o'inka, albarkar da ka samu, da abubuwan lura a cikin littafinka mai kariya.",
      featuresFr: [
        "Boutique de produits spirituels authentiques consacrés",
        "Journal de gratitude confidentiel avec verrouillage",
        "Sauvegarde sécurisée dans votre compte personnel"
      ],
      featuresEn: [
        "Store for authentic consecrated spiritual items",
        "Private, lockable gratitude & prayer journal",
        "Encrypted Cloud backup linked to your account"
      ],
      featuresHa: [
        "Sayan parchemins da takardun kariya na gaske",
        "Adana addu'o'i da albarkacin da aka samu a sirri",
        "Ajiya mai kariya a cikin asusu domin kowa"
      ],
      color: 'text-amber-500 dark:text-amber-400',
      colorHex: '#F59E0B',
      bg: 'bg-gradient-to-br from-amber-500/10 via-amber-900/5 to-amber-500/20 border-amber-500/30',
      glow: 'rgba(245, 158, 11, 0.35)',
      type: 'energy'
    }
  ];

  const handleLanguageSelect = (lang: 'fr' | 'en' | 'ha') => {
    setLanguage(lang);
    setStep(1);
  };

  const finishOnboarding = async () => {
    try {
      await requestAllPermissions();
    } catch (e) {
      console.warn('Error requesting permissions during onboarding:', e);
    }
    localStorage.setItem('hasCompletedOnboarding', 'true');
    sessionStorage.setItem('hasCompletedOnboarding', 'true');
    onComplete();
  };

  const nextStep = () => {
    if (step < slides.length) {
      setStep(step + 1);
    } else {
      finishOnboarding();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (step === 1) {
      setStep(0);
    }
  };

  const currentSlide = slides[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950 text-white overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Animated Dynamic Particles & Ambient Spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 120, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -120, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]"
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          // -------------------------------------------------------------------
          // STEP 0: Language Selection Screen with 3D Cards
          // -------------------------------------------------------------------
          <motion.div
            key="lang-select"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full relative z-10"
          >
            <Card3D bgGlow="rgba(16,185,129,0.35)" className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-white/20 transform-gpu">
                <Globe className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </Card3D>

            <h1 className="text-3xl sm:text-4xl font-black tracking-widest mb-2 text-center bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent drop-shadow-md">
              ASRARHUB
            </h1>
            <p className="text-gray-400 mb-8 text-center font-medium text-sm sm:text-base">
              {t('onboarding.langSelect', "Choisissez votre langue avant d'explorer l'application.")}
            </p>

            <div className="w-full space-y-4">
              {[
                { lang: 'fr' as const, label: 'Français', sub: 'Version originale', flag: '🇫🇷' },
                { lang: 'en' as const, label: 'English', sub: 'Global edition', flag: '🇬🇧' },
                { lang: 'ha' as const, label: 'Hausa', sub: 'Tsarin Hausa', flag: '🇳🇬' }
              ].map((item, itemIdx) => {
                const isSelected = language === item.lang;
                return (
                  <Card3D
                    key={`onboarding-lang-${item.lang}-${itemIdx}`}
                    onClick={() => handleLanguageSelect(item.lang)}
                    bgGlow={isSelected ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}
                    className="cursor-pointer"
                  >
                    <div
                      className={`w-full p-4.5 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between shadow-xl ${
                        isSelected
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-teal-950/80 text-emerald-100 shadow-emerald-500/20'
                          : 'border-gray-800 bg-gray-900/90 backdrop-blur-md hover:border-emerald-700 text-gray-200'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div>
                        <div className="font-extrabold text-lg tracking-wide" style={{ transform: 'translateZ(15px)' }}>
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-400 font-medium" style={{ transform: 'translateZ(10px)' }}>
                          {item.sub}
                        </div>
                      </div>
                      <span className="text-3xl transform transition-transform duration-300 hover:scale-125" style={{ transform: 'translateZ(25px)' }}>
                        {item.flag}
                      </span>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // -------------------------------------------------------------------
          // STEPS 1..15: 15 Dynamic & Detailed Home Screen Feature Cards
          // -------------------------------------------------------------------
          <motion.div
            key={`slide-${step}`}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="flex-1 flex flex-col p-4 sm:p-6 max-w-md mx-auto w-full h-full relative z-10 overflow-y-auto"
          >
            {/* Header Controls Bar */}
            <div className="flex items-center justify-between pt-1 h-12 flex-shrink-0">
              <button
                onClick={prevStep}
                className="flex items-center gap-1 text-gray-300 hover:text-white font-bold text-xs sm:text-sm tracking-wider transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800"
              >
                <ChevronLeft size={16} />
                <span>{language === 'ha' ? 'Koma' : language === 'en' ? 'Back' : 'Précédent'}</span>
              </button>

              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80">
                {String(step).padStart(2, '0')} / {slides.length}
              </span>

              <button
                onClick={finishOnboarding}
                className="text-gray-400 hover:text-emerald-400 font-bold text-xs sm:text-sm tracking-wider transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800"
              >
                {language === 'ha' ? 'Sallama' : language === 'en' ? 'Skip' : 'Passer'}
              </button>
            </div>

            {/* Slide Body Container with 3D Tilt Card & Procedural Video Canvas */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-1 py-2 my-auto">
              {(() => {
                const Icon = currentSlide.icon;
                const BadgeIcon = currentSlide.badgeIcon;
                const title = language === 'ha' ? currentSlide.titleHa : language === 'en' ? currentSlide.titleEn : currentSlide.titleFr;
                const badge = language === 'ha' ? currentSlide.badgeHa : language === 'en' ? currentSlide.badgeEn : currentSlide.badgeFr;
                const desc = language === 'ha' ? currentSlide.descHa : language === 'en' ? currentSlide.descEn : currentSlide.descFr;
                const features = language === 'ha' ? currentSlide.featuresHa : language === 'en' ? currentSlide.featuresEn : currentSlide.featuresFr;

                return (
                  <>
                    {/* 3D Card Stage with Live Procedural Video Canvas */}
                    <Card3D bgGlow={currentSlide.glow} className="mb-4 w-full max-w-[260px]">
                      <div
                        className={`w-full h-48 sm:h-52 rounded-3xl border-2 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl ${currentSlide.bg}`}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* 60fps Procedural 3D Canvas Background Loop */}
                        <IconCanvas3D type={currentSlide.type} colorHex={currentSlide.colorHex} />

                        {/* Top Badge Tag */}
                        <div
                          className="absolute top-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-widest uppercase text-gray-200 flex items-center gap-1.5 z-10"
                          style={{ transform: 'translateZ(15px)' }}
                        >
                          <BadgeIcon size={12} className={currentSlide.color} />
                          <span>{badge}</span>
                        </div>

                        {/* Center Floating 3D Main Icon Stage */}
                        <motion.div
                          animate={{ y: [-4, 4, -4], rotateZ: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                          className="relative z-10 flex items-center justify-center p-5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl"
                          style={{ transform: 'translateZ(35px)' }}
                        >
                          <Icon className={`w-12 h-12 sm:w-14 sm:h-14 ${currentSlide.color} drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]`} />
                        </motion.div>
                      </div>
                    </Card3D>

                    {/* Title with depth */}
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl sm:text-2xl font-black mb-2 tracking-tight text-white leading-tight"
                    >
                      {title}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium max-w-sm mb-4"
                    >
                      {desc}
                    </motion.p>

                    {/* 3 Key Feature Highlights (Detailed Bullet Cards) */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="w-full max-w-sm space-y-2 text-left mb-2"
                    >
                      {features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-2.5 sm:p-3 rounded-xl bg-gray-900/80 border border-gray-800/80 flex items-start gap-2.5 backdrop-blur-md"
                        >
                          <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${currentSlide.color}`} />
                          <span className="text-xs text-gray-200 font-medium leading-snug">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </>
                );
              })()}
            </div>

            {/* Bottom Progress Bar & Navigation Controls */}
            <div className="pb-4 pt-2 flex-shrink-0">
              {/* Slide Dots Selector */}
              <div className="flex justify-center items-center gap-1.5 mb-4 flex-wrap px-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx + 1)}
                    className="cursor-pointer p-0.5 focus:outline-none"
                    title={`Écran ${idx + 1}`}
                  >
                    <motion.div
                      animate={{
                        width: step - 1 === idx ? 20 : 5,
                        backgroundColor: step - 1 === idx ? '#10B981' : '#4B5563'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`h-1.5 rounded-full ${
                        step - 1 === idx ? 'shadow-lg shadow-emerald-500/50' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Next / Finish 3D Button */}
              <button
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white p-3.5 sm:p-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer border border-emerald-400/30"
              >
                <span>
                  {step === slides.length
                    ? language === 'ha' ? 'Fara Amfani da AsrarHub' : language === 'en' ? 'Start Exploring AsrarHub' : "Commencer l'exploration"
                    : language === 'ha' ? 'Écran Suivant' : language === 'en' ? 'Next Screen' : 'Écran Suivant'}
                </span>
                {step === slides.length ? (
                  <Check size={20} className="stroke-[3]" />
                ) : (
                  <ChevronRight size={20} className="stroke-[3]" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
