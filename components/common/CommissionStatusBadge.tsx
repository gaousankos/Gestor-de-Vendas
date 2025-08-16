import React from 'react';
import { CommissionStatus } from '../../types';

interface CommissionStatusBadgeProps {
  status: CommissionStatus;
}

const CommissionStatusBadge: React.FC<CommissionStatusBadgeProps> = ({ status }) => {
  const statusStyles: Record<CommissionStatus, string> = {
    [CommissionStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [CommissionStatus.Pending]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default CommissionStatusBadge;
