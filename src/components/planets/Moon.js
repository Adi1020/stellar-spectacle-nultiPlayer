// src/components/planets/Moon.js
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Moon = ({ planetPosition, distance, size, color, orbitSpeed }) => {
  const moonRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = planetPosition[0] + distance * Math.cos(elapsedTime * orbitSpeed);
    const z = planetPosition[2] + distance * Math.sin(elapsedTime * orbitSpeed);
    moonRef.current.position.set(x, planetPosition[1], z);
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Moon;
