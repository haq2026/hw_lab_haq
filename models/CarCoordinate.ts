// A saved parking spot. One plain object is enough here because
// react-native-maps' Marker takes { latitude, longitude } directly,
// and JSON.stringify can persist it without any extra setup.
export interface CarCoordinate {
  latitude: number;
  longitude: number;
}

// The "nothing saved yet" value. (0, 0) is used as the empty marker,
// same as the Swift version.
export const defaultCarCoordinate: CarCoordinate = {
  latitude: 0.0,
  longitude: 0.0,
};

// Returns true when a real location has been saved, meaning at least
// one of latitude/longitude is not zero. Used to enable the
// "Where's My Car?" button and show the "Location Saved" label.
export function isValidCoordinate(coordinate: CarCoordinate): boolean {
  return coordinate.latitude !== 0 || coordinate.longitude !== 0;
}

// Turns a coordinate into a readable string like "(40.444644, -79.945424)",
// always with six decimal places. Used in the save alert and the map info card.
export function formatCoordinate(coordinate: CarCoordinate): string {
  const lat = coordinate.latitude.toFixed(6);
  const lon = coordinate.longitude.toFixed(6);
  return `(${lat}, ${lon})`;
}
