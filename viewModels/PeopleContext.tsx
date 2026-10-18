import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person, createBlankPerson } from '../models/Person';

const STORAGE_KEY = '@SimpleContacts:people';

export type SortOrder = 'asc' | 'desc';

/**
 * filterAndSort (pure function)
 * Takes the full list of people, the current search text and a sort order, and returns
 * a NEW array containing only people whose name contains the search text (case-insensitive,
 * whitespace trimmed), sorted by name A-Z ('asc') or Z-A ('desc').
 * An empty / whitespace-only search returns everyone. The input array is never mutated.
 * This replaces the Swift #Predicate + SortDescriptor inside @Query, and is kept outside
 * the hook so it can be unit tested on its own.
 */
export function filterAndSort(people: Person[], searchText: string, sortOrder: SortOrder): Person[] {
  const needle = searchText.trim().toLowerCase();
  const filtered = needle === ''
    ? people
    : people.filter((p) => p.name.toLowerCase().includes(needle));
  return [...filtered].sort((a, b) =>
    sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
}

type PeopleContextValue = {
  people: Person[];
  loading: boolean;
  addPerson: () => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
};

const PeopleContext = createContext<PeopleContextValue | undefined>(undefined);

/**
 * PeopleProvider
 * Wraps the whole app (like .modelContainer(for: Person.self) in Swift) and owns the
 * list of people in React state. It loads saved people from AsyncStorage on mount,
 * saves the whole list back every time it changes, and exposes CRUD helpers through context.
 * Params: children - the screens/navigator that need access to the people data.
 */
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load effect: runs once when the provider mounts. Reads the JSON saved under
   * STORAGE_KEY from a previous session and puts it into state, then marks loading false
   * (even on error) so the save effect knows it is safe to start writing.
   */
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json != null) setPeople(JSON.parse(json));
      } catch (error) {
        console.error('Error loading people:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Save effect: runs whenever `people` (or `loading`) changes. Once the initial load is
   * done it writes the whole array to AsyncStorage, so no screen ever has to call "save"
   * by hand. Skipping while loading stops us from overwriting saved data with [].
   */
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(people)).catch((error) =>
        console.error('Error saving people:', error)
      );
    }
  }, [people, loading]);

  /**
   * addPerson
   * Creates a blank Person, appends it to the list, and returns it so the caller
   * (PeopleView) can immediately navigate to its edit screen.
   */
  const addPerson = (): Person => {
    const person = createBlankPerson();
    setPeople((prev) => [...prev, person]);
    return person;
  };

  /**
   * updatePerson
   * Finds the person with the given id and merges the partial `updates` into it
   * (e.g. { name: 'Tim' }), producing a new array so React re-renders. Other people are untouched.
   */
  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  /**
   * deletePerson
   * Removes the person with the given id from the list (used by swipe-to-delete).
   */
  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  /**
   * getPerson
   * Returns the current copy of the person with the given id, or undefined if
   * they no longer exist. The edit screen uses this so it always shows live data.
   */
  const getPerson = (id: string) => people.find((p) => p.id === id);

  return (
    <PeopleContext.Provider
      value={{ people, loading, addPerson, updatePerson, deletePerson, getPerson }}
    >
      {children}
    </PeopleContext.Provider>
  );
}

/**
 * usePeople
 * Custom hook that screens call to read the people list and CRUD helpers from context.
 * Throws a clear error if used outside PeopleProvider so the mistake is easy to spot.
 */
export function usePeople(): PeopleContextValue {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error('usePeople must be used inside a PeopleProvider');
  return ctx;
}
