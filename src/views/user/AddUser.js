import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';

const AddUser = ({ user, isEdit, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    balance: 0,
    advancePoints: 0,
    totalPoints: 0,
    directPoints: 0,
    indirectPoints: 0,
    trainingBonusBalance: 0,
    plan: '',
    rank: '',
    parent: '',
    refPer: 0,
    refParentPer: 0,
    productprofitBalance: 0,
    productProfitHistory: [],
  });

  const [plans, setPlans] = useState([]);

  // Effect to populate form when editing or adding under a parent
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        balance: user.balance || 0,
        advancePoints: user.advancePoints || 0,
        totalPoints: user.totalPoints || 0,
        directPoints: user.directPoints || 0,
        indirectPoints: user.indirectPoints || 0,
        trainingBonusBalance: user.trainingBonusBalance || 0,
        plan: user.plan || '',
        rank: user.rank || '',
        parent: user.parent ? user.parent._id : '',
        refPer: user.refPer || 0,
        refParentPer: user.refParentPer || 0,
        productprofitBalance: user.productprofitBalance || 0,
        productProfitHistory: user.productProfitHistory || [],
      }));
    } else if (user?.parent) {
      setFormData(prevData => ({
        ...prevData,
        parent: user.parent._id,
      }));
    }
  }, [user]);

  // Effect to fetch all plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan change
  const handlePlanChange = (e) => {
    const selectedPlan = plans.find(plan => plan.name === e.target.value);
    if (selectedPlan) {
      setFormData(prevData => ({
        ...prevData,
        plan: selectedPlan.name,
        refPer: selectedPlan.parent,
        refParentPer: selectedPlan.grandParent,
        advancePoints: selectedPlan.advancePoints,
      }));
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the form data before sending it
    console.log('Form Data:', formData);

    try {
      if (isEdit) {
        await axios.put(`${process.env.REACT_APP_API_HOST}/api/users/${user._id}`, formData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_HOST}/api/users`, formData);
      }
      onSuccess(); // Refresh users list after adding or editing
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">{isEdit ? 'Edit User' : 'Add User'}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required={isEdit ? false : true} // Make required false in edit mode
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Balance"
            name="balance"
            type="number"
            value={formData.balance}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Advance Points"
            name="advancePoints"
            type="number"
            value={formData.advancePoints}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Total Points"
            name="totalPoints"
            type="number"
            value={formData.totalPoints}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Direct Points"
            name="directPoints"
            type="number"
            value={formData.directPoints}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Indirect Points"
            name="indirectPoints"
            type="number"
            value={formData.indirectPoints}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Training Bonus Balance"
            name="trainingBonusBalance"
            type="number"
            value={formData.trainingBonusBalance}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Plan"
            name="plan"
            value={formData.plan}
            onChange={handlePlanChange}
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Plan</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Rank"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Rank</option>
            <option value="Glow Sales">Glow Sales</option>
            <option value="Glow Recruiters">Glow Recruiters</option>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Referral Percentage"
            name="refPer"
            type="number"
            value={formData.refPer}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Referral Parent Percentage"
            name="refParentPer"
            type="number"
            value={formData.refParentPer}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>

        {/* Display Parent's Name */}
        {user && user.parent && (
          <Grid item xs={12}>
            <Typography variant="body1">Adding Under Parent: {user.parent.fullName}</Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {isEdit ? 'Update User' : 'Add User'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel} style={{ marginLeft: '16px' }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddUser;
