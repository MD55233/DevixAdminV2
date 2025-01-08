import React, { useEffect, useState } from 'react';
import { Button, Typography, Grid, Card, CardContent, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import ReferralDetails from './ReferralDetails';

const ReferenceApproval = () => {
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/pending-approvals`);
      setApprovals(response.data);
    } catch (error) {
      setError('Error fetching pending approvals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  // Function to handle "View Details" click and set the selected approval
  const handleApprovalClick = (approval) => {
    setSelectedApproval(approval);
  };

  // Handlers for approval and rejection
  const handleApprove = () => {
    // Logic for approving goes here
    setSelectedApproval(null);  // Clear the selection after approval
  };

  const handleReject = () => {
    // Logic for rejecting goes here
    setSelectedApproval(null);  // Clear the selection after rejection
  };

  return (
    <Grid container spacing={3}>
      {loading ? (
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1">Loading pending approvals...</Typography>
        </Grid>
      ) : (
        <>
          {selectedApproval ? (
            <Grid item xs={12}>
              <ReferralDetails
                approval={selectedApproval}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </Grid>
          ) : (
            approvals.map((approval) => (
              <Grid item xs={12} sm={6} md={4} key={approval._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5">Username: {approval.username}</Typography>
                    <Typography variant="body2">Transaction ID: {approval.transactionId}</Typography>
                    <Typography variant="body2">Amount: PKR {approval.transactionAmount}</Typography>
                    <Typography variant="body2">Gateway: {approval.gateway}</Typography>
                    <Typography variant="body2">Status: {approval.status}</Typography>
                    <Typography variant="body2">
                      Requested on: {new Date(approval.createdAt).toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleApprovalClick(approval)} // Opens ReferralDetails on click
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </>
      )}

      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Grid>
  );
};

export default ReferenceApproval;
