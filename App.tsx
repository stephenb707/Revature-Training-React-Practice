import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';

// Define Task type with 'completed' field
type Task = {
  id: number;
  name: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [taskName, setTaskName] = useState<string>(''); // Name of the task being added
  const [tasks, setTasks] = useState<Task[]>([]); // Array of tasks
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null); // Track the task being edited

  // Load tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle adding a new task
  const handleAddTask = (): void => {
    if (taskName.trim() === '') return;

    const newTask: Task = {
      id: tasks.length + 1,
      name: taskName,
      completed: false, // New tasks are not completed by default
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName('');
  };

  // Handle toggling the completion status of a task
  const handleToggleComplete = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle removing a task
  const handleRemoveTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Start editing a task
  const handleEditTask = (id: number, name: string): void => {
    setEditingTaskId(id);
    setTaskName(name);
  };

  // Save edited task
  const handleSaveEdit = (): void => {
    if (editingTaskId !== null && taskName.trim() !== '') {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, name: taskName } : task
        )
      );
      setEditingTaskId(null);
      setTaskName('');
    }
  };

  return (
    <Router>
      {/* Outer Box for full-screen centering with a gradient background */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #74ABE2, #5563DE)',
          p: 2,
        }}
      >
        {/* Inner Box styled as a card */}
        <Box
          sx={{
            backgroundColor: 'white',
            p: 4,
            borderRadius: 3,
            boxShadow: 5,
            maxWidth: 500,
            width: '100%',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Task Manager
          </Typography>

          {/* Task input field */}
          <TextField
            label={editingTaskId ? 'Edit Task' : 'New Task'}
            variant="outlined"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            sx={{ mb: 2 }}
            data-testid="task-input"
          />

          {/* Add or Save task button */}
          <Button
            variant="contained"
            color="primary"
            onClick={editingTaskId ? handleSaveEdit : handleAddTask}
            fullWidth
            sx={{ mb: 2 }}
            data-testid="add-task-button"
          >
            {editingTaskId ? 'Save Edit' : 'Add Task'}
          </Button>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" data-testid="all-tasks-link">
                All Tasks
              </Button>
            </Link>
            <Link to="/active" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" data-testid="active-tasks-link">
                Active Tasks
              </Button>
            </Link>
            <Link to="/completed" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" data-testid="completed-tasks-link">
                Completed Tasks
              </Button>
            </Link>
          </Box>

          {/* Routes */}
          <Routes>
            <Route
              path="/"
              element={
                <TaskList
                  tasks={tasks}
                  handleToggleComplete={handleToggleComplete}
                  handleRemoveTask={handleRemoveTask}
                  handleEditTask={handleEditTask}
                />
              }
            />
            <Route
              path="/active"
              element={
                <TaskList
                  tasks={tasks.filter((task) => !task.completed)}
                  handleToggleComplete={handleToggleComplete}
                  handleRemoveTask={handleRemoveTask}
                  handleEditTask={handleEditTask}
                />
              }
            />
            <Route
              path="/completed"
              element={
                <TaskList
                  tasks={tasks.filter((task) => task.completed)}
                  handleToggleComplete={handleToggleComplete}
                  handleRemoveTask={handleRemoveTask}
                  handleEditTask={handleEditTask}
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;