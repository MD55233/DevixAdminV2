// assets
import { IconCalendarClock } from '@tabler/icons-react';

// constant
const icons = {
  IconCalendarClock
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Approvals & History',
  type: 'group',
  children: [
    {
      id: 'Training Bonus',
      title: 'Training Bonus',
      type: 'item',
      url: '/approval/training-bonus-approval',
      icon: icons.IconCalendarClock
    },
    {
      id: 'Referral Payment',
      title: 'Referral Payment',
      type: 'item',
      url: '/approval/reference-approval',
      icon: icons.IconCalendarClock
    },
    {
      id: 'Withdrawal Bonus', // New entry for withdrawal bonus approval
      title: 'Withdrawal Bonus',
      type: 'item',
      url: '/approval/withdrawal-approval', // Updated URL
      icon: icons.IconCalendarClock // You can change the icon if needed
    },
    {
      id: 'Update Product Profit Balance', // New entry for updating product profit balance
      title: 'Update Product Profit Balance',
      type: 'item',
      url: '/approval/update-product-profit-balance', // URL for the new component
      icon: icons.IconCalendarClock // You can change the icon if needed
    }
  ]
};

export default pages;
