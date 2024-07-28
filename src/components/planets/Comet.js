// src/components/planets/Comet.js

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Comet = ({ startPosition, endPosition, size, color, speed }) => {
  const cometRef = useRef();
  const tailRef = useRef();
  const startTime = useRef(Date.now());

  const tailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(100 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    const elapsedTime = (Date.now() - startTime.current) * 0.001 * speed;
    const lerpPosition = startPosition.clone().lerp(endPosition, elapsedTime);
    cometRef.current.position.copy(lerpPosition);

    const positions = tailGeometry.attributes.position.array;
    for (let i = 0; i < 100; i++) {
      const ratio = i / 100;
      positions[i * 3] = lerpPosition.x * (1 - ratio);
      positions[i * 3 + 1] = lerpPosition.y * (1 - ratio);
      positions[i * 3 + 2] = lerpPosition.z * (1 - ratio);
    }
    tailGeometry.attributes.position.needsUpdate = true;

    if (elapsedTime >= 1) {
      startTime.current = Date.now();
      cometRef.current.position.copy(startPosition);
    }
  });

  return (
    <group>
      <mesh ref={cometRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
      <line ref={tailRef} geometry={tailGeometry}>
        <lineBasicMaterial color={color} transparent={true} opacity={0.5} />
      </line>
    </group>
  );
};

export default Comet;
