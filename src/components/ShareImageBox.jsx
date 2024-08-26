import { useState } from "react";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import { toPng } from "html-to-image";

import "../styles/ShareImageBox.css";

const ShareImageBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleShareBox = () => {
    setIsOpen(!isOpen);
  };

  const handleShare = async (ShareButtonComponent, shareProps) => {
    try {
      const dataUrl = await toPng(document.getElementById("hadith-text"));

      shareProps.url = dataUrl;
      return <ShareButtonComponent {...shareProps} />;
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="share-box">
      <button onClick={toggleShareBox} className="social-button">
        <span role="img" aria-label="share">
          📤
        </span>
      </button>
      {isOpen && (
        <div className="share-options">
          <WhatsappShareButton
            url=""
            onClick={() =>
              handleShare(WhatsappShareButton, { title: "Check this Hadith" })
            }
          >
            <WhatsappIcon size={26} round />
          </WhatsappShareButton>

          <FacebookShareButton
            url=""
            onClick={() =>
              handleShare(FacebookShareButton, { quote: "Check this Hadith" })
            }
          >
            <FacebookIcon size={26} round />
          </FacebookShareButton>

          <TwitterShareButton
            url=""
            onClick={() =>
              handleShare(TwitterShareButton, { title: "Check this Hadith" })
            }
          >
            <TwitterIcon size={26} round />
          </TwitterShareButton>

          <TelegramShareButton
            url=""
            onClick={() =>
              handleShare(TelegramShareButton, { title: "Check this Hadith" })
            }
          >
            <TelegramIcon size={26} round />
          </TelegramShareButton>
        </div>
      )}
    </div>
  );
};

export default ShareImageBox;
