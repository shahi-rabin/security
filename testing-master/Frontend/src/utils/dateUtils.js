const getTimeDifference = (dateString) => {
    const currentDate = new Date();
    const statusUpdatedAt = new Date(dateString);
    const timeDifference = currentDate.getTime() - statusUpdatedAt.getTime();
  
    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
  };
  
  export { getTimeDifference };
  