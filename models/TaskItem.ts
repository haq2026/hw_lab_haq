// A single task in the Arbeit app. id is optional because Firestore
// assigns it when the document is first created.
export interface TaskItem {
  id?: string;
  name: string;
  assignedTo: string;
  dueDate: Date;
  dateAdded: Date;
  completed: boolean;
}

/**
 * Checks that a task has both a name and an assignee.
 * Whitespace-only strings count as empty.
 * Used by both the New Task and Edit Task screens.
 */
export function isValidTask(name: string, assignedTo: string): boolean {
  return name.trim().length > 0 && assignedTo.trim().length > 0;
}

/**
 * Comparator for Array.sort() that orders tasks alphabetically by name.
 * Returns a negative number if a comes first, positive if b comes first, 0 if equal.
 */
export function compareTasksByName(a: TaskItem, b: TaskItem): number {
  return a.name.localeCompare(b.name);
}

/**
 * Comparator for Array.sort() that orders tasks by due date, earliest first.
 */
export function compareTasksByDueDate(a: TaskItem, b: TaskItem): number {
  return a.dueDate.getTime() - b.dueDate.getTime();
}

/**
 * Returns true when two tasks have the same name, assignee and due date.
 * Ignores id, dateAdded and completed on purpose.
 */
export function areTasksEqual(a: TaskItem, b: TaskItem): boolean {
  return (
    a.name === b.name &&
    a.assignedTo === b.assignedTo &&
    a.dueDate.getTime() === b.dueDate.getTime()
  );
}
