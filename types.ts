/**
 * RootStackParamList
 * Lists every screen in the stack and the params it expects.
 * People takes nothing; EditPerson only takes the personId so it can look up
 * the freshest copy from context instead of a stale snapshot.
 */
export type RootStackParamList = {
  People: undefined;
  EditPerson: { personId: string };
};
