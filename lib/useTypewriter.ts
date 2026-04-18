import { useState, useEffect } from 'react';

export function useTypewriter(targetString: string, speedMs: number = 30, startDelayMs: number = 0, isReady: boolean = true) {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isReady) {
      // Reset if not ready
      setDisplayText('');
      setIsFinished(false);
      return; 
    }

    let index = 0;
    let timeoutId: NodeJS.Timeout;

    const startTyping = () => {
      const typeChar = () => {
        if (index < targetString.length) {
          setDisplayText((prev) => prev + targetString.charAt(index));
          index++;
          // Add slight programmatic randomness to typing speed to simulate actual human/teletype speed
          timeoutId = setTimeout(typeChar, speedMs + (Math.random() * 30)); 
        } else {
          setIsFinished(true);
        }
      };
      typeChar();
    };

    const initialDelay = setTimeout(() => {
      startTyping();
    }, startDelayMs);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
    };
  }, [targetString, speedMs, startDelayMs, isReady]);

  return { displayText, isFinished };
}
