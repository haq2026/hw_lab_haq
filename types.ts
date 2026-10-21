// Screens inside the Tasks tab stack. TaskDetails only gets the id
// and looks up the latest copy of the task from context.
export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetails: { taskId: string };
};

// The two bottom tabs.
export type RootTabParamList = {
  Tasks: undefined;
  NewTask: undefined;
};
