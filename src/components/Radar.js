// // src/components/Radar.js

// import React, { useEffect } from 'react';
// import '../styles/Radar.css';

// const Radar = ({ playerPosition, otherPlayers, userName }) => {
//   const radarRadius = 100;

//   useEffect(() => {
//     console.log(playerPosition);
//   }, [playerPosition]);

//   const calculateRelativePosition = (otherPosition) => {
//     const scale = 0.1; // Scale down the position to fit within the radar
//     const relativeX = (otherPosition[0] - playerPosition.x) * scale + radarRadius;
//     const relativeY = -(otherPosition[2] - playerPosition.z) * scale + radarRadius;
//     return {
//       x: relativeX,
//       y: relativeY,
//       isWithinBounds: relativeX >= 0 && relativeX <= 1.9 * radarRadius && relativeY >= 0 && relativeY <= 2 * radarRadius
//     };
//   };

//   return (
//     <div className="radar">
//       <div className="radar-circle">
//         <div
//           className="radar-player"
//           style={{
//             left: radarRadius,
//             top: radarRadius,
//           }}
//         />
//         <div className="radar-player-name" style={{ left: radarRadius, top: radarRadius - 20 }}>
//           {userName}
//         </div>
//         {Object.values(otherPlayers).map((player, index) => {
//           const otherPlayerPosition = calculateRelativePosition(player.position);
//           if (!otherPlayerPosition.isWithinBounds) {
//             return null; // Do not render the dot if it's out of bounds
//           }
//           return (
//             <div key={index} className="radar-other-player-wrapper">
//               <div
//                 className="radar-other-player"
//                 style={{
//                   left: otherPlayerPosition.x,
//                   top: otherPlayerPosition.y,
//                 }}
//               />
//               <div className="radar-other-player-name" style={{ left: otherPlayerPosition.x, top: otherPlayerPosition.y - 20 }}>
//                 {player.name}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Radar;


import React, { useEffect } from 'react';
import '../styles/Radar.css';

const Radar = ({ playerPosition, otherPlayers, userName }) => {
  const radarRadius = 100;

  useEffect(() => {
    console.log(playerPosition);
    console.log("radar loaded");
  }, [playerPosition, otherPlayers]);

  const calculateRelativePosition = (otherPosition) => {
    // Check if the player position is valid
    if (!playerPosition || playerPosition.length < 3 || !otherPosition || otherPosition.length < 3) {
      return { x: radarRadius, y: radarRadius, isWithinBounds: false };
    }
    const scale = 0.1; // Scale down the position to fit within the radar
    const relativeX = (otherPosition[0] - playerPosition.x) * scale + radarRadius;
    const relativeY = -(otherPosition[2] - playerPosition.z) * scale + radarRadius;
    return {
      x: relativeX,
      y: relativeY,
      isWithinBounds: relativeX >= 0 && relativeX <= 1.9 * radarRadius && relativeY >= 0 && relativeY <= 2 * radarRadius
    };
  };

  return (
    <div className="radar">
      <div className="radar-circle">
        <div
          className="radar-player"
          style={{
            left: radarRadius,
            top: radarRadius,
          }}
        />
        <div className="radar-player-name" style={{ left: radarRadius, top: radarRadius - 20 }}>
          {userName}
        </div>
        {Object.values(otherPlayers).map((player, index) => {
          // Ensure the player position is valid before rendering
          if (!player.position || player.position.length < 3) {
            return null;
          }
          const otherPlayerPosition = calculateRelativePosition(player.position);
          if (!otherPlayerPosition.isWithinBounds) {
            return null; // Do not render the dot if it's out of bounds
          }
          return (
            <div key={index} className="radar-other-player-wrapper">
              <div
                className="radar-other-player"
                style={{
                  left: otherPlayerPosition.x,
                  top: otherPlayerPosition.y,
                }}
              />
              <div className="radar-other-player-name" style={{ left: otherPlayerPosition.x, top: otherPlayerPosition.y - 20 }}>
                {player.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Radar;
