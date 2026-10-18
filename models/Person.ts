import * as Crypto from 'expo-crypto';

/**
 * Person
 * The shape of one contact. This is the RN stand-in for the Swift `@Model class Person`.
 * - id: unique UUID so React lists and lookups can tell contacts apart
 * - name / email / details: plain text fields edited in EditPersonView
 * - photoUri: optional file URI from expo-image-picker (we store a reference, not the image bytes)
 */
export interface Person {
  id: string;
  name: string;
  email: string;
  details: string;
  photoUri?: string;
}

/**
 * createBlankPerson
 * Factory that returns a brand new, empty Person with a fresh UUID.
 * Used by addPerson() when the user taps "+" so the edit screen has something to fill in.
 * Returns: a Person with empty name/email/details and no photo.
 */
export function createBlankPerson(): Person {
  return {
    id: Crypto.randomUUID(),
    name: '',
    email: '',
    details: '',
  };
}
