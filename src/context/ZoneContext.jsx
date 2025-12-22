// src/context/ZoneContext.jsx
// Context for tracking current zone and wing for admin content uploads
import { createContext, useContext, useState } from 'react';

const ZoneContext = createContext(null);

export function ZoneProvider({ children }) {
  const [currentZone, setCurrentZone] = useState(null);
  const [currentWing, setCurrentWing] = useState(null);

  return (
    <ZoneContext.Provider value={{ currentZone, currentWing, setCurrentZone, setCurrentWing }}>
      {children}
    </ZoneContext.Provider>
  );
}

export function useZoneContext() {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZoneContext must be used within a ZoneProvider');
  }
  return context;
}
