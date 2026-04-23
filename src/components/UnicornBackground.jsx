import { useEffect, useState } from 'react';

/**
 * UnicornBackground - Safely invokes the UnicornStudio script on mount
 * and blurs/dims the background when there's no mouse interaction.
 */
export default function UnicornBackground() {
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    let timeout;
    const handleInteraction = () => {
      setIsInteracting(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsInteracting(false), 2000);
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const i = document.createElement("script");
      i.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
      i.onload = function () {
        if (!window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(i);
    } else if (window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
    }

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div 
      className="unicorn-wrapper"
      style={{
        position: 'fixed',
        width: '100%',
        height: '100vh',
        zIndex: 0,
        left: 0,
        top: 0,
        background: 'linear-gradient(to bottom, rgba(88,28,135,0.20), rgba(30,58,138,0.30), rgba(0,0,0,0.40))',
        filter: isInteracting ? 'brightness(0.6) saturate(0.8) blur(0px)' : 'brightness(0.4) saturate(0.4) blur(10px)',
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 62%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 62%, transparent)',
        pointerEvents: 'none',
        transition: 'filter 1.2s ease, opacity 1.2s ease',
        opacity: isInteracting ? 1 : 0.6
      }}
      data-alpha-mask="62"
    >
      <div 
        data-us-project="MSvSkmJb9Ax55PeV6eku" 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          zIndex: -1,
          background: 'linear-gradient(to bottom right, rgba(79,70,229,0.20), rgba(147,51,234,0.20), rgba(219,39,119,0.20))'
        }}
      ></div>
    </div>
  );
}
