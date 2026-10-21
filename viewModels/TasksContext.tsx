import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TaskItem } from '../models/TaskItem';

const COLLECTION = 'tasks';

// Everything the screens can read or call from the shared tasks store.
type TasksContextValue = {
  tasks: TaskItem[];
  loading: boolean;
  addTask: (task: Omit<TaskItem, 'id'>) => Promise<void>;
  updateTask: (task: TaskItem) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompleted: (task: TaskItem) => Promise<void>;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

/**
 * Provider that owns the task list for the whole app.
 * It keeps one live Firestore listener on the "tasks" collection and
 * exposes CRUD helpers to every screen underneath it.
 */
export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time updates from Firestore. The unsubscribe returned
  // by onSnapshot is what we call on unmount to tear the listener down --
  // the RN equivalent of the Swift version removing its ListenerRegistration
  // in deinit.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION),
      // Success callback: runs on first load and every time the collection changes.
      // Converts each Firestore document into a TaskItem, sorts, and stores it.
      (snapshot) => {
        // Map one Firestore document into a TaskItem, turning Timestamps into Dates.
        const next: TaskItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            assignedTo: data.assignedTo,
            dueDate: data.dueDate?.toDate() ?? new Date(),
            dateAdded: data.dateAdded?.toDate() ?? new Date(),
            completed: data.completed ?? false,
          };
        });

        // Incomplete first, then by due date ascending.
        next.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });

        setTasks(next);
        setLoading(false);
      },
      // Error callback: logs the problem and stops the loading spinner.
      (error) => {
        console.error('Firestore listener error:', error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  /**
   * Adds a new task document to Firestore. Firestore assigns the id,
   * and the listener above picks the new task up automatically.
   */
  const addTask = async (task: Omit<TaskItem, 'id'>) => {
    await addDoc(collection(db, COLLECTION), {
      ...task,
      dueDate: Timestamp.fromDate(task.dueDate),
      dateAdded: Timestamp.fromDate(task.dateAdded),
    });
  };

  /**
   * Writes the edited fields of an existing task back to its Firestore document.
   * Throws if the task has no id since there is nothing to update.
   */
  const updateTask = async (task: TaskItem) => {
    if (!task.id) throw new Error('Cannot update a task without an id');
    await updateDoc(doc(db, COLLECTION, task.id), {
      name: task.name,
      assignedTo: task.assignedTo,
      dueDate: Timestamp.fromDate(task.dueDate),
      completed: task.completed,
    });
  };

  /**
   * Deletes the task document with the given id from Firestore.
   */
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  /**
   * Flips a task between completed and not completed in Firestore.
   * Used by the circle checkbox on each row in the list.
   */
  const toggleCompleted = async (task: TaskItem) => {
    if (!task.id) throw new Error('Cannot toggle a task without an id');
    await updateDoc(doc(db, COLLECTION, task.id), { completed: !task.completed });
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleCompleted }}>
      {children}
    </TasksContext.Provider>
  );
}

/**
 * Custom hook screens use to reach the shared tasks store.
 * Throws a clear error if it is called outside of TasksProvider.
 */
export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used inside a TasksProvider');
  return ctx;
}
