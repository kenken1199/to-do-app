import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import {
  addTask,
  getTasks,
  deleteTask,
  toggleTaskCompletion,
} from "../services/taskService";

import {
  Provider as PaperProvider,
  TextInput,
  Button,
  Card,
  Title,
  IconButton,
} from "react-native-paper";

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
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          label="New Task"
          value={newTask}
          onChangeText={setNewTask}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleAddTask}
          style={styles.addButton}
        >
          Add Task
        </Button>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                titleStyle={{
                  textDecorationLine: item.completed ? "line-through" : "none",
                }}
                right={(props) => (
                  <View style={styles.actions}>
                    <IconButton
                      {...props}
                      icon="check"
                      onPress={() =>
                        handleToggleCompletion(item.id, item.completed)
                      }
                    />
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => handleDeleteTask(item.id)}
                    />
                  </View>
                )}
              />
            </Card>
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 8,
    marginHorizontal: 8, // 両端のマージンを追加
    borderRadius: 8, // 角を丸くするオプション（任意）
    elevation: 2, // シャドウの追加（Android用）
  },
  actions: {
    flexDirection: "row",
  },
});
