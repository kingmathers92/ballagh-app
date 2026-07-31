import { useState } from "react";
import { toPng } from "html-to-image";
import PropTypes from "prop-types";

import "../styles/ShareImageBox.css";

const ShareImageBox = ({ textToShare }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("idle");
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
        <span role="img" aria-hidden="true">
          📤
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
