import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

function App() {
  const globeEl = useRef();
  const [fires, setFires] = useState([]);

  useEffect(() => {
    // 1. Auto-rotate the globe
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.6;

    // 2. Fetch Real Data from YOUR Backend
    fetch('http://localhost:7071/api/GetDisasters')
      .then(res => res.json())
      .then(data => {
        console.log("Data received:", data); // Debugging line
        setFires(data);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
       <div style={{ position: 'absolute', zIndex: 1, color: 'white', padding: '20px', pointerEvents: 'none', fontFamily: 'Arial' }}>
        <h1 style={{ margin: 0 }}>GaiaWatch 🌍</h1>
        <p style={{ margin: 0 }}>LIVE NASA FEED: Monitoring {fires.length} Active Wildfires</p>
      </div>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // The data now comes from your API state
        pointsData={fires}
        
        // Visual settings
        pointAltitude={0.02}
        pointColor="color"
        pointRadius={0.1}
        
        // Tooltip when hovering
        pointLabel={d => `
          <div style="background: black; color: white; padding: 5px; border-radius: 4px;">
            <b>${d.title}</b>
          </div>
        `}
      />
    </div>
  );
}

export default App;