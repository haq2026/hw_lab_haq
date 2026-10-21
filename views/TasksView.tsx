import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTasks } from '../viewModels/TasksContext';
import TaskRowView from './TaskRowView';
import type { TasksStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<TasksStackParamList, 'TasksList'>;

/**
 * Main list screen. Shows a spinner while Firestore loads, an empty state
 * if there are no tasks, and otherwise a list of TaskRowViews.
 */
export default function TasksView() {
  const { tasks, loading, toggleCompleted } = useTasks();
  const navigation = useNavigation<NavProp>();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptySubtitle}>Head to the New Task tab to create one</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      // Uses the Firestore document id as the React key for each row.
      keyExtractor={(item) => item.id!}
      // Renders one row, wiring tap to open details and the circle to toggle completion.
      renderItem={({ item }) => (
        <TaskRowView
          task={item}
          onPress={() => navigation.navigate('TaskDetails', { taskId: item.id! })}
          onToggleCompleted={() => toggleCompleted(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#666', marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: '#999', textAlign: 'center' },
});
