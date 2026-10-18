import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PeopleProvider } from './viewModels/PeopleContext';
import PeopleView from './views/PeopleView';
import EditPersonView from './views/EditPersonView';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App
 * Root component. GestureHandlerRootView enables swipe gestures, PeopleProvider shares
 * and persists the contacts (like .modelContainer in Swift), and the native stack holds
 * the two screens: the "My Contacts" list and the "Edit Person" form.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PeopleProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="People"
              component={PeopleView}
              options={{ title: 'My Contacts', headerLargeTitle: true }}
            />
            <Stack.Screen
              name="EditPerson"
              component={EditPersonView}
              options={{ title: 'Edit Person', headerBackTitle: 'My Contacts' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PeopleProvider>
    </GestureHandlerRootView>
  );
}
