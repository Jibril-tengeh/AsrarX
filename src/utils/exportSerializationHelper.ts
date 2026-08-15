import { toCanvas } from 'html-to-image';

/**
 * Helper callback to ensure all <canvas> and <svg> elements
 * are properly prepared for serialization into the exported image file.
 */
export function prepareClonedDOMForCanvas(origEl: HTMLElement, clonedEl: HTMLElement, clonedDoc: Document) {
  // 1. Convert all <canvas> elements to data URL <img> tags in cloned DOM
  const origCanvases = origEl.querySelectorAll('canvas');
  const clonedCanvases = clonedEl.querySelectorAll('canvas');

  origCanvases.forEach((origCanvas, idx) => {
    const clonedCanvas = clonedCanvases[idx];
    if (clonedCanvas) {
      try {
        const dataUrl = origCanvas.toDataURL('image/png');
        const img = clonedDoc.createElement('img');
        img.src = dataUrl;
        img.style.cssText = origCanvas.style.cssText;
        img.style.display = origCanvas.style.display || 'inline-block';
        if (origCanvas.width) img.width = origCanvas.width;
        if (origCanvas.height) img.height = origCanvas.height;
        img.className = origCanvas.className;
        clonedCanvas.parentNode?.replaceChild(img, clonedCanvas);
      } catch (e) {
        console.warn('[ExportHelper] Canvas serialization fallback:', e);
      }
    }
  });

  // 2. Ensure all <svg> elements have explicit dimensions and xmlns attributes
  const origSvgs = origEl.querySelectorAll('svg');
  const clonedSvgs = clonedEl.querySelectorAll('svg');

  origSvgs.forEach((origSvg, idx) => {
    const clonedSvg = clonedSvgs[idx];
    if (clonedSvg) {
      if (!clonedSvg.getAttribute('xmlns')) {
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }
      const rect = origSvg.getBoundingClientRect();
      if (rect.width > 0 && !clonedSvg.getAttribute('width')) {
        clonedSvg.setAttribute('width', `${Math.ceil(rect.width)}`);
      }
      if (rect.height > 0 && !clonedSvg.getAttribute('height')) {
        clonedSvg.setAttribute('height', `${Math.ceil(rect.height)}`);
      }
    }
  });
}

/**
 * High-quality export helper using html-to-image with full modern CSS support
 * (oklab, oklch, gradients, shadows) and multi-tier fallbacks.
 */
export async function exportElementToCanvas(
  element: HTMLElement,
  backgroundColor = '#0c0a09',
  options?: { pixelRatio?: number; cacheBust?: boolean; quality?: number; width?: number; height?: number }
): Promise<HTMLCanvasElement> {
  const pixelRatio = options?.pixelRatio ?? 2;
  const quality = options?.quality ?? 0.98;

  // Calculate true unconstrained dimensions to avoid clipping tall content or adding artificial horizontal gaps
  const boundingWidth = element.getBoundingClientRect().width;
  const width = Math.ceil(
    Math.max(
      options?.width ?? 0,
      element.scrollWidth,
      element.offsetWidth,
      element.clientWidth,
      boundingWidth
    )
  );
  const boundingHeight = element.getBoundingClientRect().height;
  const height = Math.ceil(
    Math.max(
      options?.height ?? 0,
      element.scrollHeight,
      element.offsetHeight,
      element.clientHeight,
      boundingHeight
    )
  );

  const renderStyle: Partial<CSSStyleDeclaration> = {
    maxHeight: 'none',
    height: `${height}px`,
    width: `${width}px`,
    overflow: 'visible',
    transform: 'none',
  };

  try {
    const canvas = await toCanvas(element, {
      backgroundColor: backgroundColor,
      pixelRatio: pixelRatio,
      cacheBust: true,
      quality: quality,
      width: width,
      height: height,
      style: renderStyle as any,
    });
    return canvas;
  } catch (err) {
    console.warn('[exportElementToCanvas] Primary render attempt failed, retrying with fallback options:', err);
    try {
      // Fallback: Skip font CSS embedding in case of cross-origin stylesheet font rules
      const canvas = await toCanvas(element, {
        backgroundColor: backgroundColor,
        pixelRatio: pixelRatio,
        cacheBust: true,
        quality: quality,
        width: width,
        height: height,
        style: renderStyle as any,
        skipFonts: true,
        fontEmbedCSS: '',
      });
      return canvas;
    } catch (fallbackErr) {
      console.error('[exportElementToCanvas] Final export canvas failure:', fallbackErr);
      throw fallbackErr;
    }
  }
}

