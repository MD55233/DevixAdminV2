import React, { useEffect, useState } from 'react';
import { Button, Typography, Grid, Card, CardContent, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import ReferralDetails from './ReferralDetails';

const ReferenceApproval = () => {
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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

  const handleApprovalClick = (approval) => {
    setSelectedApproval(approval);
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/approve`, {
        id: selectedApproval._id,
      });
      console.log(response.data); // Assuming the backend sends a success message
      setApprovals(approvals.filter((approval) => approval._id !== selectedApproval._id));
      setSelectedApproval(null);
    } catch (error) {
      setError('Error approving request.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (feedback) => {
    setProcessing(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/reject`, {
        id: selectedApproval._id,
        feedback,
      });
      console.log(response.data); // Assuming the backend sends a success message
      setApprovals(approvals.filter((approval) => approval._id !== selectedApproval._id));
      setSelectedApproval(null);
    } catch (error) {
      setError('Error rejecting request.');
    } finally {
      setProcessing(false);
    }
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
                    <Typography variant="body2">Amount: PKR{approval.transactionAmount}</Typography>
                    <Typography variant="body2">Gateway: {approval.gateway}</Typography>
                    <Typography variant="body2">Status: {approval.status}</Typography>
                    <Typography variant="body2">
                      Requested on: {new Date(approval.createdAt).toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => handleApprovalClick(approval)}
                      disabled={processing}
                    >
                      {processing ? <CircularProgress size={24} /> : 'View Details'}
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
