"use client";

import React from 'react';
import StellarBackground from './StellarBackground';
import Particles from './Particles';
import { Noise, Glow } from './AmbientEffects';
import WaitlistProvider from './WaitlistProvider';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <WaitlistProvider>
      <StellarBackground />
      <Particles />
      <Noise />
      <Glow />
      <div id="app">
        {children}
      </div>
    </WaitlistProvider>
  );
};

export default LayoutWrapper;
