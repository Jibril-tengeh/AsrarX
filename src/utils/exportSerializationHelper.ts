import html2canvas from 'html2canvas';

/**
 * Helper callback for html2canvas/toCanvas onclone to ensure all <canvas> and <svg> elements
 * are properly serialized into the exported image file without losing content.
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
 * High-quality export helper using html2canvas with full canvas & SVG serialization.
 */
export async function exportElementToCanvas(element: HTMLElement, backgroundColor = '#0c0a09'): Promise<HTMLCanvasElement> {
  return html2canvas(element, {
    scale: 2,
    backgroundColor: backgroundColor,
    useCORS: true,
    logging: false,
    allowTaint: true,
    onclone: (clonedDoc, clonedEl) => {
      prepareClonedDOMForCanvas(element, clonedEl, clonedDoc);
    },
  });
}
