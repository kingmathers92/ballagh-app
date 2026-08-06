import { useState } from "react";
import { toPng } from "html-to-image";
import PropTypes from "prop-types";

import "../styles/ShareImageBox.css";

const ShareImageBox = ({ textToShare }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | generating | ready | error
  const [imageUrl, setImageUrl] = useState(null);

  const toggleShareBox = () => setIsOpen((open) => !open);

  const generateAndShare = async () => {
    setStatus("generating");
    try {
      const node = document.getElementById("hadith-text");
      const dataUrl = await toPng(node);
      setImageUrl(dataUrl);

      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "hadith.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: textToShare });
          setStatus("idle");
          setIsOpen(false);
          return;
        }
      }

      setStatus("ready");
    } catch (error) {
      if (error?.name === "AbortError") {
        setStatus("idle");
      } else {
        console.error("Error sharing hadith image:", error);
        setStatus("error");
      }
    }
  };

  return (
    <div className="share-box">
      <button
        onClick={toggleShareBox}
        className="social-button"
        aria-expanded={isOpen}
        aria-label="Share this hadith"
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path
              d="M8 2v8M8 2 5 5M8 2l3 3M3 9v4h10V9"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="share-options">
          <button
            onClick={generateAndShare}
            disabled={status === "generating"}
            className="share-action-button"
          >
            {status === "generating" ? "Preparing image..." : "Share as image"}
          </button>
          {status === "ready" && imageUrl && (
            <a href={imageUrl} download="hadith.png" className="download-link">
              Download image
            </a>
          )}
          {status === "error" && (
            <p className="share-error" role="alert">
              Couldn&apos;t generate the image. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

ShareImageBox.propTypes = {
  textToShare: PropTypes.string.isRequired,
};

export default ShareImageBox;
