'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CityInfo, SUPPORTED_CITIES, findNearestCity } from '@/lib/cities';

interface LocationContextType {
  city: CityInfo;
  setCity: (city: CityInfo) => void;
  selectCityByName: (cityName: string) => void;
  isLocating: boolean;
  detectGpsLocation: () => Promise<CityInfo | null>;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  locationMessage: string | null;
  clearLocationMessage: () => void;
}

const defaultLocationContext: LocationContextType = {
  city: SUPPORTED_CITIES[0],
  setCity: () => {},
  selectCityByName: () => {},
  isLocating: false,
  detectGpsLocation: async () => null,
  showModal: false,
  setShowModal: () => {},
  locationMessage: null,
  clearLocationMessage: () => {},
};

const LocationContext = createContext<LocationContextType>(defaultLocationContext);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<CityInfo>(SUPPORTED_CITIES[0]); // Default Noida
  const [isLocating, setIsLocating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // Restore saved city from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('find2stay_city');
      if (saved) {
        const found = SUPPORTED_CITIES.find(
          (c) => c.name.toLowerCase() === saved.toLowerCase() || c.id === saved.toLowerCase()
        );
        if (found) {
          setCityState(found);
        }
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const setCity = (newCity: CityInfo) => {
    setCityState(newCity);
    try {
      localStorage.setItem('find2stay_city', newCity.name);
      document.cookie = `f2s_city=${encodeURIComponent(newCity.name)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }
    setShowModal(false);
  };

  const selectCityByName = (cityName: string) => {
    const found = SUPPORTED_CITIES.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase() || c.id === cityName.toLowerCase()
    );
    if (found) {
      setCity(found);
    } else {
      // Custom city name
      const customCity: CityInfo = {
        id: cityName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: cityName,
        state: 'India',
        lat: 20.5937,
        lng: 78.9629,
        tag: 'Nearby Verified Stays',
        localities: [],
      };
      setCity(customCity);
    }
  };

  const detectGpsLocation = async (): Promise<CityInfo | null> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return null;
    }

    setIsLocating(true);
    setLocationMessage(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const nearest = findNearestCity(latitude, longitude);
          setCity(nearest);
          setIsLocating(false);
          setShowModal(false);
          setLocationMessage(`📍 GPS Location detected: ${nearest.name} (${nearest.state}). Updated nearby stays!`);
          resolve(nearest);
        },
        (err) => {
          setIsLocating(false);
          let msg = 'Unable to retrieve location.';
          if (err.code === 1) {
            msg = 'Location permission denied. Please select your city manually.';
          } else if (err.code === 2) {
            msg = 'Location unavailable. Please select your city manually.';
          } else if (err.code === 3) {
            msg = 'Location request timed out. Please try again or select manually.';
          }
          setLocationMessage(msg);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  const clearLocationMessage = () => setLocationMessage(null);

  return (
    <LocationContext.Provider
      value={{
        city,
        setCity,
        selectCityByName,
        isLocating,
        detectGpsLocation,
        showModal,
        setShowModal,
        locationMessage,
        clearLocationMessage,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  return context || defaultLocationContext;
}
