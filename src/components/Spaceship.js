// import React, { useRef } from 'react';
// import { useFrame, useLoader } from '@react-three/fiber';
// import { Vector3, Quaternion } from 'three';
// import { TextureLoader } from 'three/src/loaders/TextureLoader';
// import { Text } from '@react-three/drei';  // Import the Text component
// import tex1 from '../assets/spaceship/spaceship-panels1-ao.png'
// import tex2 from '../assets/spaceship/spaceship-panels1-height.png'


// const Spaceship = ({ position, rotation, playerId }) => {
//   const shipRef = useRef();
//   const engineGlowRef = useRef();

//   // Load textures
//   const bodyTexture = useLoader(TextureLoader, tex1);
//   const glassTexture = useLoader(TextureLoader, tex2);

//   useFrame((state, delta) => {
//     // Add subtle hovering motion
//     if (shipRef.current) {
//       shipRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
//     }

//     // Animate engine glow
//     if (engineGlowRef.current) {
//       engineGlowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
//     }
//   });

//   return (
//     <group ref={shipRef} position={new Vector3(...position)} quaternion={new Quaternion(...rotation)}>
//       {/* Main body */}
//       <mesh>
//         <boxGeometry args={[20, 10, 20]} />
//         <meshStandardMaterial map={bodyTexture} metalness={0.6} roughness={0.4} />
//       </mesh>

//       {/* Cockpit */}
//       <mesh position={[0, 5, 8]}>
//         <sphereGeometry args={[5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
//         <meshPhysicalMaterial map={glassTexture} transparent opacity={0.7} metalness={0.2} roughness={0.1} />
//       </mesh>

//       {/* Wings */}
//       <mesh position={[12, 0, 0]}>
//         <boxGeometry args={[10, 2, 15]} />
//         <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
//       </mesh>
//       <mesh position={[-12, 0, 0]}>
//         <boxGeometry args={[10, 2, 15]} />
//         <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
//       </mesh>

//       {/* Engines */}
//       <mesh position={[5, -5, -8]}>
//         <cylinderGeometry args={[2, 3, 5, 16]} />
//         <meshStandardMaterial color="#333" />
//       </mesh>
//       <mesh position={[-5, -5, -8]}>
//         <cylinderGeometry args={[2, 3, 5, 16]} />
//         <meshStandardMaterial color="#333" />
//       </mesh>

//       {/* Engine glow */}
//       <pointLight ref={engineGlowRef} position={[0, -5, -10]} color="#00f" intensity={1.5} distance={20} />

//       {/* Player ID */}
//       <Text 
//         position={[0, 7, 0]}
//         fontSize={3}
//         color="#fff"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {playerId}
//       </Text>
//     </group>
//   );
// };

// export default Spaceship;

import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Vector3, Quaternion } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Text } from '@react-three/drei';
import tex1 from '../assets/spaceship/spaceship-panels1-ao.png';
import tex2 from '../assets/spaceship/spaceship-panels1-height.png';

const Spaceship = ({ position, rotation, playerId }) => {
  const shipRef = useRef();
  const engineGlowRef = useRef();

  // Load textures
  const bodyTexture = useLoader(TextureLoader, tex1);
  const glassTexture = useLoader(TextureLoader, tex2);

  // Constants for reused values
  const WING_COLOR = "#444";
  const ENGINE_COLOR = "#333";
  const ENGINE_GLOW_COLOR = "#00f";

  // Update frame for animations
  useFrame((state) => {
    // Add subtle hovering motion
    if (shipRef.current) {
      shipRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }

    // Animate engine glow
    if (engineGlowRef.current) {
      engineGlowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
    }
  });

  return (
    <group ref={shipRef} position={new Vector3(...position)} quaternion={new Quaternion(...rotation)}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[20, 10, 20]} />
        <meshStandardMaterial map={bodyTexture} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 5, 8]}>
        <sphereGeometry args={[5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial map={glassTexture} transparent opacity={0.7} metalness={0.2} roughness={0.1} />
      </mesh>

      {/* Wings */}
      <mesh position={[12, 0, 0]}>
        <boxGeometry args={[10, 2, 15]} />
        <meshStandardMaterial color={WING_COLOR} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-12, 0, 0]}>
        <boxGeometry args={[10, 2, 15]} />
        <meshStandardMaterial color={WING_COLOR} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Engines */}
      <mesh position={[5, -5, -8]}>
        <cylinderGeometry args={[2, 3, 5, 16]} />
        <meshStandardMaterial color={ENGINE_COLOR} />
      </mesh>
      <mesh position={[-5, -5, -8]}>
        <cylinderGeometry args={[2, 3, 5, 16]} />
        <meshStandardMaterial color={ENGINE_COLOR} />
      </mesh>

      {/* Engine glow */}
      <pointLight ref={engineGlowRef} position={[0, -5, -10]} color={ENGINE_GLOW_COLOR} intensity={1.5} distance={20} />

      {/* Player ID */}
      <Text 
        position={[0, 7, 0]}
        fontSize={3}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {playerId}
      </Text>
    </group>
  );
};

export default Spaceship;
