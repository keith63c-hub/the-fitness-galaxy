import React from "react";

/**
 * Red "Save" button overlay revealed on hover over a main content image.
 * Opens Pinterest's pin creator pre-filled with the image, title, description,
 * and the current page URL — the official Pinterest sharing flow.
 *
 * Parent must be `position: relative` and wrap the image.
 */
export default function PinterestSaveButton({ imageUrl, title, description }) {
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const pinDescription = description
    ? `${title} — ${description}`
    : title;

  const pinUrl =
    "https://pinterest.com/pin/create/button/?" +
    new URLSearchParams({
      url: pageUrl,
      media: imageUrl || "",
      description: pinDescription || "",
    }).toString();

  return (
    <a
      href={pinUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#E60023] px-4 py-2 text-xs font-bold text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-[#ad081b]"
      aria-label={`Save ${title || "image"} to Pinterest`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.566-.994 3.995-.283 1.194.6 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.137.893 2.739a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.266-.401.16-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.403 2.967 7.403 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
      Save
    </a>
  );
}