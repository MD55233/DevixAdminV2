// src/WithdrawalApproval.js

import React, { useEffect, useState } from 'react';
import { Button, Typography, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import WithdrawalApprovalDetails from './WithdrawalApprovalDetails';

const WithdrawalApproval = () => {
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);

  const fetchPendingWithdrawals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/withdrawals/`);
      console.log(response.data); // Log the response to see its structure
      const pendingApprovals = response.data.filter((approval) => approval.status === 'pending');
      setApprovals(pendingApprovals);
    } catch (error) {
      console.error('Error fetching pending withdrawal requests:', error);
    }
  };

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  const handleApprovalClick = (approval) => {
    setSelectedApproval(approval);
  };

  const handleApprove = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/withdrawals/approve`, { id: selectedApproval._id });
      setApprovals(approvals.filter((approval) => approval._id !== selectedApproval._id));
      setSelectedApproval(null);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (feedback) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_HOST}/api/withdrawals/reject`, {
        id: selectedApproval._id,
        feedback,
      });
      setApprovals(approvals.filter((approval) => approval._id !== selectedApproval._id));
      setSelectedApproval(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {selectedApproval ? (
        <Grid item xs={12}>
          <WithdrawalApprovalDetails approval={selectedApproval} onApprove={handleApprove} onReject={handleReject} />
        </Grid>
      ) : (
        approvals.map((approval) => (
          <Grid item xs={12} sm={6} md={4} key={approval._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">Username: {approval.userId ? approval.userId.username : 'N/A'}</Typography>
                <Typography variant="body2">Transaction ID: {approval.transactionId || approval._id}</Typography>
                <Typography variant="body2">Amount: PKR{approval.amount}</Typography>
                <Typography variant="body2">Account Number: {approval.accountNumber}</Typography>
                <Typography variant="body2">Gateway: {approval.gateway}</Typography>
                <Typography variant="body2">Status: {approval.status}</Typography>
                <Typography variant="body2">Requested on: {new Date(approval.createdAt).toLocaleString()}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleApprovalClick(approval)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default WithdrawalApproval;
