// src/components/planets/AsteroidBelt.js
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const AsteroidBelt = ({ innerRadius, outerRadius, count }) => {
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.random());
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      temp.push({ position: [x, (Math.random() - 0.5) * 2, z], size: Math.random() * 0.1 });
    }
    return temp;
  }, [innerRadius, outerRadius, count]);

  return (
    <>
      {asteroids.map((asteroid, index) => (
        <mesh key={index} position={asteroid.position}>
          <sphereGeometry args={[asteroid.size, 32, 32]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      ))}
    </>
  );
};

export default AsteroidBelt;
