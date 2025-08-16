
import React from 'react';
import { PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: PaymentStatus;
  large?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, large = false }) => {
  const statusStyles: Record<PaymentStatus, string> = {
    [PaymentStatus.Confirmed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [PaymentStatus.Partial]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [PaymentStatus.Pending]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    [PaymentStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    [PaymentStatus.Cancelled]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  const sizeClass = large ? 'px-4 py-2 text-base' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClass} font-medium rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
   