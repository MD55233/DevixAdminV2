import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import axios from 'axios';

const WhatsAppContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    whatsappNumber: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  // Fetch all WhatsApp contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/whatsapp/contacts`);
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Error fetching WhatsApp contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle input change for new contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add new contact
  const handleAddContact = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/admin/whatsapp/contact`, newContact);
      setContacts((prev) => [...prev, response.data.contact]);
      setNewContact({ whatsappNumber: '', fullName: '', email: '', phoneNumber: '' }); // Reset the form
    } catch (error) {
      console.error('Error adding WhatsApp contact:', error);
    }
  };

  // Handle delete contact
  const handleDeleteContact = async (contactId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/admin/whatsapp/contact/${contactId}`);
      setContacts((prev) => prev.filter((contact) => contact._id !== contactId));
    } catch (error) {
      console.error('Error deleting WhatsApp contact:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Add New WhatsApp Contact */}
      <Grid item xs={12}>
        <Typography variant="h6">Add New WhatsApp Contact</Typography>
        <TextField
          label="WhatsApp Number"
          name="whatsappNumber"
          variant="outlined"
          fullWidth
          value={newContact.whatsappNumber}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Full Name"
          name="fullName"
          variant="outlined"
          fullWidth
          value={newContact.fullName}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          value={newContact.email}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          variant="outlined"
          fullWidth
          value={newContact.phoneNumber}
          onChange={handleInputChange}
          style={{ marginBottom: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddContact}
        >
          Add Contact
        </Button>
      </Grid>

      {/* List of WhatsApp Contacts */}
      <Grid item xs={12}>
        <Typography variant="h6">WhatsApp Contacts</Typography>
      </Grid>
      {contacts.map((contact) => (
        <Grid item xs={12} sm={6} md={4} key={contact._id}>
          <Card>
            <CardContent>
              <Typography variant="body1">WhatsApp Number: {contact.whatsappNumber}</Typography>
              <Typography variant="body2">Full Name: {contact.fullName}</Typography>
              <Typography variant="body2">Email: {contact.email}</Typography>
              <Typography variant="body2">Phone Number: {contact.phoneNumber}</Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => handleDeleteContact(contact._id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WhatsAppContacts;
