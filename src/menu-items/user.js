// assets
import { IconUsers, IconUserPlus } from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconUserPlus
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const user = {
  id: 'users',
  title: 'Users',
  type: 'group',
  children: [
    {
      id: 'Active Users',
      title: 'Active Users',
      type: 'item',
      url: '/users/active-users',
      icon: icons.IconUsers
    },
    {
      id: 'Plans Management',
      title: 'Plans Management',
      type: 'item',
      url: '/users/plans-management',
      icon: icons.IconUsers
    },
 
    {
      id: 'Admin Notification',
      title: 'Admin Notification',
      type: 'item',
      url: '/users/admin-notification',
      icon: icons.IconUsers
    },
    {
      id: 'All Notification',
      title: 'All Notification',
      type: 'item',
      url: '/users/all-notification',
      icon: icons.IconUsers
    },
    {
      id: 'Contact Number',
      title: 'Contact Number',
      type: 'item',
      url: '/users/contact-us',
      icon: icons.IconUsers
    },
    {
      id: 'Payment Account',
      title: 'Payment Account',
      type: 'item',
      url: '/users/payment-accounts',
      icon: icons.IconUsers
    },
    {
      id: 'Tasks Management',
      title: 'Tasks Management',
      type: 'item',
      url: '/users/tasks-management',
      icon: icons.IconUsers
    },
  ]
  
};

export default user;
