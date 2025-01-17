import React, { useEffect, useState } from "react";
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
  Button,
  TextField, // Import TextField for search box
} from "@mui/material";
import axios from "axios";

const ReferenceBonusApproved = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const fetchApprovedReferralPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/approvals/referral/approve`
      );

      const combinedTransactions = response.data.map((item) => ({
        ...item,
        type: "Approved Referral Payment",
        amount: item.transactionAmount,
        remarks: "Payment approved",
        imagePath: `https://api1.laikostar.com/${item.imagePath.replace(/\\/g, "/")}`,
      }));

      combinedTransactions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTransactions(combinedTransactions);
    } catch (err) {
      console.error("Error fetching transaction history:", err);
      setError("Error fetching transaction history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedReferralPayments();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "pending":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case "rejected":
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#ffffff", color: "#000000" };
    }
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ color: "secondary.main", textAlign: "center" }}
        >
          Referral Approved History
        </Typography>
      </Grid>

      <Grid item xs={12} sm={10}>
        {/* Search box */}
        <TextField
          label="Search by Username"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Box textAlign="center">
            <Typography color="error" variant="h6" gutterBottom>
              {error}
            </Typography>
            <Button variant="contained" color="primary" onClick={fetchApprovedReferralPayments}>
              Retry
            </Button>
          </Box>
        ) : filteredTransactions.length === 0 ? (
          <Typography variant="h6">No transactions found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Gateway</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>
                      Rs.{" "}
                      {new Intl.NumberFormat("en-IN").format(transaction.transactionAmount)}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          ...getStatusStyles(transaction.status),
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {transaction.status}
                      </Box>
                    </TableCell>
                    <TableCell>{transaction.username || "-"}</TableCell>
                    <TableCell>{transaction.gateway || "-"}</TableCell>
                    <TableCell>
                      {transaction.imagePath ? (
                        <a
                          href={transaction.imagePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#007bff", textDecoration: "none" }}
                        >
                          View Image
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
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
