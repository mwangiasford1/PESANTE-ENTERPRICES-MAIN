import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api';

const PropertiesContext = createContext();

export const PropertiesProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null); // 🔴 Add error state

  useEffect(() => {
    api.getProperties()
      .then(data => {
        setProperties(data);
        setError(null); // clear error if successful
      })
      .catch(err => {
        console.error('API error:', err);
        setError(err.message || 'Something went wrong');
      });
  }, []);

  return (
    <PropertiesContext.Provider value={{ properties, error }}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => useContext(PropertiesContext);
