import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const ReferralDetails = ({ approval, onApprove, onReject }) => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [processing, setProcessing] = useState(false); // Fixed: added processing state

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/approve`, {
        transactionId: approval.transactionId, // Use 'approval' instead of 'selectedApproval'
      });
  
      if (response.status === 200) {
        console.log('Approval successful:', response.data);
        onApprove(); // Notify parent component
      } else {
        throw new Error(response.data.message || 'Approval failed.');
      }
    } catch (err) {
      console.error('Error during approval:', err);
      alert(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/approvals/referral/reject`, {
        transactionId: approval.transactionId,
        reason: feedback,
      });
  
      if (response.status === 200) {
        console.log('Rejection successful:', response.data);
        onReject(); // Notify parent component
      } else {
        alert(response.data.message || 'Rejection failed.');
      }
    } catch (err) {
      console.error('Error during rejection:', err);
      alert(err.response?.data?.message || 'An error occurred while rejecting.');
    } finally {
      setProcessing(false);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4">Approval Request Details</Typography>
          <Typography variant="h6">Username: {approval.username}</Typography>
          <Typography variant="body1">Transaction ID: {approval.transactionId}</Typography>
          <Typography variant="body1">Amount: PKR {approval.transactionAmount}</Typography>
          <Typography variant="body1">Gateway: {approval.gateway}</Typography>
          <Typography variant="body1">Status: {approval.status}</Typography>
          <Typography variant="body1">
            Requested on: {new Date(approval.createdAt).toLocaleString()}
          </Typography>
          <img
            src={`${process.env.REACT_APP_API_HOST}/uploads/${approval.imagePath}`}
            alt="Transaction"
            style={{ width: '100%', marginTop: '10px' }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: '20px', marginRight: '10px' }}
            onClick={handleApprove}
            disabled={processing} // Disable while loading
          >
            {processing ? <CircularProgress size={24} /> : 'Approve Request'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: '20px' }}
            onClick={handleClickOpen}
            disabled={processing} // Disable while loading
          >
            Reject Request
          </Button>
        </Paper>
      </Grid>

      {/* Dialog for rejecting the request */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide feedback on why you are rejecting this request.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="feedback"
            label="Feedback"
            type="text"
            fullWidth
            variant="standard"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handleReject} color="secondary" disabled={processing || !feedback.trim()}>
            {processing ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

ReferralDetails.propTypes = {
  approval: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    transactionId: PropTypes.string.isRequired,
    transactionAmount: PropTypes.number.isRequired,
    gateway: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
  }).isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default ReferralDetails;
