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

const ReferenceBonusApproved = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedReferralPayments = async () => {
      try {
        // Fetch only approved referral payments
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/approve`);
        
        // Assuming the response data structure is correct
        const combinedTransactions = response.data.map(item => ({
          ...item,
          type: 'Approved Referral Payment',
          amount: item.transactionAmount,
          remarks: 'Payment approved', // Set a static remark or adjust based on your logic
        }));

        // Sort transactions by date in descending order
        combinedTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTransactions(combinedTransactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setError('Error fetching transaction history. Please try again.');
        setLoading(false);
      }
    };

    fetchApprovedReferralPayments();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: '#d4edda', color: '#155724' }; // Light green background
      default:
        return { backgroundColor: '#ffffff', color: '#000000' }; // Default white background
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center' }}>
          Referal Approved History
        </Typography>
      </Grid>

      <Grid item xs={12} sm={10}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error" variant="h6">{error}</Typography>
        ) : transactions.length === 0 ? (
          <Typography variant="h6">No transactions found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>Rs,{transaction.transactionAmount}</TableCell>
                    <TableCell>
                      <Box sx={{
                        ...getStatusStyles(transaction.status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {transaction.status}
                      </Box>
                    </TableCell>
                    <TableCell>{transaction.accountNumber || '-'}</TableCell>
                    <TableCell>{transaction.gateway || '-'}</TableCell>
                    <TableCell>{transaction.remarks || '-'}</TableCell>
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

export default ReferenceBonusApproved;
