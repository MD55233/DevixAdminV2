import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Card, CardContent, TextField, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import AddUser from './AddUser';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // For both adding and editing
  const [withdrawalEnabled, setWithdrawalEnabled] = useState(false);

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

  // Fetch withdrawal status from the server
  const fetchWithdrawalStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/settings/withdrawal-status`);
      setWithdrawalEnabled(response.data.withdrawalEnabled); // Update with new schema key
    } catch (error) {
      console.error('Error fetching withdrawal status:', error);
    }
  };

  const toggleWithdrawalStatus = async () => {
    try {
      const newStatus = !withdrawalEnabled;
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/settings/withdrawal-status`, { withdrawalEnabled: newStatus }); // Update with new schema key
      setWithdrawalEnabled(newStatus);
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWithdrawalStatus();
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
      const filtered = users.filter((user) =>
        user.fullName.toLowerCase().includes(value) ||
        user.username.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Reset to original user list if search is empty
    }
  };

  // Transfer pending commission to main balance for a single user
  const handleTransferCommission = async (username) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/users/transfer-commission/${username}`);
      fetchUsers(); // Refresh the users list after transfer
    } catch (error) {
      console.error('Error transferring pending commission:', error);
    }
  };

  // Transfer all users' pending commissions to main balance
  const handleTransferAllCommissions = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/users/transfer-all-commissions`);
      fetchUsers(); // Refresh the users list after transfer
    } catch (error) {
      console.error('Error transferring all pending commissions:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Withdrawal Toggle Button */}
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={withdrawalEnabled}
              onChange={toggleWithdrawalStatus}
              color="primary"
            />
          }
          label={withdrawalEnabled ? 'Withdrawals Enabled' : 'Withdrawals Disabled'}
        />
      </Grid>

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

      {/* Transfer All Pending Commissions Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="success"
          onClick={handleTransferAllCommissions}
          style={{ marginBottom: '20px' }}
        >
          Transfer All Pending Commissions
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
                <Typography variant="body2">Account Type: {user.accountType}</Typography>
                <Typography variant="body2">Balance: Rs,{user.balance}</Typography>
                <Typography variant="body2">Withdrawal Balance: Rs{user.withdrawalBalance}</Typography>
                <Typography variant="body2">Bonus Balance: Rs{user.bonusBalance}</Typography>
                <Typography variant="body2">Daily Task Limit: {user.dailyTaskLimit}</Typography>
                <Typography variant="body2">Pending Commission: Rs{user.pendingCommission}</Typography>

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
                  onClick={() => handleTransferCommission(user.username)}
                >
                  Transfer Pending Commission
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
