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
  ]
};

export default user;
