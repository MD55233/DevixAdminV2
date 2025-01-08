import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
 
} from '@mui/material';
import { useSnackbar } from 'notistack';

const PaymentAccountForm = () => {
  const [platform, setPlatform] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [platformImage, setPlatformImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editAccountId, setEditAccountId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch existing payment accounts
  useEffect(() => {
    const fetchPaymentAccounts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/payment-accounts`);
        setPaymentAccounts(response.data);
      } catch (error) {
        enqueueSnackbar('Error fetching payment accounts', { variant: 'error' });
      }
    };
    fetchPaymentAccounts();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPlatformImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Reset form fields
  const resetForm = () => {
    setPlatform('');
    setAccountTitle('');
    setAccountNumber('');
    setPlatformImage(null);
    setImagePreview('');
    setEditMode(false);
    setEditAccountId(null);
  };

  // Handle form submission to create or update a payment account
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('platform', platform);
    formData.append('accountTitle', accountTitle);
    formData.append('accountNumber', accountNumber);
    if (platformImage) formData.append('platformImage', platformImage); // Only include if a new image is selected
  
    setLoading(true);
  
    try {
      let response;
      if (editMode) {
        // Update existing payment account
        response = await axios.put(
          `${process.env.REACT_APP_API_HOST}/payment-accounts/${editAccountId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
  
        // Update the local state
        setPaymentAccounts((prev) =>
          prev.map((account) =>
            account._id === editAccountId ? response.data.account : account
          )
        );
      } else {
        // Create a new payment account
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/api/payment-accounts/upload`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
  
        // Add the new account to local state
        setPaymentAccounts((prev) => [...prev, response.data.account]);
      }
  
      enqueueSnackbar(response.data.message, { variant: 'success' });
      resetForm();
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Error saving payment account',
        { variant: 'error' }
      );
    }
  
    setLoading(false);
  };
  
  // Handle delete payment account
  const handleDelete = async (accountId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_HOST}/payment-accounts/${accountId}`
      );
      enqueueSnackbar(response.data.message, { variant: 'success' });
      setPaymentAccounts((prev) => prev.filter((account) => account._id !== accountId));
    } catch (error) {
      enqueueSnackbar('Error deleting payment account', { variant: 'error' });
    }
  };

  // Handle edit payment account
  const handleEdit = (account) => {
    setPlatform(account.platform);
    setAccountTitle(account.accountTitle);
    setAccountNumber(account.accountNumber);
    setImagePreview(`${process.env.REACT_APP_API_HOST}/${account.platformImage}`);
    setEditMode(true);
    setEditAccountId(account._id);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {editMode ? 'Edit Payment Account' : 'Create Payment Account'}
      </Typography>

      <Card sx={{ p: 3, mb: 3, boxShadow: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Platform"
                variant="outlined"
                fullWidth
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Title"
                variant="outlined"
                fullWidth
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                variant="outlined"
                fullWidth
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && <img src={imagePreview} alt=" Preview" width="100" />}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : editMode ? 'Update' : 'Create'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      <Typography variant="h6" gutterBottom>
        Existing Payment Accounts
      </Typography>
      <Grid container spacing={2}>
        {paymentAccounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account._id}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <Typography variant="h6">{account.platform}</Typography>
              <Typography variant="body2">Account Title: {account.accountTitle}</Typography>
              <Typography variant="body2">Account Number: {account.accountNumber}</Typography>
              <img
                src={`${process.env.REACT_APP_API_HOST}/${account.platformImage}`}
                alt="Platform"
                width="100"
              />
              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(account)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(account._id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PaymentAccountForm;
