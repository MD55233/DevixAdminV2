import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, Typography, Button, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// material-ui
import { styled } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useAuth } from 'views/pages/authentication/AuthContext'; // Import your auth context

const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

const TotalIncomeLightCard = () => {
  const [addProfitAmount, setAddProfitAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [openAddProfitDialog, setOpenAddProfitDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const { username } = useAuth(); // Get the username from the auth context

  useEffect(() => {
    if (username) {
      fetchTransactions();
    }
  }, [username]); // Run effect when username changes

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/transactions/${username}`);
      setTransactions(response.data.transactions);
      setTransactionLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleAddProfit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/admin/add-profit/${username}`, { amount: addProfitAmount });
      fetchTransactions(); // Refresh transactions after adding profit
      setOpenAddProfitDialog(false);
    } catch (error) {
      console.error('Error adding profit:', error);
    }
  };

  const handleWithdrawProfit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/admin/withdraw-profit/${username}`, { amount: withdrawAmount });
      fetchTransactions(); // Refresh transactions after withdrawal
      setOpenWithdrawDialog(false);
    } catch (error) {
      console.error('Error withdrawing profit:', error);
    }
  };

  return (
    <CardWrapper border={false} content={false}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Transaction & Admin profit:
        </Typography>

        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => setOpenAddProfitDialog(true)}>
            Add Profit
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => setOpenWithdrawDialog(true)} 
            sx={{ ml: 2 }} // Add margin left to create space
          >
            Withdraw Profit
          </Button>
        </Box>

        {/* Add Profit Dialog */}
        <Dialog open={openAddProfitDialog} onClose={() => setOpenAddProfitDialog(false)}>
          <DialogTitle>Add Profit</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Profit Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={addProfitAmount}
              onChange={(e) => setAddProfitAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddProfitDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProfit}>Add</Button>
          </DialogActions>
        </Dialog>

        {/* Withdraw Profit Dialog */}
        <Dialog open={openWithdrawDialog} onClose={() => setOpenWithdrawDialog(false)}>
          <DialogTitle>Withdraw Profit</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Withdrawal Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenWithdrawDialog(false)}>Cancel</Button>
            <Button onClick={handleWithdrawProfit}>Withdraw</Button>
          </DialogActions>
        </Dialog>

        {/* Transaction History */}
        <Typography variant="h5" gutterBottom mt={2}>
          Transaction History
        </Typography>
        {transactionLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {transactions.map((transaction, index) => (
              <ListItem key={index}>
                <ListItemText primary={`Type: ${transaction.type} | Amount: ${transaction.amount} | Date: ${new Date(transaction.date).toLocaleString()}`} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </CardWrapper>
  );
};

export default TotalIncomeLightCard;
