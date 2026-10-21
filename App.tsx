import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TasksProvider } from './viewModels/TasksContext';
import TasksView from './views/TasksView';
import NewTaskView from './views/NewTaskView';
import TaskDetailsView from './views/TaskDetailsView';
import type { TasksStackParamList, RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const TasksStack = createNativeStackNavigator<TasksStackParamList>();

/**
 * Stack used inside the Tasks tab so we can push from the list
 * into the Task Details screen and back.
 */
function TasksStackScreen() {
  return (
    <TasksStack.Navigator>
      <TasksStack.Screen name="TasksList" component={TasksView} options={{ title: 'Arbeit' }} />
      <TasksStack.Screen name="TaskDetails" component={TaskDetailsView} options={{ title: 'Task Details' }} />
    </TasksStack.Navigator>
  );
}

/**
 * Root of the app. TasksProvider wraps the navigation so every tab and
 * screen shares the same Firestore-backed task store.
 */
export default function App() {
  return (
    <TasksProvider>
      <NavigationContainer>
        <Tab.Navigator
          // Per-tab options: hide the tab header (the stack has its own) and pick an icon.
          screenOptions={({ route }) => ({
            headerShown: false,
            // Picks the tab bar icon based on which tab it is.
            tabBarIcon: ({ color, size }) => {
              const icon = route.name === 'Tasks' ? 'checkmark-done-circle' : 'add-circle';
              return <Ionicons name={icon} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Tasks" component={TasksStackScreen} />
          <Tab.Screen name="NewTask" component={NewTaskView} options={{ title: 'New Task', headerShown: true }} />
        </Tab.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
