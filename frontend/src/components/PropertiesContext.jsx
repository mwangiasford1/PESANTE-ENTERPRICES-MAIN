import { createContext, useContext, useState, useEffect } from 'react';
import { getProperties } from '../api';

const PropertiesContext = createContext();

export function PropertiesProvider({ children }) {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    getProperties().then(setProperties);
  }, []);

  return (
    <PropertiesContext.Provider value={{ properties, setProperties }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
} 