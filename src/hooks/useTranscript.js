import { useEffect, useRef, useState } from 'react';

const useTranscript = ({ script, isRunning, onMessage, minDelay = 1000, maxDelay = 2000 }) => {
  const [cursor, setCursor] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    if (cursor >= script.length) {
      return;
    }

    const randomDelay = minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1));

    timerRef.current = setTimeout(() => {
      onMessage(script[cursor]);
      setCursor((prev) => prev + 1);
    }, randomDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, cursor, script, minDelay, maxDelay, onMessage]);

  const reset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCursor(0);
  };

  return { cursor, isCompleted: cursor >= script.length, reset };
};

export default useTranscript;
