import React from 'react';
import { Hero } from '../components/Hero';
import { PropertyGrid } from '../components/PropertyGrid';
import { Features } from '../components/Features';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <PropertyGrid limit={4} />
      <Features />
    </>
  );
};