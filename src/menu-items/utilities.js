// Icon assets
import { IconCircleDashedCheck } from '@tabler/icons-react';

// constant
const icons = {
  IconCircleDashedCheck
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'Approved',
  title: 'Approved',
  type: 'group',
  children: [
    {
      id: 'Training Bonus Approved',
      title: 'Withdrwal History',
      type: 'item',
      url: '/Approved/Training-bonus',
      icon: icons.IconCircleDashedCheck,
      breadcrumbs: false
    },
    {
      id: 'Referral Payment Approved',
      title: 'Referral Payment History',
      type: 'item',
      url: '/Approved/Referral-Bonus',
      icon: icons.IconCircleDashedCheck,
      breadcrumbs: false
    },
    {
      id: 'Admin Transactions History',
      title: 'Admin Transactions',
      type: 'item',
      url: '/Approved/Admin-Transaction',
      icon: icons.IconCircleDashedCheck,
      breadcrumbs: false
    },
  ]
};

export default utilities;
