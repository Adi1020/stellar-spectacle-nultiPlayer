// src/components/planets/SpaceDebris.js

import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SpaceDebris = ({ earthPosition, count, distance, size }) => {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = distance + Math.random() * 5;
      const x = earthPosition[0] + radius * Math.cos(angle);
      const y = earthPosition[1] + (Math.random() - 0.5) * 2;
      const z = earthPosition[2] + radius * Math.sin(angle);
      temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, [earthPosition, count, distance]);

  const particlesRef = React.useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap((v) => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" size={size} color="#888888" />
    </points>
  );
};

export default SpaceDebris;
