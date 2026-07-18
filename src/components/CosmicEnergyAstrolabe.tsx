import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Sparkles, Activity, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CosmicEnergyAstrolabeProps {
  day: number;
  monthIndex: number;
  year: number;
  isReadingMode?: boolean;
}

interface CelestialBody {
  id: string;
  name: string;
  arabicName: string;
  aspect: string;
  energy: number;
  peakTime: string;
  color: string;
  glowColor: string;
  radius: number;
  angle: number;
  symbol: string;
  meaning: string;
}

export const CosmicEnergyAstrolabe: React.FC<CosmicEnergyAstrolabeProps> = ({
  day,
  monthIndex,
  year,
  isReadingMode = false,
}) => {
  const { language } = useLanguage();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [dailyPeakHour, setDailyPeakHour] = useState<string>('12:45');
  const [globalEnergy, setGlobalEnergy] = useState<number>(85);

  // Deterministically generate planetary data for any day
  const getCelestialData = (): CelestialBody[] => {
    const seed = (day * 17 + monthIndex * 31 + year) % 100;
    
    // Moon phase angle
    const moonAngle = (day * 12.4) % 360;
    // Other planets angles
    const sunAngle = (seed * 5 + 45) % 360;
    const mercuryAngle = (seed * 8 + 120) % 360;
    const venusAngle = (seed * 3 + 200) % 360;
    const marsAngle = (seed * 7 + 90) % 360;
    const jupiterAngle = (seed * 2 + 300) % 360;
    const saturnAngle = (seed * 1.2 + 15) % 360;

    const names: Record<string, Record<string, string>> = {
      sun: {
        fr: 'Soleil (Al-Shams)',
        en: 'Sun (Al-Shams)',
        ha: 'Rana (Al-Shams)'
      },
      moon: {
        fr: 'Lune (Al-Qamar)',
        en: 'Moon (Al-Qamar)',
        ha: 'Wata (Al-Qamar)'
      },
      mercury: {
        fr: 'Mercure (Al-Utarid)',
        en: 'Mercury (Al-Utarid)',
        ha: 'Utarid (Al-Utarid)'
      },
      venus: {
        fr: 'Vénus (Al-Zuharah)',
        en: 'Venus (Al-Zuharah)',
        ha: 'Zuharah (Al-Zuharah)'
      },
      mars: {
        fr: 'Mars (Al-Mirrikh)',
        en: 'Mars (Al-Mirrikh)',
        ha: 'Mirrikh (Al-Mirrikh)'
      },
      jupiter: {
        fr: 'Jupiter (Al-Mushtari)',
        en: 'Jupiter (Al-Mushtari)',
        ha: 'Mushtari (Al-Mushtari)'
      },
      saturn: {
        fr: 'Saturne (Al-Zuhal)',
        en: 'Saturn (Al-Zuhal)',
        ha: 'Zuhal (Al-Zuhal)'
      }
    };

    const aspects: Record<string, Record<string, string>> = {
      sun: {
        fr: 'Vitalité Divine & Volonté',
        en: 'Divine Vitality & Will',
        ha: 'Ruhun Rayuwa & Nufin Ubangiji'
      },
      moon: {
        fr: 'Subconscient & Intuition',
        en: 'Subconscious & Intuition',
        ha: 'Zuciyar Ciki & Sanin Gaibu'
      },
      mercury: {
        fr: 'Intellect, Calcul & Écritures',
        en: 'Intellect, Calculation & Writing',
        ha: 'Hankali, Lissafi & Rubutu'
      },
      venus: {
        fr: 'Harmonie & Beauté Spirituelle',
        en: 'Harmony & Spiritual Beauty',
        ha: 'Daidaito & Kyawun Ruhaniya'
      },
      mars: {
        fr: 'Courage, Force & Protection',
        en: 'Courage, Strength & Protection',
        ha: 'Gwarzo, Ƙarfi & Kariya'
      },
      jupiter: {
        fr: 'Sagesse, Bénédiction & Abondance',
        en: 'Wisdom, Blessing & Abundance',
        ha: 'Hikima, Albarka & Yalwa'
      },
      saturn: {
        fr: 'Discipline, Patience & Secrets Anciens',
        en: 'Discipline, Patience & Ancient Secrets',
        ha: 'Horon Kai, Haƙuri & Tsofaffin Asirai'
      }
    };

    const meanings: Record<string, Record<string, string>> = {
      sun: {
        fr: 'Source de lumière créatrice et d\'élévation spirituelle directe.',
        en: 'Source of creative light and direct spiritual elevation.',
        ha: 'Mabuɗin haske mai halitta da ɗaukaka ta ruhaniya kai tsaye.'
      },
      moon: {
        fr: 'Régulateur des marées intérieures et des cycles de l\'Asrar.',
        en: 'Regulator of inner tides and cycles of the Asrar.',
        ha: 'Mai daidaita taguwar ruwa ta ciki da tsarin asirai na Asrar.'
      },
      mercury: {
        fr: 'Facilitateur du calcul jafr et de la compréhension de la grammaire sacrée.',
        en: 'Facilitator of jafr calculation and understanding of sacred grammar.',
        ha: 'Mai sauƙaƙa lissafin jafr da fahimtar ilimin rubutu mai tsarki.'
      },
      venus: {
        fr: 'Vibration de l\'amour inconditionnel, de la paix sociale et des arts sacrés.',
        en: 'Vibration of unconditional love, social peace, and sacred arts.',
        ha: 'Ruhun soyayya mara iyaka, zaman lafiya da fasaha mai tsarki.'
      },
      mars: {
        fr: 'Énergie protectrice permettant de briser les blocages et d\'affirmer la foi.',
        en: 'Protective energy to break blockages and assert faith.',
        ha: 'Ƙarfin kariya don karya tsomoki da tabbatar da imani.'
      },
      jupiter: {
        fr: 'Grand amplificateur des invocations secrètes et de la prospérité licite.',
        en: 'Great amplifier of secret invocations and lawful prosperity.',
        ha: 'Mai haɓaka sirrin addu\'o\'i da wadatar arziki mai halal.'
      },
      saturn: {
        fr: 'Gardien du temps et de la rigueur nécessaire aux longues retraites spirituelles.',
        en: 'Guardian of time and the rigor necessary for long spiritual retreats.',
        ha: 'Mai tsaron lokaci da tarbiyyar da ake buƙata don dogon zikiri.'
      }
    };

    const getT = (obj: Record<string, Record<string, string>>, key: string) => {
      const entry = obj[key];
      if (!entry) return '';
      return entry[language] || entry['fr'] || '';
    };

    return [
      {
        id: 'sun',
        name: getT(names, 'sun'),
        arabicName: 'الشمس',
        aspect: getT(aspects, 'sun'),
        energy: 85 + (seed % 15),
        peakTime: language === 'ha' ? '12:45 (Tsayuwar Rana)' : language === 'en' ? '12:45 (Solar Noon)' : '12:45 (Midi Solaire)',
        color: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.5)',
        radius: 120,
        angle: sunAngle,
        symbol: '☉',
        meaning: getT(meanings, 'sun'),
      },
      {
        id: 'moon',
        name: getT(names, 'moon'),
        arabicName: 'القمر',
        aspect: getT(aspects, 'moon'),
        energy: 78 + ((seed + 12) % 20),
        peakTime: language === 'ha' ? '23:30 (Tsakar Dare)' : language === 'en' ? '23:30 (Mystic Midnight)' : '23:30 (Minuit Mystique)',
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.5)',
        radius: 45,
        angle: moonAngle,
        symbol: '☾',
        meaning: getT(meanings, 'moon'),
      },
      {
        id: 'mercury',
        name: getT(names, 'mercury'),
        arabicName: 'عطارد',
        aspect: getT(aspects, 'mercury'),
        energy: 70 + ((seed + 5) % 25),
        peakTime: language === 'ha' ? '09:15 (Hantsi)' : language === 'en' ? '09:15 (Intellectual Dawn)' : '09:15 (Aube Intellectuelle)',
        color: '#a855f7',
        glowColor: 'rgba(168, 85, 247, 0.5)',
        radius: 70,
        angle: mercuryAngle,
        symbol: '☿',
        meaning: getT(meanings, 'mercury'),
      },
      {
        id: 'venus',
        name: getT(names, 'venus'),
        arabicName: 'الزهرة',
        aspect: getT(aspects, 'venus'),
        energy: 80 + ((seed * 2) % 18),
        peakTime: language === 'ha' ? '17:45 (La\'asar)' : language === 'en' ? '17:45 (Golden Hour)' : '17:45 (Heure Dorée)',
        color: '#ec4899',
        glowColor: 'rgba(236, 72, 153, 0.5)',
        radius: 95,
        angle: venusAngle,
        symbol: '♀',
        meaning: getT(meanings, 'venus'),
      },
      {
        id: 'mars',
        name: getT(names, 'mars'),
        arabicName: 'المريخ',
        aspect: getT(aspects, 'mars'),
        energy: 65 + ((seed * 3) % 30),
        peakTime: language === 'ha' ? '06:00 (Sassafe)' : language === 'en' ? '06:00 (Action Dawn)' : '06:00 (Aurore d\'Action)',
        color: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.5)',
        radius: 145,
        angle: marsAngle,
        symbol: '♂',
        meaning: getT(meanings, 'mars'),
      },
      {
        id: 'jupiter',
        name: getT(names, 'jupiter'),
        arabicName: 'المشتري',
        aspect: getT(aspects, 'jupiter'),
        energy: 88 + (seed % 12),
        peakTime: language === 'ha' ? '15:20 (Yalwar La\'asar)' : language === 'en' ? '15:20 (Asr Blessing)' : '15:20 (Bénédiction d\'Asr)',
        color: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.5)',
        radius: 170,
        angle: jupiterAngle,
        symbol: '♃',
        meaning: getT(meanings, 'jupiter'),
      },
      {
        id: 'saturn',
        name: getT(names, 'saturn'),
        arabicName: 'زحل',
        aspect: getT(aspects, 'saturn'),
        energy: 60 + ((seed + 20) % 25),
        peakTime: language === 'ha' ? '03:15 (Suhuwar Dare)' : language === 'en' ? '03:15 (Night Third)' : '03:15 (Tiers de la Nuit)',
        color: '#64748b',
        glowColor: 'rgba(100, 116, 139, 0.5)',
        radius: 195,
        angle: saturnAngle,
        symbol: '♄',
        meaning: getT(meanings, 'saturn'),
      },
    ];
  };

  const celestialData = getCelestialData();

  useEffect(() => {
    // Dynamically calculate peak times and global energy based on day
    const seed = (day * 13 + monthIndex * 7) % 24;
    const hour = String((seed + 8) % 24).padStart(2, '0');
    const minute = String((seed * 11 + 15) % 60).padStart(2, '0');
    setDailyPeakHour(`${hour}:${minute}`);
    
    const calculatedGlobal = Math.round(75 + ((day * 3 + monthIndex) % 21));
    setGlobalEnergy(calculatedGlobal);

    if (celestialData.length > 0 && !selectedBody) {
      // Default select the Moon or Sun based on day
      setSelectedBody(celestialData[1]); // Moon
    }
  }, [day, monthIndex, year]);

  const currentSelectedBody = celestialData.find(b => b.id === selectedBody?.id) || selectedBody;

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 450;
    const height = 450;
    const cx = width / 2;
    const cy = height / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Definitions for glows and filters
    const defs = svg.append('defs');

    // Create glowing filter for active selections
    const glowFilter = defs.append('filter')
      .attr('id', 'astrolabe-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Subtly colored star background
    const starCount = 35;
    const stars = Array.from({ length: starCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * 180;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      };
    });

    svg.append('g')
      .selectAll('circle')
      .data(stars)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.size)
      .attr('fill', isReadingMode ? '#d97706' : '#fff')
      .attr('opacity', d => d.opacity * (isReadingMode ? 0.35 : 0.65));

    // Outer boundary ring (Sacred Compass border)
    svg.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 215)
      .attr('fill', 'none')
      .attr('stroke', isReadingMode ? '#78350f' : '#334155')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.5);

    // Decorative Compass markers (North, South, East, West)
    const compassPoints = [
      { x: cx, y: cy - 215, text: 'N' },
      { x: cx, y: cy + 222, text: 'S' },
      { x: cx + 215, y: cy + 4, text: 'E' },
      { x: cx - 222, y: cy + 4, text: 'W' }
    ];

    svg.append('g')
      .selectAll('text')
      .data(compassPoints)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('fill', isReadingMode ? '#92400e' : '#475569')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text(d => d.text);

    // Draw concentric orbital rings
    const orbits = [45, 70, 95, 120, 145, 170, 195];
    svg.append('g')
      .selectAll('circle')
      .data(orbits)
      .enter()
      .append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', d => d)
      .attr('fill', 'none')
      .attr('stroke', isReadingMode ? '#78350f' : '#1e293b')
      .attr('stroke-width', d => (d === 120 ? 1.5 : 1)) // Suns orbit slightly thicker
      .attr('stroke-dasharray', d => (d % 2 === 0 ? '4,4' : 'none'))
      .attr('stroke-opacity', d => (isReadingMode ? 0.2 : 0.35));

    // Draw astronomical grid axes (Vertical & Horizontal lines)
    svg.append('line')
      .attr('x1', cx)
      .attr('y1', cy - 210)
      .attr('x2', cx)
      .attr('y2', cy + 210)
      .attr('stroke', isReadingMode ? '#78350f' : '#1e293b')
      .attr('stroke-dasharray', '2,6')
      .attr('stroke-opacity', 0.3);

    svg.append('line')
      .attr('x1', cx - 210)
      .attr('y1', cy)
      .attr('x2', cx + 210)
      .attr('y2', cy)
      .attr('stroke', isReadingMode ? '#78350f' : '#1e293b')
      .attr('stroke-dasharray', '2,6')
      .attr('stroke-opacity', 0.3);

    // Sacred Geometry Connections (Chords between planets)
    const connections: [number, number][] = [
      [0, 1], // Sun - Moon
      [1, 2], // Moon - Mercury
      [0, 3], // Sun - Venus
      [3, 5], // Venus - Jupiter
      [4, 6], // Mars - Saturn
      [2, 5], // Mercury - Jupiter
    ];

    svg.append('g')
      .selectAll('line')
      .data(connections)
      .enter()
      .append('line')
      .attr('x1', d => {
        const p = celestialData[d[0]];
        const rad = (p.angle * Math.PI) / 180;
        return cx + p.radius * Math.cos(rad);
      })
      .attr('y1', d => {
        const p = celestialData[d[0]];
        const rad = (p.angle * Math.PI) / 180;
        return cy + p.radius * Math.sin(rad);
      })
      .attr('x2', d => {
        const p = celestialData[d[1]];
        const rad = (p.angle * Math.PI) / 180;
        return cx + p.radius * Math.cos(rad);
      })
      .attr('y2', d => {
        const p = celestialData[d[1]];
        const rad = (p.angle * Math.PI) / 180;
        return cy + p.radius * Math.sin(rad);
      })
      .attr('stroke', isReadingMode ? '#b45309' : '#4338ca')
      .attr('stroke-opacity', isReadingMode ? 0.15 : 0.25)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Central Mystic Star Core
    svg.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 8)
      .attr('fill', isReadingMode ? '#78350f' : '#0f172a')
      .attr('stroke', isReadingMode ? '#d97706' : '#6366f1')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.85);

    svg.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', 3)
      .attr('fill', isReadingMode ? '#f59e0b' : '#a5b4fc');

    // Draw Celestial Bodies Nodes
    const nodesG = svg.append('g');

    const nodes = nodesG.selectAll('g')
      .data(celestialData)
      .enter()
      .append('g')
      .attr('transform', d => {
        const rad = (d.angle * Math.PI) / 180;
        const x = cx + d.radius * Math.cos(rad);
        const y = cy + d.radius * Math.sin(rad);
        return `translate(${x}, ${y})`;
      })
      .style('cursor', 'pointer');

    // Pulsing aura on selected node or hover
    nodes.append('circle')
      .attr('r', d => (currentSelectedBody?.id === d.id ? 18 : 12))
      .attr('fill', d => d.color)
      .attr('fill-opacity', d => (currentSelectedBody?.id === d.id ? 0.25 : 0.1))
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', d => (currentSelectedBody?.id === d.id ? 0.8 : 0.3))
      .attr('filter', d => (currentSelectedBody?.id === d.id ? 'url(#astrolabe-glow)' : null))
      .attr('class', 'transition-all duration-300');

    // Main solid core node
    nodes.append('circle')
      .attr('r', d => (currentSelectedBody?.id === d.id ? 7 : 5))
      .attr('fill', d => d.color)
      .attr('filter', d => (currentSelectedBody?.id === d.id ? 'url(#astrolabe-glow)' : null));

    // Glyph Symbol of the body
    nodes.append('text')
      .attr('dy', '3.5')
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', d => (currentSelectedBody?.id === d.id ? '9px' : '7px'))
      .attr('font-weight', 'bold')
      .text(d => d.symbol);

    // Dynamic Labels for Planets
    nodes.append('text')
      .attr('dy', d => (d.angle > 90 && d.angle < 270 ? '22' : '-16'))
      .attr('text-anchor', 'middle')
      .attr('fill', d => (currentSelectedBody?.id === d.id ? (isReadingMode ? '#fbbf24' : '#e2e8f0') : (isReadingMode ? '#92400e' : '#64748b')))
      .attr('font-size', d => (currentSelectedBody?.id === d.id ? '9px' : '7px'))
      .attr('font-weight', d => (currentSelectedBody?.id === d.id ? 'bold' : 'normal'))
      .attr('font-family', 'sans-serif')
      .text(d => d.name.split(' ')[0]);

    // Node Interaction
    nodes.on('click', (event, d) => {
      setSelectedBody(d);
    });

    nodes.on('mouseover', function (event, d) {
      d3.select(this).select('circle')
        .transition().duration(200)
        .attr('r', 18)
        .attr('fill-opacity', 0.3)
        .attr('stroke-opacity', 0.9);
    });

    nodes.on('mouseout', function (event, d) {
      if (currentSelectedBody?.id !== d.id) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('r', 12)
          .attr('fill-opacity', 0.1)
          .attr('stroke-opacity', 0.3);
      }
    });

  }, [day, monthIndex, year, currentSelectedBody, isReadingMode]);

  return (
    <div className={`mt-5 rounded-2xl border p-4 transition-all duration-300 ${
      isReadingMode
        ? 'bg-[#151310] border-amber-900/30 text-amber-100'
        : 'bg-gray-50/50 dark:bg-gray-850/30 border-gray-100 dark:border-gray-800/80 text-gray-900 dark:text-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-3 border-b pb-2.5 border-dashed border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-1.5">
          <Activity size={14} className={isReadingMode ? 'text-amber-500' : 'text-purple-500'} />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            {language === 'ha' ? 'Taswirar Kuzarin Sararin Samaniya' : language === 'en' ? 'Circular Energetic Astrolabe' : 'Astrolabe Énergétique Circulaire'}
          </h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            isReadingMode 
              ? 'bg-amber-950/40 text-amber-300 border border-amber-900/30'
              : 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
          }`}>
            {language === 'ha' ? 'Kuzari na gaba daya' : language === 'en' ? 'Global Flow' : 'Flux global'} : {globalEnergy}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* SVG Astrolabe */}
        <div className="md:col-span-7 flex justify-center relative overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 450 450"
            className="w-full max-w-[280px] sm:max-w-[320px] h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          />
        </div>

        {/* Selected Body Information */}
        <div className="md:col-span-5 flex flex-col justify-center">
          {currentSelectedBody ? (
            <div className={`rounded-xl p-3 border transition-all duration-300 ${
              isReadingMode
                ? 'bg-[#1e1a14] border-amber-900/20'
                : 'bg-white dark:bg-gray-900/50 border-gray-100 dark:border-gray-800/50 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentSelectedBody.color }}
                  />
                  <span className={`font-black text-xs sm:text-sm ${isReadingMode ? 'text-amber-200' : 'text-gray-900 dark:text-white'}`}>
                    {currentSelectedBody.name}
                  </span>
                </div>
                <span className="text-base font-serif font-bold text-emerald-600 dark:text-emerald-400" dir="rtl">
                  {currentSelectedBody.arabicName}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className={isReadingMode ? 'text-amber-400/70 font-medium' : 'text-gray-400 dark:text-gray-500 font-medium'}>
                    {language === 'ha' ? 'Hasken Ruhaniya :' : language === 'en' ? 'Spiritual Aspect:' : 'Aspect Spirituel :'}
                  </span>
                  <p className={`font-semibold ${isReadingMode ? 'text-amber-100' : 'text-gray-800 dark:text-gray-200'}`}>
                    {currentSelectedBody.aspect}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className={isReadingMode ? 'text-amber-400/70 font-medium' : 'text-gray-400 dark:text-gray-500 font-medium'}>
                      {language === 'ha' ? 'Karfi :' : language === 'en' ? 'Intensity:' : 'Intensité :'}
                    </span>
                    <p className={`font-extrabold ${isReadingMode ? 'text-amber-300' : 'text-purple-600 dark:text-purple-400'}`}>
                      {currentSelectedBody.energy}%
                    </p>
                  </div>
                  <div>
                    <span className={isReadingMode ? 'text-amber-400/70 font-medium' : 'text-gray-400 dark:text-gray-500 font-medium'}>
                      {language === 'ha' ? 'Lokacin Kololuwa :' : language === 'en' ? 'Peak Time:' : 'Pic Horaire :'}
                    </span>
                    <p className={`font-semibold ${isReadingMode ? 'text-amber-100' : 'text-gray-800 dark:text-gray-200'}`}>
                      {currentSelectedBody.peakTime.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <div className={`mt-2 pt-2 border-t border-dashed ${isReadingMode ? 'border-amber-900/30' : 'border-gray-100 dark:border-gray-800'}`}>
                  <p className={`text-[11px] leading-relaxed italic ${isReadingMode ? 'text-amber-200/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    "{currentSelectedBody.meaning}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-6 text-xs">
              {language === 'ha' ? 'Danna kan tauraro don ganin tasirinsa na ruhaniya.' : language === 'en' ? 'Click on a celestial body to reveal its vibrational influences.' : 'Cliquez sur un astre pour révéler ses influences vibratoires.'}
            </div>
          )}

          {/* Daily General Energy Peaks */}
          <div className={`mt-3 rounded-xl p-3 border text-xs ${
            isReadingMode
              ? 'bg-[#181512] border-amber-900/10'
              : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800 dark:text-emerald-300'
          }`}>
            <span className="font-extrabold uppercase tracking-widest text-[9px] block mb-1 flex items-center gap-1">
              <Sparkles size={10} className="text-amber-500" />
              {language === 'ha' ? 'Lokacin Kololuwar Hasken Rana' : language === 'en' ? 'Cosmic Energy Peak of the Day' : "Pic d'Énergie Cosmique du Jour"}
            </span>
            <p className="leading-relaxed">
              {language === 'ha' ? (
                <>A yau, ana sa ran kololuwar daidaiton taurari a <strong className="font-extrabold">{dailyPeakHour}</strong>. Wannan lokacin yana da matukar kyau don yin zikiri, wirdi, da neman hasken ruhaniya.</>
              ) : language === 'en' ? (
                <>Today, the maximal celestial alignment is expected at <strong className="font-extrabold">{dailyPeakHour}</strong>. This moment is particularly auspicious for introspection, wird, and seeking illumination.</>
              ) : (
                <>Aujourd'hui, l'alignement céleste maximal est prévu à <strong className="font-extrabold">{dailyPeakHour}</strong>. Ce moment est particulièrement propice à l'introspection, au wird et aux demandes d'illumination.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
