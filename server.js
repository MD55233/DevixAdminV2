const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

const PORT =  9001;

console.log('Attempting to start server on port:', PORT);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Your middleware and routes go here

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});

// Close the Mongoose connection if the Node process ends
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});
app.use(bodyParser.json());
app.use(cors());

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    productprofitBalance: {
      type: Number,
      default: 0
    },
    advancePoints: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    directPoints: {
      type: Number,
      default: 0
    },
    indirectPoints: {
      type: Number,
      default: 0
    },
    trainingBonusBalance: {
      type: Number,
      default: 0
    },
    plan: {
      type: String,
      required: true
    },
    rank: {
      type: String,
      default: 'Buisness Member'
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }, // Reference to the parent (referrer)
    refPer: {
      type: Number,
      required: true
    },
    refParentPer: {
      type: Number,
      required: true
    },
    parentName: {
      type: String,
      default: 'Admin'
    },
    grandParentName: {
      type: String,
      default: 'Admin'
    },
    productProfitHistory: [
      {
        amount: { type: Number, required: true },
        directPointsIncrement: { type: Number, required: true },
        totalPointsIncrement: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    profilePicture: {
      type: String, // URL or file path to the image
      default: null
    },

  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const User = mongoose.model('User', userSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  totalProfit: { type: Number, default: 0 },
  monthlyProfit: { type: Number, default: 0 },
  transactions: [{
    amount: { type: Number, required: true },
    type: { type: String, required: true }, // e.g., "Withdrawal", "Deposit"
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
// Get full name by username
app.get('/api/users/fullname/:username', async (req, res) => {
  try {
    const user = await Admin.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send({ fullName: user.fullName });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Authentication Endpoint
app.post('/api/authenticate', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await Admin.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password
    });

    if (user) {
      res.json({ success: true, username: user.username });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
// Define schemas and models
const TrainingBonusApprovalSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    imagePath: { type: String, required: true },
    status: { type: String, default: 'pending' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const TrainingBonusApproval = mongoose.model('TrainingBonusApproval', TrainingBonusApprovalSchema);

const TrainingBonusApprovedSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    addedPoints: { type: Number, required: true },
    imagePath: { type: String, required: true },
    status: { type: String, default: 'approved' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const TrainingBonusApproved = mongoose.model('TrainingBonusApproved', TrainingBonusApprovedSchema);

// Serve static files from the VPS 'uploads' directory during local development
app.use('/uploads', (req, res) => {
  const vpsUrl = `https://api.fairyglow.org/uploads${req.url}`;
  res.redirect(vpsUrl);
});

// Fetch all pending approval requests
app.get('/api/approvals/pending-approvals', async (req, res) => {
  try {
    const approvals = await TrainingBonusApproval.find({ status: 'pending' });
    res.json(approvals);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).send('Server error');
  }
});

app.post('/api/approvals/approve', async (req, res) => {
  const { id } = req.body;

  try {
    const approval = await TrainingBonusApproval.findById(id);
    if (!approval) {
      return res.status(404).send('Approval request not found');
    }

    // Fetch the user (replace User with your actual User model)
    const user = await User.findOne({ username: approval.username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update user's balance, training bonus balance, and total points
    const bonusAmount = approval.transactionAmount * 0.5;
    const trainingBonusPoints = parseInt(process.env.TRAINING_BONUS_POINTS);
    user.balance += bonusAmount;
    user.trainingBonusBalance += bonusAmount;
    user.totalPoints += trainingBonusPoints;
    await user.save();

    // Create a new approved record
    const approvedRecord = new TrainingBonusApproved({
      username: approval.username,
      transactionId: approval.transactionId,
      transactionAmount: approval.transactionAmount,
      gateway: approval.gateway,
      addedPoints: process.env.TRAINING_BONUS_POINTS,
      imagePath: approval.imagePath, // Ensure image path is correct for frontend display
      approvedAt: new Date()
    });
    await approvedRecord.save();

    // Remove the approval request
    await TrainingBonusApproval.findByIdAndRemove(id);

    res.send('Request approved successfully');
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).send('Server error: ' + error.message); // Send detailed error message
  }
});

//---------------||Rejected Training Bonus Schema||---------------------
const TrainingBonusRejectedSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    imagePath: { type: String, required: true },
    feedback: { type: String, required: true },
    status: { type: String, default: 'rejected' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const TrainingBonusRejected = mongoose.model('TrainingBonusRejected', TrainingBonusRejectedSchema);

// ]--------------------||EndPoint to Handle Training Bonus Rejection||---------------------------[

app.post('/api/approvals/reject', async (req, res) => {
  const { id, feedback } = req.body;

  try {
    const approval = await TrainingBonusApproval.findById(id);
    if (!approval) {
      return res.status(404).send('Approval request not found');
    }

    // Create a new rejected record
    const rejectedRecord = new TrainingBonusRejected({
      username: approval.username,
      transactionId: approval.transactionId,
      transactionAmount: approval.transactionAmount,
      gateway: approval.gateway,
      imagePath: approval.imagePath,
      feedback: feedback
    });
    await rejectedRecord.save();

    // Remove the approval request
    await TrainingBonusApproval.findByIdAndRemove(id);

    res.send('Request rejected successfully');
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});



//       ]------------------------||Investment Plans Model||----------------------------[

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  advancePoints: { type: Number, required: true },
  DirectPoint: { type: Number, required: true },
  IndirectPoint: { type: Number, required: true },
  parent: { type: Number, required: true },
  grandParent: { type: Number, required: true }
});
const Plan = mongoose.model('Plan', planSchema);

//      ]---------------------GET all Plans Documents-----------------------[

  app.get('/api/plans', async (req, res) => {
    try {
      const plans = await Plan.find();
      res.json(plans);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Add a new plan
app.post('/api/plans', async (req, res) => {
  const { name, price, advancePoints, DirectPoint, IndirectPoint, parent, grandParent } = req.body;
  
  const newPlan = new Plan({ name, price, advancePoints, DirectPoint, IndirectPoint, parent, grandParent });
  
  try {
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a plan
app.delete('/api/plans/:id', async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ]-------------------||Get Profile Data by username from User Model||-------------------------[

app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      fullName: user.fullName,
      rank: user.rank,
      plan: user.plan,
      refPer: user.refPer,
      refParentPer: user.refParentPer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// ]----------------||Implementation of approving Referrals||------------------[

// Define schema for ReferralPaymentVerification
const referralPaymentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    planName: { type: String, required: true },
    planPRICE: { type: Number, required: true },
    advancePoints: { type: Number, required: true },
    DirectPoint: { type: Number, required: true },
    IndirectPoint: { type: Number, required: true },
    refPer: { type: Number, required: true },
    refParentPer: { type: Number, required: true },
    referrerPin: { type: String, required: true, unique: true },
    imagePath: { type: String, required: true }
  },
  { timestamps: true }
);
const ReferralPaymentVerification = mongoose.model('ReferralPaymentVerification', referralPaymentSchema);
const ReferralApprovedSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    addedPointsSelf: { type: Number, required: true },
    addedPointsParent: { type: Number, required: true },
    addedBalanceSelf: { type: Number, required: true },
    addedBalanceParent: { type: Number, required: true },
    imagePath: { type: String, required: true },
    status: { type: String, default: 'approved' }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const ReferralApproved = mongoose.model('ReferralApproved', ReferralApprovedSchema);

// Serve static files from the VPS 'uploads' directory during local development
app.use('/uploads', (req, res) => {
  const vpsUrl = `https://api.fairyglow.org/uploads${req.url}`;
  res.redirect(vpsUrl);
});


// Fetch all pending approval requests
app.get('/api/approvals/referral/pending-approvals', async (req, res) => {
  try {
    const approvals = await ReferralPaymentVerification.find({ status: 'pending' });
    res.json(approvals);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).send('Server error');
  }
});

const userPendingSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    planPRICE: { type: Number, required: true },
    advancePoints: { type: Number, required: true },
    DirectPoint: { type: Number, required: true },
    IndirectPoint: { type: Number, required: true },
    refPer: { type: Number, required: true },
    refParentPer: { type: Number, required: true },
    referrerPin: { type: String, required: true, unique: true },
    referrerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
  },
  { timestamps: true }
);

const UserPending = mongoose.model('UserPending', userPendingSchema);
app.post('/api/approvals/referral/approve', async (req, res) => {
  const { id } = req.body;

  try {
    // Fetch the referral payment request by its ID
    const approval = await ReferralPaymentVerification.findById(id);
    if (!approval) {
      return res.status(404).send('Approval request not found');
    }

    // Find the user associated with the referral payment
    const user = await User.findOne({ username: approval.username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the parent exists (based on user.parent field)
    let parent = null;
    if (user.parent) {
      parent = await User.findById(user.parent);
      if (!parent) {
        console.warn(`Parent user for ${user.username} not found. Skipping parent bonus processing.`);
      }
    }

    // Calculate bonuses
    const bonusAmountSelf = approval.transactionAmount * (user.refPer || 0);
    const bonusAmountParent = parent ? approval.transactionAmount * (parent.refParentPer || 0) : 0;

    // Calculate direct and indirect referral points
    const referralDirectPoints = approval.DirectPoint || 0;
    const referralIndirectPoints = parent ? approval.IndirectPoint || 0 : 0;

    // Update user's balance and points
    user.balance += bonusAmountSelf;
    user.trainingBonusBalance += bonusAmountSelf;
    user.totalPoints += referralDirectPoints;
    user.directPoints += referralDirectPoints;
    await user.save();

    // Update parent's balance and points if a parent exists
    if (parent) {
      parent.balance += bonusAmountParent;
      parent.trainingBonusBalance += bonusAmountParent;
      parent.totalPoints += referralIndirectPoints;
      parent.indirectPoints += referralIndirectPoints;
      await parent.save();
    }

    // Save the approved transaction into the approved record collection
    const approvedRecord = new ReferralApproved({
      username: approval.username,
      transactionId: approval.transactionId,
      transactionAmount: approval.transactionAmount,
      gateway: approval.gateway,
      addedPointsSelf: referralDirectPoints,
      addedPointsParent: referralIndirectPoints,
      addedBalanceSelf: bonusAmountSelf,
      addedBalanceParent: bonusAmountParent,
      imagePath: approval.imagePath,
    });
    await approvedRecord.save();

    // Create a pending record for further tracking
    const userPendingRecord = new UserPending({
      planName: approval.planName,
      planPRICE: approval.planPRICE,
      advancePoints: approval.advancePoints,
      DirectPoint: approval.DirectPoint,
      IndirectPoint: approval.IndirectPoint,
      refPer: approval.refPer,
      refParentPer: approval.refParentPer,
      referrerPin: approval.referrerPin,
      referrerId: user.id
    });
    await userPendingRecord.save();

    // Remove the original approval request from ReferralPaymentVerification after approval
    await ReferralPaymentVerification.findByIdAndRemove(id);

    res.send('Request approved successfully');
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});


// ---------------||Define schema for ReferralRejected||-----------------------

const referralRejectedSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    transactionId: { type: String, required: true },
    transactionAmount: { type: Number, required: true },
    gateway: { type: String, required: true },
    imagePath: { type: String, required: true },
    feedback: { type: String, required: true },
    status: { type: String, default: 'rejected' },
    refPer: { type: Number, required: true },
    refParentPer: { type: Number, required: true }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
  }
);

const ReferralRejected = mongoose.model('ReferralRejected', referralRejectedSchema);

// EndPoint to Handle Referral Request Rejection
app.post('/api/approvals/referral/reject', async (req, res) => {
  const { id, feedback } = req.body;

  try {
    const approval = await ReferralPaymentVerification.findById(id);
    if (!approval) {
      return res.status(404).send('Approval request not found');
    }

    // Create a new rejected record
    const rejectedRecord = new ReferralRejected({
      username: approval.username,
      transactionId: approval.transactionId,
      transactionAmount: approval.transactionAmount,
      gateway: approval.gateway,
      imagePath: approval.imagePath,
      feedback: feedback,
      refPer: approval.refPer,
      refParentPer: approval.refParentPer
    });
    await rejectedRecord.save();

    // Remove the approval request
    await ReferralPaymentVerification.findByIdAndRemove(id);

    res.send('Request rejected successfully');
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});






// Define the WithdrawalRequest model
const withdrawalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    accountNumber: {
      type: String,
      required: true
    },
    accountTitle: {
      type: String,
      required: true
    },
    gateway: {
      type: String,
      required: true
    },
    remarks: {
      type: String,
      default: null // For admin remarks in case of rejection
    }
  },
  { timestamps: true }
);

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

// Submit a withdrawal request (User Side)
app.post('/api/withdraw-balance', async (req, res) => {
  const { username, withdrawAmount, gateway, accountNumber, accountTitle } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check user balance
    if (user.balance < withdrawAmount) {
      return res.status(400).json({ message: 'Insufficient balance for withdrawal.' });
    }

    // Create and save new withdrawal request
    const newWithdrawalRequest = new WithdrawalRequest({
      userId: user._id,
      amount: withdrawAmount,
      accountNumber,
      accountTitle,
      gateway
    });
    await newWithdrawalRequest.save();

    // Deduct balance
    user.balance -= withdrawAmount;
    await user.save();

    res.status(200).json({ message: 'Withdrawal request submitted successfully.', requestId: newWithdrawalRequest._id });
  } catch (error) {
    console.error('Error processing withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all withdrawal requests (Admin Side)
app.get('/api/withdrawals', async (req, res) => {
  try {
    // Fetch all withdrawal requests
    const withdrawalRequests = await WithdrawalRequest.find().populate('userId', 'username').sort({ createdAt: -1 });

    res.json(withdrawalRequests); // Return all requests with their status and remarks s(if any)
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Approve a withdrawal request
app.post('/api/withdrawals/approve', async (req, res) => {
  const { id } = req.body;

  try {
    const withdrawal = await WithdrawalRequest.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    // Find the user associated with the request
    const user = await User.findById(withdrawal.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has sufficient balance (extra safety check)
    if (user.balance < withdrawal.amount) {
      return res.status(400).json({ message: 'Insufficient balance for approval.' });
    }

    // Deduct the balance (now on admin approval)
    user.balance -= withdrawal.amount;
    await user.save();

    // Update status to 'approved'
    withdrawal.status = 'approved';
    await withdrawal.save();

    res.json({ message: 'Withdrawal approved successfully, balance deducted.' });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({ message: 'Failed to approve withdrawal' });
  }
});

// Reject a withdrawal request with feedback (No balance refund, just rejection)
app.post('/api/withdrawals/reject', async (req, res) => {
  const { id, feedback } = req.body;

  try {
    const withdrawal = await WithdrawalRequest.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    // Update status to 'rejected' and save remarks
    withdrawal.status = 'rejected';
    withdrawal.remarks = feedback;
    await withdrawal.save();

    res.json({ message: 'Withdrawal rejected successfully, no balance adjustments.' });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    res.status(500).json({ message: 'Failed to reject withdrawal' });
  }
});

// Fetch all training bonuses
app.get('/api/training-bonus', async (req, res) => {
  try {
    const bonuses = await TrainingBonusApproval.find().sort({ createdAt: -1 });
    res.json(bonuses);
  } catch (error) {
    console.error('Error fetching training bonuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all approved training bonuses
app.get('/api/approvals/approve', async (req, res) => {
  try {
    const approvedBonuses = await TrainingBonusApproved.find().sort({ createdAt: -1 });
    res.json(approvedBonuses);
  } catch (error) {
    console.error('Error fetching approved training bonuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all rejected training bonuses
app.get('/api/approvals/reject', async (req, res) => {
  try {
    const rejectedBonuses = await TrainingBonusRejected.find().sort({ createdAt: -1 });
    res.json(rejectedBonuses);
  } catch (error) {
    console.error('Error fetching rejected training bonuses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to fetch all referral payment verifications
app.get('/api/referral-payment', async (req, res) => {
  try {
    const referralPayments = await ReferralPaymentVerification.find();
    res.json(referralPayments);
  } catch (error) {
    console.error('Error fetching referral payment verifications:', error);
    res.status(500).json({ error: 'Failed to fetch referral payment verifications.' });
  }
});
const referralApprovedSchema = new mongoose.Schema({
  username: { type: String, required: true },
  transactionId: { type: String, required: true },
  transactionAmount: { type: Number, required: true },
  gateway: { type: String, required: true },
  addedPointsSelf: { type: Number, required: true },
  addedPointsParent: { type: Number, required: true },
  addedBalanceSelf: { type: Number, required: true },
  addedBalanceParent: { type: Number, required: true },
  imagePath: { type: String },
}, { timestamps: true });

const ReferralApproveds = mongoose.model('ReferralApproveds', referralApprovedSchema);

// Fetch all approved referral payments
app.get('/api/approvals/referral/approve', async (req, res) => {
  console.log('Fetching all approved referral payments...'); // Add logging
  try {
    const approvals = await ReferralApproveds.find();
    console.log('Approved referrals fetched:', approvals); // Log the fetched data
    res.json(approvals);
  } catch (error) {
    console.error('Error fetching approvals:', error.message); // Log the error message
    res.status(500).send('Server error: ' + error.message);
  }
});


// Fetch all rejected referral payments
app.get('/api/approvals/referral/reject', async (req, res) => {
  try {
    const rejectedApprovals = await ReferralRejected.find();
    res.json(rejectedApprovals);
  } catch (error) {
    console.error('Error fetching rejected approvals:', error);
    res.status(500).send('Server error');
  }
});

// Fetch user by username (to validate existence)
app.get('/api/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/api/users/update-product-profit-balance', async (req, res) => {
  const { username, amount, directPointsIncrement, totalPointsIncrement } = req.body;

  try {
    // Parse amount to ensure it's a valid number
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: 'Invalid amount provided' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's product profit balance, total balance, and points
    user.productprofitBalance += parsedAmount;
    user.balance += parsedAmount;
    user.totalPoints += totalPointsIncrement;
    user.directPoints += totalPointsIncrement;

    // Add the updated product profit history
    user.productProfitHistory.push({
      amount: parsedAmount,
      directPointsIncrement,
      totalPointsIncrement,
    });

    // If the user has a parent, update the parent's indirect points
    if (user.parent) {
      const parent = await User.findById(user.parent);
      if (parent) {
        parent.indirectPoints += directPointsIncrement; // Update parent's indirect points
        parent.totalPoints += totalPointsIncrement;     // Also increment total points for parent

        // Save the parent
        await parent.save();
      } else {
        console.warn(`Parent not found for user ${user.username}`);
      }
    }

    // Save the user after all updates
    await user.save();

    // Return success response
    res.json({
      message: "Product profit balance updated successfully",
      newBalance: user.productprofitBalance,
      totalBalance: user.balance,
      username: user.fullName,
      directPoints: user.directPoints,
      totalPoints: user.totalPoints,
    });

  } catch (error) {
    console.error('Error updating product profit balance:', error);
    res.status(500).json({ message: 'Failed to update product profit balance' });
  }
});




app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error. Could not fetch users.' });
  }
});

// POST endpoint to add a new user
app.post('/api/users', async (req, res) => {
  const {
    fullName,
    username,
    password, // Keep this field but store as plain text (not recommended)
    email,
    phoneNumber,
    plan,
    rank,
    refPer,
    refParentPer,
    advancePoints,
    balance,
    directPoints,
    indirectPoints,
    trainingBonusBalance,
    productprofitBalance,
    productProfitHistory,
    parent // Assuming you want to store the parent reference as well
  } = req.body;

  try {
    // Create a new user instance
    const newUser = new User({
      fullName,
      username,
      password, // Directly store the plain text password
      email,
      phoneNumber,
      plan,
      rank,
      refPer,
      refParentPer,
      advancePoints,
      balance,
      directPoints,
      indirectPoints,
      trainingBonusBalance,
      productprofitBalance,
      productProfitHistory,
      parent // Add parent reference if needed
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: error.message });
  }
});



// DELETE endpoint to delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send('Error updating user');
  }
});



app.post('/api/users/reset-points', async (req, res) => {
  try {
    await User.updateMany({}, {
      $set: {
        totalPoints: 0,
        advancePoints: 0,
        directPoints: 0,
        indirectPoints: 0,
        trainingBonusBalance: 0,
        productProfitBalance: 0

      }
    });
    res.status(200).json({ message: 'Points reset successfully' });
  } catch (error) {
    console.error('Error resetting points:', error);
    res.status(500).json({ message: 'Error resetting points' });
  }
});




// Add a route to get the total user count
app.get('/users/total', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Counts all documents in the User collection
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get admin total profit
app.post('/api/admin/profit/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send('Admin not found');
    
    res.json({ totalProfit: admin.totalProfit });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Add transaction
app.post('/api/admin/transaction/:username', async (req, res) => {
  const { username } = req.params;
  const { amount, type } = req.body; // Expecting amount and type in the request body

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send('Admin not found');
    
    admin.transactions.push({ amount, type });
    admin.totalProfit += amount; // Adjust total profit
    await admin.save();

    res.status(201).send('Transaction added successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});



// Add profit
app.post('/api/admin/add-profit/:username', async (req, res) => {
  const { username } = req.params;
  const { amount } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send('Admin not found');
    
    admin.totalProfit += amount;
    admin.monthlyProfit += amount; // Store in monthly profit
    admin.transactions.push({ amount, type: 'Deposit' });
    await admin.save();

    res.status(201).send('Profit added successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Withdraw profit
app.post('/api/admin/withdraw-profit/:username', async (req, res) => {
  const { username } = req.params;
  const { amount } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send('Admin not found');

    if (admin.totalProfit < amount) return res.status(400).send('Insufficient funds');

    admin.totalProfit -= amount;
    admin.transactions.push({ amount, type: 'Withdrawal' });
    await admin.save();

    res.status(201).send('Profit withdrawn successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get transaction history
app.get('/api/admin/transactions/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).send('Admin not found');

    res.json({ transactions: admin.transactions });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Example endpoint code
app.post('/api/commission/this-month/:username', async (req, res) => {
  const { username } = req.params;

  try {
      // Fetch commissions for the current month for the specified username
      const commissions = await Commission.find({
          username,
          createdAt: {
              $gte: new Date(new Date().setDate(1)), // Start of the month
              $lt: new Date(new Date().setDate(1)).setMonth(new Date().getMonth() + 1) // Start of next month
          }
      });

      // Calculate total commission
      const totalCommission = commissions.reduce((acc, commission) => acc + commission.amount, 0);
      
      res.json({ commissionAmount: totalCommission });
  } catch (error) {
      console.error('Error fetching commission:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/api/admin/monthly-profit/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch the admin document by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Respond with the monthly profit
    res.json({ monthlyProfit: admin.monthlyProfit });
  } catch (error) {
    console.error('Error fetching monthly profit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Endpoint to fetch product profit history for all users
// Endpoint to fetch product profit history for all users
app.get('/api/users/product-profit-history', async (req, res) => {
  try {
    // Fetch all users and only return their username and productProfitHistory
    const users = await User.find({}, 'username productProfitHistory');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Transform the data to a more usable format
    const productProfitHistories = users.map(user => ({
      username: user.username,
      productProfitHistory: user.productProfitHistory,
    }));

    res.json(productProfitHistories);
  } catch (error) {
    console.error('Error fetching all users product profit history:', error);
    res.status(500).json({ message: 'Failed to fetch product profit history for all users' });
  }
});


const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'message', // Default type for notifications
  },
  status: {
    type: String,
    default: 'unread', // Default status for new notifications
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to the current date/time
  },
  userName: {
    type: String,
    required: true, // User associated with the notification
  },
}, {
  versionKey: false, // Disable the version key (__v)
});

const Notification = mongoose.model('Notification', notificationSchema);
app.post('/api/notifications/:username', async (req, res) => {
  const { username } = req.params;
  const { message } = req.body;

  try {
    const newNotification = new Notification({
      message,
      userName: username,
      type: 'message', // or any other type you want to set
      status: 'unread',
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});
app.get('/api/notifications/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const notifications = await Notification.find({ userName: username });
    
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }

    // Format notifications to the required structure
    const formattedNotifications = notifications.map(notification => ({
      _id: notification._id,
      message: notification.message,
      type: notification.type,
      status: notification.status,
      timestamp: notification.timestamp.toISOString(), // Ensure timestamp is in ISO format
      userName: notification.userName,
    }));

    res.json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});
app.delete('/api/notifications/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);
    
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});
