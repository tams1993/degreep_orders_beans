

export const useOrderStatus = () => {

  const statusMap = ref({
    1: 'Placed',
    2: 'Paid',
    3: 'Delivered',
    4: 'Canceled'
  });
  
  const getStatusDescription = (status) => {
    return statusMap.value[status] || 'Unknown';
  };

  return { statusMap, getStatusDescription };
}