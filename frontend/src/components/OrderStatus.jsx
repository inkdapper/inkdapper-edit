import React from 'react';

const OrderStatus = ({ item, orderStatusLoading }) => {
  const statusColors = {
    'Order placed': 'bg-[#FFB26F]',
    'Packing': 'bg-[#FAB12F]',
    'Shipped': 'bg-[#FC8F54]',
    'Out for delivery': 'bg-[#FA812F]',
    'Delivered': 'bg-[#FA4032]',
  };

  const statusClass = statusColors[item.status] || 'bg-[#FFB26F]'; // Default color

  return (
    <div className={`flex items-center gap-2 lg:flex ${orderStatusLoading}`}>
      <p className={`min-w-2 h-2 rounded-full ${statusClass}`}></p>
      <p className="text-sm md:text-base">{item.status}</p>
    </div>
  );
};

export default OrderStatus;