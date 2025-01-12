import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART (DISPLAY USERS) ||============================== //

// Function to get balance styles
const getBalanceStyles = (balance) => {
  if (balance > 0) {
    return { backgroundColor: '#d4edda', color: '#155724' }; // Light green for positive balance
  }
  return { backgroundColor: '#f8d7da', color: '#721c24' }; // Light red for negative balance
};

// Function to get Daily Task Limit styles
const getTaskLimitStyles = (dailyTaskLimit) => {
  if (dailyTaskLimit > 0) {
    return { backgroundColor: '#d4edda', color: '#155724' }; // Light green for positive limit
  }
  return { backgroundColor: '#f8d7da', color: '#721c24' }; // Light red for zero limit
};

const TotalGrowthBarChart = ({ isLoading }) => {
  const [users, setUsers] = useState([]);
  const [showPositiveBalance, setShowPositiveBalance] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchUsers();
    }
  }, [isLoading]);

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Update users list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Calculate total balance
  const totalBalance = users.reduce((acc, user) => acc + user.balance, 0);

  // Filter users based on the balance
  const displayedUsers = showPositiveBalance
    ? users.filter((user) => user.balance > 0)
    : users;

  return (
    <MainCard>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      {/* Header Box for Total Balance */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          mb: 2,
        }}
      >
        <Typography variant="h6">Total Balance of Users:</Typography>
        <Box
          sx={{
            py: 1,
            px: 2,
            borderRadius: '4px',
            fontWeight: 'bold',
            backgroundColor: totalBalance >= 0 ? '#d4edda' : '#f8d7da', // Adjust background based on total balance
            color: totalBalance >= 0 ? '#155724' : '#721c24',
          }}
        >
          PKR {totalBalance.toFixed(2)} {/* Format to 2 decimal places */}
        </Box>
      </Box>
      {/* Filter Button */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setShowPositiveBalance(!showPositiveBalance)}
        >
          {showPositiveBalance ? 'Show All Users' : 'Show Users with Positive Balance'}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Daily Task Limit</TableCell> {/* New Column for Task Limit */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1">No users available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        ...getBalanceStyles(user.balance), // Apply balance styles
                      }}
                    >
                      {user.balance}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        py: 1,
                        px: 2,
                        borderRadius: '4px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        ...getTaskLimitStyles(user.dailyTaskLimit), // Apply task limit styles
                      }}
                    >
                      {user.dailyTaskLimit}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete User
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalGrowthBarChart;
