import React from "react";
import { Facebook } from "lucide-react";

/**
 * Opens Facebook's share dialog for the current page URL (works for visitors
 * and the site owner alike — shares to the viewer's own Facebook).
 */
export default function FacebookShareButton({ url, label = "Share on Facebook", className = "" }) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleClick = (e) => {
    e.preventDefault();
    const target = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(target, "_blank", "noopener,noreferrer,width=600,height=540");
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166FE5] transition-colors ${className}`}
      aria-label="Share on Facebook"
    >
      <Facebook className="h-4 w-4" />
      {label}
    </button>
  );
}