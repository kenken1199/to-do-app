import { ref, push, set, onValue, remove, get } from "firebase/database";
import database from "../firebaseConfig";

// タスクを追加
export const addTask = async (taskName) => {
  if (!taskName.trim()) return;

  const tasksRef = ref(database, "tasks");
  const newTaskRef = push(tasksRef);

  await set(newTaskRef, { name: taskName, completed: false });
};

// タスクを読み込む
export const getTasks = (callback) => {
  const tasksRef = ref(database, "tasks");

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
  if (!taskId) return;

  const taskRef = ref(database, `tasks/${taskId}`);
  await remove(taskRef);
};

// タスクの完了状態を更新
export const toggleTaskCompletion = async (taskId, currentCompleted) => {
  const taskRef = ref(database, `tasks/${taskId}`);
  const taskSnapshot = await get(taskRef);

  if (taskSnapshot.exists()) {
    const taskData = taskSnapshot.val();
    await set(taskRef, { ...taskData, completed: !currentCompleted }); // 現在のデータを保持しつつ、completedを反転
  }
};
