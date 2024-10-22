import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';

const EditUser = ({ user, onSuccess, onCancel }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  // Handle form change
  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
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
          label="Balance"
          name="balance"
          value={updatedUser.balance}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Advance Points"
          name="advancePoints"
          value={updatedUser.advancePoints}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Direct Points"
          name="directPoints"
          value={updatedUser.directPoints}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Indirect Points"
          name="indirectPoints"
          value={updatedUser.indirectPoints}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Training Bonus Balance"
          name="trainingBonusBalance"
          value={updatedUser.trainingBonusBalance}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Plan"
          name="plan"
          value={updatedUser.plan}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Rank"
          name="rank"
          value={updatedUser.rank}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Referrer Percentage"
          name="refPer"
          value={updatedUser.refPer}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Referrer Parent Percentage"
          name="refParentPer"
          value={updatedUser.refParentPer}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdateUser}>
          Update User
        </Button>
        <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={onCancel}>
          Cancel
        </Button>
        <Grid container spacing={3}>
      {/* Existing fields */}
      <Button variant="contained" color="primary" onClick={handleOpenAddUser}>
        Add User Under This      
      </Button>
      {/* Other buttons */}
    </Grid>
      </Grid>
    </Grid>
    
  );
};

export default EditUser;
