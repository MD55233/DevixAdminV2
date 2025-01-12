import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';
import axios from 'axios';

const AllUsersWithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/withdrawals`);
        setWithdrawals(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching withdrawal history:', error);
        setError('Error fetching withdrawal history. Please try again.');
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: 'secondary.main', textAlign: 'center' }}
        >
          All Users Withdrawal History
        </Typography>
      </Grid>

      <Grid item xs={12} sm={10}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        ) : withdrawals.length === 0 ? (
          <Typography variant="h6">No withdrawal records found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Account Title</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal._id}>
                    <TableCell>
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {/* Check if userId and username exist, otherwise display '-' */}
                      {withdrawal.userId && withdrawal.userId.username ? withdrawal.userId.username : '-'}
                    </TableCell>
                    <TableCell>Rs. {withdrawal.amount}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: withdrawal.status === 'approved' ? '#d4edda' : '#f8d7da',
                          color: withdrawal.status === 'approved' ? '#155724' : '#721c24',
                        }}
                      >
                        {withdrawal.status}
                      </Box>
                    </TableCell>
                    <TableCell>{withdrawal.accountNumber || '-'}</TableCell>
                    <TableCell>{withdrawal.accountTitle || '-'}</TableCell>
                    <TableCell>{withdrawal.gateway || '-'}</TableCell>
                    <TableCell>{withdrawal.remarks || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default AllUsersWithdrawalHistory;
