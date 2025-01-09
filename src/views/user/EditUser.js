import React, { useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';

const EditUser = ({ user, onSuccess, onCancel }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  // Handle update user
  const handleUpdateUser = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_HOST}/api/users/${user._id}`, updatedUser);
      onSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleOpenAddUser = () => {
    onOpenAddUser(user); // Pass the current user to the add user function
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Edit User Details
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Full Name"
          name="fullName"
          value={updatedUser.fullName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Username"
          name="username"
          value={updatedUser.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={updatedUser.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={updatedUser.phoneNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Account Type"
          name="accountType"
          value={updatedUser.accountType}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Balance"
          name="balance"
          value={updatedUser.balance}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Withdrawal Balance"
          name="withdrawalBalance"
          value={updatedUser.withdrawalBalance}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Daily Task Limit"
          name="dailyTaskLimit"
          value={updatedUser.dailyTaskLimit}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Bonus Balance"
          name="bonusBalance"
          value={updatedUser.bonusBalance}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Pending Commission"
          name="pendingCommission"
          value={updatedUser.pendingCommission}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
      </Grid>

      <Grid item xs={12} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleUpdateUser}>
          Update User
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleOpenAddUser}>
          Add User Under This
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditUser;
