import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Sun = ({ position, size, texture }) => {
  const ref = useRef();
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [texMap] = useTexture([texture]);

  // Load texture
  const textureMap = useLoader(THREE.TextureLoader, texture, (loader) => {
    console.log("Sun texture loaded");
    loader.load(texture, () => {
      setTextureLoaded(true);
    });
  });

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    console.log("Sun rendered");
    console.log(textureMap);
  }, [textureMap]);

  return (
    <group position={position}>
      <Sphere ref={ref} args={[size, 64, 64]}>
        <meshStandardMaterial 
          map={texMap} 
          emissive={new THREE.Color(0xFDB813)}
          emissiveIntensity={0.5}
        />
      </Sphere>
      <pointLight color="#FDB813" intensity={2} distance={300} decay={2} />
      <pointLight color="#ff4500" intensity={1} distance={500} decay={2} />
      <sprite scale={[size * 3, size * 3, 1]}>
        <spriteMaterial
          blending={THREE.AdditiveBlending}
          map={new THREE.TextureLoader().load('/sun_glow.png')}
          transparent={true}
          opacity={0.7}
        />
      </sprite>
    </group>
  );
};

export default Sun;