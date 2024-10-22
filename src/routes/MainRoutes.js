import { lazy } from 'react';

// Project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// Dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Payment routing
const TrainingBonusApproval = Loadable(lazy(() => import('views/pages/TrainingBonusApproval')));
const ReferenceApproval = Loadable(lazy(() => import('views/pages/ReferenceApproval')));

// Transaction routing
const ReferenceBonusApproved = Loadable(lazy(() => import('views/utilities/ReferenceBonusApproved')));
const TrainingBonusApproved = Loadable(lazy(() => import('views/utilities/TrainingBonusApproved')));

// User Routes
const ActiveUsers = Loadable(lazy(() => import('views/user/ActiveUsers')));
const AddUser = Loadable(lazy(() => import('views/user/AddUser')));
const AdminNotification = Loadable(lazy(() => import('views/user/AdminNotification')));

// Withdrawal Routes
const WithdrawalApproval = Loadable(lazy(() => import('views/pages/WithdrawalApproval'))); // New route

// Product Profit Balance Route
const UpdateProductProfitBalance = Loadable(lazy(() => import('views/pages/UpdateProductProfitBalance'))); // New route
const PlansManagement = Loadable(lazy(() => import('views/user/PlansManagement')));

const AdminTransactionHistory = Loadable(lazy(() => import('views/utilities/AdminTransactionHistory')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'approved',
      children: [
        {
          path: 'training-bonus',
          element: <TrainingBonusApproved />
        },
        {
          path: 'referral-bonus',
          element: <ReferenceBonusApproved />
        },
        {
          path: 'admin-transaction',
          element: <AdminTransactionHistory />
        },
      ]
    },
    {
      path: 'users',
      children: [
        {
          path: 'active-users',
          element: <ActiveUsers />
        },
        {
          path: 'plans-management',
          element: <PlansManagement />
        },
        {
          path: 'add-user',
          element: <AddUser />
        },
        {
          path: 'admin-notification',
          element: <AdminNotification />
        },
      ]
    },
    {
      path: 'approval',
      children: [
        {
          path: 'training-bonus-approval',
          element: <TrainingBonusApproval />
        },
        {
          path: 'reference-approval',
          element: <ReferenceApproval />
        },
        {
          path: 'withdrawal-approval', // New route for withdrawal bonus approval
          element: <WithdrawalApproval />
        },
        {
          path: 'update-product-profit-balance', // New route for updating product profit balance
          element: <UpdateProductProfitBalance />
        }
      ]
    }
  ]
};

export default MainRoutes;
