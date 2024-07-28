// src/components/Planet.js

import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { MeshStandardMaterial } from 'three';
import imgDiffuse from '../assets/tex/ground_0010_height_1k.png';
import imgBump from '../assets/tex/ground_0010_normal_opengl_1k.png';
import imgSpecular from '../assets/tex/ground_0010_roughness_1k.jpg';

const Planet = ({ position }) => {
  const textureDiffuse = useLoader(TextureLoader, imgDiffuse);
  const textureBump = useLoader(TextureLoader, imgBump);
  const textureSpecular = useLoader(TextureLoader, imgSpecular);
  
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Animate rotation
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={textureDiffuse}
        bumpMap={textureBump}
        bumpScale={0.05}
        specularMap={textureSpecular}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
};

export default Planet;
