import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

/**
 * Synchronously generates an ISO/IEC compliant vector SVG string for the given text.
 * 100% offline, zero network latency, universally supported in all browsers and print engines.
 */
export function getSyncQrSvg(text: string, margin = 2): string {
  if (!text || typeof text !== 'string') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/></svg>`;
  }

  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const size = qr.modules.size;
    const totalSize = size + margin * 2;
    const data = qr.modules.data;
    let path = '';

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (data[r * size + c]) {
          path += `M${c + margin} ${r + margin}h1v1h-1z `;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="crispEdges" style="width:100%;height:100%;display:block;"><rect width="100%" height="100%" fill="#ffffff"/><path fill="#000000" d="${path.trim()}"/></svg>`;
  } catch (err) {
    console.error('Error generating sync QR SVG:', err);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/></svg>`;
  }
}

/**
 * Synchronously generates a Data URI of the SVG string.
 * Usable directly inside <img src="..." /> without any network requests.
 */
export function getSyncQrDataUri(text: string, margin = 2): string {
  const svg = getSyncQrSvg(text, margin);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Asynchronously generates a Base64 PNG Data URL using the QRCode library.
 */
export async function getQrDataUrlAsync(text: string, size = 180): Promise<string> {
  if (!text) return getSyncQrDataUri(text);
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR Data URL async:', err);
    return getSyncQrDataUri(text);
  }
}

/**
 * Universal React Component for Rendering UPI QR Codes Offline
 */
export const UpiPaymentQRCode: React.FC<{
  upiUri: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ upiUri, size = 60, className = '', style = {} }) => {
  const [svgHtml, setSvgHtml] = useState<string>(() => getSyncQrSvg(upiUri));

  useEffect(() => {
    setSvgHtml(getSyncQrSvg(upiUri));
  }, [upiUri]);

  return (
    <div
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        ...style,
      }}
      className={`flex items-center justify-center shrink-0 overflow-hidden [&_svg]:w-full [&_svg]:h-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};
