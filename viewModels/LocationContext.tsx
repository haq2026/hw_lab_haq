import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarCoordinate, defaultCarCoordinate } from '../models/CarCoordinate';

// Key the saved coordinate lives under in AsyncStorage.
const STORAGE_KEY = '@FindMyCar:coordinate';

// Everything a screen can read or call from this view model.
type LocationContextValue = {
  coordinate: CarCoordinate;
  loading: boolean;
  saveCurrentLocation: () => Promise<CarCoordinate>;
  clearLocation: () => Promise<void>;
};

// Shared context so both screens see the same saved coordinate.
const LocationContext = createContext<LocationContextValue | undefined>(undefined);

// Provider that owns the saved car coordinate. It loads the last saved
// spot on startup, gets the phone's location when asked, and writes it
// to AsyncStorage so it survives app restarts. Wrap the app in this.
export function LocationProvider({ children }: { children: ReactNode }) {
  const [coordinate, setCoordinate] = useState<CarCoordinate>(defaultCarCoordinate);
  const [loading, setLoading] = useState(true);

  // Load whatever coordinate was saved from a previous session on mount.
  // This is the RN equivalent of the Swift LocationManager's loadLocation()
  // being called from init().
  useEffect(() => {
    // Async helper run once on mount: reads the stored JSON (if any),
    // puts it into state, and turns off the loading flag either way.
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json != null) setCoordinate(JSON.parse(json));
      } catch (error) {
        console.error('Error loading coordinate:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Gets the device's current position and saves it as the car's spot.
  // Checks that location services are on and permission is granted
  // (asking for it if needed), then stores the result in AsyncStorage
  // and in state. Throws an Error with a readable message on failure.
  async function saveCurrentLocation(): Promise<CarCoordinate> {
    // Confirm services + permissions before asking for a position.
    if (!(await Location.hasServicesEnabledAsync())) {
      throw new Error('Location services are disabled.');
    }
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      ({ status } = await Location.requestForegroundPermissionsAsync());
    }
    if (status !== 'granted') {
      throw new Error('Location access denied. Please enable in Settings.');
    }

    const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    const next: CarCoordinate = {
      latitude: fix.coords.latitude,
      longitude: fix.coords.longitude,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCoordinate(next);
    return next;
  }

  // Forgets the saved spot by resetting both storage and state back
  // to the default (0, 0) coordinate.
  async function clearLocation(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCarCoordinate));
    setCoordinate(defaultCarCoordinate);
  }

  return (
    <LocationContext.Provider value={{ coordinate, loading, saveCurrentLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook screens use to get the saved coordinate and the
// save/clear functions. Throws if used outside a LocationProvider
// so wiring mistakes show up right away.
export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside a LocationProvider');
  return ctx;
}
