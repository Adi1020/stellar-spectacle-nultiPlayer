// src/components/planets/Spacecraft.js

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Spacecraft = ({ position, rotation, setPosition, setRotation }) => {
  const spacecraftRef = useRef();
  const controls = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          controls.current.forward = true;
          break;
        case 's':
          controls.current.backward = true;
          break;
        case 'a':
          controls.current.left = true;
          break;
        case 'd':
          controls.current.right = true;
          break;
        case 'arrowup':
          controls.current.up = true;
          break;
        case 'arrowdown':
          controls.current.down = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          controls.current.forward = false;
          break;
        case 's':
          controls.current.backward = false;
          break;
        case 'a':
          controls.current.left = false;
          break;
        case 'd':
          controls.current.right = false;
          break;
        case 'arrowup':
          controls.current.up = false;
          break;
        case 'arrowdown':
          controls.current.down = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const speed = 0.1;
    const rotationSpeed = 0.02;

    let movement = new THREE.Vector3(0, 0, 0);

    if (controls.current.forward) movement.z -= speed;
    if (controls.current.backward) movement.z += speed;
    if (controls.current.left) {
      const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
      setRotation(prev => prev.multiply(rotation));
    }
    if (controls.current.right) {
      const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed);
      setRotation(prev => prev.multiply(rotation));
    }
    if (controls.current.up) {
      const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -rotationSpeed);
      setRotation(prev => prev.multiply(rotation));
    }
    if (controls.current.down) {
      const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotationSpeed);
      setRotation(prev => prev.multiply(rotation));
    }

    if (movement.lengthSq() > 0) {
      movement.applyQuaternion(rotation);
      setPosition(prev => prev.add(movement));
    }
  });

  return (
    <mesh ref={spacecraftRef} position={position.toArray()} quaternion={rotation}>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="#808080" />
    </mesh>
  );
};

export default Spacecraft;
