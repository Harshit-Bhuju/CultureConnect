const getBaseUrl = () => {
  const hostname = window.location.hostname;

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost/CultureConnect/backend";
  }

  // Production
  return "https://api.harmanbhuju.com.np/cultureconnect/backend";
};

export const BASE_URL = getBaseUrl();

const API = {
  // Authentication
  GOOGLE_LOGIN: `${BASE_URL}/auth/google_login.php`,
  CHECK_SESSION: `${BASE_URL}/auth/check_session.php`,
  SET_PASSWORD: `${BASE_URL}/auth/setpassword.php`,
  CHANGE_PASSWORD: `${BASE_URL}/user/changePassword.php`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgotPassword.php`,
  SIGNUP: `${BASE_URL}/auth/signup.php`,
  LOGIN: `${BASE_URL}/auth/login.php`,
  SIGNUP_VERIFY: `${BASE_URL}/auth/signup_verify.php`,
  FORGOT_PASSWORD_VERIFY: `${BASE_URL}/auth/forgotpassword_verify.php`,
  LOGOUT: `${BASE_URL}/auth/logout.php`,

  // User Profile
  UPLOADS: `${BASE_URL}/uploads`,
  USER_PROFILE: `${BASE_URL}/user/user_profile.php`,
  USERNAME_PERSONAL: `${BASE_URL}/user/update_username.php`,
  SETTING_PASSWORD: `${BASE_URL}/user/set_password_authenticated.php`,

  // Seller
  SELLER_REGISTRATION: `${BASE_URL}/seller/seller_registration.php`,
  GET_SELLER_PROFILE: `${BASE_URL}/seller/get_seller_profile.php`,

  UPDATE_SELLER_PROFILE: `${BASE_URL}/seller/seller_profile_update.php`,

  // Products
  PRODUCT_UPLOAD: `${BASE_URL}/seller/product_upload.php`,
  PRODUCT_IMAGES: `${BASE_URL}/uploads/product_images`,
  GET_SELLER_PRODUCTS: `${BASE_URL}/seller/get_seller_products.php`,
  DELETE_PRODUCT: `${BASE_URL}/seller/product_delete.php`,
  GET_PRODUCT_DETAILS: `${BASE_URL}/seller/get_product_details.php`,
  UPDATE_PRODUCT: `${BASE_URL}/seller/product_update.php`,
  UPDATE_PRODUCT_STATUS: `${BASE_URL}/seller/product_status_update.php`,
  GET_DRAFT_PRODUCTS: `${BASE_URL}/seller/get_draft_products.php`,

  // Orders
  GET_ALL_ORDERS: `${BASE_URL}/order/get_all_orders.php`,
  UPDATE_ORDER_STATUS: `${BASE_URL}/order/update_order_status.php`,
  CREATE_ORDER: `${BASE_URL}/order/create_order.php`,
  GET_ORDER_DETAILS: `${BASE_URL}/order/get_order_details_confirmation.php`,
  GET_USER_LOCATION: `${BASE_URL}/user/get_user_location.php`,
  CONFIRM_PAYMENT: `${BASE_URL}/order/confirm_payment.php`,

  // Cart & Wishlist
  GET_CART_ITEMS: `${BASE_URL}/user/user_cart/get_cart_items.php`,
  ADD_TO_CART: `${BASE_URL}/user/user_cart/add_to_cart.php`,
  UPDATE_CART_QUANTITY: `${BASE_URL}/user/user_cart/update_cart_quantity.php`,
  REMOVE_FROM_CART: `${BASE_URL}/user/user_cart/remove_from_cart.php`,
  GET_WISHLIST_ITEMS: `${BASE_URL}/user/user_cart/get_wishlist_items.php`,
  ADD_TO_WISHLIST: `${BASE_URL}/user/user_cart/add_to_wishlist.php`,
  REMOVE_FROM_WISHLIST: `${BASE_URL}/user/user_cart/remove_from_wishlist.php`,

  // Order History
  GET_RECENT_ORDERS: `${BASE_URL}/user/user_cart/get_recent_orders.php`,
  GET_CANCELLED_ORDERS: `${BASE_URL}/user/user_cart/get_cancelled_orders.php`,
  GET_COMPLETED_ORDERS: `${BASE_URL}/user/user_cart/get_completed_orders.php`,

  // Analytics
  GET_ANALYTICS_STATS: `${BASE_URL}/seller/get_analytics_stats.php`,
  GET_TOP_SELLING_PRODUCTS: `${BASE_URL}/seller/get_top_selling_products.php`,

  // Reviews
  SUBMIT_REVIEW: `${BASE_URL}/review/submit_review.php`,
  DELETE_REVIEW: `${BASE_URL}/review/delete_review.php`,
  SELLER_REPLY_REVIEW: `${BASE_URL}/review/seller_reply_review.php`,
  SELLER_DELETE_REPLY: `${BASE_URL}/review/seller_delete_reply.php`,

  // Seller Follow
  FOLLOW_SELLER: `${BASE_URL}/seller/follow_seller.php`,
  CHECK_FOLLOW_STATUS: `${BASE_URL}/user/check_follow_status.php`,
  GET_USER_FOLLOWING: `${BASE_URL}/user/get_user_following.php`,

  // Home/Products
  GET_POPULAR_PRODUCTS: `${BASE_URL}/product/seller_product/marketplace/get_popular_products.php`,
  GET_TRENDING_PRODUCTS: `${BASE_URL}/product/seller_product/marketplace/get_trending_products.php`,
  GET_POPULAR_WEEKLY_PRODUCTS: `${BASE_URL}/product/seller_product/marketplace/get_popular_week.php`,

  // Teacher
  TEACHER_REGISTRATION: `${BASE_URL}/teacher/teacher_registration.php`,
  TEACHER_PROFILE_PICTURES: `${BASE_URL}/uploads/teacher_datas/profile_pictures`,
  TEACHER_CERTIFICATES: `${BASE_URL}/uploads/teacher_datas/certificates`,
  GET_TEACHER_PROFILE_WITH_COURSES: `${BASE_URL}/teacher/get_teacher_profile.php`,
  UPDATE_TEACHER_PROFILE: `${BASE_URL}/teacher/teacher_profile_update.php`,
  GET_PENDING_TEACHERS: `${BASE_URL}/teacher/get_pending_teachers.php`,
  APPROVE_TEACHER: `${BASE_URL}/teacher/approve_teacher.php`,
  FOLLOW_TEACHER: `${BASE_URL}/teacher/follow_teacher.php`,
  CHECK_TEACHER_FOLLOW_STATUS: `${BASE_URL}/user/check_teacher_follow_status.php`,
  GET_USER_FOLLOWING_TEACHERS: `${BASE_URL}/user/get_user_following_teacher.php`,

  // Teacher Courses
  COURSE_UPLOAD: `${BASE_URL}/course/course_upload.php`,
  GET_TEACHER_COURSES: `${BASE_URL}/get_teacher_courses.php`,
  GET_DRAFT_COURSES: `${BASE_URL}/get_draft_courses.php`,
  GET_COURSE_DETAILS: `${BASE_URL}/course/get_course_details.php`,
  UPDATE_COURSE: `${BASE_URL}/course/course_update.php`,
  DELETE_COURSE: `${BASE_URL}/course/course_delete.php`,
  UPDATE_COURSE_STATUS: `${BASE_URL}/course/course_status_update.php`,

  // Course Videos
  COURSE_VIDEOS: `${BASE_URL}/uploads/teacher_datas/course_videos`,

  // Course Thumbnails
  COURSE_THUMBNAILS: `${BASE_URL}/uploads/teacher_datas/course_thumbnails`,
};

export default API;
