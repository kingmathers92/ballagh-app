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
import PropTypes from "prop-types";

import "../styles/ShareImageBox.css";

const ShareImageBox = ({ textToShare }) => {
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
              handleShare(WhatsappShareButton, { title: textToShare })
            }
          >
            <WhatsappIcon size={26} round />
          </WhatsappShareButton>

          <FacebookShareButton
            url=""
            onClick={() =>
              handleShare(FacebookShareButton, { quote: textToShare })
            }
          >
            <FacebookIcon size={26} round />
          </FacebookShareButton>

          <TwitterShareButton
            url=""
            onClick={() =>
              handleShare(TwitterShareButton, { title: textToShare })
            }
          >
            <TwitterIcon size={26} round />
          </TwitterShareButton>

          <TelegramShareButton
            url=""
            onClick={() =>
              handleShare(TelegramShareButton, { title: textToShare })
            }
          >
            <TelegramIcon size={26} round />
          </TelegramShareButton>
        </div>
      )}
    </div>
  );
};

ShareImageBox.propTypes = {
  textToShare: PropTypes.string.isRequired,
};

export default ShareImageBox;
