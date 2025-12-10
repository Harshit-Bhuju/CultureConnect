export const initialProducts = [
  {
    id: 1,
    productName: 'Traditional Newari Dhaka Topi',
    productType: 'Traditional',
    culture: 'Newari',
    category: 'cultural-clothes',
    description: 'Authentic handwoven Dhaka Topi made by skilled Newari artisans. Features intricate traditional patterns and vibrant colors that represent Nepal\'s rich cultural heritage.',
    price: 1200,
    stock: 45,
    status: 'Active',
    audience: 'men',
    adultSizes: ['M', 'L', 'XL'],
    childAgeGroups: [],
    tags: ['traditional', 'handmade', 'newari', 'cultural', 'dhaka'],
    dimensions: '25 * 15 * 10',
    material: 'Cotton, Traditional Dhaka fabric',
    careInstructions: 'Hand wash only with cold water. Do not wring or twist. Dry flat in shade. Iron on low heat if needed.',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop',
    ],
    rating: 4.8,
    totalReviews: 3,
    sales: [
      {
        thisMonth: 34,
        thisYear: 156,
        totalSales: 1250
      }
    ],
    orders: [
      {
        user_id: 'ORD-1201',
        customerName: 'Rajesh Maharjan',
        customerEmail: 'rajesh.maharjan@gmail.com',
        customerPhone: '9801234567',
        status: 'completed',
        totalAmount: 2400,
        orderDate: '2024-12-05T14:30:00',
        quantity: 2
      },
      {
        user_id: 'ORD-1185',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@gmail.com',
        customerPhone: '9802345678',
        status: 'shipped',
        totalAmount: 1200,
        orderDate: '2024-12-04T11:15:00',
        quantity: 1
      },
      {
        user_id: 'ORD-1167',
        customerName: 'Anil Shrestha',
        customerEmail: 'anil.shrestha@gmail.com',
        customerPhone: '9803456789',
        status: 'processing',
        totalAmount: 3600,
        orderDate: '2024-12-03T09:45:00',
        quantity: 3
      }
    ],
    createdAt: '2024-01-15',
    reviews: [
      {
        id: 1,
        author: 'Rajesh Maharjan',
        rating: 5,
        date: '2024-11-20',
        comment: 'Absolutely authentic! The craftsmanship is excellent and the quality is top-notch. Very happy with my purchase.'
      },
      {
        id: 2,
        author: 'Sarah Johnson',
        rating: 5,
        date: '2024-11-15',
        comment: 'Beautiful traditional piece. The colors are vibrant and it fits perfectly. Great for cultural events!'
      },
      {
        id: 3,
        author: 'Anil Shrestha',
        rating: 4,
        date: '2024-11-10',
        comment: 'Good quality product. Slightly took longer to arrive but worth the wait. Authentic Newari design.'
      }
    ]
  },
  {
    id: 2,
    productName: 'Tibetan Prayer Wheel',
    productType: 'Religious',
    culture: 'Tibetan',
    category: 'handicraft-decors',
    description: 'Handcrafted brass prayer wheel with authentic mantras inscribed. A spiritual artifact used in Tibetan Buddhist practices, featuring intricate engravings and smooth rotation mechanism.',
    price: 2500,
    stock: 12,
    status: 'Active',
    audience: '',
    adultSizes: [],
    childAgeGroups: [],
    tags: ['tibetan', 'buddhist', 'prayer', 'spiritual', 'handcrafted', 'brass'],
    dimensions: '30 * 12 * 12',
    material: 'Brass, Wood, Cotton',
    careInstructions: 'Wipe with soft dry cloth. Avoid water contact. Polish brass occasionally with brass cleaner to maintain shine.',
    images: [
      'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=1000&fit=crop',
    ],
    rating: 4.9,
    totalReviews: 2,
    sales: [
      {
        thisMonth: 5,
        thisYear: 18,
        totalSales: 89
      }
    ],
    orders: [
      {
        user_id: 'ORD-1198',
        customerName: 'Tenzin Dorje',
        customerEmail: 'tenzin.dorje@gmail.com',
        customerPhone: '9804567890',
        status: 'completed',
        totalAmount: 2500,
        orderDate: '2024-12-06T16:20:00',
        quantity: 1
      },
      {
        user_id: 'ORD-1175',
        customerName: 'Lisa Anderson',
        customerEmail: 'lisa.anderson@gmail.com',
        customerPhone: '9805678901',
        status: 'processing',
        totalAmount: 2500,
        orderDate: '2024-12-02T13:40:00',
        quantity: 1
      }
    ],
    createdAt: '2024-03-22',
    reviews: [
      {
        id: 1,
        author: 'Tenzin Dorje',
        rating: 5,
        date: '2024-11-22',
        comment: 'Authentic and beautifully crafted. The mantras are clearly inscribed and it spins smoothly. Perfect for my meditation room.'
      },
      {
        id: 2,
        author: 'Lisa Anderson',
        rating: 5,
        date: '2024-11-18',
        comment: 'Excellent quality. The craftsmanship is outstanding. Very satisfied with this purchase.'
      }
    ]
  },
  {
    id: 3,
    productName: 'Madal - Traditional Nepali Drum',
    productType: 'Traditional',
    culture: 'Nepali',
    category: 'musical-instruments',
    description: 'Authentic handmade Madal drum, a traditional Nepali percussion instrument. Made with high-quality wood and leather, perfect for folk music performances and cultural events.',
    price: 3500,
    stock: 8,
    status: 'Active',
    audience: '',
    adultSizes: [],
    childAgeGroups: [],
    tags: ['musical', 'instrument', 'madal', 'traditional', 'nepali', 'percussion'],
    dimensions: '45 * 18 * 18',
    material: 'Seasoned wood, Goat leather, Cotton rope',
    careInstructions: 'Keep in dry place away from direct sunlight. Do not expose to moisture. Clean with dry cloth. Tune strings as needed for optimal sound.',
    images: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=1000&fit=crop',
    ],
    rating: 4.7,
    totalReviews: 2,
    sales: [
      {
        thisMonth: 4,
        thisYear: 15,
        totalSales: 67
      }
    ],
    orders: [
      {
        user_id: 'ORD-1192',
        customerName: 'Krishna Tamang',
        customerEmail: 'krishna.tamang@gmail.com',
        customerPhone: '9806789012',
        status: 'shipped',
        totalAmount: 3500,
        orderDate: '2024-12-05T10:25:00',
        quantity: 1
      },
      {
        user_id: 'ORD-1180',
        customerName: 'David Chen',
        customerEmail: 'david.chen@gmail.com',
        customerPhone: '9807890123',
        status: 'completed',
        totalAmount: 7000,
        orderDate: '2024-12-01T15:50:00',
        quantity: 2
      }
    ],
    createdAt: '2024-05-10',
    reviews: [
      {
        id: 1,
        author: 'Krishna Tamang',
        rating: 5,
        date: '2024-11-19',
        comment: 'Perfect sound quality! The craftsmanship is excellent. Highly recommend for anyone learning traditional Nepali music.'
      },
      {
        id: 2,
        author: 'David Chen',
        rating: 4,
        date: '2024-11-12',
        comment: 'Good quality madal. The sound is authentic and the build is solid. Takes some practice to master.'
      }
    ]
  },
  {
    id: 4,
    productName: 'Tharu Traditional Dress for Women',
    productType: 'Traditional',
    culture: 'Tharu',
    category: 'cultural-clothes',
    description: 'Beautiful traditional Tharu dress for women, featuring colorful embroidery and authentic tribal patterns. Made with high-quality cotton fabric, comfortable for all-day wear during cultural celebrations.',
    price: 2800,
    stock: 15,
    status: 'Active',
    audience: 'women',
    adultSizes: ['S', 'M', 'L', 'XL'],
    childAgeGroups: [],
    tags: ['tharu', 'traditional', 'dress', 'ethnic', 'embroidered', 'cultural'],
    dimensions: '120 * 80 * 2',
    material: 'Premium Cotton, Silk thread embroidery',
    careInstructions: 'Hand wash separately in cold water. Do not bleach. Dry in shade. Iron on medium heat. Dry clean recommended for best results.',
    images: [
      'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1000&fit=crop',
    ],
    rating: 4.6,
    totalReviews: 2,
    sales: [
      {
        thisMonth: 9,
        thisYear: 42,
        totalSales: 134
      }
    ],
    orders: [
      {
        user_id: 'ORD-1205',
        customerName: 'Sita Chaudhary',
        customerEmail: 'sita.chaudhary@gmail.com',
        customerPhone: '9808901234',
        status: 'processing',
        totalAmount: 2800,
        orderDate: '2024-12-07T08:30:00',
        quantity: 1
      },
      {
        user_id: 'ORD-1188',
        customerName: 'Maya Tharu',
        customerEmail: 'maya.tharu@gmail.com',
        customerPhone: '9809012345',
        status: 'completed',
        totalAmount: 5600,
        orderDate: '2024-12-04T12:45:00',
        quantity: 2
      }
    ],
    createdAt: '2024-02-28',
    reviews: [
      {
        id: 1,
        author: 'Sita Chaudhary',
        rating: 5,
        date: '2024-11-21',
        comment: 'Absolutely gorgeous! The embroidery work is stunning and the fit is perfect. Received many compliments at the cultural program.'
      },
      {
        id: 2,
        author: 'Maya Tharu',
        rating: 4,
        date: '2024-11-16',
        comment: 'Beautiful dress with authentic Tharu designs. The colors are vibrant. Slightly delayed delivery but worth the wait.'
      }
    ]
  },
  {
    id: 5,
    productName: 'Newari Kids Cultural Outfit',
    productType: 'Traditional',
    culture: 'Newari',
    category: 'cultural-clothes',
    description: 'Adorable traditional Newari outfit for boys, perfect for cultural festivals and special occasions. Features authentic Newari design elements with comfortable cotton fabric suitable for active kids.',
    price: 1500,
    stock: 25,
    status: 'Active',
    audience: 'boy',
    adultSizes: [],
    childAgeGroups: ['5-6', '7-8', '9-10', '11-12'],
    tags: ['kids', 'newari', 'traditional', 'cultural', 'festival', 'boys'],
    dimensions: '75 * 50 * 2',
    material: 'Soft cotton, Traditional fabric accents',
    careInstructions: 'Machine wash cold on gentle cycle. Tumble dry low. Iron if needed. Avoid harsh detergents to preserve colors.',
    images: [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=1000&fit=crop',
    ],
    rating: 4.8,
    totalReviews: 3,
    sales: [
      {
        thisMonth: 16,
        thisYear: 64,
        totalSales: 198
      }
    ],
    orders: [
      {
        user_id: 'ORD-1203',
        customerName: 'Lakshmi Shakya',
        customerEmail: 'lakshmi.shakya@gmail.com',
        customerPhone: '9810123456',
        status: 'shipped',
        totalAmount: 1500,
        orderDate: '2024-12-06T14:10:00',
        quantity: 1
      },
      {
        user_id: 'ORD-1195',
        customerName: 'Ramesh Joshi',
        customerEmail: 'ramesh.joshi@gmail.com',
        customerPhone: '9811234567',
        status: 'completed',
        totalAmount: 3000,
        orderDate: '2024-12-05T11:30:00',
        quantity: 2
      },
      {
        user_id: 'ORD-1172',
        customerName: 'Anita Shrestha',
        customerEmail: 'anita.shrestha@gmail.com',
        customerPhone: '9812345678',
        status: 'processing',
        totalAmount: 1500,
        orderDate: '2024-12-03T16:55:00',
        quantity: 1
      }
    ],
    createdAt: '2024-06-18',
    reviews: [
      {
        id: 1,
        author: 'Lakshmi Shakya',
        rating: 5,
        date: '2024-11-23',
        comment: 'My son looked adorable in this! Good quality fabric and stitching. Perfect for the Indra Jatra festival.'
      },
      {
        id: 2,
        author: 'Ramesh Joshi',
        rating: 5,
        date: '2024-11-17',
        comment: 'Excellent quality and authentic design. My nephew loved wearing it. Highly recommend!'
      },
      {
        id: 3,
        author: 'Anita Shrestha',
        rating: 4,
        date: '2024-11-11',
        comment: 'Very nice outfit. The sizing was accurate. Good value for money.'
      }
    ]
  },
  {
    id: 6,
    productName: 'Bamboo Handicraft Wall Decor',
    productType: 'Contemporary',
    culture: 'Mixed',
    category: 'handicraft-decors',
    description: 'Eco-friendly bamboo wall art featuring intricate weaving patterns. Handcrafted by local artisans, this piece combines traditional techniques with modern design aesthetics.',
    price: 1800,
    stock: 20,
    status: 'Active',
    audience: '',
    adultSizes: [],
    childAgeGroups: [],
    tags: ['bamboo', 'wall-art', 'eco-friendly', 'handcrafted', 'decor', 'sustainable'],
    dimensions: '60 * 60 * 5',
    material: 'Natural bamboo, Jute string',
    careInstructions: 'Dust regularly with soft brush. Keep away from moisture. Do not expose to direct sunlight for prolonged periods. Can be cleaned with damp cloth if needed.',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=1000&fit=crop',
    ],
    rating: 4.5,
    totalReviews: 2,
    sales: [
      {
        thisMonth: 7,
        thisYear: 36,
        totalSales: 112
      }
    ],
    orders: [
      {
        user_id: 'ORD-1190',
        customerName: 'Maria Garcia',
        customerEmail: 'maria.garcia@gmail.com',
        customerPhone: '9813456789',
        status: 'completed',
        totalAmount: 1800,
        orderDate: '2024-12-04T09:20:00',
        quantity: 1
      },
      {
        user_id: 'ORD-1177',
        customerName: 'Robert Wilson',
        customerEmail: 'robert.wilson@gmail.com',
        customerPhone: '9814567890',
        status: 'shipped',
        totalAmount: 5400,
        orderDate: '2024-12-02T15:35:00',
        quantity: 3
      }
    ],
    createdAt: '2024-08-05',
    reviews: [
      {
        id: 1,
        author: 'Maria Garcia',
        rating: 5,
        date: '2024-11-19',
        comment: 'Beautiful piece! Adds a natural, organic feel to my living room. The craftsmanship is excellent.'
      },
      {
        id: 2,
        author: 'Robert Wilson',
        rating: 4,
        date: '2024-11-14',
        comment: 'Nice bamboo art. Looks great on the wall. Package arrived well-protected.'
      }
    ]
  },
  {
    id: 7,
    productName: 'Traditional Sarangi (String Instrument)',
    productType: 'Traditional',
    culture: 'Nepali',
    category: 'musical-instruments',
    description: 'Authentic handcrafted Sarangi, a traditional Nepali string instrument. Made with carefully selected wood and horsehair strings, producing rich, melodious tones perfect for classical music.',
    price: 8500,
    stock: 4,
    status: 'Active',
    audience: '',
    adultSizes: [],
    childAgeGroups: [],
    tags: ['sarangi', 'musical', 'traditional', 'string-instrument', 'nepali', 'classical'],
    dimensions: '50 * 20 * 15',
    material: 'Teak wood, Horsehair strings, Goat skin',
    careInstructions: 'Store in dry place at room temperature. Keep strings tuned. Clean with soft cloth. Avoid extreme temperature changes. Professional maintenance recommended annually.',
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
    ],
    rating: 4.9,
    totalReviews: 2,
    sales: [
      {
        thisMonth: 1,
        thisYear: 8,
        totalSales: 23
      }
    ],
    orders: [
      {
        user_id: 'ORD-1200',
        customerName: 'Ganesh Raj',
        customerEmail: 'ganesh.raj@gmail.com',
        customerPhone: '9815678901',
        status: 'processing',
        totalAmount: 8500,
        orderDate: '2024-12-06T10:40:00',
        quantity: 1
      }
    ],
    createdAt: '2024-09-12',
    reviews: [
      {
        id: 1,
        author: 'Ganesh Raj',
        rating: 5,
        date: '2024-11-20',
        comment: 'Exceptional quality! The sound is pure and authentic. Worth every rupee. Perfect for my music school.'
      },
      {
        id: 2,
        author: 'Prakash Ale',
        rating: 5,
        date: '2024-11-15',
        comment: 'Beautiful instrument with excellent tonal quality. Highly recommended for serious musicians.'
      }
    ]
  },
  {
    id: 8,
    productName: 'Sherpa Traditional Jacket',
    productType: 'Traditional',
    culture: 'Sherpa',
    category: 'cultural-clothes',
    description: 'Warm and authentic Sherpa traditional jacket made with high-quality wool. Features traditional patterns and excellent insulation, perfect for cold weather and cultural occasions.',
    price: 4500,
    stock: 10,
    status: 'Draft',
    audience: 'men',
    adultSizes: ['M', 'L', 'XL', 'XXL'],
    childAgeGroups: [],
    tags: ['sherpa', 'jacket', 'warm', 'traditional', 'wool', 'winter'],
    dimensions: '80 * 60 * 3',
    material: 'Pure wool, Cotton lining, Traditional fabric accents',
    careInstructions: 'Dry clean only. Do not machine wash. Store in cool, dry place. Keep away from moths. Can be aired in shade to refresh.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&h=1000&fit=crop',
    ],
    rating: 0,
    totalReviews: 0,
    sales: [
      {
        thisMonth: 0,
        thisYear: 0,
        totalSales: 0
      }
    ],
    orders: [],
    createdAt: '2024-11-01',
    reviews: []
  }
];

// Helper function to get all recent orders across all products
export const getAllRecentOrders = () => {
  const allOrders = [];
  
  initialProducts.forEach((product) => {
    if (product.orders && product.orders.length > 0) {
      product.orders.forEach((order) => {
        allOrders.push({
          ...order,
          productId: product.id,
          productName: product.productName
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

export const stockOptions = ['All Stock', 'In Stock', 'Out of Stock','Low Stock'];

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