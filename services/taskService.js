import { ref, push, set, onValue, remove, get } from "firebase/database";
import { database, auth } from "../firebaseConfig";

// タスクを追加
export const addTask = async (taskName) => {
  if (!taskName.trim()) return;

  const userId = auth.currentUser.uid;
  const taskRef = ref(database, "tasks/" + userId);
  const newTaskRef = push(taskRef);
  await set(newTaskRef, { name: taskName, completed: false });
};

// タスクを読み込む
export const getTasks = (callback) => {
  const userId = auth.currentUser.uid;
  const tasksRef = ref(database, "tasks/" + userId);

  // リアルタイムでタスクを取得
  return onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    const taskList = data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
    callback(taskList);
  });
};

// タスクを削除
export const deleteTask = async (taskId) => {
  const userId = auth.currentUser.uid;
  if (!taskId) return;

  const taskRef = ref(database, "tasks/" + userId + "/" + taskId);
  await remove(taskRef);
};

// タスクの完了状態を更新
export const toggleTaskCompletion = async (taskId, currentCompleted) => {
  const userId = auth.currentUser.uid;
  const taskRef = ref(database, "tasks/" + userId + "/" + taskId);
  const taskSnapshot = await get(taskRef);

  if (taskSnapshot.exists()) {
    const taskData = taskSnapshot.val();
    await set(taskRef, { ...taskData, completed: !currentCompleted }); // 現在のデータを保持しつつ、completedを反転
  }
};
