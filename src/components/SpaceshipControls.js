// SpaceshipControls.js
import React from 'react';
import { FaRocket, FaArrowLeft } from 'react-icons/fa';
import './SpaceshipControls.css';

const SpaceshipControls = ({ 
  isSpaceshipView, 
  toggleSpaceshipView, 
  movementSpeed, 
  rotationSpeed,
  setMovementSpeed,
  setRotationSpeed
}) => {
  return (
    <div className="spaceship-controls-container">
      <button 
        onClick={toggleSpaceshipView}
        className="spaceship-toggle-btn"
      >
        {isSpaceshipView ? (
          <>
            <FaArrowLeft /> Exit Spaceship
          </>
        ) : (
          <>
            <FaRocket /> Enter Spaceship
          </>
        )}
      </button>
      {isSpaceshipView && (
        <div className="spaceship-controls-info">
          <h3>Spaceship Controls</h3>
          <ul>
            <li><strong>W, A, S, D:</strong> Move</li>
            <li><strong>Space / Shift:</strong> Up / Down</li>
            <li><strong>Arrow Keys:</strong> Rotate</li>
          </ul>
          <div className="spaceship-stats">
            <label>
              Speed: {movementSpeed.toFixed(2)}
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1" 
                value={movementSpeed}
                onChange={(e) => setMovementSpeed(Number(e.target.value))}
              />
            </label>
            <label>
              Rotation: {rotationSpeed.toFixed(4)}
              <input 
                type="range" 
                min="0.0005" 
                max="0.05" 
                step="0.0005" 
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceshipControls;