// src/components/NamePicker.js

import React from 'react';
import '../styles/NamePicker.css';

const NamePicker = ({ userName, setUserName }) => {
  return (
    <div className="name-picker">
      <label htmlFor="name-input" className="name-label">Enter your name:</label>
      <input 
        id="name-input"
        type="text" 
        placeholder="Your name" 
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
        className="name-input"
      />
    </div>
  );
};

export default NamePicker;

