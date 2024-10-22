import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const AdminNotification = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userList, setUserList] = useState([]); // List of users

  // Fetch all usernames for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/users`); // Assuming you have an endpoint to fetch users
        setUserList(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/notifications/${username}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    if (!username || !message) {
      alert('Please enter both username and message.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/notifications/${username}`, { message });
      setMessage(''); // Clear the message input
      fetchNotifications(); // Fetch updated notifications
    } catch (error) {
      console.error('Error creating notification:', error);
      setError('Failed to create notification.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/notifications/${notificationId}`);
      // Fetch updated notifications after deletion
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setError('Failed to delete notification.');
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Admin Notification Management
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Username</InputLabel>
          <Select
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
          >
            {userList.map((user) => (
              <MenuItem key={user.username} value={user.username}>
                {user.username}
              </MenuItem>
            ))}
            <MenuItem value="">Manual Entry</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Manual Username"
          variant="outlined"
          fullWidth
          value={username === '' ? username : ''}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginTop: 2 }} // Adds margin for better spacing
          placeholder="Or enter username manually"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Notification Message"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleCreateNotification}>
          Create Notification
        </Button>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6">Notifications for {username}</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification._id}>
                  <ListItem>
                    <ListItemText primary={notification.message} />
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      onClick={() => handleDeleteNotification(notification._id)}
                    >
                      Delete
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <Typography>No notifications found for this user.</Typography>
            )}
          </List>
        </Grid>
      )}
    </Grid>
  );
};

export default AdminNotification;
