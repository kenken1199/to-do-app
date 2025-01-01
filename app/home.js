import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { ref, push, onValue, remove } from "firebase/database";
import { signOut, getAuth } from "firebase/auth";
import { database, auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const router = useRouter();

  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const tasksRef = ref(database, "tasks/" + user.uid);
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        const loadedTasks = data
          ? Object.keys(data).map((key) => ({ id: key, text: data[key].text }))
          : [];
        setTasks(loadedTasks);
        return () => unsubscribe();
      });
    }
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }
    if (user) {
      const taskRef = ref(database, `tasks/${user.uid}`); // タスクIDを生成
      await push(taskRef, { text: newTask, completed: false });
      setNewTask("");
    } else {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = ref(database, `tasks/${user.uid}/${taskId}`);
      await remove(taskRef);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTask}
          onChangeText={setNewTask}
        />
        <Button title="Add Task" onPress={handleAddTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>
            <Button
              title="Delete"
              onPress={() => handleDeleteTask(item.id)}
              color="red"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  taskText: { fontSize: 16 },
});
