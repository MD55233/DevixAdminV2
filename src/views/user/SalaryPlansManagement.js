import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';

const SalaryPlansManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [editSalary, setEditSalary] = useState(null);
  const [newSalary, setNewSalary] = useState({
    salaryAmount: '',
    claimableAfter: '',
    status: '',
    directReferralCount: '',
    indirectReferralCount: '',
  });

  // Fetch all salaries
  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/salaries`);
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  // Handle adding a new salary
  const handleAddSalary = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/salaries`, newSalary);
      setSalaries([...salaries, response.data]);
      setNewSalary({ salaryAmount: '', claimableAfter: '', status: '0', directReferralCount: '', indirectReferralCount: '' });
    } catch (error) {
      console.error('Error adding salary:', error);
    }
  };

  // Handle editing a salary
  const handleEditSalary = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_HOST}/api/salaries/${editSalary._id}`, editSalary);
      setSalaries(salaries.map((salary) => (salary._id === editSalary._id ? response.data : salary)));
      setEditSalary(null); // Close the modal
    } catch (error) {
      console.error('Error editing salary:', error);
    }
  };

  // Handle deleting a salary
  const handleDeleteSalary = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/salaries/${id}`);
      setSalaries(salaries.filter((salary) => salary._id !== id));
    } catch (error) {
      console.error('Error deleting salary:', error);
    }
  };

  // Handle input changes for new and edit salary
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditSalary({ ...editSalary, [name]: value });
    } else {
      setNewSalary({ ...newSalary, [name]: value });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5">Add New Salary</Typography>
            <TextField
              label="Salary Amount"
              name="salaryAmount"
              value={newSalary.salaryAmount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              type="date"
              label="Claimable After"
              name="claimableAfter"
              value={newSalary.claimableAfter}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Direct Referral Count"
              name="directReferralCount"
              value={newSalary.directReferralCount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Indirect Referral Count"
              name="indirectReferralCount"
              value={newSalary.indirectReferralCount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddSalary}>
              Add Salary
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {salaries.map((salary) => (
        <Grid item xs={12} sm={6} md={4} key={salary._id}>
          <Card>
            <CardContent>
              <Typography variant="body2">Amount: Rs,{salary.salaryAmount}</Typography>
              <Typography variant="body2">Claimable After: {new Date(salary.claimableAfter).toLocaleDateString()}</Typography>
              <Typography variant="body2">Status: {salary.status}</Typography>
              <Typography variant="body2">Direct Referrals: {salary.directReferralCount}</Typography>
              <Typography variant="body2">Indirect Referrals: {salary.indirectReferralCount}</Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2, mr: 1 }}
                onClick={() => setEditSalary(salary)}
              >
                Edit
              </Button>
              <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => handleDeleteSalary(salary._id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {/* Edit Salary Modal */}
      <Dialog open={!!editSalary} onClose={() => setEditSalary(null)}>
        <DialogTitle>Edit Salary</DialogTitle>
        <DialogContent>
          <TextField
            label="Salary Amount"
            name="salaryAmount"
            value={editSalary?.salaryAmount || ''}
            onChange={(e) => handleInputChange(e, true)}
            fullWidth
            margin="normal"
          />
          <TextField
            type="date"
            label="Claimable After"
            name="claimableAfter"
            value={editSalary?.claimableAfter || ''}
            onChange={(e) => handleInputChange(e, true)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Direct Referral Count"
            name="directReferralCount"
            value={editSalary?.directReferralCount || ''}
            onChange={(e) => handleInputChange(e, true)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Indirect Referral Count"
            name="indirectReferralCount"
            value={editSalary?.indirectReferralCount || ''}
            onChange={(e) => handleInputChange(e, true)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSalary(null)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSalary}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default SalaryPlansManagement;
