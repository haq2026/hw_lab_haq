import { Alert, Platform } from 'react-native';
import { isValidTask } from '../models/TaskItem';

/**
 * Formats a date like "October 21, 2026" for display in the list and forms.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

/**
 * Builds the onChange handler for the DateTimePicker.
 * Hides the picker on Android (it closes itself) and passes the picked date to onPick.
 */
export function makeDateChangeHandler(
  setShowPicker: (show: boolean) => void,
  onPick: (date: Date) => void,
) {
  // The actual handler the picker calls whenever the user changes the date.
  return (_event: unknown, selected?: Date) => {
    // Android auto-dismisses; iOS stays open until we set it to false ourselves.
    setShowPicker(Platform.OS === 'ios');
    if (selected) onPick(selected);
  };
}

/**
 * Validates the form, runs the save, then calls onDone if it worked.
 * Shows an alert for missing fields or if the save throws.
 */
export async function saveWithValidation(
  name: string,
  assignedTo: string,
  save: () => Promise<void>,
  onDone: () => void,
) {
  if (!isValidTask(name, assignedTo)) {
    Alert.alert('Validation Error', 'Please fill in both name and assignee.');
    return;
  }
  try {
    await save();
    onDone();
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to save task.');
  }
}

/**
 * Asks the user to confirm before deleting a task.
 * If they tap Delete, runs performDelete and then onDone, or shows an error alert.
 */
export function confirmDelete(
  performDelete: () => Promise<void>,
  onDone: () => void,
) {
  Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      // Runs only after the user confirms the delete.
      onPress: async () => {
        try {
          await performDelete();
          onDone();
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to delete task.');
        }
      },
    },
  ]);
}
