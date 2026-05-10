import React, { useState, useEffect } from 'react';
import { TextScramble } from './text-scramble';

export const HeroFuturistic = ({ onExplore }: { onExplore?: () => void }) => {
  const titleWords = 'Build AI Chatbots'.split(' ');
  const subtitle = 'Transform your static FAQ into an intelligent assistant.';
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 600);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <div className="relative h-svh w-full overflow-hidden bg-transparent">
      {/* Subtle dark gradient overlay to ensure text contrast against the bright 3D model */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6 md:px-12 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,transparent_70%)]">
        <div className="text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl font-black text-center max-w-5xl tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-white">
            {titleWords.map((word, index) => (
              <TextScramble
                key={index}
                className={word === 'Chatbots' ? 'bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent' : 'text-white'}
                as="div"
                trigger={index < visibleWords}
                duration={0.8}
                speed={0.05}
              >
                {word}
              </TextScramble>
            ))}
          </div>
        </div>
        
        <div className="text-lg md:text-2xl mt-8 text-white/90 font-medium text-center max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <div
            className="transition-all duration-1000 ease-out"
            style={{ 
              animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`, 
              opacity: subtitleVisible ? 1 : 0,
              transform: subtitleVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            {subtitle}
          </div>
        </div>

        <div 
          className="mt-12 transition-all duration-1000 ease-out pointer-events-auto"
          style={{ opacity: subtitleVisible ? 1 : 0, transform: subtitleVisible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          <button
            onClick={onExplore}
            className="flex items-center gap-3 px-8 py-4 bg-brand hover:bg-brand-hover text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-glow-brand"
          >
            Start Building Free
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default HeroFuturistic;

