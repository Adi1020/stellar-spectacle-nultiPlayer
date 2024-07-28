// src/components/planets/Satellite.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Satellite = ({ earthPosition, distance, size, color, orbitSpeed }) => {
  const satelliteRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = earthPosition[0] + distance * Math.cos(elapsedTime * orbitSpeed);
    const z = earthPosition[2] + distance * Math.sin(elapsedTime * orbitSpeed);
    satelliteRef.current.position.set(x, earthPosition[1], z);
    satelliteRef.current.rotation.y += 0.01; // Add a rotation for the satellite itself
  });

  return (
    <mesh ref={satelliteRef}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Satellite;
