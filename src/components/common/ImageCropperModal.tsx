import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Check,
  X,
  Maximize2,
  Sliders,
  Sparkles,
  Info,
  Circle,
  Square,
  RectangleHorizontal,
  RectangleVertical
} from 'lucide-react';

export type AspectRatioOption = 'free' | '16:9' | '4:3' | '1:1' | '3:2' | '9:16' | '2:1' | 'circle';

export interface ImageCropResult {
  dataUrl: string;
  width: number;
  height: number;
  format: 'image/png' | 'image/jpeg' | 'image/webp';
}

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt?: string;
  onClose: () => void;
  onCropComplete: (result: ImageCropResult) => void;
  title?: string;
  initialAspectRatio?: AspectRatioOption;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  imageAlt = 'Image',
  onClose,
  onCropComplete,
  title = "Recadrer & Ajuster l'image",
  initialAspectRatio = 'free',
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [fineRotation, setFineRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [exportQuality, setExportQuality] = useState<number>(0.92);

  // Image loading state
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Crop rectangle in percentages relative to container [0 - 100]
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragModeRef = useRef<'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e' | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialBox: typeof cropBox }>({
    startX: 0,
    startY: 0,
    initialBox: { x: 10, y: 10, width: 80, height: 80 },
  });

  // Calculate target ratio numeric value
  const getNumericRatio = useCallback((ratio: AspectRatioOption): number | null => {
    switch (ratio) {
      case '16:9': return 16 / 9;
      case '4:3': return 4 / 3;
      case '1:1':
      case 'circle': return 1;
      case '3:2': return 3 / 2;
      case '9:16': return 9 / 16;
      case '2:1': return 2 / 1;
      case 'free':
      default: return null;
    }
  }, []);

  // Update crop box when aspect ratio changes
  const applyAspectRatio = useCallback((ratio: AspectRatioOption) => {
    setAspectRatio(ratio);
    const targetRatio = getNumericRatio(ratio);
    if (!targetRatio || !containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const containerRatio = container.width / container.height;

    let newWidth = 80;
    let newHeight = 80;

    if (targetRatio > containerRatio) {
      // Wider than container
      newWidth = 85;
      newHeight = Math.min(85, (newWidth / targetRatio) * containerRatio);
    } else {
      // Taller than container
      newHeight = 85;
      newWidth = Math.min(85, (newHeight * targetRatio) / containerRatio);
    }

    const newX = Math.max(0, (100 - newWidth) / 2);
    const newY = Math.max(0, (100 - newHeight) / 2);

    setCropBox({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  }, [getNumericRatio]);

  // Load image whenever imageSrc changes
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    setImageLoaded(false);
    setImageError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      // Reset adjustments
      setZoom(1);
      setRotation(0);
      setFineRotation(0);
      setFlipH(false);
      setFlipV(false);
      applyAspectRatio(aspectRatio);
    };
    img.onerror = () => {
      // Try loading without crossOrigin if CORS rejected it
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setNaturalSize({ width: fallbackImg.naturalWidth, height: fallbackImg.naturalHeight });
        setImageLoaded(true);
      };
      fallbackImg.onerror = () => {
        setImageError("Impossible de charger l'image pour le recadrage (vérifiez l'URL ou les autorisations réseau).");
      };
      fallbackImg.src = imageSrc;
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc, aspectRatio, applyAspectRatio]);

  // Handle Drag / Resize events
  const handlePointerDown = (mode: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'w' | 'e', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    dragModeRef.current = mode;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...cropBox },
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !dragModeRef.current || !containerRef.current) return;
    e.preventDefault();

    const container = containerRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragStartRef.current.startX) / container.width) * 100;
    const deltaYPercent = ((e.clientY - dragStartRef.current.startY) / container.height) * 100;
    const init = dragStartRef.current.initialBox;
    const mode = dragModeRef.current;
    const numericRatio = getNumericRatio(aspectRatio);
    const containerAspect = container.width / container.height;

    let nextBox = { ...cropBox };

    if (mode === 'move') {
      let nextX = init.x + deltaXPercent;
      let nextY = init.y + deltaYPercent;
      nextX = Math.max(0, Math.min(nextX, 100 - init.width));
      nextY = Math.max(0, Math.min(nextY, 100 - init.height));
      nextBox = { ...init, x: nextX, y: nextY };
    } else {
      let x = init.x;
      let y = init.y;
      let w = init.width;
      let h = init.height;

      // Handle individual directions
      if (mode.includes('e')) {
        w = Math.max(10, Math.min(100 - init.x, init.width + deltaXPercent));
      }
      if (mode.includes('s')) {
        h = Math.max(10, Math.min(100 - init.y, init.height + deltaYPercent));
      }
      if (mode.includes('w')) {
        const potentialW = init.width - deltaXPercent;
        if (potentialW >= 10 && init.x + deltaXPercent >= 0) {
          w = potentialW;
          x = init.x + deltaXPercent;
        }
      }
      if (mode.includes('n')) {
        const potentialH = init.height - deltaYPercent;
        if (potentialH >= 10 && init.y + deltaYPercent >= 0) {
          h = potentialH;
          y = init.y + deltaYPercent;
        }
      }

      // Enforce aspect ratio if active
      if (numericRatio) {
        if (mode === 'e' || mode === 'w' || mode === 'ne' || mode === 'nw') {
          h = Math.max(10, Math.min(100 - y, (w / numericRatio) * containerAspect));
        } else {
          w = Math.max(10, Math.min(100 - x, (h * numericRatio) / containerAspect));
        }
      }

      nextBox = { x, y, width: w, height: h };
    }

    setCropBox(nextBox);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    dragModeRef.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Perform Canvas Crop Render
  const handlePerformCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;

    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const container = containerRef.current.getBoundingClientRect();

      // Effective crop rectangle in pixels inside container
      const cropPixelX = (cropBox.x / 100) * container.width;
      const cropPixelY = (cropBox.y / 100) * container.height;
      const cropPixelW = (cropBox.width / 100) * container.width;
      const cropPixelH = (cropBox.height / 100) * container.height;

      // Target canvas output size (scaled up for high-res crispness)
      const scaleFactor = Math.max(1, (naturalSize.width || 800) / container.width);
      const outWidth = Math.round(cropPixelW * scaleFactor);
      const outHeight = Math.round(cropPixelH * scaleFactor);

      canvas.width = outWidth;
      canvas.height = outHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // If circle crop, clip to circle
      if (aspectRatio === 'circle') {
        ctx.beginPath();
        ctx.arc(outWidth / 2, outHeight / 2, Math.min(outWidth, outHeight) / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      // Draw transformed image
      ctx.save();
      // Translate to center of crop
      ctx.translate(-cropPixelX * scaleFactor, -cropPixelY * scaleFactor);

      // Handle container center for transforms
      const containerCenterX = (container.width / 2) * scaleFactor;
      const containerCenterY = (container.height / 2) * scaleFactor;

      ctx.translate(containerCenterX, containerCenterY);
      const totalRotation = ((rotation + fineRotation) * Math.PI) / 180;
      ctx.rotate(totalRotation);
      ctx.scale(flipH ? -zoom : zoom, flipV ? -zoom : zoom);
      ctx.translate(-containerCenterX, -containerCenterY);

      // Draw original image centered in container
      const imgAspect = naturalSize.width / naturalSize.height;
      const contAspect = container.width / container.height;
      let drawW = container.width * scaleFactor;
      let drawH = container.height * scaleFactor;

      if (imgAspect > contAspect) {
        drawH = drawW / imgAspect;
      } else {
        drawW = drawH * imgAspect;
      }

      const drawX = (container.width * scaleFactor - drawW) / 2;
      const drawY = (container.height * scaleFactor - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL(exportFormat, exportQuality);

      onCropComplete({
        dataUrl: croppedDataUrl,
        width: outWidth,
        height: outHeight,
        format: exportFormat,
      });

      onClose();
    } catch (err) {
      console.error('Error during canvas crop:', err);
      setImageError("Une erreur est survenue lors de l'exportation du recadrage.");
    }
  };

  const handleResetAdjustments = () => {
    setZoom(1);
    setRotation(0);
    setFineRotation(0);
    setFlipH(false);
    setFlipV(false);
    applyAspectRatio(aspectRatio);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-850/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Crop size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {imageAlt} {naturalSize.width > 0 && `• Original: ${naturalSize.width} × ${naturalSize.height}px`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetAdjustments}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Réinitialiser les ajustements"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center">
          
          {/* Main Visual Cropping Workspace */}
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            {imageError ? (
              <div className="w-full h-72 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex flex-col items-center justify-center p-6 text-center text-red-600 dark:text-red-400">
                <Info size={32} className="mb-2" />
                <p className="text-sm font-semibold">{imageError}</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div
                ref={containerRef}
                className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[16/10] bg-gray-950 rounded-2xl overflow-hidden shadow-inner border border-gray-800 flex items-center justify-center cursor-crosshair touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {/* Target Image under transforms */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt={imageAlt}
                  crossOrigin="anonymous"
                  style={{
                    transform: `rotate(${rotation + fineRotation}deg) scale(${flipH ? -zoom : zoom}, ${flipV ? -zoom : zoom})`,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                  }}
                  className="select-none"
                />

                {/* Dark Mask Layer over non-cropped areas */}
                {imageLoaded && (
                  <>
                    {/* Dark overlay with SVG cutout hole */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                      <defs>
                        <mask id="crop-mask">
                          <rect width="100%" height="100%" fill="white" />
                          {aspectRatio === 'circle' ? (
                            <ellipse
                              cx={`${cropBox.x + cropBox.width / 2}%`}
                              cy={`${cropBox.y + cropBox.height / 2}%`}
                              rx={`${cropBox.width / 2}%`}
                              ry={`${cropBox.height / 2}%`}
                              fill="black"
                            />
                          ) : (
                            <rect
                              x={`${cropBox.x}%`}
                              y={`${cropBox.y}%`}
                              width={`${cropBox.width}%`}
                              height={`${cropBox.height}%`}
                              fill="black"
                              rx={4}
                            />
                          )}
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.65)"
                        mask="url(#crop-mask)"
                      />
                    </svg>

                    {/* Interactive Crop Frame Box */}
                    <div
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.width}%`,
                        height: `${cropBox.height}%`,
                        borderRadius: aspectRatio === 'circle' ? '9999px' : '6px',
                      }}
                      className="absolute z-20 border-2 border-emerald-400 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_4px_16px_rgba(0,0,0,0.4)] cursor-move touch-none"
                      onPointerDown={(e) => handlePointerDown('move', e)}
                    >
                      {/* Grid Lines (Rule of Thirds) */}
                      {aspectRatio !== 'circle' && (
                        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-40">
                          <div className="border-r border-b border-white/60" />
                          <div className="border-r border-b border-white/60" />
                          <div className="border-b border-white/60" />
                          <div className="border-r border-b border-white/60" />
                          <div className="border-r border-b border-white/60" />
                          <div className="border-b border-white/60" />
                          <div className="border-r border-white/60" />
                          <div className="border-r border-white/60" />
                          <div />
                        </div>
                      )}

                      {/* Dimension Badge in Center */}
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono font-bold text-emerald-300 pointer-events-none shadow-xs">
                        {Math.round((cropBox.width / 100) * (naturalSize.width || 500))} × {Math.round((cropBox.height / 100) * (naturalSize.height || 500))}px
                      </div>

                      {/* Corner & Edge Handles */}
                      <div
                        onPointerDown={(e) => handlePointerDown('nw', e)}
                        className="absolute -top-2 -left-2 w-5 h-5 bg-white border-2 border-emerald-500 rounded-sm shadow-md cursor-nwse-resize z-30"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDown('ne', e)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-white border-2 border-emerald-500 rounded-sm shadow-md cursor-nesw-resize z-30"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDown('sw', e)}
                        className="absolute -bottom-2 -left-2 w-5 h-5 bg-white border-2 border-emerald-500 rounded-sm shadow-md cursor-nesw-resize z-30"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDown('se', e)}
                        className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-emerald-500 rounded-sm shadow-md cursor-nwse-resize z-30"
                      />

                      {/* Edge Centers for Freeform */}
                      {aspectRatio === 'free' && (
                        <>
                          <div
                            onPointerDown={(e) => handlePointerDown('n', e)}
                            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border-2 border-emerald-500 rounded-xs shadow-md cursor-ns-resize z-30"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown('s', e)}
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border-2 border-emerald-500 rounded-xs shadow-md cursor-ns-resize z-30"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown('w', e)}
                            className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-8 w-3 bg-white border-2 border-emerald-500 rounded-xs shadow-md cursor-ew-resize z-30"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown('e', e)}
                            className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-8 w-3 bg-white border-2 border-emerald-500 rounded-xs shadow-md cursor-ew-resize z-30"
                          />
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quick Helper Text */}
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              Faites glisser les poignées pour dimensionner • Déplacez le cadre pour ajuster la zone
            </p>
          </div>

          {/* Right Control Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            
            {/* 1. Aspect Ratio Presets */}
            <div className="bg-gray-50 dark:bg-gray-800/80 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/80">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Proportions</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{aspectRatio.toUpperCase()}</span>
              </label>
              
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'free', label: 'Libre', icon: Maximize2 },
                  { id: '16:9', label: '16:9', icon: RectangleHorizontal },
                  { id: '4:3', label: '4:3', icon: RectangleHorizontal },
                  { id: '1:1', label: '1:1', icon: Square },
                  { id: '3:2', label: '3:2', icon: RectangleHorizontal },
                  { id: '9:16', label: '9:16', icon: RectangleVertical },
                  { id: '2:1', label: 'Bannière', icon: RectangleHorizontal },
                  { id: 'circle', label: 'Rond', icon: Circle },
                ].map((item) => {
                  const isSelected = aspectRatio === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => applyAspectRatio(item.id as AspectRatioOption)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-400'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="text-[10px] leading-none">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Transformation Tools (Zoom, Rotate, Mirror) */}
            <div className="bg-gray-50 dark:bg-gray-800/80 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Ajustements & Rotation
              </label>

              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1"><ZoomIn size={14} /> Zoom</span>
                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
                    className="p-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 text-gray-700 dark:text-gray-300"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-600 cursor-pointer h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                    className="p-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 text-gray-700 dark:text-gray-300"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>

              {/* Rotation buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="py-1.5 px-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-emerald-500 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Tourner de -90°"
                >
                  <RotateCcw size={14} /> -90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="py-1.5 px-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-emerald-500 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Tourner de +90°"
                >
                  <RotateCw size={14} /> +90°
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                    flipH 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                  title="Miroir Horizontal"
                >
                  <FlipHorizontal size={14} /> Miroir H
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                    flipV 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                  title="Miroir Vertical"
                >
                  <FlipVertical size={14} /> Miroir V
                </button>
              </div>

              {/* Fine rotation angle */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Ajustement fin angle</span>
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{fineRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={fineRotation}
                  onChange={(e) => setFineRotation(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg"
                />
              </div>
            </div>

            {/* 3. Output Format Options */}
            <div className="bg-gray-50 dark:bg-gray-800/80 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/80 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Format d'export :</span>
              <div className="flex gap-1 bg-white dark:bg-gray-700 p-0.5 rounded-xl border border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => setExportFormat('image/png')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    exportFormat === 'image/png' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat('image/jpeg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    exportFormat === 'image/jpeg' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  JPEG
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-850/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handlePerformCrop}
            disabled={!imageLoaded || !!imageError}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check size={18} />
            <span>Valider et Recadrer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
