// src/components/planets/Earth.js

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import {
  TerranBump,
  TerranDiffuse,
  TerranClouds,
  TerranWater,
  TerranLightsRural,
  TerranRoughness
} from '../../assets/tex/textures';

const EARTH_ROTATION_SPEED = 0.01; // Example constant

const Earth = ({ sunPosition, distance, size, onClick, orbitSpeed }) => {
  const earthRef = useRef();
  const cloudRef = useRef();

  const [
    colorMap,
    bumpMap,
    cloudsMap,
    waterMap,
    lightsMap,
    roughnessMap
  ] = useTexture([
    TerranBump,
    TerranDiffuse,
    TerranClouds,
    TerranWater,
    TerranLightsRural,
    TerranRoughness
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = sunPosition[0] + distance * Math.cos(elapsedTime * orbitSpeed);
    const z = sunPosition[2] + distance * Math.sin(elapsedTime * orbitSpeed);
    earthRef.current.position.set(x, sunPosition[1], z);
    earthRef.current.rotation.y += EARTH_ROTATION_SPEED;
    cloudRef.current.rotation.y += EARTH_ROTATION_SPEED * 1.1;
  });

  return (
    <group onClick={() => onClick && onClick(earthRef.current.position.toArray())} ref={earthRef}>
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          metalnessMap={waterMap}
          roughnessMap={roughnessMap}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffffff)}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[size * 1.01, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

export default Earth;
