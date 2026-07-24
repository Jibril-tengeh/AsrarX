import React, { useState, useRef } from 'react';
import { Star, ArrowLeft, RefreshCw, Calculator, Grid, Type, Download, Share2, FileDown, Image, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ToolInfoTooltip } from '../../../components/ToolInfoTooltip';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAbjadValue } from '../../../utils/abjad';
import { toCanvas, toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

import { downloadCanvasImage } from '../../../utils/downloadHelper';

export const KhatimGenerator: React.FC = () => {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [gridSize, setGridSize] = useState<number>(3);
  const [grid, setGrid] = useState<number[][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calculatedTotal, setCalculatedTotal] = useState<number>(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
      await downloadCanvasImage(canvas, `khatim-${gridSize}x${gridSize}.png`);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadTransparentPNG = async () => {
    if (!resultRef.current) return;
    try {
      const url = await toPng(resultRef.current, { 
        backgroundColor: null,
        skipFonts: true,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
        }
      });
      const link = document.createElement('a');
      link.download = `khatim-${gridSize}x${gridSize}-transparent.png`;
      link.href = url;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  const downloadSVG = async () => {
    if (!resultRef.current) return;
    try {
      const url = await toSvg(resultRef.current, {
        backgroundColor: null,
        skipFonts: true,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
        }
      });
      const link = document.createElement('a');
      link.download = `khatim-${gridSize}x${gridSize}.svg`;
      link.href = url;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, 210, 297, 'F');
      
      pdf.setTextColor(17, 24, 39);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text("AsrarHub - Khatim Sacre", 105, 30, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Khatim ${gridSize}x${gridSize} (Poids Mystique: ${calculatedTotal})`, 105, 42, { align: 'center' });
      
      const imgWidth = 120;
      const imgHeight = 120;
      const x = (210 - imgWidth) / 2;
      const y = 60;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Inscrivez ce Khatim sacre avec de l'encre de safran et de l'eau de rose", 105, 200, { align: 'center' });
      pdf.text("lors de l'heure planetaire correspondante a votre intention.", 105, 206, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.text("Genere via AsrarHub. Tous droits reserves.", 105, 280, { align: 'center' });
      
      pdf.save(`AsrarHub_Khatim_${gridSize}x${gridSize}_${calculatedTotal}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  const shareResult = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await toCanvas(resultRef.current, { backgroundColor: '#18181b', skipFonts: true });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `khatim-${gridSize}x${gridSize}.png`, { type: 'image/png' });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: t('tools.khatim.title', 'Khatim Généré'),
            text: t('tools.khatim.shareText', 'Voici mon Khatim généré.'),
            files: [file]
          });
        } else {
          alert(t('tools.khatim.shareNotSupported', "Le partage direct n'est pas supporté sur ce navigateur."));
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const oddMagicSquare = (n: number): number[][] => {
    const grid = Array.from({ length: n }, () => Array(n).fill(0));
    let r = 0;
    let c = Math.floor(n / 2);
    for (let num = 1; num <= n * n; num++) {
      grid[r][c] = num;
      let nextR = (r - 1 + n) % n;
      let nextC = (c + 1) % n;
      if (grid[nextR][nextC] !== 0) {
        r = (r + 1) % n;
      } else {
        r = nextR;
        c = nextC;
      }
    }
    return grid;
  };

  const doublyEvenMagicSquare = (n: number): number[][] => {
    const grid = Array.from({ length: n }, () => Array(n).fill(0));
    let num = 1;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const isDiagonal = (i % 4 === j % 4) || ((i % 4) + (j % 4) === 3);
        if (isDiagonal) {
          grid[i][j] = n * n + 1 - num;
        } else {
          grid[i][j] = num;
        }
        num++;
      }
    }
    return grid;
  };

  const singlyEvenMagicSquare = (n: number): number[][] => {
    const k = n / 2;
    const grid = Array.from({ length: n }, () => Array(n).fill(0));
    const sub = oddMagicSquare(k);
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < k; j++) {
        grid[i][j] = sub[i][j];
        grid[i + k][j + k] = sub[i][j] + k * k;
        grid[i][j + k] = sub[i][j] + 2 * k * k;
        grid[i + k][j] = sub[i][j] + 3 * k * k;
      }
    }
    const m = Math.floor(k / 2);
    for (let i = 0; i < k; i++) {
      for (let j = 0; j < m; j++) {
        let swapCol = j;
        if (i === m && j === 0) swapCol = m;
        const temp = grid[i][swapCol];
        grid[i][swapCol] = grid[i + k][swapCol];
        grid[i + k][swapCol] = temp;
      }
    }
    for (let i = 0; i < k; i++) {
      for (let j = k - (m - 1); j < k; j++) {
        const temp = grid[i][j + k];
        grid[i][j + k] = grid[i + k][j + k];
        grid[i + k][j + k] = temp;
      }
    }
    return grid;
  };

  const getMagicSquare = (n: number): number[][] => {
    if (n % 2 !== 0) return oddMagicSquare(n);
    if (n % 4 === 0) return doublyEvenMagicSquare(n);
    return singlyEvenMagicSquare(n);
  };

  const generateKhatimGrid = (n: number, total: number) => {
    const stdSum = (n * (n * n + 1)) / 2;
    if (total < stdSum) {
      throw new Error(
        t('tools.khatim.errorMin', 'Le poids calculé ({total}) est trop petit pour un Khatim de taille {size}x{size}. Le minimum requis est {min}.')
          .replace('{total}', String(total))
          .replace('{size}', String(n))
          .replace('{min}', String(stdSum))
      );
    }

    const base = total - stdSum;
    const step = Math.floor(base / n);
    const rem = base % n;

    const stdGrid = getMagicSquare(n);
    const customGrid = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let val = stdGrid[i][j] + step;
        if (rem > 0 && ((i - j + n) % n < rem)) {
          val += 1;
        }
        customGrid[i][j] = val;
      }
    }
    return customGrid;
  };

  const generateKhatim = () => {
    setError(null);
    try {
      let n = 0;
      // If it's a pure number, use it. Otherwise, calculate abjad.
      if (/^\d+$/.test(inputText.trim())) {
        n = parseInt(inputText, 10);
      } else {
        n = calculateAbjadValue(inputText);
      }

      if (n === 0) throw new Error(t('tools.khatim.errorEmpty', 'Veuillez entrer un nombre ou un texte en arabe.'));

      setCalculatedTotal(n);
      
      let stats; try { stats = JSON.parse(localStorage.getItem('asrar_stats') || '{}'); if (!stats || typeof stats !== 'object') stats = {}; } catch(e) { stats = {}; }
      stats.tools_used = (stats.tools_used || 0) + 1;
      localStorage.setItem('asrar_stats', JSON.stringify(stats));

      const newGrid = generateKhatimGrid(gridSize, n);
      setGrid(newGrid);

    } catch (err: any) {
      setError(err.message);
      setGrid(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, bounce: 0.5 } }
  };

  const gridColsClassMap: Record<number, string> = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
  };

  const textPercentSizeMap: Record<number, string> = {
    3: 'text-2xl sm:text-3xl',
    4: 'text-xl sm:text-2xl',
    5: 'text-lg sm:text-xl',
    6: 'text-base sm:text-lg',
    7: 'text-xs sm:text-sm',
    8: 'text-[11px] sm:text-xs',
    9: 'text-[10px] sm:text-[11px]',
    10: 'text-[9px] sm:text-[10px]',
  };

  const gridCellPaddingMap: Record<number, string> = {
    3: 'p-2 sm:p-4 aspect-square',
    4: 'p-2 sm:p-3 aspect-square',
    5: 'p-1.5 sm:p-2.5 aspect-square',
    6: 'p-1 sm:p-2 aspect-square',
    7: 'p-1 aspect-square',
    8: 'p-0.5 sm:p-1 aspect-square',
    9: 'p-0.5 aspect-square',
    10: 'p-0.5 aspect-square',
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-pt max-h-[85vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <Link 
          to="/tools" 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="text-purple-500 shrink-0" />
            <span className="truncate">{t('tools.khatim.dynamicTitle', 'Générateur de Khatim Dynamique')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t("tools.khatim.description")}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-0.5">

      <div className="bg-purple-900/10 border border-purple-800/30 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <p className="text-sm text-purple-800 dark:text-purple-200 font-medium leading-relaxed relative z-10">
          {t('tools.khatim.instructions', 'Entrez un texte en arabe (pour calculer son Poids Mystique) ou directement une valeur numérique. Choisissez le type de sceau pour le générer.')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 relative z-20">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Type size={16} /> {t('tools.khatim.inputLabel', 'Texte (Arabe) ou Nombre')}
          </label>
          <input
            type="text"
            dir="auto"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('tools.khatim.placeholder', "Ex: جلب رزق ou 66")}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-arabic"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Grid size={16} /> {t('tools.khatim.dimensionLabel', 'Dimension du Sceau (Khatim)')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { size: 3, name: 'Muthallath' },
              { size: 4, name: 'Murabba\'' },
              { size: 5, name: 'Mukhammas' },
              { size: 6, name: 'Musaddas' },
              { size: 7, name: 'Musabba\'' },
              { size: 8, name: 'Muthamman' },
              { size: 9, name: 'Mutassa\'' },
              { size: 10, name: 'Mu\'ashshar' }
            ].map(({ size, name }) => (
              <button
                key={size}
                type="button"
                onClick={() => setGridSize(size)}
                className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${gridSize === size ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
              >
                <span className="truncate">{name}</span>
                <span className={`text-[10px] ${gridSize === size ? 'text-purple-200' : 'text-gray-400 dark:text-gray-500'}`}>({size}x{size})</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateKhatim}
          className="w-full h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white font-bold transition-transform hover:scale-102 active:scale-98 shadow-lg flex items-center justify-center gap-2 tracking-wide cursor-pointer"
        >
          <Grid size={20} /> {t('tools.khatim.generateButton', 'GÉNÉRER LE KHATIM')}
        </button>
        
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-sm mt-4 font-bold bg-red-50/50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-8">
        <ToolInfoTooltip toolId="khatim" />
      </div>

      <AnimatePresence>
        {grid && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative flex flex-col items-center gap-6"
          >
            <div ref={resultRef} className="bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-zinc-800 mx-auto max-w-md relative overflow-hidden w-full">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
               
               {/* AsrarHub Watermarks in 4 corners */}
               <div className="absolute top-2 left-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                 AsrarHub
               </div>
               <div className="absolute top-2 right-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                 AsrarHub
               </div>
               <div className="absolute bottom-2 left-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                 AsrarHub
               </div>
               <div className="absolute bottom-2 right-3 text-[10px] font-bold tracking-widest text-purple-400/30 pointer-events-none select-none uppercase">
                 AsrarHub
               </div>

               {/* AsrarHub Logo Header */}
               <div className="flex justify-center mb-4 relative z-10">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black tracking-widest uppercase shadow-sm">
                   <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                   <span>AsrarHub</span>
                 </div>
               </div>

               <div className="text-center mb-6 relative z-10">
                <span className="inline-block border-2 border-purple-500/50 text-purple-400 px-6 py-2 rounded-full text-sm font-black tracking-[0.3em] bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  {t('tools.khatim.totalWeight', 'POIDS TOTAL')} : {calculatedTotal}
                </span>
              </div>
              
              <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
                <div className="min-w-[280px] max-w-full mx-auto">
                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className={`grid gap-1.5 sm:gap-2.5 relative z-10 ${gridColsClassMap[gridSize] || 'grid-cols-3'}`}
                  >
                    {/* Horizontal & Vertical internal lines simulating ancient draw only for 3x3 */}
                    {gridSize === 3 && (
                      <>
                        <div className="absolute top-1/3 left-0 right-0 h-1 bg-zinc-800/50 rounded-full"></div>
                        <div className="absolute top-2/3 left-0 right-0 h-1 bg-zinc-800/50 rounded-full"></div>
                        <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full"></div>
                        <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full"></div>
                      </>
                    )}

                    {grid.map((row, i) => (
                      row.map((val, j) => (
                        <motion.div 
                          key={`${i}-${j}`}
                          variants={item}
                          className={`${gridCellPaddingMap[gridSize] || 'p-2 aspect-square'} bg-zinc-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center relative group`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                          <span className={`font-black text-white tabular-nums drop-shadow-md z-10 ${textPercentSizeMap[gridSize] || 'text-xl'}`}>
                            {val}
                          </span>
                        </motion.div>
                      ))
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="text-center mt-8 relative z-10 border-t border-zinc-800 pt-3">
                 <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-1">{t('tools.khatim.sacredHarmony', 'Harmonie Sacrée')}</p>
                 <p className="text-xs text-zinc-400 mb-2">{t('tools.khatim.rowsColsDesc', 'Lignes et colonnes')} = {calculatedTotal} {calculatedTotal % gridSize !== 0 && t('tools.khatim.diagonalsNote', "(Les diagonales peuvent légèrement varier s'il y a un reste)")}</p>
                 <p className="text-[10px] font-bold tracking-widest text-purple-400/60 uppercase">AsrarHub • Science des Lettres & Wafq</p>
              </div>
            </div>
            
            <div className="mt-8 bg-zinc-900/50 backdrop-blur-sm p-6 rounded-3xl border border-zinc-800 w-full relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Espace de Téléchargement & Exportation (Wafq)
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={downloadImage}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <Image size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold">PNG HD (Sombre)</span>
                  <span className="text-[10px] text-zinc-400">Pour affichage écran</span>
                </button>
                <button 
                  onClick={downloadTransparentPNG}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <Download size={18} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  <span className="text-xs font-bold">PNG Transparent</span>
                  <span className="text-[10px] text-zinc-400">Pour travaux d'écriture</span>
                </button>
                <button 
                  onClick={downloadSVG}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <FileDown size={18} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-xs font-bold">Vecteur SVG</span>
                  <span className="text-[10px] text-zinc-400">Agrandissement infini</span>
                </button>
                <button 
                  onClick={downloadPDF}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center group border border-zinc-700/50"
                >
                  <FileDown size={18} className="text-red-400 group-hover:text-red-300 transition-colors" />
                  <span className="text-xs font-bold">PDF Imprimable</span>
                  <span className="text-[10px] text-zinc-400">Prêt pour l'impression A4</span>
                </button>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800/80">
                <button 
                  onClick={shareResult}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 text-xs font-bold transition-all shadow-md cursor-pointer ml-auto"
                >
                  <Share2 size={14} />
                  <span>Partager le Khatim</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};
