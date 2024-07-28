import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Ring, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import tex from '../../assets/tex/2k_earth_daymap.jpg';

const Planet = ({ 
  size, 
  texture, 
  rotationSpeed, 
  name, 
  onClick,
  orbitSpeed,
  distanceFromSun,
  orbitalInclination,
  obliquityToOrbit,
  hasRings,
  numberOfMoons,
  surfaceGravity,
  meanTemperature,
  orbitalEccentricity
}) => {
  const groupRef = useRef();
  const planetRef = useRef();
  orbitSpeed = orbitSpeed *1000;
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [texMap] = useTexture([texture])

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(name);
    }
  }, [onClick, name]);

  // Load texture
  const textureMap = useLoader(THREE.TextureLoader, tex,(loader) => {
    console.log("Texture loaded");
     loader.load(texture, () => {
        setTextureLoaded(true);
      }
    
      );
  }
  );

  // Create moons
  const moons = useMemo(() => {
    return Array(numberOfMoons).fill().map((_, index) => {
      const moonSize = size * 0.1;
      const moonDistance = size * 2 + index * moonSize * 3;
      const moonPosition = new THREE.Vector3(moonDistance, 0, 0);
      return { size: moonSize, position: moonPosition };
    });
  }, [numberOfMoons, size]);

  useFrame(({ clock }) => {
    if (groupRef.current && planetRef.current) {
      // Planet rotation
      planetRef.current.rotation.y += rotationSpeed;

      // Orbital rotation
      const time = clock.getElapsedTime();
      const angle = time * orbitSpeed;
      
      // Calculate position using orbital characteristics
      const a = distanceFromSun; // semi-major axis
      const e = orbitalEccentricity;
      const b = a * Math.sqrt(1 - e * e); // semi-minor axis
      
      groupRef.current.position.x = a * Math.cos(angle);
      groupRef.current.position.z = b * Math.sin(angle);

      // Apply orbital inclination
      groupRef.current.rotation.x = (orbitalInclination * Math.PI) / 180;

      // Apply obliquity to orbit (axial tilt)
      planetRef.current.rotation.x = (obliquityToOrbit * Math.PI) / 180;
    }
  });

  // Calculate color based on temperature
  const temperatureColor = useMemo(() => {
    const tempNormalized = (meanTemperature + 273.15) / 500; // Normalize temperature
    return new THREE.Color().setHSL(1 - tempNormalized, 1, 0.5);
  }, [meanTemperature]);


  useEffect   (() => {
    console.log("Planet rendered");
    console.log(textureMap);
  }, []);
  return (
    <group ref={groupRef}>
      <group ref={planetRef} onClick={handleClick}>
        <Sphere args={[size, 64, 64]}>
          <meshStandardMaterial map={texMap} />
        </Sphere>
        {hasRings && (
          <Ring args={[size * 1.5, size * 2, 64]}>
            <meshBasicMaterial  opacity={0.5} transparent side={THREE.DoubleSide} />
          </Ring>
        )}
        {moons.map((moon, index) => (
          <Sphere key={index} args={[moon.size, 32, 32]} position={moon.position}>
            <meshStandardMaterial />
          </Sphere>
        ))}
        <pointLight color={temperatureColor} intensity={surfaceGravity * 0.1} distance={size * 10} />
      </group>
    </group>
  );
};

export default Planet;