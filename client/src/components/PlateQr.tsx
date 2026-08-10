/**
 * PlateQr — renders a scannable QR code for a single exercise plate.
 *
 * STYLE CONTRACT (ideas.md):
 *  - Scannability beats styling: QR modules stay pure black on pure white.
 *    A lime-on-black QR would fail contrast for many phone scanners, so the
 *    code itself is inverted and the LIME lives in the frame around it.
 *  - Error correction level "H" so the code still reads when a gym sticker
 *    gets scuffed, sweated on, or partially peeled.
 */

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  /** Absolute URL the code should resolve to. */
  value: string;
  /** Rendered pixel size of the code itself. */
  size?: number;
  className?: string;
}

export function PlateQr({ value, size = 128, className }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: size * 3, // oversample so print output stays crisp
      color: { dark: "#000000ff", light: "#ffffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`shrink-0 animate-pulse bg-white/10 ${className ?? ""}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR code linking to ${value}`}
      width={size}
      height={size}
      className={`shrink-0 bg-white ${className ?? ""}`}
      style={{ width: size, height: size, imageRendering: "pixelated" }}
    />
  );
}

