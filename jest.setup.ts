// Test-only mocks: give expo-crypto a working randomUUID and swap AsyncStorage's
// native module for the in-memory mock so importing PeopleContext doesn't crash under Jest.
jest.mock('expo-crypto', () => ({
  randomUUID: () => require('crypto').randomUUID(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
