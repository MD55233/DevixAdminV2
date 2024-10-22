import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import axios from 'axios';

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    advancePoints: '',
    DirectPoint: '',
    IndirectPoint: '',
    parent: '',
    grandParent: ''
  });

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Handle adding a new plan
  const handleAddPlan = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/plans`, newPlan);
      setPlans([...plans, response.data]);
      setNewPlan({
        name: '',
        price: '',
        advancePoints: '',
        DirectPoint: '',
        IndirectPoint: '',
        parent: '',
        grandParent: ''
      });
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  // Handle deleting a plan
  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/plans/${planId}`);
      setPlans(plans.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  // Handle form change
  const handleInputChange = (e) => {
    setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={3}>
      {/* Form to Add New Plan */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Add New Plan</Typography>
            <TextField
              label="Name"
              name="name"
              value={newPlan.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              name="price"
              value={newPlan.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Advance Points"
              name="advancePoints"
              value={newPlan.advancePoints}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Direct Points"
              name="DirectPoint"
              value={newPlan.DirectPoint}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Indirect Points"
              name="IndirectPoint"
              value={newPlan.IndirectPoint}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Parent"
              name="parent"
              value={newPlan.parent}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Grand Parent"
              name="grandParent"
              value={newPlan.grandParent}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddPlan}>
              Add Plan
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* List of All Plans */}
      {plans.map((plan) => (
        <Grid item xs={12} sm={6} md={4} key={plan._id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{plan.name}</Typography>
              <Typography variant="body2">Price: ${plan.price}</Typography>
              <Typography variant="body2">Advance Points: {plan.advancePoints}</Typography>
              <Typography variant="body2">Direct Points: {plan.DirectPoint}</Typography>
              <Typography variant="body2">Indirect Points: {plan.IndirectPoint}</Typography>
              <Typography variant="body2">Parent: {plan.parent}</Typography>
              <Typography variant="body2">Grand Parent: {plan.grandParent}</Typography>
              <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => handleDeletePlan(plan._id)}>
                Delete Plan
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PlansManagement;
