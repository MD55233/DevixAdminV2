import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import axios from 'axios';
import AddUser from './AddUser';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // For both adding and editing

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/users`);
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialize filtered users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle add or edit user
  const handleAddOrEditUserClick = (user = null) => {
    setSelectedUser(user);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userId)); // Update filtered users as well
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Handle user form cancel
  const handleCancel = () => {
    setSelectedUser(null);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter users based on search term
    if (value) {
      const filtered = users.filter(user => 
        user.fullName.toLowerCase().includes(value) || 
        user.username.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to original user list if search is empty
    }
  };

  // Reset points for all users
  const handleResetPoints = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/users/reset-points`);
      fetchUsers(); // Refresh the users list after reset
    } catch (error) {
      console.error('Error resetting points:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Search Bar */}
      <Grid item xs={12}>
        <TextField
          label="Search by Name or Username"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px' }}
        />
      </Grid>

      {/* Reset Points Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleResetPoints}
        >
          Reset All User Points
        </Button>
      </Grid>

      {selectedUser ? (
        <Grid item xs={12}>
          <AddUser
            user={selectedUser}
            isEdit={!!selectedUser._id} // Check if editing
            onSuccess={() => {
              fetchUsers(); // Refresh the users list after add/edit
              handleCancel(); // Close the form after success
            }}
            onCancel={handleCancel} // Provide a way to cancel the form
          />
        </Grid>
      ) : (
        filteredUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">Username: {user.username}</Typography>
                <Typography variant="h5">Password: {user.password}</Typography>
                <Typography variant="body2">Full Name: {user.fullName}</Typography>
                <Typography variant="body2">Email: {user.email}</Typography>
                <Typography variant="body2">Phone Number: {user.phoneNumber}</Typography>
                <Typography variant="body2">Balance: ${user.balance}</Typography>
                <Typography variant="body2">Advance Points: {user.advancePoints}</Typography>
                <Typography variant="body2">Total Points: {user.totalPoints}</Typography>
                <Typography variant="body2">Direct Points: {user.directPoints}</Typography>
                <Typography variant="body2">Indirect Points: {user.indirectPoints}</Typography>
                <Typography variant="body2">Training Bonus Balance: ${user.trainingBonusBalance}</Typography>
                <Typography variant="body2">Plan: {user.plan}</Typography>
                <Typography variant="body2">Rank: {user.rank}</Typography>
                <Typography variant="body2">Referral Percentage: {user.refPer}%</Typography>
                <Typography variant="body2">Parent Referral Percentage: {user.refParentPer}%</Typography>

                {/* Product Profit History */}
                <Typography variant="body2" gutterBottom>Product Profit History:</Typography>
                {user.productProfitHistory.length > 0 ? (
                  user.productProfitHistory.map((history, index) => (
                    <div key={index}>
                      <Typography variant="body2">Amount: ${history.amount}</Typography>
                      <Typography variant="body2">Direct Points Increment: {history.directPointsIncrement}</Typography>
                      <Typography variant="body2">Total Points Increment: {history.totalPointsIncrement}</Typography>
                      <Typography variant="body2">Date: {new Date(history.createdAt).toLocaleDateString()}</Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2">No Product Profit History</Typography>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleAddOrEditUserClick(user)} // Edit existing user
                >
                  Edit User
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete User
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={() => handleAddOrEditUserClick({ parent: user })} // Add user under parent
                >
                  Add User Under Parent
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ActiveUsers;
