import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, FlatList } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { usePeople, filterAndSort, SortOrder } from '../viewModels/PeopleContext';
import type { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'People'>;

/**
 * PeopleView
 * The "My Contacts" list screen. Reads people from context, keeps local state for the
 * search text and sort order, shows the filtered + sorted list, lets the user swipe a row
 * left to delete it, tap a row to edit it, and use the header buttons to sort or add.
 */
export default function PeopleView() {
  const navigation = useNavigation<NavProp>();
  const { people, addPerson, deletePerson } = usePeople();
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  /**
   * handleAdd
   * Creates a new blank contact in the store and immediately opens its edit screen,
   * same as AppView.addPerson() in Swift.
   */
  const handleAdd = () => {
    const person = addPerson();
    navigation.navigate('EditPerson', { personId: person.id });
  };

  /**
   * handleSort
   * Shows an alert with "Name (A-Z)" / "Name (Z-A)" options and updates sortOrder
   * based on the choice (RN replacement for the Swift toolbar Menu + Picker).
   */
  const handleSort = () => {
    Alert.alert('Sort', undefined, [
      { text: 'Name (A-Z)', onPress: () => setSortOrder('asc') },
      { text: 'Name (Z-A)', onPress: () => setSortOrder('desc') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  /**
   * Header setup effect: runs before paint and puts a native search bar
   * (like .searchable in SwiftUI) plus the sort and add buttons into the nav header.
   */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Search',
        onChangeText: (event: any) => setSearchText(event.nativeEvent.text),
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable onPress={handleSort}>
            <Ionicons name="swap-vertical" size={22} color="#007AFF" />
          </Pressable>
          <Pressable onPress={handleAdd}>
            <Ionicons name="add" size={26} color="#007AFF" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  /**
   * displayedPeople
   * Memoized result of filterAndSort; only recomputes when people, searchText,
   * or sortOrder change (RN version of the Swift @Query predicate + sort).
   */
  const displayedPeople = useMemo(
    () => filterAndSort(people, searchText, sortOrder),
    [people, searchText, sortOrder]
  );

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: '#f2f2f7' }}
      data={displayedPeople}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Swipeable
          renderRightActions={() => (
            <Pressable style={styles.deleteAction} onPress={() => deletePerson(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          )}
        >
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('EditPerson', { personId: item.id })}
          >
            <Text style={styles.name}>{item.name || 'New Contact'}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </Pressable>
        </Swipeable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  name: { fontSize: 17 },
  deleteAction: { backgroundColor: 'red', justifyContent: 'center', paddingHorizontal: 20 },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
