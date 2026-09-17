import React, { useRef, useState, useCallback } from "react";
import { Download, Upload, Link as LinkIcon, AlertCircle, Image as ImageIcon } from "lucide-react";

const TARGET_W = 1024;
const TARGET_H = 576;

export default function BannerResizer() {
  const canvasRef = useRef(null);
  const [url, setUrl] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("youtube-banner");

  const drawImage = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = TARGET_W;
    canvas.height = TARGET_H;
    const ctx = canvas.getContext("2d");
    // Dark galaxy backdrop fills any letterboxing before the image is drawn.
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, TARGET_W, TARGET_H);
    // Cover-crop: scale to fill, center, overflow clipped to the canvas.
    const scale = Math.max(TARGET_W / img.naturalWidth, TARGET_H / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (TARGET_W - dw) / 2;
    const dy = (TARGET_H - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    setReady(true);
  }, []);

  const loadFromUrl = () => {
    setError("");
    setReady(false);
    if (!url.trim()) {
      setError("Paste your banner image URL first.");
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => drawImage(img);
    img.onerror = () => setError("Couldn't load that URL. Try uploading the file instead.");
    img.src = url.trim();
  };

  const loadFromFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setReady(false);
    setFileName(file.name.replace(/\.[^.]+$/, "") || "youtube-banner");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => drawImage(img);
      img.onerror = () => setError("Couldn't read that image file.");
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Export blocked (cross-origin image). Upload the file instead of using the URL.");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}-1024x576.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">YouTube Banner Resizer</h1>
        <p className="mt-2 text-muted-foreground">
          Resize your Pinterest cover banner to an exact 1024×576 image for your YouTube channel.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        {/* URL input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <LinkIcon className="h-4 w-4" /> Paste banner image URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://media.base44.com/..."
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={loadFromUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ImageIcon className="h-4 w-4" /> Load
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
        </div>

        {/* File upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <Upload className="h-4 w-4" /> Upload the banner file from your device
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={loadFromFile}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Preview canvas */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Preview (1024 × 576)</span>
            {ready && (
              <button
                onClick={download}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 transition-colors"
              >
                <Download className="h-4 w-4" /> Download PNG
              </button>
            )}
          </div>
          <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="block w-full h-auto"
              style={{ aspectRatio: `${TARGET_W} / ${TARGET_H}` }}
            />
            {!ready && (
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                Load an image to see the 1024×576 preview.
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        The image is cover-cropped to fit 16:9, so some top/bottom edges may be trimmed.
      </p>
    </div>
  );
}