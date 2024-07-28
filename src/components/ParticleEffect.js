import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

function ParticleEffect() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    let app;

    // Function to get current dimensions
    const getDimensions = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Function to create and setup the PIXI application
    const setupPixi = async () => {
      // Create a new PIXI Application
      app = new PIXI.Application({
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: 0x000000, // Black background for space
      });

      // Append the canvas to our React component
      if (canvasRef.current) {
        canvasRef.current.appendChild(app.view);
      }

      // Create a container for our particles
      const particles = new PIXI.Container();
      app.stage.addChild(particles);

      // Load texture
      try {
        const starTexture = await PIXI.Texture.fromURL('https://banner2.cleanpng.com/20180403/pjq/kisspng-star-light-clip-art-white-star-5ac3d26a194375.8335619215227828261035.jpg');

        // Create stars
        const stars = [];
        for (let i = 0; i < 500; i++) {
          const star = new PIXI.Sprite(starTexture);
          star.x = Math.random() * app.screen.width;
          star.y = Math.random() * app.screen.height;
          star.scale.set(0.1 + Math.random() * 0.3);
          star.alpha = 0.5 + Math.random() * 0.5;
          particles.addChild(star);
          stars.push(star);
        }

        // Animation loop
        app.ticker.add(() => {
          stars.forEach(star => {
            star.y += 0.1 + star.scale.x * 0.5;
            if (star.y > app.screen.height) {
              star.y = -5;
              star.x = Math.random() * app.screen.width;
            }
          });
        });
      } catch (error) {
        console.error("Failed to load texture:", error);
      }
    };

    // Setup PIXI

    // Handle window resize
    const handleResize = () => {
      const newDimensions = getDimensions();
      setDimensions(newDimensions);
      if (app) {
        app.renderer.resize(newDimensions.width, newDimensions.height);
        // Optionally, adjust particle positions here
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Set initial dimensions
      setDimensions(getDimensions());
    }

    // Clean up function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
      if (app) {
        app.destroy(true, { children: true, texture: true, baseTexture: true });
      }
    };
  }, []);

  return <div ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default ParticleEffect;