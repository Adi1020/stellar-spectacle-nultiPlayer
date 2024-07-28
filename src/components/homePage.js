// src/components/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3, Quaternion } from 'three';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import socket from '../services/socket';
import SpaceshipControls from './SpaceshipControls';
import SpaceScene from './SpaceScene';
import Radar from './Radar';
import NamePicker from './NamePicker';
import ErrorBoundary from './ErrorBoundary';
import '../styles/App.css';

const HomePage = () => {
  const [isSpaceshipView, setIsSpaceshipView] = useState(false);
  const [spaceshipPosition, setSpaceshipPosition] = useState(() => new Vector3(0, 100, 200));
  const [spaceshipRotation, setSpaceshipRotation] = useState(() => new Quaternion());
  const [movementSpeed, setMovementSpeed] = useState(0.05);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [otherPlayers, setOtherPlayers] = useState({});
  const [userName, setUserName] = useState('');
  const [user, loading] = useAuthState(auth);

  const toggleSpaceshipView = useCallback(() => {
    setIsSpaceshipView((prev) => !prev);
  }, []);

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setOtherPlayers(players);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, []);

  useEffect(() => {
    if (userName) {
      socket.emit('playerState', {
        position: [spaceshipPosition.x, spaceshipPosition.y, spaceshipPosition.z],
        rotation: [spaceshipRotation.x, spaceshipRotation.y, spaceshipRotation.z, spaceshipRotation.w],
        name: userName
      });
    }
  }, [userName, spaceshipPosition, spaceshipRotation]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="intro-visual" aria-label="Interactive 3D space scene">
        <ErrorBoundary>
          <Canvas>
            <SpaceScene 
              isSpaceshipView={isSpaceshipView}
              spaceshipPosition={spaceshipPosition}
              spaceshipRotation={spaceshipRotation}
              setSpaceshipPosition={setSpaceshipPosition}
              setSpaceshipRotation={setSpaceshipRotation}
              movementSpeed={movementSpeed}
              rotationSpeed={rotationSpeed}
              otherPlayers={otherPlayers}
              setOtherPlayers={setOtherPlayers}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
      {user ? (
        <>
          <SpaceshipControls 
            isSpaceshipView={isSpaceshipView}
            toggleSpaceshipView={toggleSpaceshipView}
            movementSpeed={movementSpeed}
            rotationSpeed={rotationSpeed}
            setMovementSpeed={setMovementSpeed}
            setRotationSpeed={setRotationSpeed}
          />
          <NamePicker 
            userName={userName} 
            setUserName={setUserName} 
          />
          <Radar 
            playerPosition={spaceshipPosition} 
            otherPlayers={otherPlayers} 
            userName={userName} 
          />
        </>
      ) : (
        <p>Please log in to create a spaceship.</p>
      )}
      <div className="server_status">
        <p>Server status: {socket.connected ? "Connected" : "Disconnected"}</p>
      </div>
    </div>
  );
};

export default HomePage;
