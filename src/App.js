// // src/App.js

// import React, { useState, useEffect, useCallback } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Canvas } from '@react-three/fiber';
// import { Vector3, Quaternion } from 'three';
// import Navigation from './components/Navigation';
// import ErrorBoundary from './components/ErrorBoundary';
// import './styles/App.css';
// import socket from './services/socket';
// import SpaceshipControls from './components/SpaceshipControls';
// import SpaceScene from './components/SpaceScene';
// import Radar from './components/Radar';
// import NamePicker from './components/NamePicker'; // Import the NamePicker component

// const HomePage = () => {
//   const [isSpaceshipView, setIsSpaceshipView] = useState(false);
//   const [spaceshipPosition, setSpaceshipPosition] = useState(() => new Vector3(0, 100, 200));
//   const [spaceshipRotation, setSpaceshipRotation] = useState(() => new Quaternion());
//   const [movementSpeed, setMovementSpeed] = useState(0.05);
//   const [rotationSpeed, setRotationSpeed] = useState(0.005);
//   const [otherPlayers, setOtherPlayers] = useState({});
//   const [userName, setUserName] = useState('');

//   const toggleSpaceshipView = useCallback(() => {
//     setIsSpaceshipView((prev) => !prev);
//   }, []);

//   useEffect(() => {
//     socket.on("updatePlayers", (players) => {
//       setOtherPlayers(players);
//     });

//     return () => {
//       socket.off("updatePlayers");
//     };
//   }, []);

//   // Emit player state whenever the user's name changes
//   useEffect(() => {
//     if (userName) {
//       socket.emit('playerState', {
//         position: [spaceshipPosition.x, spaceshipPosition.y, spaceshipPosition.z],
//         rotation: [spaceshipRotation.x, spaceshipRotation.y, spaceshipRotation.z, spaceshipRotation.w],
//         name: userName
//       });
//     }
//   }, [userName, spaceshipPosition, spaceshipRotation]);

//   return (
//     <div className="home">
//       <div className="intro-visual" aria-label="Interactive 3D space scene">
//         <ErrorBoundary>
//           <Canvas>
//             <SpaceScene 
//               isSpaceshipView={isSpaceshipView}
//               spaceshipPosition={spaceshipPosition}
//               spaceshipRotation={spaceshipRotation}
//               setSpaceshipPosition={setSpaceshipPosition}
//               setSpaceshipRotation={setSpaceshipRotation}
//               movementSpeed={movementSpeed}
//               rotationSpeed={rotationSpeed}
//               otherPlayers={otherPlayers}
//               setOtherPlayers={setOtherPlayers}
//             />
//           </Canvas>
//         </ErrorBoundary>
//       </div>
//       <SpaceshipControls 
//         isSpaceshipView={isSpaceshipView}
//         toggleSpaceshipView={toggleSpaceshipView}
//         movementSpeed={movementSpeed}
//         rotationSpeed={rotationSpeed}
//         setMovementSpeed={setMovementSpeed}
//         setRotationSpeed={setRotationSpeed}
//       />
//       <NamePicker 
//         userName={userName} 
//         setUserName={setUserName} 
//       />
//       <Radar 
//         playerPosition={spaceshipPosition} 
//         otherPlayers={otherPlayers} 
//         userName={userName} 
//       />
//       <div className="server_status">
//         <p>Server status: {socket.connected ? "Connected" : "Disconnected"}</p>
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   useEffect(() => {
//     const onConnect = () => {
//       console.log("Connected to the server");
//       setIsConnected(true);
//     };

//     const onDisconnect = () => {
//       console.log("Disconnected from the server");
//       setIsConnected(false);
//     };

//     socket.connect();

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <Router>
//       <div className="App">
//         <Navigation />
//         <ErrorBoundary>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//           </Routes>
//         </ErrorBoundary>
//         <div className="server_status">
//           <p>Server status: {isConnected ? "Connected" : "Disconnected"}</p>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// 24/7/24 - src/App.js
// src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Vector3, Quaternion } from 'three';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/App.css';
import socket from './services/socket';
import SpaceshipControls from './components/SpaceshipControls';
import SpaceScene from './components/SpaceScene';
import Radar from './components/Radar';
import NamePicker from './components/NamePicker';
import Auth from './components/auth'; // Ensure this matches the filename

const HomePage = () => {
  const [isSpaceshipView, setIsSpaceshipView] = useState(false);
  const [spaceshipPosition, setSpaceshipPosition] = useState(() => new Vector3(0, 100, 200));
  const [spaceshipRotation, setSpaceshipRotation] = useState(() => new Quaternion());
  const [movementSpeed, setMovementSpeed] = useState(0.05);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [otherPlayers, setOtherPlayers] = useState({});
  const [userName, setUserName] = useState('');
  const [health, setHealth] = useState(100); // Health state
  const [hitEffect, setHitEffect] = useState(false); // Hit effect state
  const [isPvPMode, setIsPvPMode] = useState(false); // PvP mode state
  const [connectedUsers, setConnectedUsers] = useState(0); // Connected users state
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard state

  const toggleSpaceshipView = useCallback(() => {
    setIsSpaceshipView((prev) => !prev);
  }, []);

  const togglePvPMode = () => {
    setIsPvPMode((prev) => !prev);
  };

  useEffect(() => {
    socket.on("updatePlayers", (players) => {
      setOtherPlayers(players || {});
    });

    socket.on("connectedUsers", (count) => {
      setConnectedUsers(count || 0);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("connectedUsers");
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
              health={health}
              setHealth={setHealth}
              hitEffect={hitEffect}
              setHitEffect={setHitEffect}
              isPvPMode={isPvPMode} // Pass PvP mode state
            />
          </Canvas>
        </ErrorBoundary>
      </div>
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
      <div className="crosshair">
        <div className="crosshair-line"></div>
        <div className="crosshair-line"></div>
      </div>
      <button className="pvpMode" onClick={togglePvPMode}>
        {isPvPMode ? "Disable PvP" : "Enable PvP"}
      </button>
      <div className="health-bar">
        <div className="health-bar-inner" style={{ width: `${health}%` }}></div>
      </div>
      {hitEffect && <div className="hit-effect"></div>}
      <div className="server_status">
        <p>Server status: {socket.connected ? "Connected" : "Disconnected"}</p>
      </div>
      <div className="connected-users">
        <p>Connected users: {connectedUsers}</p>
      </div>
    </div>
  );
};

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to the server");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("Disconnected from the server");
      setIsConnected(false);
    };

    socket.connect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <ErrorBoundary>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </ErrorBoundary>
        <div className="server_status">
          <p>Server status: {isConnected ? "Connected" : "Disconnected"}</p>
        </div>
      </div>
    </Router>
  );
}

export default App;
