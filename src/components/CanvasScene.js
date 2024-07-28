// src/components/CanvasScene.js

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';

function CanvasScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Planet position={[0, 0, 0]} />
      <OrbitControls />
    </Canvas>
  );
}

export default CanvasScene;
