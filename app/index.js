import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  FlatList,
  View,
  TouchableOpacity,
} from "react-native";
import {
  addTask,
  getTasks,
  deleteTask,
  toggleTaskCompletion,
} from "../services/taskService";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // タスクを読み込む
  useEffect(() => {
    const unsubscribe = getTasks(setTasks);
    return () => unsubscribe();
  }, []);

  // タスクを追加
  const handleAddTask = async () => {
    try {
      await addTask(newTask);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // タスクを削除
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // タスクの完了状態を切り替える
  const handleToggleCompletion = async (taskId, completed) => {
    try {
      await toggleTaskCompletion(taskId, completed);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDo App</Text>

      {/* 新しいタスクを追加 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <Button title="Add" onPress={handleAddTask} />
      </View>

      {/* タスクリスト */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              onPress={() => handleToggleCompletion(item.id, item.completed)}
            >
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTask,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={() => handleDeleteTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: "line-through", // 完了したタスクに線を引く
    color: "#888", // 完了したタスクの色を薄くする
  },
});
