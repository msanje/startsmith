import React, { useRef, useState } from "react";

const CopyButton = ({ input }: CopyButtonProps) => {
  const [showCopied, setShowCopied] = useState(false);
  const timerRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const copy = async () => {
    await navigator.clipboard.writeText(input);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowCopied(false);
    }, 2000);

    setShowCopied(true);
  };

  return (
    <button
      type="button"
      className="button floating"
      title="Copy schema"
      aria-label="Copy schema"
      onClick={copy}
    >
      {showCopied ? "Copied!" : "Copy link"}
    </button>
  );
};

interface CopyButtonProps {
  input: string;
}

export default CopyButton;
