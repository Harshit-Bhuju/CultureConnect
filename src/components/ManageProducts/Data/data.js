
// Helper function to get all recent orders across all products
export const getAllRecentOrders = () => {
  const allOrders = [];
  
  initialProducts.forEach((product) => {
    if (product.orders && product.orders.length > 0) {
      product.orders.forEach((order) => {
        allOrders.push({
          ...order,
          productId: product.id,
          productName: product.productName,
          productPrice: product.price
        });
      });
    }
  });
  
  // Sort by date (most recent first)
  return allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

// Helper function to update order status
export const updateOrderStatus = (userId, newStatus) => {
  const product = initialProducts.find(p => 
    p.orders && p.orders.some(o => o.user_id === userId)
  );
  
  if (product) {
    const order = product.orders.find(o => o.user_id === userId);
    if (order) {
      order.status = newStatus;
      return true;
    }
  }
  return false;
};

// Helper function to get orders by user ID
export const getOrdersByUserId = (userId) => {
  const userOrders = [];
  
  initialProducts.forEach((product) => {
    if (product.orders && product.orders.length > 0) {
      const matchingOrders = product.orders.filter(
        (order) => order.user_id === userId
      );
      
      matchingOrders.forEach((order) => {
        userOrders.push({
          ...order,
          productId: product.id,
          productName: product.productName
        });
      });
    }
  });
  
  return userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};

// Helper function to get orders by customer email
export const getOrdersByEmail = (email) => {
  const emailOrders = [];
  
  initialProducts.forEach((product) => {
    if (product.orders && product.orders.length > 0) {
      const matchingOrders = product.orders.filter(
        (order) => order.customerEmail === email
      );
      
      matchingOrders.forEach((order) => {
        emailOrders.push({
          ...order,
          productId: product.id,
          productName: product.productName
        });
      });
    }
  });
  
  return emailOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
};


// Categories matching the upload form
export const categories = [
  'All Categories',
  'Cultural Clothes',
  'Musical Instruments',
  'Handicraft & Decors'
];

export const sortOptions = ['Latest', 'Oldest','Recently Updated'];



export const getCategoryDisplay = (category) => {
  const categoryMap = {
    'cultural-clothes': 'Cultural Clothes',
    'musical-instruments': 'Musical Instruments',
    'handicraft-decors': 'Handicraft & Decors'
  };
  return categoryMap[category] || category.toUpperCase();
};

// Helper function to get audience display name
export const getAudienceDisplay = (audience) => {
  const audienceMap = {
    'men': 'Men',
    'women': 'Women',
    'boy': 'Boys',
    'girl': 'Girls'
  };
  return audienceMap[audience] || '';
};

// Helper function to calculate average rating
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};