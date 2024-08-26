import PropTypes from "prop-types";
import { useState } from "react";
import { FaCopy } from "react-icons/fa";

function ShareButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copyToClipboard} className="share-button">
      <FaCopy /> {copied ? "Copied!" : "Copy"}
    </button>
  );
}

ShareButton.propTypes = {
  textToCopy: PropTypes.string.isRequired,
};

export default ShareButton;
