import React, { useState, useEffect } from 'react';
import {
  Button,

  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';

const AdminNotification = () => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/notifications`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

 

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/notifications/${notificationId}`);
      fetchNotifications(); // Fetch updated notifications after deletion
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
     
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6">All Notifications</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <List>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <React.Fragment key={notification._id}>
                  <ListItem>
                    <ListItemText
                      primary={notification.message}
                      secondary={`User: ${notification.userName} | Type: ${notification.type} | Status: ${notification.status} | Time: ${notification.timestamp}`}
                    />
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
              <Typography>No notifications found.</Typography>
            )}
          </List>
        </Grid>
      )}
    </Grid>
  );
};

export default AdminNotification;
