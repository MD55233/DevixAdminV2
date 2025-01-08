import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import axios from 'axios';

const TasksManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    reward: '',
    image: '',
    redirectLink: '',
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/tasks`);
      setTasks(response.data.tasks); // Assuming tasks are returned in a `tasks` array
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/tasks`, newTask);
      setTasks([...tasks, response.data.task]);
      setNewTask({
        name: '',
        description: '',
        reward: '',
        image: '',
        redirectLink: '',
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle form change
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={3}>
      {/* Form to Add New Task */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Add New Task</Typography>
            <TextField
              label="Name"
              name="name"
              value={newTask.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Reward"
              name="reward"
              value={newTask.reward}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image URL"
              name="image"
              value={newTask.image}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Redirection Link"
              name="redirectLink"
              value={newTask.redirectLink}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddTask}>
              Add Task
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* List of All Tasks */}
      {tasks.map((task) => (
        <Grid item xs={12} sm={6} md={4} key={task._id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{task.name}</Typography>
              <Typography variant="body2">Description: {task.description}</Typography>
              <Typography variant="body2">Reward: {task.reward}</Typography>
              {task.image && <img src={task.image} alt={task.name} style={{ width: '100%' }} />}
              <Typography variant="body2">
                <a href={task.redirectLink} target="_blank" rel="noopener noreferrer">
                  Visit Task Link
                </a>
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete Task
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TasksManagement;
