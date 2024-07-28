import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const OrbitLine = ({ sunPosition, distance, eccentricity, inclination }) => {
  const points = useMemo(() => {
    if (!isFinite(distance) || !isFinite(eccentricity)) {
      console.warn('Invalid distance or eccentricity for orbit line');
      return [];
    }

    const segments = 64;
    const points = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const a = Math.max(distance, 0.001); // Ensure a minimum distance
      const b = a * Math.sqrt(Math.max(0, Math.min(1, 1 - eccentricity * eccentricity))); // Clamp eccentricity
      const x = a * Math.cos(theta);
      const z = b * Math.sin(theta);
      points.push(new THREE.Vector3(x, 0, z));
    }

    return points;
  }, [distance, eccentricity]);

  const rotationMatrix = useMemo(() => {
    const matrix = new THREE.Matrix4();
    const safeInclination = isFinite(inclination) ? inclination : 0;
    matrix.makeRotationX(safeInclination * Math.PI / 180);
    return matrix;
  }, [inclination]);

  const transformedPoints = useMemo(() => {
    return points.map(point => point.clone().applyMatrix4(rotationMatrix));
  }, [points, rotationMatrix]);

  // Check if we have valid points to render
  if (transformedPoints.length === 0) {
    return null; // Don't render anything if we don't have valid points
  }

  return (
    <Line
      points={transformedPoints}
      color="white"
      lineWidth={1}
      position={sunPosition}
    />
  );
};

export default OrbitLine;