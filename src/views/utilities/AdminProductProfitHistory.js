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
} from '@mui/material';
import axios from 'axios';

const AdminProductProfitHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllUsersProductProfitHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/users/product-profit-history`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching product profit history:', error);
        setError('Error fetching product profit history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsersProductProfitHistory();
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          All Users Product Profit History
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : history.length === 0 ? (
          <Typography>No product profit history found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Direct Points Increment</TableCell>
                  <TableCell>Total Points Increment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record._id || record.createdAt}>
                    <TableCell>{record.username}</TableCell> {/* Display username or any identifier */}
                    <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>Rs,{record.amount}</TableCell>
                    <TableCell>{record.directPointsIncrement}</TableCell>
                    <TableCell>{record.totalPointsIncrement}</TableCell>
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

export default AdminProductProfitHistory;
