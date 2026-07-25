import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Compass, Moon, Info, Eye, EyeOff, Calendar, Download, ChevronDown, Activity, Heart, Zap, Brain, Timer, Play, Pause, Flame, Check, ShieldAlert, RefreshCw, Lock, Copy, ExternalLink, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { triggerProtectionModal } from './ContentProtectionManager';
import { downloadCanvasImage } from '../utils/downloadHelper';
import { useFeatures } from '../contexts/FeatureContext';
import { CosmicEnergyAstrolabe } from './CosmicEnergyAstrolabe';
import { ContemplativeAudioPlayer } from './ContemplativeAudioPlayer';
import { RitualIncenseTimer } from './RitualIncenseTimer';
import { MuraqabahLogModal } from './MuraqabahLogModal';
import { calculateSolarTimes } from '../utils/solarCalculator';
import {
  getLocalizedHijriMonths,
  getLocalizedMysticEvent,
  getLocalizedMoonDayMystery,
  getLocalizedInspirationalQuotes,
  getLocalizedFrequencyPresets,
  getTalsamAdvancedProtocol,
  HijriMonthDetails,
  MysticEvent,
  MoonPhaseMystery
} from '../utils/mysticCalendarData';

interface MysticCalendarModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isPage?: boolean;
}


export const MysticCalendarModal: React.FC<MysticCalendarModalProps> = ({ isOpen = false, onClose, isPage = false }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { featureToggles } = useFeatures();
  const navigate = useNavigate();

  const [isSealExpanded, setIsSealExpanded] = useState<boolean>(false);
  const [selectedSealVersion, setSelectedSealVersion] = useState<1 | 2>(1);
  const [copiedTalsam, setCopiedTalsam] = useState<boolean>(false);
  const [copiedSeal, setCopiedSeal] = useState<boolean>(false);

  const HIJRI_MONTHS = getLocalizedHijriMonths(language);
  
  // Safe mathematical & astronomical conversion from Hijri to Gregorian
  const getGregorianDateForHijri = (hYear: number, hMonthIndex: number, hDay: number): Date => {
    // Epoch of Hijri calendar: July 16, 622 CE.
    // Hijri year is approx 354.367068 days, Hijri month is approx 29.530588 days.
    const daysSinceEpoch = Math.floor(
      (hYear - 1) * 354.367068 + 
      (hMonthIndex * 29.530588) + 
      (hDay - 1)
    );
    
    const guessDate = new Date(622, 6, 16 + daysSinceEpoch);
    
    try {
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });

      const getHijriFromFormatter = (d: Date) => {
        const parts = formatter.formatToParts(d);
        let day = 1;
        let month = 1;
        let year = 1447;
        parts.forEach(p => {
          if (p.type === 'day') day = parseInt(p.value, 10);
          if (p.type === 'month') month = parseInt(p.value, 10);
          if (p.type === 'year') {
            const match = p.value.match(/\d+/);
            if (match) year = parseInt(match[0], 10);
          }
        });
        return { day, month, year };
      };

      let bestDate = new Date(guessDate);
      let bestDiff = 999999;

      // Search within a 15-day window before and after for the exact match
      for (let offset = -15; offset <= 15; offset++) {
        const testDate = new Date(guessDate.getTime() + offset * 24 * 60 * 60 * 1000);
        const hj = getHijriFromFormatter(testDate);
        if (hj.year === hYear && (hj.month - 1) === hMonthIndex && hj.day === hDay) {
          return testDate;
        }
        const diff = Math.abs((hj.year - hYear) * 354 + (hj.month - 1 - hMonthIndex) * 29.5 + (hj.day - hDay));
        if (diff < bestDiff) {
          bestDiff = diff;
          bestDate = testDate;
        }
      }
      return bestDate;
    } catch (e) {
      return guessDate;
    }
  };

  const getDaysInHijriMonth = (hYear: number, hMonthIndex: number): number => {
    // Find the Gregorian date for Hijri day 29 of this month
    const gDateDay29 = getGregorianDateForHijri(hYear, hMonthIndex, 29);
    
    // Get the next day's Gregorian date
    const gDateNextDay = new Date(gDateDay29.getTime() + 24 * 60 * 60 * 1000);
    
    try {
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric'
      });
      const parts = formatter.formatToParts(gDateNextDay);
      let hDay = 1;
      parts.forEach(p => {
        if (p.type === 'day') hDay = parseInt(p.value, 10);
      });
      return hDay === 30 ? 30 : 29;
    } catch (e) {
      // Fallback: alternate between 30 and 29 days
      return (hMonthIndex % 2 === 0) ? 30 : 29;
    }
  };

  // Get initial Hijri date based on today's system date
  const getInitialHijriState = () => {
    try {
      const today = new Date();
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
      const parts = formatter.formatToParts(today);
      let day = today.getDate();
      let month = 8; // Default to index 8 (Ramadan)
      let year = 1447;
      parts.forEach(p => {
        if (p.type === 'day') day = parseInt(p.value, 10);
        if (p.type === 'month') month = parseInt(p.value, 10) - 1; // 0-indexed
        if (p.type === 'year') {
          const match = p.value.match(/\d+/);
          if (match) year = parseInt(match[0], 10);
        }
      });
      return { day, month, year };
    } catch (e) {
      return { day: 15, month: 8, year: 1447 }; // Safe fallback
    }
  };

  const init = getInitialHijriState();
  const [hijriYear, setHijriYear] = useState<number>(init.year);
  const [hijriMonthIndex, setHijriMonthIndex] = useState<number>(init.month);
  const [selectedHijriDay, setSelectedHijriDay] = useState<number>(init.day);
  const [selectedMoonPhaseDay, setSelectedMoonPhaseDay] = useState<number | null>(null);
  const [showVeilRevealed, setShowVeilRevealed] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(0);
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);
  const [isMuraqabahModalOpen, setIsMuraqabahModalOpen] = useState<boolean>(false);

  // Accordion Sections (All collapsed/closed by default per requirement)
  const [isEventExpanded, setIsEventExpanded] = useState<boolean>(false);
  const [isQuoteExpanded, setIsQuoteExpanded] = useState<boolean>(false);
  const [isAstrolabeExpanded, setIsAstrolabeExpanded] = useState<boolean>(false);
  
  // Feature 1: AI Personalized Guidance (L'Asrar Génératif)
  const [aiTask, setAiTask] = useState<string>('');
  const [aiCounsel, setAiCounsel] = useState<{ guidance: string; focusKeyword: string; spiritualPractice: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isAiExpanded, setIsAiExpanded] = useState<boolean>(false);

  // Feature 2: Biometric Synchronicity
  const [isBiometricsConnected, setIsBiometricsConnected] = useState<boolean>(false);
  const [isBiometricsLoading, setIsBiometricsLoading] = useState<boolean>(false);
  const [biometricData, setBiometricData] = useState<{ sleep: number; hrv: number; stress: number; energy: number } | null>(null);
  const [isBiometricsExpanded, setIsBiometricsExpanded] = useState<boolean>(false);

  // Feature 3: Personal Transits
  const [birthDate, setBirthDate] = useState<string>(() => localStorage.getItem('asrar_birth_date') || '');
  const [birthTime, setBirthTime] = useState<string>(() => localStorage.getItem('asrar_birth_time') || '');
  const [birthPlace, setBirthPlace] = useState<string>(() => localStorage.getItem('asrar_birth_place') || '');
  const [isTransitsCalculated, setIsTransitsCalculated] = useState<boolean>(() => !!localStorage.getItem('asrar_birth_date'));
  const [transitDays, setTransitDays] = useState<Record<number, { type: 'power' | 'creative' | 'vigilance'; description: string }>>({});
  const [isTransitsExpanded, setIsTransitsExpanded] = useState<boolean>(false);

  // Feature 4: Sacred Focus Mode (Pomodoro)
  const [isFocusModeActive, setIsFocusModeActive] = useState<boolean>(false);
  const [focusDuration, setFocusDuration] = useState<number>(25 * 60); // Default 25 min
  const [isFocusExpanded, setIsFocusExpanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Feature 6: Cosmic Alignment
  const [isCosmicExpanded, setIsCosmicExpanded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('analytical');

  // Feature 7: Intention Journal & Synchronicities
  const [isJournalExpanded, setIsJournalExpanded] = useState<boolean>(false);
  const [isSolarClocksExpanded, setIsSolarClocksExpanded] = useState<boolean>(false);
  const [isSacredWavesExpanded, setIsSacredWavesExpanded] = useState<boolean>(false);
  const [morningIntention, setMorningIntention] = useState<string>('');
  const [eveningGratitude, setEveningGratitude] = useState<string>('');
  const [journalMood, setJournalMood] = useState<string>('peaceful');
  const [journalLogs, setJournalLogs] = useState<Record<string, { intention: string; gratitude: string; mood: string }>>(() => {
    try {
      const stored = localStorage.getItem('asrar_journal_logs');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Feature Request: Geolocation & Solar Clock State
  const [solarCoords, setSolarCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const lat = localStorage.getItem('asrar_latitude');
    const lng = localStorage.getItem('asrar_longitude');
    if (lat && lng) {
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    // Default to Mecca coordinates
    return { lat: 21.4225, lng: 39.8262 };
  });
  const [solarCoordsSource, setSolarCoordsSource] = useState<'gps' | 'ref'>(() => {
    const lat = localStorage.getItem('asrar_latitude');
    return lat ? 'gps' : 'ref';
  });
  const [solarTimes, setSolarTimes] = useState<{ sunrise: string; sunset: string; zenith: string; goldenHour: string }>({
    sunrise: '05:40',
    sunset: '18:50',
    zenith: '12:15',
    goldenHour: '17:50'
  });
  const [meditationNotificationsEnabled, setMeditationNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('asrar_meditation_notifs') === 'true';
  });
  const [hasWebNotificationPermission, setHasWebNotificationPermission] = useState<boolean>(false);

  // Feature Request: Custom Synth state for Daily Task Frequencies
  const [synthVolume, setSynthVolume] = useState<number>(0.12);
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);
  const [activeSynthPreset, setActiveSynthPreset] = useState<{ id: string; name: string; baseFreq: number; beatFreq: number; desc: string } | null>(null);

  const synthAudioCtxRef = React.useRef<AudioContext | null>(null);
  const synthOscLRef = React.useRef<OscillatorNode | null>(null);
  const synthOscRRef = React.useRef<OscillatorNode | null>(null);
  const synthGainRef = React.useRef<GainNode | null>(null);

  const backdropRef = React.useRef<HTMLDivElement>(null);
  const modalContentRef = React.useRef<HTMLDivElement>(null);

  // Calculate Solar Times based on selected/stored coordinates
  useEffect(() => {
    if (solarCoords) {
      try {
        const times = calculateSolarTimes(solarCoords.lat, solarCoords.lng, new Date());
        setSolarTimes(times);
      } catch (err) {
        console.error("Error calculating solar times", err);
      }
    }
  }, [solarCoords]);

  // Request location from browser
  const requestGeolocation = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          localStorage.setItem('asrar_latitude', String(lat));
          localStorage.setItem('asrar_longitude', String(lng));
          setSolarCoords({ lat, lng });
          setSolarCoordsSource('gps');
        },
        (err) => {
          console.warn("Geolocation request failed, using Mecca as cosmic reference.", err);
          setSolarCoords({ lat: 21.4225, lng: 39.8262 });
          setSolarCoordsSource('ref');
        }
      );
    }
  };

  // Notification setup and requests
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasWebNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  const enableLocalNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setHasWebNotificationPermission(true);
          setMeditationNotificationsEnabled(true);
          localStorage.setItem('asrar_meditation_notifs', 'true');
          new Notification(
            language === 'fr' ? "Notifications Activées 🌟" : language === 'ha' ? "An Kaddamar da Sanarwa 🌟" : "Notifications Activated 🌟", 
            {
              body: language === 'fr' ? "Vous recevrez des invitations discrètes aux heures clés du soleil." : language === 'ha' ? "Zaka sami sanarwa a lokutan da suka dace don yin zikiri." : "You will receive discreet invites at key solar moments.",
              icon: '/favicon.ico'
            }
          );
        } else {
          setMeditationNotificationsEnabled(false);
          localStorage.setItem('asrar_meditation_notifs', 'false');
        }
      } catch (err) {
        console.warn("Error requesting notification permission", err);
      }
    } else {
      setMeditationNotificationsEnabled(prev => {
        const next = !prev;
        localStorage.setItem('asrar_meditation_notifs', String(next));
        return next;
      });
    }
  };

  // Local clock solar matcher and alarm sound
  const lastNotifiedRef = React.useRef<string>('');

  const triggerChime = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio chime
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    } catch {}
  };

  useEffect(() => {
    if (!meditationNotificationsEnabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (lastNotifiedRef.current === currentHM) return;

      let title = '';
      let message = '';

      if (currentHM === solarTimes.sunrise) {
        title = language === 'fr' ? "Lever du Soleil 🌅" : language === 'ha' ? "Fitowar Rana 🌅" : "Sunrise 🌅";
        message = language === 'fr' ? "Le jour se lève, moment idéal pour le Wird al-Subh de protection divine." : language === 'ha' ? "Rana tana fitowa, lokaci mai kyau don Wird al-Subh da samun kariya." : "The sun is rising, ideal moment for the protective Wird al-Subh.";
      } else if (currentHM === solarTimes.zenith) {
        title = language === 'fr' ? "Zénith Solaire ☀️" : language === 'ha' ? "Tsakiyar Rana ☀️" : "Solar Zenith ☀️";
        message = language === 'fr' ? "Le Soleil atteint son zénith. Heure sacrée pour la méditation et l'alignement." : language === 'ha' ? "Rana ta kai kololuwarta. Lokaci ne na albarka don yin zikiri da samun natsuwa." : "The Sun has reached its zenith. Sacred hour for meditation and alignment.";
      } else if (currentHM === solarTimes.goldenHour) {
        title = language === 'fr' ? "Heure Dorée 🌟" : language === 'ha' ? "Lokacin Zinariya ��" : "Golden Hour 🌟";
        message = language === 'fr' ? "L'Heure Dorée commence. Les ondes spirituelles sont idéales pour le Tasbih et le calme." : language === 'ha' ? "Lokacin Zinariya ya fara. Lokaci ne mai kyau don Tasbahi da natsuwa." : "The Golden Hour begins. Spiritual waves are perfect for Tasbih and serenity.";
      } else if (currentHM === solarTimes.sunset) {
        title = language === 'fr' ? "Coucher du Soleil 🌇" : language === 'ha' ? "Faɗuwar Rana 🌇" : "Sunset 🌇";
        message = language === 'fr' ? "Le Soleil se couche. Propice aux wirds du soir et aux chants de gratitude." : language === 'ha' ? "Rana tana faɗuwa, tana buɗe lokacin dare. Lokaci ne mai kyau don godiya." : "The Sun is setting. Auspicious for evening wirds and songs of gratitude.";
      }

      if (title && message) {
        lastNotifiedRef.current = currentHM;
        
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(title, { body: message, icon: '/favicon.ico' });
          } catch (e) {
            console.error("Failed to trigger Notification", e);
          }
        }
        triggerChime();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [meditationNotificationsEnabled, solarTimes, language]);

  // Audio frequency presets definition
  const getFreqPresets = () => getLocalizedFrequencyPresets(language);

  const startSynth = (preset: { id: string; name: string; baseFreq: number; beatFreq: number; desc: string }) => {
    stopSynth();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      synthAudioCtxRef.current = ctx;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(synthVolume, ctx.currentTime + 0.15); // Fade in
      synthGainRef.current = mainGain;

      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(preset.baseFreq, ctx.currentTime);
      synthOscLRef.current = oscL;

      if (preset.beatFreq > 0) {
        const oscR = ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(preset.baseFreq + preset.beatFreq, ctx.currentTime);
        synthOscRRef.current = oscR;

        const merger = ctx.createChannelMerger(2);
        const gainL = ctx.createGain();
        gainL.gain.setValueAtTime(0.5, ctx.currentTime);
        const gainR = ctx.createGain();
        gainR.gain.setValueAtTime(0.5, ctx.currentTime);

        oscL.connect(gainL).connect(merger, 0, 0);
        oscR.connect(gainR).connect(merger, 0, 1);

        merger.connect(mainGain);
        oscR.start();
      } else {
        oscL.connect(mainGain);
      }

      mainGain.connect(ctx.destination);
      oscL.start();

      setActiveSynthPreset(preset);
      setIsSynthPlaying(true);
    } catch (err) {
      console.error("Failed to start calendar frequency synth:", err);
    }
  };

  const stopSynth = () => {
    if (synthGainRef.current && synthAudioCtxRef.current) {
      const ctx = synthAudioCtxRef.current;
      const gainNode = synthGainRef.current;
      try {
        gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15); // Fade out
      } catch {}
    }

    setTimeout(() => {
      try {
        synthOscLRef.current?.stop();
        synthOscLRef.current?.disconnect();
      } catch {}
      try {
        synthOscRRef.current?.stop();
        synthOscRRef.current?.disconnect();
      } catch {}
      try {
        synthAudioCtxRef.current?.close();
      } catch {}

      synthOscLRef.current = null;
      synthOscRRef.current = null;
      synthGainRef.current = null;
      synthAudioCtxRef.current = null;
      setIsSynthPlaying(false);
    }, 160);
  };

  const handleVolumeChange = (vol: number) => {
    setSynthVolume(vol);
    if (synthGainRef.current && synthAudioCtxRef.current) {
      try {
        synthGainRef.current.gain.setValueAtTime(vol, synthAudioCtxRef.current.currentTime);
      } catch {}
    }
  };

  // Automatically pause play if modal is closed or unmounts
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  // Lock background scroll and disable pull-to-refresh when calendar is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflowBody = document.body.style.overflow;
      const originalOverscrollBody = document.body.style.overscrollBehavior;
      const originalOverflowHtml = document.documentElement.style.overflow;
      const originalOverscrollHtml = document.documentElement.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';

      return () => {
        document.body.style.overflow = originalOverflowBody;
        document.body.style.overscrollBehavior = originalOverscrollBody;
        document.documentElement.style.overflow = originalOverflowHtml;
        document.documentElement.style.overscrollBehavior = originalOverscrollHtml;
      };
    }
  }, [isOpen]);

  // Load journal for selected day
  useEffect(() => {
    const key = `${hijriYear}-${hijriMonthIndex}-${selectedHijriDay}`;
    const log = journalLogs[key];
    if (log) {
      setMorningIntention(log.intention || '');
      setEveningGratitude(log.gratitude || '');
      setJournalMood(log.mood || 'peaceful');
    } else {
      setMorningIntention('');
      setEveningGratitude('');
      setJournalMood('peaceful');
    }
  }, [selectedHijriDay, hijriMonthIndex, hijriYear]);

  const saveJournalLog = () => {
    const key = `${hijriYear}-${hijriMonthIndex}-${selectedHijriDay}`;
    const updated = {
      ...journalLogs,
      [key]: { intention: morningIntention, gratitude: eveningGratitude, mood: journalMood }
    };
    setJournalLogs(updated);
    localStorage.setItem('asrar_journal_logs', JSON.stringify(updated));
  };

  // Feature 5: Parallax Coordinates
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Web Audio Refs for Binaural Beats
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorLeftRef = React.useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = React.useRef<OscillatorNode | null>(null);
  const gainNodeRef = React.useRef<GainNode | null>(null);

  // Load transits deterministically on initialization or change of birth info or Hijri month
  useEffect(() => {
    if (birthDate && birthPlace) {
      calculatePersonalTransits(birthDate, birthPlace);
    }
  }, [birthDate, birthPlace, hijriMonthIndex, hijriYear]);

  // Save birth info
  const saveBirthInfo = (date: string, time: string, place: string) => {
    localStorage.setItem('asrar_birth_date', date);
    localStorage.setItem('asrar_birth_time', time);
    localStorage.setItem('asrar_birth_place', place);
    setBirthDate(date);
    setBirthTime(time);
    setBirthPlace(place);
    calculatePersonalTransits(date, place);
  };

  const calculatePersonalTransits = (bDate: string, bPlace: string) => {
    const seed = bDate + bPlace + hijriYear + hijriMonthIndex;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const record: Record<number, { type: 'power' | 'creative' | 'vigilance'; description: string }> = {};
    const daysCount = getDaysInHijriMonth(hijriYear, hijriMonthIndex);
    
    // Seed and generate transit peaks
    for (let d = 1; d <= daysCount; d++) {
      const daySeed = hash + d * 1337;
      const pseudoRandom = Math.abs(Math.sin(daySeed)) * 1000 % 1;
      
      if (pseudoRandom < 0.08) {
        record[d] = {
          type: 'power',
          description: "Transit Solaire de Pouvoir Personnel : Le transit du Soleil amplifie votre clarté intérieure et votre puissance de rayonnement spirituel. Journée idéale pour les initiatives."
        };
      } else if (pseudoRandom >= 0.08 && pseudoRandom < 0.16) {
        record[d] = {
          type: 'creative',
          description: "Transit Lunaire de Créativité Inspirée : Alignement de Mercure et de la Lune avec votre thème de naissance. Votre intuition artistique et spirituelle est décuplée."
        };
      } else if (pseudoRandom >= 0.16 && pseudoRandom < 0.22) {
        record[d] = {
          type: 'vigilance',
          description: "Transit de Vigilance Spécifique : Alignement de Saturne et Mars avec votre axe de naissance. Restez calme, privilégiez le silence et le non-agir aujourd'hui."
        };
      }
    }
    setTransitDays(record);
    setIsTransitsCalculated(true);
  };

  // Parallax & Gyroscope / Mouse move listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.min(Math.max(e.gamma, -25), 25) / 2.5;
        const y = Math.min(Math.max(e.beta - 45, -25), 25) / 2.5;
        setParallaxOffset({ x, y });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 35;
      const y = (e.clientY - window.innerHeight / 2) / 35;
      setParallaxOffset({ x, y });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Binaural beats audio manager
  const startBinauralBeats = () => {
    try {
      stopBinauralBeats();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Alpha beat: 120Hz Left ear, 130Hz Right ear = 10Hz Binaural difference
      const oscL = ctx.createOscillator();
      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(120, ctx.currentTime);

      const oscR = ctx.createOscillator();
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(130, ctx.currentTime);

      const merger = ctx.createChannelMerger(2);
      const gainL = ctx.createGain();
      gainL.gain.setValueAtTime(0.5, ctx.currentTime);
      const gainR = ctx.createGain();
      gainR.gain.setValueAtTime(0.5, ctx.currentTime);

      oscL.connect(gainL);
      oscR.connect(gainR);

      gainL.connect(merger, 0, 0);
      gainR.connect(merger, 0, 1);

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(isMuted ? 0 : 0.12, ctx.currentTime);
      gainNodeRef.current = mainGain;

      merger.connect(mainGain);
      mainGain.connect(ctx.destination);

      oscL.start();
      oscR.start();

      oscillatorLeftRef.current = oscL;
      oscillatorRightRef.current = oscR;
    } catch (err) {
      console.warn("Binaural beats initialization failed", err);
    }
  };

  const stopBinauralBeats = () => {
    try {
      if (oscillatorLeftRef.current) {
        oscillatorLeftRef.current.stop();
        oscillatorLeftRef.current.disconnect();
      }
      if (oscillatorRightRef.current) {
        oscillatorRightRef.current.stop();
        oscillatorRightRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch (e) {
      // ignore
    }
    oscillatorLeftRef.current = null;
    oscillatorRightRef.current = null;
    audioContextRef.current = null;
  };

  useEffect(() => {
    if (isFocusModeActive) {
      startBinauralBeats();
    } else {
      stopBinauralBeats();
    }
    return () => stopBinauralBeats();
  }, [isFocusModeActive]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : 0.12, audioContextRef.current.currentTime);
    }
  }, [isMuted]);

  // AI custom guidance generator
  const generateAiGuidance = async () => {
    if (!aiTask.trim()) return;
    setIsAiLoading(true);
    setAiCounsel(null);
    try {
      const phaseData = getMoonDayMystery(selectedHijriDay || 1);
      const response = await fetch('/api/gemini/asrar-conseil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: aiTask,
          hijriDay: selectedHijriDay,
          hijriMonth: HIJRI_MONTHS[hijriMonthIndex].french,
          hijriYear: hijriYear,
          moonPhase: phaseData.name + " (" + phaseData.arabicName + ")",
          eventTitle: selectedEvent?.title || ""
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiCounsel(data);
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (err) {
      console.error(err);
      // Fallback in case of network offline or missing key
      setAiCounsel({
        focusKeyword: "Alignement",
        guidance: "Abordez votre défi de ce jour par une respiration lente et un calme intérieur. Les transits du jour vous conseillent d'allier patience stratégique et action mesurée, sans hâter les fruits du destin.",
        spiritualPractice: "Prenez 5 minutes de respiration consciente silencieuse avant d'agir."
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Sync Wearables simulation
  const handleWearablesSync = () => {
    setIsBiometricsLoading(true);
    setTimeout(() => {
      setIsBiometricsConnected(true);
      setIsBiometricsLoading(false);
      setBiometricData({
        sleep: 84, // 84% sleep score
        hrv: 78,   // 78 ms
        stress: 30, // 30/100 stress index (very good)
        energy: 88  // 88/100 energy peak
      });
    }, 1500);
  };

  // Dynamic .ics calendar file generator
  const downloadIcsFile = () => {
    if (!selectedHijriDay || !selectedEvent) return;
    if (!isUserPremium) {
      triggerProtectionModal('download');
      return;
    }

    const gDate = getGregorianDateForHijri(hijriYear, hijriMonthIndex, selectedHijriDay);
    const yyyy = gDate.getFullYear();
    const mm = String(gDate.getMonth() + 1).padStart(2, '0');
    const dd = String(gDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    const titleEscaped = selectedEvent.title.replace(/[,;]/g, '\\$&');
    const descriptionEscaped = selectedEvent.description.replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
    const recEscaped = selectedEvent.recommendation.replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AsrarHub//MysticCalendar//FR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:[Asrar] ${titleEscaped}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `DESCRIPTION:${descriptionEscaped}\\n\\nRecommandation: ${recEscaped}\\n\\nHijri: ${selectedHijriDay} ${HIJRI_MONTHS[hijriMonthIndex].french} ${hijriYear} AH`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      `DESCRIPTION:Rappel: ${titleEscaped}`,
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `asrar-evenement-${dateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Synchronize veil reveal animation when selected day changes
  useEffect(() => {
    if (selectedHijriDay !== null) {
      setShowVeilRevealed(false);
      const timer = setTimeout(() => {
        setShowVeilRevealed(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedHijriDay, hijriMonthIndex, hijriYear]);

  if (!isOpen && !isPage) return null;

  const gregorianMonths = language === 'fr'
    ? ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    : language === 'ha'
    ? ["Janairu", "Fabrairu", "Maris", "Afrilu", "Mayu", "Yuni", "Yuli", "Agusta", "Satumba", "Oktoba", "Nuwamba", "Disamba"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysOfWeek = language === 'fr'
    ? ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    : language === 'ha'
    ? ["Lit", "Tal", "Lar", "Alh", "Jum", "Asa", "Lah"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const islamicWeekDays = language === 'ha'
    ? [
        { arabic: "الْأَحَد", french: "Lahadi" },
        { arabic: "الاِثْنَيْن", french: "Litinin" },
        { arabic: "الثُّلَاثَاء", french: "Talata" },
        { arabic: "الْأَرْبِعَاء", french: "Laraba" },
        { arabic: "الْخَمِيس", french: "Alhamis" },
        { arabic: "الْجُمُعَة", french: "Juma'a" },
        { arabic: "السَّبْت", french: "Asabar" }
      ]
    : language === 'fr'
    ? [
        { arabic: "الْأَحَد", french: "Dimanche" },
        { arabic: "الاِثْنَيْن", french: "Lundi" },
        { arabic: "الثُّلَاثَاء", french: "Mardi" },
        { arabic: "الْأَرْبِعَاء", french: "Mercredi" },
        { arabic: "الْخَمِيس", french: "Jeudi" },
        { arabic: "الْجُمُعَة", french: "Vendredi" },
        { arabic: "السَّبْت", french: "Samedi" }
      ]
    : [
        { arabic: "الْأَحَد", french: "Sunday" },
        { arabic: "الاِثْنَيْن", french: "Monday" },
        { arabic: "الثُّلَاثَاء", french: "Tuesday" },
        { arabic: "الْأَرْبِعَاء", french: "Wednesday" },
        { arabic: "الْخَمِيس", french: "Thursday" },
        { arabic: "الْجُمُعَة", french: "Friday" },
        { arabic: "السَّبْت", french: "Saturday" }
      ];

  // Helper: starting day of the week for Hijri day 1 (adjusted to Monday start)
  const firstDayGregorian = getGregorianDateForHijri(hijriYear, hijriMonthIndex, 1);
  const firstDayOfWeek = firstDayGregorian.getDay();
  const startingDayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Navigation handlers
  const handlePrevMonth = () => {
    setDirection(-1);
    if (hijriMonthIndex === 0) {
      setHijriMonthIndex(11);
      setHijriYear(prev => prev - 1);
    } else {
      setHijriMonthIndex(prev => prev - 1);
    }
    setSelectedHijriDay(1);
    setSelectedMoonPhaseDay(null);
  };

  const handleNextMonth = () => {
    setDirection(1);
    if (hijriMonthIndex === 11) {
      setHijriMonthIndex(0);
      setHijriYear(prev => prev + 1);
    } else {
      setHijriMonthIndex(prev => prev + 1);
    }
    setSelectedHijriDay(1);
    setSelectedMoonPhaseDay(null);
  };

  // Get mystical event for a specific Hijri date
  const getMysticEventForHijri = (hYear: number, hMonthIndex: number, hDay: number, dayOfWeek: number): MysticEvent => {
    return getLocalizedMysticEvent(hYear, hMonthIndex, hDay, dayOfWeek, language);
  };

  // 30 Lunar Days Mystical Influence (The Manzils & Spiritual Significance)
  const getMoonDayMystery = (hDay: number): MoonPhaseMystery => {
    return getLocalizedMoonDayMystery(hDay, language);
  };

  // Inspirational Quotes for "L'Asrar du Jour"
  const inspirativeQuotes = getLocalizedInspirationalQuotes(language);

  // Moon Phase SVG Renderer
  const getMoonPhaseSvg = (hDay: number) => {
    if (hDay === 1 || hDay === 29 || hDay === 30) {
      return (
        <svg className="w-4 h-4 text-gray-300 dark:text-gray-605" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    } else if (hDay >= 2 && hDay <= 6) {
      return (
        <svg className="w-4 h-4 text-amber-400 fill-amber-400 filter drop-shadow-[0_0_1px_rgba(251,191,36,0.5)]" viewBox="0 0 24 24">
          <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 1-9-9z"/>
        </svg>
      );
    } else if (hDay >= 7 && hDay <= 9) {
      return (
        <svg className="w-4 h-4 text-amber-400 filter drop-shadow-[0_0_1px_rgba(251,191,36,0.5)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v18a9 9 0 0 0 0-18z"/>
        </svg>
      );
    } else if (hDay >= 10 && hDay <= 12) {
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3a9 9 0 0 1 4.5 9 9 9 0 0 1-4.5 9V3z" />
          <path d="M12 3a4.5 4.5 0 0 0 0 18V3z" />
        </svg>
      );
    } else if (hDay >= 13 && hDay <= 15) {
      return (
        <svg className="w-4.5 h-4.5 text-amber-300 fill-amber-300 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.9)]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    } else if (hDay >= 16 && hDay <= 18) {
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3a9 9 0 0 0-4.5 9 9 9 0 0 0 4.5 9V3z" />
          <path d="M12 3a4.5 4.5 0 0 1 0 18V3z" />
        </svg>
      );
    } else if (hDay >= 19 && hDay <= 22) {
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v18a9 9 0 0 1 0-18z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0-4.5-9A9 9 0 0 0 12 3z" fill="currentColor"/>
        </svg>
      );
    }
  };

  // Render Days list containing EXACTLY the current Hijri month's days without overflowing into next/prev months
  const renderDaysList = () => {
    const list = [];
    const daysInCurrentMonth = getDaysInHijriMonth(hijriYear, hijriMonthIndex);
    
    // 1. Spacers for aligning the first day under the correct weekday
    for (let i = 0; i < startingDayIndex; i++) {
      list.push(
        <div 
          key={`spacer-${i}`} 
          className="h-[68px] bg-transparent border border-transparent rounded-2xl opacity-0" 
        />
      );
    }

    // 2. Days in Current Month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const targetGDate = getGregorianDateForHijri(hijriYear, hijriMonthIndex, d);
      const isSelected = selectedHijriDay === d;
      
      const isMysticalDay = 
        [13, 14, 15].includes(d) || 
        (hijriMonthIndex === 0 && [1, 10].includes(d)) ||
        (hijriMonthIndex === 2 && d === 12) ||
        (hijriMonthIndex === 6 && d === 27) ||
        (hijriMonthIndex === 7 && d === 15) ||
        (hijriMonthIndex === 8 && [1, 17, 21, 23, 25, 27, 29].includes(d));

      const dayTransit = transitDays[d];

      // Determine the border and background styles based on transit days
      let transitStyles = 'border-transparent';
      if (dayTransit && !isSelected) {
        if (dayTransit.type === 'power') {
          transitStyles = 'border-amber-400/80 bg-amber-500/5 dark:bg-amber-400/5 shadow-[0_0_10px_rgba(245,158,11,0.25)]';
        } else if (dayTransit.type === 'creative') {
          transitStyles = 'border-purple-400/80 bg-purple-500/5 dark:bg-purple-400/5 shadow-[0_0_10px_rgba(168,85,247,0.25)]';
        } else if (dayTransit.type === 'vigilance') {
          transitStyles = 'border-rose-400/80 bg-rose-500/5 dark:bg-rose-400/5 shadow-[0_0_10px_rgba(244,63,94,0.25)]';
        }
      }

      list.push(
        <motion.button
          key={`day-${d}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedHijriDay(d);
            setSelectedMoonPhaseDay(null);
          }}
          className={`h-[68px] relative flex flex-col items-center justify-between py-1.5 rounded-2xl transition-all cursor-pointer border ${
            isSelected
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
              : isMysticalDay
              ? `bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.18)] ${transitStyles}`
              : `bg-gray-50/70 hover:bg-gray-100 dark:bg-gray-850/40 dark:hover:bg-gray-800/80 text-gray-900 dark:text-gray-100 ${transitStyles}`
          }`}
          style={{
            boxShadow: isMysticalDay && !isSelected ? '0 0 10px rgba(245,158,11,0.22)' : undefined,
          }}
        >
          {/* Numbers Header */}
          <div className="flex w-full justify-between px-2.5 items-center">
            <span className="text-[13px] font-bold flex items-center gap-0.5">
              {d}
              {dayTransit && !isSelected && (
                <span 
                  className={`w-1.5 h-1.5 rounded-full ${
                    dayTransit.type === 'power' ? 'bg-amber-400' : dayTransit.type === 'creative' ? 'bg-purple-400' : 'bg-rose-400'
                  }`} 
                  title={dayTransit.description}
                />
              )}
            </span>
            <span className={`text-[9px] font-medium ${isSelected ? 'text-emerald-200' : 'text-gray-400 dark:text-gray-500'}`}>
              {targetGDate.getDate()}
            </span>
          </div>

          {/* Clickable Moon Phase Icon */}
          <div 
            onClick={(e) => {
              e.stopPropagation(); // prevent resetting selectedHijriDay when we want to view deep moon detail
              setSelectedHijriDay(d);
              setSelectedMoonPhaseDay(d);
            }}
            className="flex items-center justify-center h-6 w-full cursor-pointer hover:scale-125 active:scale-95 transition-transform duration-150 relative z-10"
            title="Découvrir le secret spirituel de cette phase lunaire"
          >
            {getMoonPhaseSvg(d)}
          </div>
          
          {isMysticalDay && (
            <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-400'}`} />
          )}
        </motion.button>
      );
    }

    return list;
  };

  const selectedGregorianDate = getGregorianDateForHijri(hijriYear, hijriMonthIndex, selectedHijriDay);
  const selectedEvent = getMysticEventForHijri(hijriYear, hijriMonthIndex, selectedHijriDay, selectedGregorianDate.getDay());
  const selectedHijri = { day: selectedHijriDay, month: HIJRI_MONTHS[hijriMonthIndex].french, year: hijriYear };
  const selectedHijriDetails = HIJRI_MONTHS[hijriMonthIndex];
  const asrarOfTheDay = inspirativeQuotes[selectedHijriDay % inspirativeQuotes.length];

  const activeMoonMystery = getMoonDayMystery(selectedMoonPhaseDay !== null ? selectedMoonPhaseDay : selectedHijriDay);

  const calendarStatus = featureToggles?.tool_calendar || 'active'; // active, premium, maintenance, inactive, disabled
  const isUserPremium = user?.subscriptionTier === 'premium' || user?.subscriptionTier === 'pro' || user?.role === 'admin';
  const isCalendarBlocked = user?.blockedTools?.includes('calendar') || calendarStatus === 'inactive' || calendarStatus === 'disabled';
  const isCalendarMaintenance = calendarStatus === 'maintenance';
  const isCalendarPremiumLocked = calendarStatus === 'premium' && !isUserPremium;

  const downloadSealAsImage = async () => {
    if (!activeMoonMystery?.talsamDetails) return;
    if (!isUserPremium) {
      triggerProtectionModal('download');
      return;
    }
    const text = selectedSealVersion === 2 && activeMoonMystery.talsamDetails.graphicSymbolV2
      ? activeMoonMystery.talsamDetails.graphicSymbolV2
      : activeMoonMystery.talsamDetails.graphicSymbol;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 600;
    canvas.height = 600;
    
    const grad = ctx.createRadialGradient(300, 300, 50, 300, 300, 400);
    grad.addColorStop(0, '#120b24');
    grad.addColorStop(1, '#05030a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 600;
      const y = Math.random() * 600;
      const r = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 560, 560);
    
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(300, 300, 250, 0, Math.PI * 2);
    ctx.stroke();

    // Corner Watermarks "AsrarHub"
    ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("ASRARHUB", 35, 42);
    ctx.textAlign = 'right';
    ctx.fillText("ASRARHUB", 565, 42);
    ctx.textAlign = 'left';
    ctx.fillText("ASRARHUB", 35, 568);
    ctx.textAlign = 'right';
    ctx.fillText("ASRARHUB", 565, 568);

    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    const isFr = language === 'fr';
    const isHa = language === 'ha';
    ctx.fillText(isFr ? "SCEAU MYSTIQUE ASRARHUB DE LA LUNE" : isHa ? "HATIMIN WATA NA SIRRI (ASRARHUB)" : "MYSTICAL ASRARHUB LUNAR SEAL", 300, 65);
    
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText(`"${activeMoonMystery.vibration}"`, 300, 90);
    
    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 28;
    const startY = 300 - ((lines.length - 1) * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 300, startY + index * lineHeight);
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px sans-serif';
    ctx.fillText("AsrarHub © Lunar Calendar System", 300, 545);
    
    await downloadCanvasImage(canvas, `Sceau_Mystique_Jour_${selectedHijriDay}.png`);
  };

  const handleCopyTalsam = () => {
    if (!activeMoonMystery?.talsamDetails) return;
    if (!isUserPremium) {
      triggerProtectionModal('copy');
      return;
    }
    navigator.clipboard.writeText(activeMoonMystery.talsamDetails.formula);
    setCopiedTalsam(true);
    setTimeout(() => setCopiedTalsam(false), 2000);
  };

  const handleCopySeal = () => {
    if (!activeMoonMystery?.talsamDetails) return;
    if (!isUserPremium) {
      triggerProtectionModal('copy');
      return;
    }
    const text = selectedSealVersion === 2 && activeMoonMystery.talsamDetails.graphicSymbolV2
      ? activeMoonMystery.talsamDetails.graphicSymbolV2
      : activeMoonMystery.talsamDetails.graphicSymbol;
    navigator.clipboard.writeText(text);
    setCopiedSeal(true);
    setTimeout(() => setCopiedSeal(false), 2000);
  };

  const getGregorianRange = () => {
    const firstDay = getGregorianDateForHijri(hijriYear, hijriMonthIndex, 1);
    const lastDay = getGregorianDateForHijri(hijriYear, hijriMonthIndex, getDaysInHijriMonth(hijriYear, hijriMonthIndex));
    
    const fYear = firstDay.getFullYear();
    const lYear = lastDay.getFullYear();
    
    const fMonthStr = gregorianMonths[firstDay.getMonth()];
    const lMonthStr = gregorianMonths[lastDay.getMonth()];
    
    if (firstDay.getMonth() === lastDay.getMonth()) {
      return `${fMonthStr} ${fYear}`;
    }
    
    if (fYear === lYear) {
      return `${fMonthStr} - ${lMonthStr} ${fYear}`;
    }
    
    return `${fMonthStr} ${fYear} - ${lMonthStr} ${lYear}`;
  };

  const gregorianRange = getGregorianRange();

  return (
    <AnimatePresence>
      <div 
        ref={isPage ? undefined : backdropRef} 
        data-modal-overlay={!isPage ? "true" : undefined}
        className={isPage 
          ? "w-full max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 safe-area-pt pb-28 sm:pb-32"
          : "fixed inset-0 z-[120] overflow-hidden bg-black/70 backdrop-blur-md p-3 sm:p-4 flex justify-center items-center"
        }
      >
        
        {/* Outer click protection */}
        {!isPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 cursor-default z-0"
          />
        )}

        {/* Page Back Button (Only in Page Mode) */}
        {isPage && (
          <div className="mb-6 flex items-center justify-between w-full">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer font-bold"
            >
              <ChevronLeft size={16} />
              {t('mysticCalendar.backBtn', "Retour à l'exploration")}
            </button>
          </div>
        )}

        {/* Modal Outer Container */}
        <motion.div
          ref={isPage ? undefined : modalContentRef}
          initial={isPage ? undefined : { scale: 0.95, opacity: 0, y: 15 }}
          animate={isPage ? undefined : { scale: 1, opacity: 1, y: 0 }}
          exit={isPage ? undefined : { scale: 0.95, opacity: 0, y: 15 }}
          transition={isPage ? undefined : { type: "spring", stiffness: 300, damping: 26 }}
          className={`relative border rounded-3xl p-4 sm:p-6 shadow-2xl w-full z-10 flex flex-col transition-colors duration-300 ${
            isPage ? "pb-28 sm:pb-32" : "max-w-xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain my-4 sm:my-8 scrollbar-thin scrollbar-track-transparent"
          } ${
            isReadingMode
              ? 'bg-[#0f0d0b] border-amber-950/40 text-amber-100/90 shadow-amber-950/20'
              : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
          }`}
        >
          {/* Header section with title */}
          <div className={`flex items-center justify-between mb-4 pb-3 border-b transition-colors duration-300 ${
            isReadingMode ? 'border-amber-950/40' : 'border-gray-100 dark:border-gray-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner transition-colors ${
                isReadingMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}>
                <Moon size={18} className={isReadingMode ? 'fill-amber-400/20' : 'fill-amber-500/20'} />
              </div>
              <div>
                <h2 className={`font-extrabold text-base sm:text-lg flex items-center gap-1.5 leading-tight transition-colors ${
                  isReadingMode ? 'text-amber-100' : 'text-gray-900 dark:text-white'
                }`}>
                  {t('mysticCalendar.title')}
                </h2>
                <p className={`text-[11px] font-medium transition-colors ${
                  isReadingMode ? 'text-amber-400/60' : 'text-gray-500'
                }`}>
                  {t('mysticCalendar.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReadingMode(!isReadingMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isReadingMode
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-transparent'
                }`}
                title={t('mysticCalendar.readingModeTitle')}
              >
                {isReadingMode ? <Eye size={12} /> : <EyeOff size={12} />}
                {t('mysticCalendar.readingMode')}
              </button>

              {!isPage && onClose && (
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isReadingMode
                      ? 'hover:bg-amber-950/40 text-amber-400/70 hover:text-amber-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {(isCalendarBlocked || isCalendarMaintenance || isCalendarPremiumLocked) ? (
            <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 my-auto min-h-[40vh] space-y-6">
              {isCalendarBlocked && (
                <>
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2 border border-red-500/20 shadow-lg shadow-red-500/5 animate-pulse">
                    <ShieldAlert size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {language === 'fr' ? 'Accès Bloqué' : language === 'ha' ? 'An Rufe Hanya' : 'Access Blocked'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                    {language === 'fr' 
                      ? 'L\'accès au calendrier mystique a été temporairement restreint pour votre compte. Veuillez contacter l\'administrateur pour plus d\'informations.' 
                      : language === 'ha'
                      ? 'An rufe wannan sashe na kalanda ga asusunka. Tuntuɓi mai gudanarwa don ƙarin bayani.'
                      : 'Access to the mystic calendar has been restricted for your account. Please contact the administrator for more information.'}
                  </p>
                </>
              )}

              {isCalendarMaintenance && (
                <>
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2 border border-amber-500/20 shadow-lg shadow-amber-500/5 animate-pulse">
                    <RefreshCw size={36} className="animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {language === 'fr' ? 'Calendrier en Maintenance' : language === 'ha' ? 'Rijistar a Gyara' : 'Calendar under Maintenance'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                    {language === 'fr' 
                      ? 'Le calendrier mystique est temporairement en maintenance pour des ajustements astronomiques et techniques. Veuillez réessayer plus tard.' 
                      : language === 'ha'
                      ? 'Wannan tsarin kalanda yana fuskantar gyara na ɗan lokaci. Da fatan za a sake gwadawa daga baya.'
                      : 'The mystic calendar is temporarily under maintenance for astronomical and technical adjustments. Please try again later.'}
                  </p>
                </>
              )}

              {isCalendarPremiumLocked && (
                <>
                  <div className="w-16 h-16 bg-violet-500/15 rounded-full flex items-center justify-center text-violet-400 mb-2 border border-violet-500/30 shadow-lg shadow-violet-500/10 relative">
                    <Lock size={32} className="text-violet-400" />
                    <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 justify-center">
                    {language === 'fr' ? 'Calendrier Mystique Premium 🌟' : language === 'ha' ? 'Taswirar Premium 🌟' : 'Premium Mystic Calendar 🌟'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                    {language === 'fr' 
                      ? 'Ce calendrier mystique et ses précieux secrets lunaires, astrologiques et théurgiques sont réservés aux membres Premium d\'AsrarHub. Débloquez-les dès maintenant !' 
                      : language === 'ha'
                      ? 'Wannan sashe na musamman na sirrin wata da taurari ne ga membobin Premium na AsrarHub.'
                      : 'This mystic calendar and its valuable lunar, astrological, and theurgic secrets are reserved for Premium members of AsrarHub. Unlock them now!'}
                  </p>
                  <button
                    onClick={() => {
                      if (onClose) onClose();
                      navigate('/payment');
                    }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold py-3 px-6 rounded-2xl shadow-lg hover:shadow-violet-500/10 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles size={16} />
                    <span>{language === 'fr' ? "Devenir Membre Premium" : language === 'ha' ? "Zama Memban Premium" : "Upgrade to Premium"}</span>
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Month Navigation & Display with complete Arabic with Vowels (Tashkeel) */}
          <div className="flex items-center justify-between mb-4 bg-gray-50/70 dark:bg-gray-850/40 p-2.5 rounded-2xl border border-gray-100/50 dark:border-gray-800/40 shrink-0">
            <button
              onClick={handlePrevMonth}
              className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
              aria-label={t('mysticCalendar.prevMonth')}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="text-center flex flex-col items-center">
              <span className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white uppercase tracking-wider block">
                {HIJRI_MONTHS[hijriMonthIndex].french} {hijriYear} AH
              </span>
              
              {/* Arabic spelling with full tashkeel (vowels) displayed prominently */}
              <motion.span 
                key={hijriMonthIndex}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base sm:text-lg font-serif text-emerald-600 dark:text-emerald-400 font-bold leading-tight my-0.5 block"
                dir="rtl"
              >
                {HIJRI_MONTHS[hijriMonthIndex].arabic}
              </motion.span>

              <span className="text-[10px] sm:text-[11px] text-emerald-600/70 dark:text-emerald-400/70 font-bold tracking-wide">
                {t('mysticCalendar.hijriMonthSuffix').replace('{month}', String(hijriMonthIndex + 1))}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
              aria-label={t('mysticCalendar.nextMonth')}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Week Days Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest shrink-0">
            {daysOfWeek.map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>

          {/* Calendar Grid Container (Always displays 42 cells to ensure no layout jumps) */}
          <div className="relative overflow-hidden mb-4 shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${hijriYear}-${hijriMonthIndex}`}
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 15 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-7 gap-1.5"
              >
                {renderDaysList()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scrollable Accordion Sections - All closed/collapsed by default */}
          <div className={`border-t pt-3.5 flex-grow flex flex-col gap-2 relative transition-colors duration-300 ${
            isReadingMode ? 'border-amber-950/40' : 'border-gray-100 dark:border-gray-800'
          }`}>
            
            {/* Accordion 1: Événements & Invocations du Jour */}
            {selectedHijriDay && selectedEvent && selectedHijri && (
              <div>
                <button
                  onClick={() => setIsEventExpanded(!isEventExpanded)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isReadingMode
                      ? isEventExpanded
                        ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                        : 'bg-[#0f0d0b] border-amber-950/20 text-amber-200/60 hover:text-amber-100'
                      : isEventExpanded
                      ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                      : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isReadingMode
                        ? isEventExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                        : isEventExpanded
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}>
                      <Sparkles size={13} className="fill-amber-400/20" />
                    </div>
                    <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                      {t('mysticCalendar.accordion1')} ({selectedEvent.type})
                    </span>
                  </div>
                  <motion.div animate={{ rotate: isEventExpanded ? 180 : 0 }}>
                    <ChevronDown size={14} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isEventExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`rounded-xl p-4 border mb-2 mt-1.5 relative overflow-hidden flex flex-col transition-all duration-300 ${
                        isReadingMode
                          ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                          : 'bg-gradient-to-br from-amber-500/[0.01] via-transparent to-emerald-500/[0.01] border-gray-100 dark:border-gray-800'
                      }`}>
                        <div className="flex justify-between items-start mb-2.5 w-full">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                            isReadingMode 
                              ? 'bg-amber-950/50 text-amber-300' 
                              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          }`}>
                            {selectedHijri.day} {selectedHijri.month} {selectedHijri.year} AH
                          </span>
                          
                          <button
                            onClick={downloadIcsFile}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold tracking-wide uppercase transition-all border cursor-pointer ${
                              isReadingMode
                                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            <Download size={9} />
                            {t('mysticCalendar.icsSync')}
                          </button>
                        </div>

                        <h3 
                          className="font-extrabold text-sm sm:text-base mb-1.5 transition-colors text-amber-600 dark:text-amber-400"
                          style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined, fontSize: isReadingMode ? '1.15rem' : undefined }}
                        >
                          {selectedEvent.title}
                        </h3>

                        <p 
                          className={`mb-3 transition-all ${
                            isReadingMode 
                              ? 'text-sm text-amber-100/85 leading-[1.85]' 
                              : 'text-xs text-gray-600 dark:text-gray-300 leading-relaxed'
                          }`}
                          style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                        >
                          {selectedEvent.description}
                        </p>

                        <div className={`border rounded-xl p-3 mb-2 transition-all ${
                          isReadingMode
                            ? 'bg-[#151310] border-amber-950/30 text-amber-200'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/30 dark:border-emerald-800/20'
                        }`}>
                          <h4 className={`text-[10px] font-black uppercase tracking-wider mb-1 flex items-center gap-1 transition-colors ${
                            isReadingMode ? 'text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                          }`}>
                            <BookOpen size={10} /> Recommandation du jour
                          </h4>
                          <p 
                            className={`font-medium transition-all ${
                              isReadingMode 
                                ? 'text-sm text-amber-200 leading-[1.85]' 
                                : 'text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed'
                            }`}
                            style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                          >
                            {selectedEvent.recommendation}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedMoonPhaseDay(selectedHijriDay)}
                          className={`text-[10px] font-bold flex items-center gap-1 mt-1 cursor-pointer self-start transition-colors ${
                            isReadingMode
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:underline'
                          }`}
                        >
                          <Moon size={10} className="fill-amber-500/10" />
                          Découvrir le secret ésotérique de la Lune →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accordion 2: L'Asrar du Jour */}
            <div>
              <button
                onClick={() => setIsQuoteExpanded(!isQuoteExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isQuoteExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isQuoteExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isQuoteExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isQuoteExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Compass size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion2')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isQuoteExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isQuoteExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60'
                    }`}>
                      <blockquote 
                        className={`italic leading-relaxed mb-1.5 transition-all ${
                          isReadingMode ? 'text-sm leading-[1.8] text-amber-200' : 'text-xs text-gray-700 dark:text-gray-300 font-serif'
                        }`}
                        style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                      >
                        "{asrarOfTheDay.quote}"
                      </blockquote>
                      
                      <cite className={`text-[10px] not-italic font-bold block text-right transition-colors ${
                        isReadingMode ? 'text-amber-400/50' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        — {asrarOfTheDay.author}
                      </cite>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Position Céleste & Astrolabe Interactif */}
            <div>
              <button
                onClick={() => setIsAstrolabeExpanded(!isAstrolabeExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isAstrolabeExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isAstrolabeExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isAstrolabeExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isAstrolabeExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Moon size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion3')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isAstrolabeExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isAstrolabeExpanded && selectedHijriDay && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-2"
                  >
                    <CosmicEnergyAstrolabe 
                      day={selectedHijriDay} 
                      monthIndex={hijriMonthIndex} 
                      year={hijriYear} 
                      isReadingMode={isReadingMode}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 4: Guidage personnalisé par IA (L'Asrar Génératif) */}
            <div>
              <button
                onClick={() => setIsAiExpanded(!isAiExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isAiExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isAiExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isAiExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isAiExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Brain size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    {t('mysticCalendar.accordion4')}
                    <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[8px] font-bold px-1 py-0.2 rounded">BETA</span>
                  </span>
                </div>
                <motion.div animate={{ rotate: isAiExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isAiExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-emerald-500/[0.01] to-amber-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2.5">
                        {t('mysticCalendar.aiDescription').replace('{day}', String(selectedHijriDay)).replace('{month}', HIJRI_MONTHS[hijriMonthIndex].french)}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                            {t('mysticCalendar.aiTaskLabel')}
                          </label>
                          <input 
                            type="text" 
                            value={aiTask}
                            onChange={(e) => setAiTask(e.target.value)}
                            placeholder={t('mysticCalendar.aiTaskPlaceholder')}
                            className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all ${
                              isReadingMode
                                ? 'bg-[#151310] border-amber-950/40 text-amber-100 focus:ring-amber-500 focus:border-amber-500'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-emerald-500 focus:border-emerald-500'
                            }`}
                          />
                        </div>

                        <button
                          onClick={generateAiGuidance}
                          disabled={isAiLoading || !aiTask.trim()}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            !aiTask.trim()
                              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                              : isReadingMode
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
                          }`}
                        >
                          {isAiLoading ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              {t('mysticCalendar.aiGenerating')}
                            </>
                          ) : (
                            <>
                              <Sparkles size={13} />
                              {t('mysticCalendar.aiGenerateBtn')}
                            </>
                          )}
                        </button>

                        {aiCounsel && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl p-3.5 border text-left mt-3 relative overflow-hidden ${
                              isReadingMode
                                ? 'bg-[#151310] border-amber-950/40'
                                : 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/20'
                            }`}
                          >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/[0.03] rounded-bl-full pointer-events-none" />
                            
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                                {t('mysticCalendar.focusOfDay')}
                              </span>
                              <span className="bg-amber-400/20 text-amber-700 dark:text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                {aiCounsel.focusKeyword}
                              </span>
                            </div>

                            <p 
                              className={`mb-3 transition-all ${
                                isReadingMode 
                                  ? 'text-sm text-amber-100/90 leading-[1.85]' 
                                  : 'text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-serif italic'
                              }`}
                              style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                            >
                              "{aiCounsel.guidance}"
                            </p>

                            <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-800 text-[10px]">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5 uppercase tracking-wider">
                                {t('mysticCalendar.groundingPractice')}
                              </span>
                              <span className="text-gray-600 dark:text-gray-300">
                                {aiCounsel.spiritualPractice}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 5: Synchronicité Biométrique (Connexion Wearables) */}
            <div>
              <button
                onClick={() => setIsBiometricsExpanded(!isBiometricsExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isBiometricsExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isBiometricsExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isBiometricsExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isBiometricsExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Activity size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion5')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isBiometricsExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isBiometricsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-emerald-500/[0.01] to-amber-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 text-left">
                        {t('mysticCalendar.biometricDesc')}
                      </p>

                      {!isBiometricsConnected ? (
                        <button
                          onClick={handleWearablesSync}
                          disabled={isBiometricsLoading}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isReadingMode
                              ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100'
                          }`}
                        >
                          {isBiometricsLoading ? (
                            <>
                              <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              {t('mysticCalendar.biometricSyncing')}
                            </>
                          ) : (
                            <>
                              <Activity size={13} />
                              {t('mysticCalendar.biometricSyncBtn')}
                            </>
                          )}
                        </button>
                      ) : biometricData && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-gray-150 dark:border-gray-850 rounded-xl p-2.5 text-center">
                              <span className="text-[9px] text-gray-400 block">{t('mysticCalendar.sleepScore')}</span>
                              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{biometricData.sleep}%</span>
                              <span className="text-[8px] text-emerald-600 block">{t('mysticCalendar.sleepRestful')}</span>
                            </div>

                            <div className="bg-amber-500/[0.02] dark:bg-amber-500/[0.01] border border-gray-150 dark:border-gray-850 rounded-xl p-2.5 text-center">
                              <span className="text-[9px] text-gray-400 block">{t('mysticCalendar.hrvLabel')}</span>
                              <span className="text-base font-extrabold text-amber-500">{biometricData.hrv} ms</span>
                              <span className="text-[8px] text-amber-500 block">{t('mysticCalendar.parasympathetic')}</span>
                            </div>

                            <div className="bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-gray-150 dark:border-gray-850 rounded-xl p-2.5 text-center">
                              <span className="text-[9px] text-gray-400 block">{t('mysticCalendar.stressIndex')}</span>
                              <span className="text-base font-extrabold text-emerald-500">{biometricData.stress}/100</span>
                              <span className="text-[8px] text-emerald-500 block">{t('mysticCalendar.calmStatus')}</span>
                            </div>

                            <div className="bg-purple-500/[0.02] dark:bg-purple-500/[0.01] border border-gray-150 dark:border-gray-850 rounded-xl p-2.5 text-center">
                              <span className="text-[9px] text-gray-400 block">{t('mysticCalendar.energyCoherence')}</span>
                              <span className="text-base font-extrabold text-purple-400">{biometricData.energy}%</span>
                              <span className="text-[8px] text-purple-400 block">{t('mysticCalendar.optimalAction')}</span>
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border text-xs leading-relaxed text-left ${
                            isReadingMode ? 'bg-[#151310] border-amber-950/40 text-amber-100' : 'bg-amber-50/30 border-amber-500/10 text-gray-750'
                          }`}>
                            <strong className="text-amber-500">{t('mysticCalendar.syncAnalysis')} </strong>
                            {t('mysticCalendar.biometricSuccessText').replace('{hrv}', String(biometricData.hrv)).replace('{day}', String(selectedHijriDay)).replace('{month}', HIJRI_MONTHS[hijriMonthIndex].french)}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 6: Superposition de Transits Personnels */}
            <div>
              <button
                onClick={() => setIsTransitsExpanded(!isTransitsExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isTransitsExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isTransitsExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isTransitsExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isTransitsExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Zap size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion6')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isTransitsExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isTransitsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-purple-500/[0.01] to-emerald-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 text-left">
                        {t('mysticCalendar.transitDesc')}
                      </p>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                              {t('mysticCalendar.birthDate')}
                            </label>
                            <input 
                              type="date" 
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all ${
                                isReadingMode
                                  ? 'bg-[#151310] border-amber-950/40 text-amber-100 focus:ring-amber-500'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-emerald-500'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                              {t('mysticCalendar.birthTime')}
                            </label>
                            <input 
                              type="time" 
                              value={birthTime}
                              onChange={(e) => setBirthTime(e.target.value)}
                              className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all ${
                                isReadingMode
                                  ? 'bg-[#151310] border-amber-950/40 text-amber-100 focus:ring-amber-500'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                            {t('mysticCalendar.birthPlace')}
                          </label>
                          <input 
                            type="text" 
                            value={birthPlace}
                            onChange={(e) => setBirthPlace(e.target.value)}
                            placeholder={t('mysticCalendar.birthPlacePlaceholder')}
                            className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all ${
                              isReadingMode
                                ? 'bg-[#151310] border-amber-950/40 text-amber-100 focus:ring-amber-500'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-emerald-500'
                            }`}
                          />
                        </div>

                        <button
                          onClick={() => saveBirthInfo(birthDate, birthTime, birthPlace)}
                          disabled={!birthDate || !birthPlace}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            !birthDate || !birthPlace
                              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                              : isReadingMode
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <Zap size={13} />
                          {t('mysticCalendar.saveTransitBtn')}
                        </button>

                        {isTransitsCalculated && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2 mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-800 text-left"
                          >
                            <span className="text-[10px] font-bold text-amber-500 block uppercase tracking-wider">
                              {t('mysticCalendar.transitLegendTitle')}
                            </span>

                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block shrink-0" />
                                <span className="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">
                                  <strong>{t('mysticCalendar.powerDay')}</strong> {t('mysticCalendar.powerDayDesc')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 block shrink-0" />
                                <span className="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">
                                  <strong>{t('mysticCalendar.creativeDay')}</strong> {t('mysticCalendar.creativeDayDesc')}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 block shrink-0" />
                                <span className="text-[10px] text-gray-600 dark:text-gray-300 leading-tight">
                                  <strong>{t('mysticCalendar.vigilanceDay')}</strong> {t('mysticCalendar.vigilanceDayDesc')}
                                </span>
                              </div>
                            </div>

                            {transitDays[selectedHijriDay] && (
                              <div className={`p-2.5 rounded-lg border text-[10px] leading-relaxed mt-2.5 ${
                                isReadingMode ? 'bg-[#151310] border-amber-950/40 text-amber-200' : 'bg-purple-500/[0.03] border-purple-500/15 text-purple-900 dark:text-purple-200'
                              }`}>
                                <strong className="text-purple-500">{t('mysticCalendar.activeTransit')} </strong>
                                {transitDays[selectedHijriDay].description}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 7: Espace "Focus Sacré" (Pomodoro) */}
            <div>
              <button
                onClick={() => setIsFocusExpanded(!isFocusExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isFocusExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isFocusExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isFocusExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isFocusExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Timer size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion7')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isFocusExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isFocusExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-amber-500/[0.01] to-purple-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 text-left">
                        {t('mysticCalendar.focusDescription')}
                      </p>

                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                            {t('mysticCalendar.focusDurationLabel')}
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[15, 25, 45].map((mins) => (
                              <button
                                key={mins}
                                onClick={() => setFocusDuration(mins * 60)}
                                className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  focusDuration === mins * 60
                                    ? isReadingMode
                                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                                      : 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                {mins} Min
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setIsFocusModeActive(true)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isReadingMode
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.12)]'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10'
                          }`}
                        >
                          <Flame size={13} className="animate-pulse text-amber-400" />
                          {t('mysticCalendar.enterFocusBtn')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 8: Analyse de Synergie & "Cosmic Alignment" */}
            <div>
              <button
                onClick={() => setIsCosmicExpanded(!isCosmicExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isCosmicExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-950/20 text-amber-200/60 hover:text-amber-100'
                    : isCosmicExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isCosmicExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isCosmicExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Compass size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion8')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isCosmicExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isCosmicExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-amber-500/[0.01] to-emerald-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 text-left">
                        {t('mysticCalendar.cosmicAlignDesc')}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                            {t('mysticCalendar.plannedTaskType')}
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {[
                              { id: 'analytical', label: t('mysticCalendar.cosmicTaskAnalytical'), icon: '📊' },
                              { id: 'negotiation', label: t('mysticCalendar.cosmicTaskNegotiation'), icon: '🤝' },
                              { id: 'creative', label: t('mysticCalendar.cosmicTaskCreative'), icon: '🎨' },
                              { id: 'introspection', label: t('mysticCalendar.cosmicTaskIntrospection'), icon: '👁️' },
                              { id: 'rest', label: t('mysticCalendar.cosmicTaskRest'), icon: '💤' },
                            ].map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`p-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer justify-center ${
                                  selectedCategory === cat.id
                                    ? isReadingMode
                                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
                                      : 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-100'
                                }`}
                              >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Alignment Score visualizer */}
                        {selectedHijriDay && (
                          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center gap-4 text-left ${
                            isReadingMode ? 'bg-[#151310] border-amber-950/40 text-amber-200' : 'bg-emerald-500/[0.02] border-emerald-500/10'
                          }`}>
                            {/* Score ring */}
                            <div className="relative shrink-0 w-16 h-16 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100 dark:stroke-gray-800" strokeWidth="2.5" />
                                <circle 
                                  cx="18" 
                                  cy="18" 
                                  r="16" 
                                  fill="none" 
                                  className={isReadingMode ? 'stroke-amber-400' : 'stroke-emerald-600 dark:stroke-emerald-400'} 
                                  strokeWidth="2.5" 
                                  strokeDasharray={`${
                                    selectedCategory === 'analytical' && (selectedHijriDay >= 4 && selectedHijriDay <= 12) ? 95 :
                                    selectedCategory === 'negotiation' && (selectedHijriDay >= 13 && selectedHijriDay <= 16) ? 98 :
                                    selectedCategory === 'creative' && (selectedHijriDay >= 11 && selectedHijriDay <= 15) ? 90 :
                                    selectedCategory === 'introspection' && (selectedHijriDay >= 26 || selectedHijriDay <= 3) ? 92 :
                                    selectedCategory === 'rest' && (selectedHijriDay >= 27 || selectedHijriDay <= 2) ? 96 : 65
                                  }, 100`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute text-xs font-black">
                                {
                                  selectedCategory === 'analytical' && (selectedHijriDay >= 4 && selectedHijriDay <= 12) ? '95%' :
                                  selectedCategory === 'negotiation' && (selectedHijriDay >= 13 && selectedHijriDay <= 16) ? '98%' :
                                  selectedCategory === 'creative' && (selectedHijriDay >= 11 && selectedHijriDay <= 15) ? '90%' :
                                  selectedCategory === 'introspection' && (selectedHijriDay >= 26 || selectedHijriDay <= 3) ? '92%' :
                                  selectedCategory === 'rest' && (selectedHijriDay >= 27 || selectedHijriDay <= 2) ? '96%' : '65%'
                                }
                              </span>
                            </div>

                            {/* Verdict and dynamic text */}
                            <div className="text-xs">
                              <span className="font-extrabold uppercase text-[10px] tracking-wider text-amber-500 block mb-0.5">
                                {t('mysticCalendar.cosmicAlignmentTitle')}
                              </span>
                              <p className="leading-relaxed">
                                {selectedCategory === 'analytical' && (selectedHijriDay >= 4 && selectedHijriDay <= 12) && t('mysticCalendar.cosmicVerdictAnalytical')}
                                {selectedCategory === 'negotiation' && (selectedHijriDay >= 13 && selectedHijriDay <= 16) && t('mysticCalendar.cosmicVerdictNegotiation')}
                                {selectedCategory === 'creative' && (selectedHijriDay >= 11 && selectedHijriDay <= 15) && t('mysticCalendar.cosmicVerdictCreative')}
                                {selectedCategory === 'introspection' && (selectedHijriDay >= 26 || selectedHijriDay <= 3) && t('mysticCalendar.cosmicVerdictIntrospection')}
                                {selectedCategory === 'rest' && (selectedHijriDay >= 27 || selectedHijriDay <= 2) && t('mysticCalendar.cosmicVerdictRest')}
                                {!((selectedCategory === 'analytical' && (selectedHijriDay >= 4 && selectedHijriDay <= 12)) ||
                                  (selectedCategory === 'negotiation' && (selectedHijriDay >= 13 && selectedHijriDay <= 16)) ||
                                  (selectedCategory === 'creative' && (selectedHijriDay >= 11 && selectedHijriDay <= 15)) ||
                                  (selectedCategory === 'introspection' && (selectedHijriDay >= 26 || selectedHijriDay <= 3)) ||
                                  (selectedCategory === 'rest' && (selectedHijriDay >= 27 || selectedHijriDay <= 2))) && 
                                  t('mysticCalendar.cosmicVerdictModerate')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 9: Journal d'Intention & Suivi des Synchronicités */}
            <div>
              <button
                onClick={() => setIsJournalExpanded(!isJournalExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isJournalExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isJournalExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isJournalExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isJournalExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <BookOpen size={13} />
                  </div>
                  <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider">
                    {t('mysticCalendar.accordion9')}
                  </span>
                </div>
                <motion.div animate={{ rotate: isJournalExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isJournalExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-purple-500/[0.01] to-amber-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3 text-left">
                        {t('mysticCalendar.journalDesc')}
                      </p>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                              {t('mysticCalendar.morningIntention')}
                            </span>
                            <input 
                              type="text"
                              value={morningIntention}
                              onChange={(e) => setMorningIntention(e.target.value)}
                              placeholder={t('mysticCalendar.morningIntentionPlaceholder')}
                              className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all ${
                                isReadingMode
                                  ? 'bg-[#151310] border-amber-950/40 text-amber-100 focus:ring-amber-500'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-emerald-500'
                              }`}
                            />
                          </div>

                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                              {t('mysticCalendar.eveningGratitude')}
                            </span>
                            <input 
                              type="text"
                              value={eveningGratitude}
                              onChange={(e) => setEveningGratitude(e.target.value)}
                              placeholder={t('mysticCalendar.eveningGratitudePlaceholder')}
                              className={`w-full p-2 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all ${
                                isReadingMode
                                  ? 'bg-[#151310] border-amber-950/40 text-amber-100 focus:ring-amber-500'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 focus:ring-emerald-500'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-1">
                            {t('mysticCalendar.vibrationalState')}
                          </span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { id: 'peaceful', label: t('mysticCalendar.moodPeaceful') },
                              { id: 'energized', label: t('mysticCalendar.moodEnergized') },
                              { id: 'contemplative', label: t('mysticCalendar.moodContemplative') },
                              { id: 'tired', label: t('mysticCalendar.moodTired') },
                            ].map((moodItem) => (
                              <button
                                key={moodItem.id}
                                onClick={() => setJournalMood(moodItem.id)}
                                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                  journalMood === moodItem.id
                                    ? isReadingMode
                                      ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                                      : 'bg-purple-600 text-white'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                                }`}
                              >
                                {moodItem.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={saveJournalLog}
                            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              isReadingMode
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            }`}
                          >
                            <Check size={12} /> {t('mysticCalendar.saveJournalBtn')}
                          </button>

                          <button
                            onClick={() => setIsMuraqabahModalOpen(true)}
                            className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-sm"
                          >
                            <BookOpen size={12} />
                            {language === 'fr' ? "Journal Muraqabah" : "Muraqabah Log"}
                          </button>
                        </div>

                        {/* Miniature Trend Tracker based on active Hijri Month */}
                        <div className="pt-3.5 border-t border-dashed border-gray-200 dark:border-gray-800 text-left">
                          <span className="text-[9px] font-bold text-purple-500 block uppercase tracking-wider mb-1">
                            {t('mysticCalendar.lunarCorrelationTitle')}
                          </span>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
                            {t('mysticCalendar.lunarCorrelationDesc').replace('{month}', HIJRI_MONTHS[hijriMonthIndex].french)}
                          </p>

                          {/* Beautiful miniature grid timeline */}
                          <div className="flex gap-1 overflow-x-auto pb-1 mt-1.5 max-w-full">
                            {Array.from({ length: getDaysInHijriMonth(hijriYear, hijriMonthIndex) }, (_, i) => i + 1).map((dayNum) => {
                              const dayLog = journalLogs[`${hijriYear}-${hijriMonthIndex}-${dayNum}`];
                              const isToday = dayNum === selectedHijriDay;
                              return (
                                <div 
                                  key={dayNum}
                                  onClick={() => setSelectedHijriDay(dayNum)}
                                  className={`w-4 h-6 rounded flex flex-col items-center justify-center text-[8px] font-bold cursor-pointer transition-all shrink-0 ${
                                    isToday
                                      ? 'border border-amber-500 scale-110'
                                      : 'border border-transparent'
                                  } ${
                                    dayLog
                                      ? dayLog.mood === 'peaceful' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                                        dayLog.mood === 'energized' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                                        dayLog.mood === 'contemplative' ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' :
                                        'bg-slate-500/20 text-slate-700 dark:text-slate-400'
                                      : 'bg-gray-100 dark:bg-gray-800/40 text-gray-400'
                                  }`}
                                  title={t('mysticCalendar.daySuffix').replace('{day}', String(dayNum))}
                                >
                                  <span>{dayNum}</span>
                                  {dayLog && (
                                    <span className="w-1 h-1 rounded-full bg-current" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 10: Horloges Solaires & Invitations d'Asrar */}
            <div className="mt-3">
              <button
                onClick={() => setIsSolarClocksExpanded(!isSolarClocksExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isSolarClocksExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isSolarClocksExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isSolarClocksExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isSolarClocksExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Compass size={13} className={isSolarClocksExpanded ? "animate-spin-slow" : ""} />
                  </div>
                  <div>
                    <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider block">
                      {t('mysticCalendar.solarClocksTitle')}
                    </span>
                    <span className={`text-[9px] block ${isReadingMode ? 'text-amber-500/50' : 'text-gray-400'}`}>
                      {t('mysticCalendar.solarClocksSubtitle')}
                    </span>
                  </div>
                </div>
                <motion.div animate={{ rotate: isSolarClocksExpanded ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isSolarClocksExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-amber-500/[0.01] to-purple-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2.5 border-b border-dashed border-gray-100 dark:border-gray-800/60">
                        <span className={`text-[10px] ${isReadingMode ? 'text-amber-400/60' : 'text-gray-400'}`}>
                          {solarCoordsSource === 'gps'
                            ? t('mysticCalendar.gpsSource')
                            : t('mysticCalendar.cosmicSource')
                          }
                          <span className="font-mono text-gray-500 ml-2">
                            {solarCoords ? `${solarCoords.lat.toFixed(4)}°N, ${solarCoords.lng.toFixed(4)}°E` : ''}
                          </span>
                        </span>

                        <button
                          onClick={requestGeolocation}
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1 shrink-0 ${
                            isReadingMode 
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          <Sparkles size={11} />
                          {t('mysticCalendar.detectPositionBtn')}
                        </button>
                      </div>

                      {/* Computed Solar Times Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
                        {[
                          { id: 'sunrise', icon: '🌅', label: t('mysticCalendar.sunriseLabel'), time: solarTimes.sunrise },
                          { id: 'zenith', icon: '☀️', label: t('mysticCalendar.zenithLabel'), time: solarTimes.zenith },
                          { id: 'goldenHour', icon: '🌟', label: t('mysticCalendar.goldenHourLabel'), time: solarTimes.goldenHour },
                          { id: 'sunset', icon: '🌇', label: t('mysticCalendar.sunsetLabel'), time: solarTimes.sunset },
                        ].map((item) => (
                          <div key={item.id} className={`rounded-xl p-2.5 border text-center transition-all ${
                            isReadingMode
                              ? 'bg-amber-950/20 border-amber-950/40 text-amber-100'
                              : 'bg-white dark:bg-gray-850 border-gray-100 dark:border-gray-800 shadow-sm'
                          }`}>
                            <span className="text-lg block mb-0.5">{item.icon}</span>
                            <span className={`text-[9px] block uppercase tracking-wider font-bold ${isReadingMode ? 'text-amber-500/60' : 'text-gray-400 dark:text-gray-500'}`}>
                              {item.label}
                            </span>
                            <span className="text-xs font-black font-mono block mt-0.5">
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Notification Toggle button */}
                      <button
                        onClick={enableLocalNotifications}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                          meditationNotificationsEnabled
                            ? isReadingMode
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/80'
                        }`}
                      >
                        <Heart size={13} className={meditationNotificationsEnabled ? "fill-current animate-pulse" : ""} />
                        {meditationNotificationsEnabled
                          ? t('mysticCalendar.meditationNotifActive')
                          : t('mysticCalendar.activateMeditationNotif')
                        }
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 11: Ondes Sacrées & Fréquences d'Asrar */}
            <div className="mt-3">
              <button
                onClick={() => setIsSacredWavesExpanded(!isSacredWavesExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isReadingMode
                    ? isSacredWavesExpanded
                      ? 'bg-[#181512] border-amber-950/60 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.06)]'
                      : 'bg-[#0f0d0b] border-amber-200/60 text-amber-200/60 hover:text-amber-100'
                    : isSacredWavesExpanded
                    ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border-amber-500/20 text-gray-900 dark:text-white shadow-sm'
                    : 'bg-gray-50/70 dark:bg-gray-850/40 border-gray-100 dark:border-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center gap-2 text-left">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isReadingMode
                      ? isSacredWavesExpanded ? 'bg-amber-500/25 text-amber-400' : 'bg-amber-500/10 text-amber-500/40'
                      : isSacredWavesExpanded
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}>
                    <Activity size={13} className={isSynthPlaying ? "animate-pulse" : ""} />
                  </div>
                  <div>
                    <span className="text-[12px] sm:text-xs font-extrabold uppercase tracking-wider block">
                      {t('mysticCalendar.sacredWavesTitle')}
                    </span>
                    <span className={`text-[9px] block ${isReadingMode ? 'text-amber-500/50' : 'text-gray-400'}`}>
                      {t('mysticCalendar.sacredWavesSubtitle')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {isSynthPlaying && (
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  )}
                  <motion.div animate={{ rotate: isSacredWavesExpanded ? 180 : 0 }}>
                    <ChevronDown size={14} />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isSacredWavesExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl p-4 border mb-2 mt-1.5 transition-all duration-300 ${
                      isReadingMode
                        ? 'bg-[#181512] border-amber-950/40 text-amber-100'
                        : 'bg-gradient-to-br from-purple-500/[0.01] to-emerald-500/[0.01] border-gray-100 dark:border-gray-800'
                    }`}>

                      {/* Suggested Preset Sync Badge */}
                      <div className={`mb-3 p-2 rounded-xl text-[10px] leading-relaxed flex items-center gap-1.5 border ${
                        isReadingMode
                          ? 'bg-amber-950/10 border-amber-950/20 text-amber-200/80'
                          : 'bg-purple-500/5 border-purple-500/10 text-purple-800 dark:text-purple-300'
                      }`}>
                        <Sparkles size={11} className="text-amber-500 animate-pulse shrink-0" />
                        <span>
                          {t('mysticCalendar.activeTaskSync').replace('{task}', selectedCategory)}
                        </span>
                      </div>

                      {/* Playing state visualizer */}
                      {isSynthPlaying && activeSynthPreset ? (
                        <div className={`mb-3.5 p-3 rounded-xl border transition-all ${
                          isReadingMode
                            ? 'bg-amber-950/30 border-amber-950/40 text-amber-100'
                            : 'bg-white dark:bg-gray-850 border-gray-100 dark:border-gray-800 shadow-sm'
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-xs text-purple-600 dark:text-purple-400">
                              {activeSynthPreset.name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {activeSynthPreset.baseFreq}Hz {activeSynthPreset.beatFreq > 0 ? `+ ${activeSynthPreset.beatFreq}Hz (Beat)` : ''}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed italic">
                            "{activeSynthPreset.desc}"
                          </p>
                        </div>
                      ) : (
                        <div className="mb-3.5 py-4 text-center text-[10px] text-gray-400 italic">
                          {t('mysticCalendar.selectSoundWarning')}
                        </div>
                      )}

                      {/* Volume Slider Control */}
                      <div className="mb-4 flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-bold shrink-0 ${isReadingMode ? 'text-amber-400/60' : 'text-gray-400'}`}>
                          {t('mysticCalendar.waveVolumeLabel')}
                        </span>
                        <input
                          type="range"
                          min="0.01"
                          max="0.4"
                          step="0.01"
                          value={synthVolume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="flex-grow accent-purple-500 h-1 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="font-mono text-[10px] text-gray-500 w-8 text-right">
                          {Math.round(synthVolume * 250)}%
                        </span>
                      </div>

                      {/* Preset Selector Buttons Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2.5">
                        {getFreqPresets().map((preset) => {
                          const isCurrent = activeSynthPreset?.id === preset.id;
                          const isSyncedWithTask = selectedCategory === preset.id;
                          
                          return (
                            <button
                              key={preset.id}
                              onClick={() => isCurrent && isSynthPlaying ? stopSynth() : startSynth(preset)}
                              className={`py-1.5 px-2 rounded-xl text-[9px] font-extrabold transition-all cursor-pointer border flex flex-col justify-center items-center text-center leading-tight relative ${
                                isCurrent && isSynthPlaying
                                  ? isReadingMode
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                                    : 'bg-purple-600 text-white border-purple-500 shadow-sm'
                                  : isReadingMode
                                  ? 'bg-amber-950/10 border-amber-950/30 text-amber-300 hover:bg-amber-950/20'
                                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800'
                              }`}
                            >
                              <span>{preset.id === 'rest' ? '💤' : preset.id === 'introspection' ? '🧘' : preset.id === 'creative' ? '🎨' : preset.id === 'negotiation' ? '🗣️' : '🧠'}</span>
                              <span className="mt-0.5 truncate max-w-full">{preset.name.split(' ')[0]}</span>
                              
                              {isSyncedWithTask && !isCurrent && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Recommandé !" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Play/Pause Main Control */}
                      {isSynthPlaying ? (
                        <button
                          onClick={stopSynth}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 border border-rose-500/20`}
                        >
                          <Pause size={12} className="fill-current" />
                          {t('mysticCalendar.disableFrequencyBtn')}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const preset = getFreqPresets().find(p => p.id === selectedCategory) || getFreqPresets()[0];
                            startSynth(preset);
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/10`}
                        >
                          <Play size={12} className="fill-current" />
                          {t('mysticCalendar.activateOptimalWaveBtn')}
                        </button>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Interactive Moon Phase Deep Mystery Overlay (Raised on click) */}
          <AnimatePresence>
            {selectedMoonPhaseDay !== null && activeMoonMystery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                data-modal-overlay="true"
                className={isPage 
                  ? "fixed inset-0 z-[10005] bg-gray-950 text-white p-5 pt-8 pb-36 sm:p-8 sm:pb-40 flex flex-col justify-between overflow-y-auto overscroll-contain w-full max-w-4xl mx-auto md:rounded-3xl md:my-8 md:h-[calc(100vh-4rem)] md:inset-auto md:left-1/2 md:-translate-x-1/2"
                  : "absolute inset-0 z-[130] bg-gray-950 text-white rounded-3xl p-5 sm:p-6 pb-28 sm:pb-32 flex flex-col justify-between overflow-y-auto overscroll-contain"
                }
              >
                {/* Mystic Starfield Design */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col min-h-full justify-between">
                  <div>
                    {/* Header of overlay */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Moon size={13} className="fill-amber-400/20" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest">
                          {t('mysticCalendar.moonMysteryTitle')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsMuraqabahModalOpen(true)}
                          className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-500 hover:bg-amber-600 text-black rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-md shadow-amber-500/20"
                        >
                          <BookOpen size={11} />
                          {language === 'fr' ? "Journal Muraqabah" : "Muraqabah Log"}
                        </button>

                        <button
                          onClick={() => setSelectedMoonPhaseDay(null)}
                          className="px-2.5 py-1 text-[10px] font-extrabold bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg cursor-pointer transition-colors"
                        >
                          {t('mysticCalendar.backToCalendar')}
                        </button>
                      </div>
                    </div>

                    {/* Central Moon Visual */}
                    <div className="text-center py-3 flex flex-col items-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-full mb-2.5 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                        {getMoonPhaseSvg(selectedMoonPhaseDay)}
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-amber-200">
                        {activeMoonMystery.name}
                      </h3>
                      <span className="text-base font-serif text-amber-400 block mt-0.5 tracking-wide" dir="rtl">
                        {activeMoonMystery.arabicName}
                      </span>
                    </div>

                    {/* Mystery details with light glassmorphism */}
                    <div className="space-y-2.5 my-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5 flex items-center gap-1">
                            <Info size={10} /> {t('mysticCalendar.manzil')}
                          </span>
                          <p className="text-xs text-gray-100 font-semibold">
                            {activeMoonMystery.manzil}
                          </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5 flex items-center gap-1">
                            <Sparkles size={10} /> {t('mysticCalendar.energyInfluence')}
                          </span>
                          <p className="text-xs text-gray-100 font-semibold">
                            {activeMoonMystery.energy}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                          {t('mysticCalendar.deepMysticMeaning')}
                        </span>
                        <p 
                          className={`leading-relaxed font-light transition-all ${
                            isReadingMode ? 'font-serif leading-[1.8] text-amber-100 text-sm' : 'text-xs text-gray-200'
                          }`}
                          style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                        >
                          {activeMoonMystery.mysticMeaning}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                          {t('mysticCalendar.spiritualSecret')}
                        </span>
                        <p 
                          className={`leading-relaxed font-medium transition-all ${
                            isReadingMode ? 'font-serif leading-[1.8] text-amber-100 text-sm' : 'text-xs text-purple-100'
                          }`}
                          style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                        >
                          {activeMoonMystery.spiritualSecret}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
                          {t('mysticCalendar.astronomyCosmic')}
                        </span>
                        <p 
                          className={`leading-relaxed font-light transition-all ${
                            isReadingMode ? 'font-serif leading-[1.8] text-amber-100 text-sm' : 'text-xs text-sky-100'
                          }`}
                          style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                        >
                          {activeMoonMystery.astronomicalInfo}
                        </p>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                          {t('mysticCalendar.recommendedNames')}
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {activeMoonMystery.recommendedAsma.map((name, idx) => (
                            <span key={idx} className="bg-amber-950/40 text-amber-200 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-lg font-serif font-bold">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5 flex items-center gap-1">
                          <BookOpen size={10} /> {t('mysticCalendar.recommendedPractice')}
                        </span>
                        <p 
                          className={`leading-relaxed font-semibold transition-all ${
                            isReadingMode ? 'font-serif leading-[1.8] text-amber-100 text-sm' : 'text-xs text-emerald-100'
                          }`}
                          style={{ fontFamily: isReadingMode ? "'Amiri', serif" : undefined }}
                        >
                          {activeMoonMystery.recommendedPractice}
                        </p>
                        <div className="mt-2 pt-2 border-t border-emerald-500/10 text-[10px] text-emerald-300 italic">
                          <strong>{t('mysticCalendar.soulKey')}</strong> {activeMoonMystery.spiritualKey}
                        </div>
                      </div>

                      {activeMoonMystery.wirdDetails && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden shadow-lg col-span-1">
                          <div className="absolute top-0 right-0 p-1 opacity-20">
                            <Sparkles size={40} className="text-amber-400" />
                          </div>
                          
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 block mb-1 flex items-center gap-1">
                            <Flame size={10} className="animate-pulse" /> 
                            {language === 'fr' ? "WIRD & ZIKR DE LA PHASE" : language === 'ha' ? "WIRDI DA ZIKIRIN LOKACIN" : "WIRD & ZIKR OF THE PHASE"}
                          </span>
                          
                          <h4 className="text-sm font-bold text-white mb-2">
                            {activeMoonMystery.wirdDetails.title}
                          </h4>
                          
                          <div className="bg-black/40 border border-amber-500/20 rounded-lg p-3 my-2 text-center relative">
                            <p className="text-base font-serif font-bold text-amber-200 tracking-wide leading-relaxed">
                              {activeMoonMystery.wirdDetails.formula}
                            </p>
                            <div className="absolute -bottom-2 right-4 bg-amber-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              {activeMoonMystery.wirdDetails.count} x
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-300 leading-relaxed mt-2 italic">
                            {activeMoonMystery.wirdDetails.description}
                          </p>
                        </div>
                      )}

                      {activeMoonMystery.talsamDetails && (
                        <div className="bg-gradient-to-br from-purple-950/40 to-slate-900/60 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden shadow-lg col-span-1">
                          <div className="absolute top-0 right-0 p-1 opacity-10">
                            <Compass size={40} className="text-purple-400" />
                          </div>
                          
                          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 block mb-1 flex items-center gap-1">
                            <Zap size={10} />
                            {language === 'fr' ? "SCEAU & TALSAM MYSTIQUE" : language === 'ha' ? "HARSHE DA SIRRIN TALSAM" : "SACRED SEAL & TALSAM"}
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center mt-2">
                            <div className="md:col-span-5 flex flex-col items-center justify-center gap-2">
                              {/* Version Switcher Tabs */}
                              <div className="flex items-center justify-between gap-1 w-full bg-black/70 p-1 rounded-xl border border-purple-500/30">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSealVersion(1);
                                  }}
                                  className={`flex-1 py-1 px-1.5 text-[9px] font-extrabold rounded-lg transition-all cursor-pointer ${
                                    selectedSealVersion === 1 
                                      ? "bg-amber-500 text-black shadow-md" 
                                      : "text-purple-300 hover:text-white hover:bg-purple-900/40"
                                  }`}
                                >
                                  {activeMoonMystery.talsamDetails.version1Title || (language === 'fr' ? "V1 : Wafq Abjad" : "V1: Wafq Seal")}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSealVersion(2);
                                  }}
                                  className={`flex-1 py-1 px-1.5 text-[9px] font-extrabold rounded-lg transition-all cursor-pointer ${
                                    selectedSealVersion === 2 
                                      ? "bg-amber-500 text-black shadow-md" 
                                      : "text-purple-300 hover:text-white hover:bg-purple-900/40"
                                  }`}
                                >
                                  {activeMoonMystery.talsamDetails.version2Title || (language === 'fr' ? "V2 : Khatim An-Nur" : "V2: Khatim Seal")}
                                </button>
                              </div>

                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsSealExpanded(true);
                                }}
                                className="group relative cursor-pointer w-full flex flex-col items-center justify-center bg-black/80 border border-purple-500/40 hover:border-amber-400/60 p-3 rounded-xl transition-all duration-300 shadow-inner hover:shadow-purple-500/20 select-none min-h-[140px]"
                                title={language === 'fr' ? "Cliquez pour agrandir en plein écran et télécharger le Sceau" : language === 'ha' ? "Danna don faɗaɗawa da saukar da Hatimi" : "Click to enlarge in full screen and download Seal"}
                              >
                                <pre className="text-purple-300 text-[10px] sm:text-[11px] font-mono leading-none tracking-tight text-center whitespace-pre max-w-full overflow-x-auto">
                                  {selectedSealVersion === 2 && activeMoonMystery.talsamDetails.graphicSymbolV2
                                    ? activeMoonMystery.talsamDetails.graphicSymbolV2
                                    : activeMoonMystery.talsamDetails.graphicSymbol}
                                </pre>
                                
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                                  <span className="bg-purple-950/90 text-amber-300 text-[10px] font-extrabold px-2 py-1 rounded-lg border border-amber-500/40 shadow-xl flex items-center gap-1.5 uppercase tracking-wider">
                                    <Eye size={12} className="animate-pulse" />
                                    {language === 'fr' ? "Voir en Plein Écran" : language === 'ha' ? "Buɗe Bayana" : "Full Screen"}
                                  </span>
                                </div>
                              </div>

                              {/* Direct Seal Control Buttons */}
                              <div className="flex items-center gap-1.5 w-full">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsSealExpanded(true);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/30 text-purple-200 text-[10px] font-bold py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
                                  title={language === 'fr' ? "Afficher le sceau en grand" : "View seal full screen"}
                                >
                                  <Eye size={12} className="text-purple-300" />
                                  <span>{language === 'fr' ? "Plein Écran" : language === 'ha' ? "Buɗe" : "Full Screen"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadSealAsImage();
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
                                  title={language === 'fr' ? "Télécharger le Sceau sous forme d'image PNG" : "Download Seal as PNG image"}
                                >
                                  <Download size={12} className="text-amber-400" />
                                  <span>{language === 'fr' ? "Télécharger" : language === 'ha' ? "Sauke" : "Download"}</span>
                                </button>
                              </div>
                            </div>
                            <div className="md:col-span-7 space-y-1.5">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-gray-300 block flex items-center justify-between font-bold">
                                  <span>
                                    {language === 'fr' ? "Formule Talsamique (avec Tashkeel)" : language === 'ha' ? "Kalmar Talsam (da Tashkeel)" : "Talismanic formula (with Tashkeel)"}
                                  </span>
                                  <button
                                    onClick={handleCopyTalsam}
                                    className="text-purple-300 hover:text-white text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                                    title={language === 'fr' ? "Copier la formule" : "Copy formula"}
                                  >
                                    {copiedTalsam ? (
                                      <span className="text-emerald-400 flex items-center gap-0.5">
                                        <Check size={11} />
                                        {language === 'fr' ? "Copié !" : "Copied!"}
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-0.5 bg-purple-900/60 px-2 py-0.5 rounded-md border border-purple-500/30">
                                        <Copy size={11} />
                                        {language === 'fr' ? "Copier" : "Copy"}
                                      </span>
                                    )}
                                  </button>
                                </span>
                                <div className="bg-black/80 border border-amber-500/30 rounded-xl p-2.5 mt-1 flex flex-col gap-1 shadow-inner">
                                  <code className="text-base sm:text-lg md:text-2xl font-serif font-bold text-amber-300 select-all tracking-wide text-center leading-relaxed" dir="rtl">
                                    {activeMoonMystery.talsamDetails.formula}
                                  </code>
                                  <span className="text-[9px] text-gray-400 text-center font-sans italic">
                                    {language === 'fr' 
                                      ? "✦ Formule talsamique sacrée vocalisée avec diacritiques (Tashkeel)" 
                                      : language === 'ha' 
                                      ? "✦ Formular Talsam mai albarka tare da Tashkeel" 
                                      : "✦ Sacred vocalized talsam formula with diacritics (Tashkeel)"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="text-[8px] uppercase tracking-wider text-gray-400 block">
                                  {language === 'fr' ? "Vertu Spirituelle" : language === 'ha' ? "Amfanin Ruhaniya" : "Spiritual Utility"}
                                </span>
                                <p className="text-xs text-emerald-300 font-semibold leading-snug">
                                  {activeMoonMystery.talsamDetails.spiritualUtility}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-[11px] text-gray-300 leading-relaxed mt-2.5 pt-2 border-t border-purple-500/10">
                            {activeMoonMystery.talsamDetails.description}
                          </p>
                        </div>
                      )}

                      {/* Quranic Verse Accompanying the Phase */}
                      {activeMoonMystery.quranicVerseDetails && (
                        <div className="bg-gradient-to-br from-emerald-950/40 to-teal-950/50 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden shadow-lg col-span-1 md:col-span-1 space-y-3">
                          <div className="absolute top-0 right-0 p-1 opacity-10">
                            <BookOpen size={40} className="text-emerald-400" />
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block mb-1 flex items-center gap-1">
                            <BookOpen size={10} />
                            {language === 'fr' ? "VERSET CORANIQUE D'ACCOMPAGNEMENT" : language === 'ha' ? "AYAR AL-QUR'ANI MAI RAFIKA" : "ACCOMPANYING QURANIC VERSE"}
                          </span>
                          <div className="flex justify-between items-center mb-1.5">
                            <h4 className="text-xs font-bold text-emerald-200">
                              {activeMoonMystery.quranicVerseDetails.surahName}
                            </h4>
                            <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                              {activeMoonMystery.quranicVerseDetails.verseNumber}
                            </span>
                          </div>
                          <div className="bg-black/50 border border-emerald-500/20 rounded-lg p-3 my-2 text-center">
                            <p className="text-xl sm:text-2xl font-quran font-bold text-amber-200 leading-[2.2] my-1" dir="rtl" style={{ fontFamily: '"Amiri Quran", "Uthmani", "Scheherazade New", "Amiri", serif', direction: 'rtl' }}>
                              {activeMoonMystery.quranicVerseDetails.arabicText}
                            </p>
                            <p className="text-[10px] text-emerald-300/80 italic mt-1 font-mono">
                              "{activeMoonMystery.quranicVerseDetails.phonetic}"
                            </p>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed italic mb-2">
                            « {activeMoonMystery.quranicVerseDetails.translation} »
                          </p>
                          <div className="pt-2 border-t border-emerald-500/10 text-[10px] text-emerald-300">
                            <strong className="text-amber-300">{language === 'fr' ? "Vertu Spirituelle : " : language === 'ha' ? "Amfanin Ruhaniya: " : "Spiritual Benefit: "}</strong> 
                            {activeMoonMystery.quranicVerseDetails.spiritualBenefit}
                          </div>

                          {/* Contemplative Spiritual Audio Player */}
                          <div className="mt-3">
                            <ContemplativeAudioPlayer
                              verseTitle={`${activeMoonMystery.quranicVerseDetails.surahName} (${activeMoonMystery.quranicVerseDetails.verseNumber})`}
                              arabicText={activeMoonMystery.quranicVerseDetails.arabicText}
                              phoneticText={activeMoonMystery.quranicVerseDetails.phonetic}
                              translationText={activeMoonMystery.quranicVerseDetails.translation}
                              language={language}
                            />
                          </div>
                        </div>
                      )}

                      {/* Sacred Plants & Incenses Accompanying the Phase */}
                      {activeMoonMystery.sacredPlantsDetails && (
                        <div className="bg-gradient-to-br from-amber-950/40 to-stone-900/60 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden shadow-lg col-span-1 md:col-span-1 space-y-3">
                          <div className="absolute top-0 right-0 p-1 opacity-10">
                            <Leaf size={40} className="text-amber-400" />
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 block mb-1 flex items-center gap-1">
                            <Leaf size={10} className="text-emerald-400 animate-pulse" />
                            {language === 'fr' ? "PLANTES SACRÉES & ENCENS RÉSONANTS" : language === 'ha' ? "TSAHO DA TURARE MAI ALBARKA" : "SACRED PLANTS & RESONANT INCENSE"}
                          </span>
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-xs font-bold text-amber-200">
                              {activeMoonMystery.sacredPlantsDetails.plantName}
                            </h4>
                            {activeMoonMystery.sacredPlantsDetails.botanicalName && (
                              <span className="text-[9px] text-gray-400 italic font-mono">
                                {activeMoonMystery.sacredPlantsDetails.botanicalName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20">
                              ⚡ {language === 'fr' ? "Élément : " : language === 'ha' ? "Element: " : "Element: "} {activeMoonMystery.sacredPlantsDetails.element}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed mb-2">
                            {activeMoonMystery.sacredPlantsDetails.spiritualProperties}
                          </p>
                          <div className="pt-2 border-t border-amber-500/10 text-[10px] text-amber-200/90 bg-black/30 p-2 rounded-lg border border-amber-500/10">
                            <strong className="text-amber-400 flex items-center gap-1 mb-0.5">
                              <Sparkles size={10} />
                              {language === 'fr' ? "Mode d'Utilisation Rituel :" : language === 'ha' ? "Hanyar Amfani:" : "Ritual Usage Method:"}
                            </strong>
                            <p className="text-[10px] text-gray-300 leading-normal">
                              {activeMoonMystery.sacredPlantsDetails.usageMethod}
                            </p>
                          </div>

                          {/* Synchronous Ritual Fumigation Audio Timer */}
                          <div className="mt-3">
                            <RitualIncenseTimer
                              plantName={activeMoonMystery.sacredPlantsDetails.plantName}
                              element={activeMoonMystery.sacredPlantsDetails.element}
                              binauralFreq={activeMoonMystery.sacredPlantsDetails.binauralFreq || 528}
                              frequencyName={activeMoonMystery.sacredPlantsDetails.frequencyName}
                              essentialOils={activeMoonMystery.sacredPlantsDetails.essentialOils}
                              usageMethod={activeMoonMystery.sacredPlantsDetails.usageMethod}
                              language={language}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vibration label in footer */}
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {t('mysticCalendar.vibrationalInfluence')}
                    </span>
                    <span className="text-[10px] text-amber-300 font-extrabold italic">
                      "{activeMoonMystery.vibration}"
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

            </>
          )}

        </motion.div>

        {/* Lightbox for Seal Expansion */}
        <AnimatePresence>
          {isSealExpanded && activeMoonMystery?.talsamDetails && createPortal(
            (() => {
              const currentDayForSeal = selectedMoonPhaseDay || selectedHijriDay;
              const proto = getTalsamAdvancedProtocol(currentDayForSeal, language);
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSealExpanded(false)}
                  className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto cursor-pointer"
                >
                  {/* Background elements */}
                  <div className="absolute inset-0 bg-radial-gradient from-purple-950/40 via-black to-black opacity-80 pointer-events-none" />
                  
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0a0712] border border-purple-500/40 rounded-3xl p-5 sm:p-8 flex flex-col items-center shadow-2xl shadow-purple-500/20 z-10 my-auto cursor-default"
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setIsSealExpanded(false)}
                      className="absolute top-4 right-4 p-2.5 bg-purple-950/80 text-purple-300 hover:text-white rounded-full border border-purple-500/40 hover:bg-purple-900 transition-colors cursor-pointer z-20 shadow-lg"
                      title={language === 'fr' ? "Fermer" : "Close"}
                    >
                      <X size={20} />
                    </button>

                    <div className="text-center mb-6 pr-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block mb-1">
                        {language === 'fr' ? `SCEAU SACRÉ & PROTOCOLE (JOUR ${currentDayForSeal})` : language === 'ha' ? `HATIMIN SIRRI DA MAGANA (RANA ${currentDayForSeal})` : `SACRED LUNAR SEAL & PROTOCOL (DAY ${currentDayForSeal})`}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                        {activeMoonMystery.wirdDetails?.title || `Jour ${currentDayForSeal}`}
                      </h3>
                      <p className="text-xs text-amber-300 font-extrabold italic mt-1">
                        "{activeMoonMystery.vibration}"
                      </p>
                    </div>

                    {/* Version Switcher Bar in Lightbox */}
                    <div className="flex items-center justify-center gap-2 w-full max-w-md bg-black/80 p-1.5 rounded-2xl border border-purple-500/30 mb-6 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setSelectedSealVersion(1)}
                        className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                          selectedSealVersion === 1 
                            ? "bg-amber-500 text-black shadow-lg scale-[1.02]" 
                            : "text-purple-300 hover:text-white hover:bg-purple-900/40"
                        }`}
                      >
                        {activeMoonMystery.talsamDetails.version1Title || (language === 'fr' ? "Version 1 : Wafq Abjad" : "Version 1: Wafq Seal")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedSealVersion(2)}
                        className={`flex-1 py-2 px-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                          selectedSealVersion === 2 
                            ? "bg-amber-500 text-black shadow-lg scale-[1.02]" 
                            : "text-purple-300 hover:text-white hover:bg-purple-900/40"
                        }`}
                      >
                        {activeMoonMystery.talsamDetails.version2Title || (language === 'fr' ? "Version 2 : Khatim An-Nur" : "Version 2: Khatim Seal")}
                      </button>
                    </div>

                    {/* Big Sceau view */}
                    <div className="w-full flex flex-col items-center justify-center gap-4 py-6 bg-black/95 border border-purple-500/40 rounded-2xl p-4 sm:p-8 shadow-2xl relative overflow-hidden select-all mb-6">
                      <pre className="text-purple-300 font-mono text-xl sm:text-2xl md:text-3xl leading-none tracking-normal text-center whitespace-pre select-all overflow-x-auto max-w-full">
                        {selectedSealVersion === 2 && activeMoonMystery.talsamDetails.graphicSymbolV2
                          ? activeMoonMystery.talsamDetails.graphicSymbolV2
                          : activeMoonMystery.talsamDetails.graphicSymbol}
                      </pre>
                      
                      {activeMoonMystery.talsamDetails.formula && (
                        <div className="w-full pt-4 border-t border-purple-500/30 text-center">
                          <span className="text-[10px] uppercase tracking-widest text-amber-400/90 block mb-1.5 font-bold">
                            {language === 'fr' ? "Formule Talsamique Vocalisée (Tashkeel)" : language === 'ha' ? "Formular Talsam (Tashkeel)" : "Talismanic Formula (Tashkeel)"}
                          </span>
                          <code className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-300 select-all tracking-wide leading-relaxed block my-1" dir="rtl">
                            {activeMoonMystery.talsamDetails.formula}
                          </code>
                        </div>
                      )}
                    </div>

                    {/* Mode d'Emploi Rituel Section */}
                    <div className="w-full bg-purple-950/20 border border-purple-500/20 rounded-2xl p-4 sm:p-5 mb-6 text-left">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/20">
                        <Sparkles size={16} className="text-amber-400" />
                        <h4 className="text-sm font-bold text-purple-200 uppercase tracking-wider">
                          {language === 'fr' ? "Comment Utiliser le Sceau & Talsam (Protocole Rituel)" : language === 'ha' ? "Yadda ake amfani da Hatimi (Tsarin Aiki)" : "How to Use the Seal & Talisman (Ritual Protocol)"}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {proto.usageSteps.map((s) => (
                          <div key={s.step} className="flex gap-3 items-start bg-black/40 border border-purple-500/10 rounded-xl p-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center">
                              {s.step}
                            </span>
                            <div>
                              <h5 className="text-xs font-bold text-amber-200">{s.title}</h5>
                              <p className="text-[11px] text-gray-300 leading-relaxed mt-0.5">{s.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Esoteric Details */}
                    <div className="w-full bg-black/60 border border-amber-500/20 rounded-2xl p-4 sm:p-5 mb-6 text-left">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/20">
                        <Compass size={16} className="text-amber-400" />
                        <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                          {language === 'fr' ? "Détails & Spécifications Ésotériques Avancées" : language === 'ha' ? "Sirri da Bayani na Gaba" : "Advanced Esoteric Specifications"}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                          <span className="text-[10px] text-purple-300 uppercase font-bold block mb-1">
                            {language === 'fr' ? "Base Abjadique & Fréquence" : "Abjad & Numerical Base"}
                          </span>
                          <p className="text-gray-200 font-medium">{proto.advancedDetails.abjadBasis}</p>
                        </div>

                        <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                          <span className="text-[10px] text-purple-300 uppercase font-bold block mb-1">
                            {language === 'fr' ? "Nature Élémentaire" : "Elemental Temperament"}
                          </span>
                          <p className="text-gray-200 font-medium">{proto.advancedDetails.elementalNature}</p>
                        </div>

                        <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                          <span className="text-[10px] text-purple-300 uppercase font-bold block mb-1">
                            {language === 'fr' ? "Alignement des Khuddam & Anges" : "Angelic & Khuddam Alignment"}
                          </span>
                          <p className="text-gray-200 font-medium">{proto.advancedDetails.khuddamInfo}</p>
                        </div>

                        <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                          <span className="text-[10px] text-purple-300 uppercase font-bold block mb-1">
                            {language === 'fr' ? "Encens Recommandé (Bukhoor)" : "Recommended Incense"}
                          </span>
                          <p className="text-emerald-300 font-semibold">{proto.advancedDetails.recommendedIncense}</p>
                        </div>

                        <div className="sm:col-span-2 bg-amber-950/20 border border-amber-500/30 rounded-xl p-3">
                          <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                            {language === 'fr' ? "Règle Temporelle & Direction Céleste" : "Timing & Qiblah Rule"}
                          </span>
                          <p className="text-amber-200 font-medium">{proto.advancedDetails.timingRule}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <button
                        onClick={downloadSealAsImage}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold py-3 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <Download size={18} />
                        <span>{language === 'fr' ? "Télécharger Sceau" : language === 'ha' ? "Sauke Hatimi" : "Download Seal"}</span>
                      </button>

                      <button
                        onClick={handleCopySeal}
                        className="flex items-center justify-center gap-2 bg-purple-950/50 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/60 text-purple-200 font-bold py-3 px-5 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                      >
                        {copiedSeal ? (
                          <>
                            <Check size={18} className="text-emerald-400" />
                            <span className="text-emerald-400">{language === 'fr' ? "Sceau Copié !" : "Seal Copied!"}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            <span>{language === 'fr' ? "Copier le Sceau" : "Copy Seal"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })(),
            document.body
          )}
        </AnimatePresence>

        {/* Muraqabah Lunar Retreat Log Generator Modal */}
        <MuraqabahLogModal
          isOpen={isMuraqabahModalOpen}
          onClose={() => setIsMuraqabahModalOpen(false)}
          currentHijriYear={hijriYear}
          currentHijriMonthIndex={hijriMonthIndex}
          currentHijriMonthName={HIJRI_MONTHS[hijriMonthIndex]?.french || ''}
          currentHijriDay={selectedHijriDay}
          currentPhaseName={activeMoonMystery?.name}
          language={language}
        />

      </div>
    </AnimatePresence>
  );
};
