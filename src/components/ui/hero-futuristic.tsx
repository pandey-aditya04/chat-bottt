import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    // Handle deprecation: PostProcessing was renamed to RenderPipeline in newer Three.js versions
    const PipelineClass = (THREE as any).RenderPipeline || (THREE as any).PostProcessing;
    const postProcessing = new PipelineClass(gl as any);
    
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a scan line overlay (changed to brand color: indigo/purple)
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    const brandOverlay = vec3(0.38, 0.4, 0.94).mul(oneMinus(scanLine)).mul(0.4); // Brand color overlay

    // Mix the original scene with the overlay
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, brandOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    
    // Handle deprecation: renderAsync is deprecated in favor of render
    if (render.renderAsync) {
      render.renderAsync();
    } else if (render.render) {
      render.render();
    }
  }, 1);

  return null;
};

// Scene component removed per user request

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
    <div className="relative h-svh w-full overflow-hidden bg-black">
      {/* Subtle dark gradient overlay to ensure text contrast against the bright 3D model */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6 md:px-12 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,transparent_70%)]">
        <div className="text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl font-black text-center max-w-5xl tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-white">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className="transition-all duration-1000 ease-out"
                style={{ 
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`, 
                  opacity: index < visibleWords ? 1 : 0,
                  transform: index < visibleWords ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                {word === 'Chatbots' ? <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent drop-shadow-none">{word}</span> : word}
              </div>
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

      {/* Wrap WebGPU Canvas in an error boundary to prevent full page crash if WebGPU is unsupported */}
      <ErrorBoundary fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black">
           <p className="text-white/50">3D Experience requires a WebGPU-compatible browser.</p>
        </div>
      }>
        <Canvas
          flat
          className="absolute inset-0 pointer-events-auto"
          gl={async (props) => {
            const renderer = new THREE.WebGPURenderer(props as any);
            await renderer.init();
            return renderer;
          }}
        >
          <Suspense fallback={null}>
            <PostProcessing fullScreenEffect={true} />
            {/* Image scene removed per user request */}
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

// Simple Error Boundary component for WebGPU graceful degradation
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default HeroFuturistic;

