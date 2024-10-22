import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import axios from 'axios';

const UpdateProductProfitBalance = () => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [directPointsIncrement, setDirectPointsIncrement] = useState(''); // New state for direct points increment
  const [totalPointsIncrement, setTotalPointsIncrement] = useState(''); // New state for total points increment
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateBalance = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if user exists before updating balance
      const userResponse = await axios.get(`${process.env.REACT_APP_API_HOST}/api/users/${username}`);
      if (!userResponse.data) {
        setError('User not found. Please check the username.');
        setLoading(false);
        return;
      }

      // Proceed to update the balance and points
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/users/update-product-profit-balance`, {
        username,
        amount: Number(amount), // Ensure amount is a number
        directPointsIncrement: Number(directPointsIncrement), // Convert to number
        totalPointsIncrement: Number(totalPointsIncrement) // Convert to number
      });

      setSuccess(response.data.message);
    } catch (error) {
      setError('Error updating product profit balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Update Product Profit Balance
        </Typography>
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          label="Direct Points Increment"
          variant="outlined"
          fullWidth
          type="number"
          value={directPointsIncrement}
          onChange={(e) => setDirectPointsIncrement(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          label="Total Points Increment"
          variant="outlined"
          fullWidth
          type="number"
          value={totalPointsIncrement}
          onChange={(e) => setTotalPointsIncrement(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <Button variant="contained" color="primary" onClick={handleUpdateBalance} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Update Balance'}
        </Button>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}

      {success && (
        <Grid item xs={12}>
          <Typography color="success">{success}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default UpdateProductProfitBalance;
