"use client";

import React from 'react';
import StellarBackground from './StellarBackground';
import Particles from './Particles';
import { Noise, Glow } from './AmbientEffects';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <>
      <StellarBackground />
      <Particles />
      <Noise />
      <Glow />
      <div id="app">
        {children}
      </div>
    </>
  );
};

export default LayoutWrapper;
