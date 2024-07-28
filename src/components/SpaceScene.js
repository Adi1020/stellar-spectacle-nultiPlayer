// // src/components/SpaceScene.js

// import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Stars, Html } from '@react-three/drei';
// import { Vector3, Quaternion, Matrix4 } from 'three';
// import socket from '../services/socket';
// import Sun from './planets/Sun';
// import OrbitLine from './planets/OrbitLine';
// import { planetData } from '../components/planets/planetData';
// import Planet from '../components/planets/Planet';
// import { throttle } from 'lodash';
// import Spaceship from './Spaceship';
// import sunTex from '../assets/tex/2k_sun.jpg'

// const CAMERA_POSITION = new Vector3(0, 100, 200);
// const CAMERA_FOV = 50;
// const SCALE_FACTOR = 1 / 100;
// const ORBIT_SPEED_FACTOR = 1 / 100;
// const SYSTEM_RADIUS = 700;

// const SpaceScene = ({
//   isSpaceshipView,
//   spaceshipPosition,
//   spaceshipRotation,
//   setSpaceshipPosition,
//   setSpaceshipRotation,
//   movementSpeed,
//   rotationSpeed,
//   otherPlayers,
//   setOtherPlayers
// }) => {
//   const { camera, gl } = useThree();
//   const controlsRef = useRef({});
//   const keysPressed = useRef({});
//   const [selectedPlanet, setSelectedPlanet] = useState(null);
//   const [edgeOpacity, setEdgeOpacity] = useState(0);

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       keysPressed.current[event.code] = true;
//     };
//     const handleKeyUp = (event) => {
//       keysPressed.current[event.code] = false;
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useEffect(() => {
//     socket.on("updatePlayers", (players) => {
//       console.log("Received updated players", players);
//       setOtherPlayers(players);
//     });

//     return () => {
//       socket.off("updatePlayers");
//     };
//   }, [setOtherPlayers]);

//   const emitPlayerState = throttle((newPosition, newRotation) => {
//     console.log("Emitting player state", newPosition, newRotation);
//     socket.emit("playerState", {
//       position: [newPosition.x, newPosition.y, newPosition.z],
//       rotation: [newRotation.x, newRotation.y, newRotation.z, newRotation.w],
//       userId: socket.id,
//     });
//   }, 300);

//   useFrame(() => {
//     if (isSpaceshipView) {
//       camera.position.copy(spaceshipPosition);
//       camera.quaternion.copy(spaceshipRotation);

//       const direction = new Vector3();
//       const rotationMatrix = new Matrix4().makeRotationFromQuaternion(spaceshipRotation);

//       if (keysPressed.current['KeyW']) direction.z -= 1;
//       if (keysPressed.current['KeyS']) direction.z += 1;
//       if (keysPressed.current['KeyA']) direction.x -= 1;
//       if (keysPressed.current['KeyD']) direction.x += 1;
//       if (keysPressed.current['Space']) direction.y += 1;
//       if (keysPressed.current['ShiftLeft']) direction.y -= 1;

//       direction.applyMatrix4(rotationMatrix);
//       direction.normalize().multiplyScalar(movementSpeed);

//       const newPosition = spaceshipPosition.clone().add(direction);
//       const distanceFromCenter = newPosition.length();

//       if (distanceFromCenter < SYSTEM_RADIUS * 5) {
//         setSpaceshipPosition(newPosition);
//         setEdgeOpacity(0);
//       } else {
//         const clampedPosition = newPosition.normalize().multiplyScalar(SYSTEM_RADIUS);
//         setSpaceshipPosition(clampedPosition);
//         setEdgeOpacity(Math.min((distanceFromCenter - SYSTEM_RADIUS) / 100, 1));
//       }

//       const rotationChange = new Quaternion();
//       if (keysPressed.current['ArrowLeft']) {
//         rotationChange.setFromAxisAngle(new Vector3(0, 1, 0), rotationSpeed);
//       }
//       if (keysPressed.current['ArrowRight']) {
//         rotationChange.setFromAxisAngle(new Vector3(0, 1, 0), -rotationSpeed);
//       }
//       if (keysPressed.current['ArrowUp']) {
//         rotationChange.setFromAxisAngle(new Vector3(1, 0, 0), rotationSpeed);
//       }
//       if (keysPressed.current['ArrowDown']) {
//         rotationChange.setFromAxisAngle(new Vector3(1, 0, 0), -rotationSpeed);
//       }

//       setSpaceshipRotation((prev) => prev.multiply(rotationChange));

//       emitPlayerState(newPosition, spaceshipRotation);
//     }
//   });

//   useEffect(() => {
//     if (!isSpaceshipView && controlsRef.current) {
//       controlsRef.current.reset();
//     }
//   }, [isSpaceshipView]);

//   const handlePlanetClick = useCallback((planetName) => {
//     setSelectedPlanet(planetName);
//   }, []);

//   return (
//     <>
//       <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={CAMERA_FOV} />
//       <OrbitControls
//         ref={controlsRef}
//         enableZoom={true}
//         enablePan={true}
//         enableRotate={true}
//         enabled={!isSpaceshipView}
//         args={[camera, gl.domElement]}
//       />
//       <ambientLight intensity={1.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1.5} />
//       <directionalLight position={[-10, -10, -5]} intensity={1.5} />

//       <Sun position={[0, 0, 0]} size={1500 * SCALE_FACTOR} texture={sunTex} />
//      {planetData.map((planet) => (
//         <React.Fragment key={planet.name}>
//           <Planet
//             size={planet.diameter * SCALE_FACTOR}
//             texture={planet.texture}
//             rotationSpeed={(1 / planet.rotationPeriod) * 0.01}
//             orbitSpeed={(1 / planet.orbitalPeriod) * ORBIT_SPEED_FACTOR}
//             distanceFromSun={planet.distanceFromSun * SCALE_FACTOR * 80}
//             name={planet.name}
//             orbitalInclination={planet.orbitalInclination}
//             obliquityToOrbit={planet.obliquityToOrbit}
//             onClick={handlePlanetClick}
//             hasRings={planet.hasRingSystem}
//             numberOfMoons={planet.numberOfMoons}
//             surfaceGravity={planet.surfaceGravity}
//             meanTemperature={planet.meanTemperature}
//             orbitalEccentricity={planet.orbitalEccentricity}
//           />
//           <OrbitLine
//             sunPosition={[0, 0, 0]}
//             distance={planet.distanceFromSun * SCALE_FACTOR * 80 || 0}
//             eccentricity={planet.orbitalEccentricity || 0}
//             inclination={planet.orbitalInclination || 0}
//           />
//         </React.Fragment>
//       ))}
//       <Stars radius={SYSTEM_RADIUS} depth={50} count={50000} factor={30} saturation={10} fade speed={1} />
//       {isSpaceshipView && (
//         <mesh position={[0, 0, -1]}>
//           <planeGeometry args={[2, 2]} />
//           <meshBasicMaterial color="black" transparent opacity={edgeOpacity} />
//         </mesh>
//       )}
//       {otherPlayers &&
//       Object.values(otherPlayers).map((player, index) => (
//         <React.Fragment key={index}>
//           <Spaceship position={player.position} rotation={player.rotation} playerId={player.id} />
//           <Html position={[player.position[0], player.position[1] + 20, player.position[2]]} distanceFactor={10}>
//             <div className="player-name" style={{ transform: 'translate(-50%, -100%)', color: 'white', fontSize: '15em', backgroundColor: "rgba(255,100,200,0.4)", padding: '2px 5px', borderRadius: '5px' }}>
//               {player.name}
//             </div>
//           </Html>
//         </React.Fragment>
//       ))}
//     </>
//   );
// };

// export default SpaceScene;



import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import { Vector3, Quaternion, Matrix4, Color } from 'three';
import socket from '../services/socket';
import Sun from './planets/Sun';
import OrbitLine from './planets/OrbitLine';
import { planetData } from '../components/planets/planetData';
import Planet from '../components/planets/Planet';
import { throttle } from 'lodash';
import Spaceship from './Spaceship';
import sunTex from '../assets/tex/2k_sun.jpg';

const CAMERA_POSITION = new Vector3(0, 100, 200);
const CAMERA_FOV = 50;
const SCALE_FACTOR = 1 / 100;
const ORBIT_SPEED_FACTOR = 1 / 100;
const SYSTEM_RADIUS = 700;

const SpaceScene = ({
  isSpaceshipView,
  spaceshipPosition,
  spaceshipRotation,
  setSpaceshipPosition,
  setSpaceshipRotation,
  movementSpeed,
  rotationSpeed,
  otherPlayers,
  setOtherPlayers,
  health,
  setHealth,
  hitEffect,
  setHitEffect,
  isPvPMode
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef({});
  const keysPressed = useRef({});
  const [projectiles, setProjectiles] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [edgeOpacity, setEdgeOpacity] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.current[event.code] = true;

      if (isPvPMode && event.code === 'KeyF') {
        shootProjectile();
      }
    };
    const handleKeyUp = (event) => {
      keysPressed.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPvPMode, spaceshipPosition, spaceshipRotation]);

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      console.log("Received updated players", players);
      setOtherPlayers(players || {});
    });

    socket.on("newProjectile", (projectile) => {
      if (!projectile.position || !projectile.direction) {
        return;
      }
      setProjectiles((prev) => [
        ...prev,
        {
          ...projectile,
          position: new Vector3().fromArray(projectile.position), // Convert array to Vector3
          direction: new Vector3().fromArray(projectile.direction), // Convert array to Vector3
        },
      ]);
    });

    socket.on("newExplosion", (explosion) => {
      console.log("Received explosion", explosion);
      if (!explosion.position) {
        return;
      }
      setExplosions((prev) => [...prev, explosion]);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("newProjectile");
      socket.off("explosion");
    };
  }, [setOtherPlayers]);

  const emitPlayerState = throttle((newPosition, newRotation) => {
    console.log("Emitting player state", newPosition, newRotation);
    socket.emit("playerState", {
      position: [newPosition.x, newPosition.y, newPosition.z],
      rotation: [newRotation.x, newRotation.y, newRotation.z, newRotation.w],
      userId: socket.id,
    });
  }, 300);

  const shootProjectile = () => {
    console.log("Shooting projectile");
    console.log("Spaceship position", spaceshipPosition);
    console.log("Spaceship rotation", spaceshipRotation);
    const direction = new Vector3(0, 0, -2).applyQuaternion(spaceshipRotation.clone());
    const projectile = {
      position: spaceshipPosition.clone().add(direction.clone().multiplyScalar(5)),
      direction,
      speed: 2,
      id: Date.now()
    };
    setProjectiles((prev) => [...prev, projectile]);

    socket.emit('shootProjectile', {
      ...projectile,
      position: projectile.position.toArray(), // Convert Vector3 to array for transmission
      direction: projectile.direction.toArray(), // Convert Vector3 to array for transmission
    });
  };

  const addExplosion = (position) => {
    const explosion = {
      position: position.toArray(),
      color: [1, 0.5, 0], // Orange color for explosion
      size: 5,
      ttl: 200 // Time to live for the explosion in ms
    };
    setExplosions((prev) => [...prev, explosion]);
    socket.emit('explosion', explosion);
  };

  const checkCollision = useCallback(() => {
    projectiles.forEach((projectile) => {
      if (!projectile.position) {
        return;
      }
      const distance = projectile.position.distanceTo(spaceshipPosition);
      if (distance < 5) { // Assuming a collision threshold of 5 units
        setHealth((prevHealth) => prevHealth - 20);
        socket.emit('playerHit', socket.id, 20); // Notify server of hit
        setHitEffect(true);
        setTimeout(() => setHitEffect(false), 200); // Reset the effect after 200ms
        if (health <= 20) {
          // Respawn the user
          setSpaceshipPosition(new Vector3(0, 100, 200));
          setSpaceshipRotation(new Quaternion());
          setHealth(100);
        }
        addExplosion(projectile.position); // Add explosion effect
        // Remove the projectile after collision
        setProjectiles((prev) => prev.filter((p) => p.id !== projectile.id));
      }
    });
  }, [projectiles, spaceshipPosition, health, setHealth, setHitEffect]);

  useFrame(() => {
    if (isSpaceshipView) {
      camera.position.copy(spaceshipPosition);
      camera.quaternion.copy(spaceshipRotation);

      const direction = new Vector3();
      const rotationMatrix = new Matrix4().makeRotationFromQuaternion(spaceshipRotation);

      if (keysPressed.current['KeyW']) direction.z -= 1;
      if (keysPressed.current['KeyS']) direction.z += 1;
      if (keysPressed.current['KeyA']) direction.x -= 1;
      if (keysPressed.current['KeyD']) direction.x += 1;
      if (keysPressed.current['Space']) direction.y += 1;
      if (keysPressed.current['ShiftLeft']) direction.y -= 1;

      direction.applyMatrix4(rotationMatrix);
      direction.normalize().multiplyScalar(movementSpeed);

      const newPosition = spaceshipPosition.clone().add(direction);
      const distanceFromCenter = newPosition.length();

      if (distanceFromCenter < SYSTEM_RADIUS * 5) {
        setSpaceshipPosition(newPosition);
        setEdgeOpacity(0);
      } else {
        const clampedPosition = newPosition.normalize().multiplyScalar(SYSTEM_RADIUS);
        setSpaceshipPosition(clampedPosition);
        setEdgeOpacity(Math.min((distanceFromCenter - SYSTEM_RADIUS) / 100, 1));
      }

      const rotationChange = new Quaternion();
      if (keysPressed.current['ArrowLeft']) {
        rotationChange.setFromAxisAngle(new Vector3(0, 1, 0), rotationSpeed);
      }
      if (keysPressed.current['ArrowRight']) {
        rotationChange.setFromAxisAngle(new Vector3(0, 1, 0), -rotationSpeed);
      }
      if (keysPressed.current['ArrowUp']) {
        rotationChange.setFromAxisAngle(new Vector3(1, 0, 0), rotationSpeed);
      }
      if (keysPressed.current['ArrowDown']) {
        rotationChange.setFromAxisAngle(new Vector3(1, 0, 0), -rotationSpeed);
      }

      setSpaceshipRotation((prev) => prev.multiply(rotationChange));

      emitPlayerState(newPosition, spaceshipRotation);
    }

    setProjectiles((prev) => prev.map(p => {
      if (!p.position || !p.direction) {
        return p;
      }
      return {
        ...p,
        position: p.position.clone().add(p.direction.clone().multiplyScalar(p.speed))
      };
    }));

    checkCollision();

    // Remove expired explosions
    setExplosions((prev) => prev.filter((explosion) => {
      explosion.ttl -= 16; // Assuming a frame duration of ~16ms
      return explosion.ttl > 0;
    }));
  });

  useEffect(() => {
    if (!isSpaceshipView && controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [isSpaceshipView]);

  const handlePlanetClick = useCallback((planetName) => {
    setSelectedPlanet(planetName);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={CAMERA_FOV} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        enabled={!isSpaceshipView}
        args={[camera, gl.domElement]}
      />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={1.5} />

      <Sun position={[0, 0, 0]} size={1500 * SCALE_FACTOR} texture={sunTex} />
      {planetData.map((planet) => (
        <React.Fragment key={planet.name}>
          <Planet
            size={planet.diameter * SCALE_FACTOR}
            texture={planet.texture}
            rotationSpeed={(1 / planet.rotationPeriod) * 0.01}
            orbitSpeed={(1 / planet.orbitalPeriod) * ORBIT_SPEED_FACTOR}
            distanceFromSun={planet.distanceFromSun * SCALE_FACTOR * 80}
            name={planet.name}
            orbitalInclination={planet.orbitalInclination}
            obliquityToOrbit={planet.obliquityToOrbit}
            onClick={handlePlanetClick}
            hasRings={planet.hasRingSystem}
            numberOfMoons={planet.numberOfMoons}
            surfaceGravity={planet.surfaceGravity}
            meanTemperature={planet.meanTemperature}
            orbitalEccentricity={planet.orbitalEccentricity}
          />
          <OrbitLine
            sunPosition={[0, 0, 0]}
            distance={planet.distanceFromSun * SCALE_FACTOR * 80 || 0}
            eccentricity={planet.orbitalEccentricity || 0}
            inclination={planet.orbitalInclination || 0}
          />
        </React.Fragment>
      ))}
      <Stars radius={SYSTEM_RADIUS} depth={50} count={50000} factor={30} saturation={10} fade speed={1} />
      {isSpaceshipView && (
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="black" transparent opacity={edgeOpacity} />
        </mesh>
      )}
      {Object.values(otherPlayers).map((player, index) => {
        if (!player.position || player.position.length < 3) {
          return null;
        }
        return (
          <React.Fragment key={index}>
            <Spaceship position={player.position} rotation={player.rotation} playerId={player.id} />
            <Html position={[player.position[0], player.position[1] + 20, player.position[2]]} distanceFactor={10}>
              <div className="player-name" style={{ transform: 'translate(-50%, -100%)', color: 'white', fontSize: '15em', backgroundColor: "rgba(255,100,200,0.4)", padding: '2px 5px', borderRadius: '5px' }}>
                {player.name}
              </div>
            </Html>
          </React.Fragment>
        );
      })}
      {projectiles.map((projectile, index) => {
        if (!projectile.position) {
          return null;
        }
        return (
          <mesh key={index} position={projectile.position}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        );
      })}
      {explosions.map((explosion, index) => (
        <mesh key={index} position={new Vector3().fromArray(explosion.position)}>
          <sphereGeometry args={[10, 32, 32]} />
          <meshBasicMaterial color={new Color(...explosion.color)} transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  );
};

export default SpaceScene;
