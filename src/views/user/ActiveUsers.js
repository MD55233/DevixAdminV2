import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,

  Skeleton,
  Alert,
} from '@mui/material';
import axios from 'axios';
import AddUser from './AddUser';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // For add/edit
  const [withdrawalEnabled, setWithdrawalEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/users`);
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialize filtered users
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch withdrawal status
  const fetchWithdrawalStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/settings/withdrawal-status`);
      setWithdrawalEnabled(response.data.withdrawalEnabled);
    } catch (err) {
      console.error('Error fetching withdrawal status:', err);
      setError('Failed to fetch withdrawal status.');
    }
  };

  // Toggle withdrawal status
  const toggleWithdrawalStatus = async () => {
    try {
      const newStatus = !withdrawalEnabled;
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/settings/withdrawal-status`, {
        withdrawalEnabled: newStatus,
      });
      setWithdrawalEnabled(newStatus);
    } catch (err) {
      console.error('Error updating withdrawal status:', err);
      setError('Failed to update withdrawal status.');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchWithdrawalStatus();
  }, []);

  // Handle search input (debounced)
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value) {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(value) ||
          user.username.toLowerCase().includes(value)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  // Handle add or edit user
  const handleAddOrEditUserClick = (user = null) => {
    setSelectedUser(user);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user.');
    }
  };

  // Handle transfer of all pending commissions
  const handleTransferAllCommissions = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/users/transfer-all-commissions`);
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error('Error transferring all pending commissions:', err);
      setError('Failed to transfer pending commissions.');
    }
  };

  // Handle transfer of a single user's commission
  const handleTransferCommission = async (username) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/users/transfer-commission/${username}`);
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error('Error transferring commission:', err);
      setError('Failed to transfer pending commission.');
    }
  };

  // Handle cancel button for the Add/Edit User form
  const handleCancel = () => {
    setSelectedUser(null);
  };

  // Render loading skeleton
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(6)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Display Errors */}
      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}

      {/* Withdrawal Toggle */}
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
        />
      </Grid>

      {/* Transfer All Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="success"
          onClick={handleTransferAllCommissions}
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
                  onClick={() => handleAddOrEditUserClick(user)} // Edit existing user
                >
                  Edit User
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete User
                </Button>
                <Button
                  variant="contained"
                  color="success"
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
