const getBaseUrl = () => {
  const hostname = window.location.hostname;

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost/CultureConnect/backend";
    // return "https://api.harmanbhuju.com.np/cultureconnect/backend";
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
  FORGOT_PASSWORD_VERIFY: `${BASE_URL}/auth/forgotPassword_verify.php`,
  LOGOUT: `${BASE_URL}/auth/logout.php`,

  // User Profile
  UPLOADS: `${BASE_URL}/uploads`,
  USER_PROFILE: `${BASE_URL}/user/user_profile.php`,
  USERNAME_PERSONAL: `${BASE_URL}/user/update_username.php`,
  SETTING_PASSWORD: `${BASE_URL}/user/set_password_authenticated.php`,

  // Seller
  SELLER_REGISTRATION: `${BASE_URL}/seller/seller_registration.php`,
  GET_SELLER_PROFILE: `${BASE_URL}/seller/get_seller_profile.php`,
  GET_SELLER_FOLLOWERS: `${BASE_URL}/seller/get_seller_followers.php`,
  SELLER_LOGOS: `${BASE_URL}/uploads/seller_img_datas/seller_logos`,
  SELLER_BANNERS: `${BASE_URL}/uploads/seller_img_datas/seller_banners`,

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
  CANCEL_ORDER: `${BASE_URL}/user/user_cart/cancel_order.php`,

  // Analytics
  GET_ANALYTICS_STATS: `${BASE_URL}/seller/analytics/get_analytics_stats.php`,
  GET_TOP_SELLING_PRODUCTS: `${BASE_URL}/seller/analytics/get_top_selling_products.php`,

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
  GET_MAY_LIKE_PRODUCTS: `${BASE_URL}/product/seller_product/marketplace/get_may_like.php`,
  GET_SUGGESTED_SELLERS: `${BASE_URL}/product/seller_product/marketplace/get_suggested_sellers.php`,
  GET_CATEGORY_COUNTS: `${BASE_URL}/product/seller_product/marketplace/get_category_counts.php`,
  GET_CATEGORY_PRODUCTS: `${BASE_URL}/product/seller_product/category/get_category_products.php`,

  // Teacher Course Filtering & Marketplace
  GET_POPULAR_COURSES: `${BASE_URL}/product/teacher_courses/learn_culture/get_popular_courses.php`,
  GET_TRENDING_COURSES: `${BASE_URL}/product/teacher_courses/learn_culture/get_trending_courses.php`,
  GET_MAY_LIKE_COURSES: `${BASE_URL}/product/teacher_courses/learn_culture/get_may_like_courses.php`,
  GET_COURSE_CATEGORY_COUNTS: `${BASE_URL}/product/teacher_courses/learn_culture/get_category_counts.php`,
  GET_CATEGORY_COURSES: `${BASE_URL}/product/teacher_courses/category/get_category_courses.php`,
  GET_SUGGESTED_TEACHERS: `${BASE_URL}/product/teacher_courses/learn_culture/get_suggested_teachers.php`,

  // Teacher
  TEACHER_REGISTRATION: `${BASE_URL}/teacher/teacher_registration.php`,
  TEACHER_PROFILE_PICTURES: `${BASE_URL}/uploads/teacher_datas/profile_pictures`,
  TEACHER_CERTIFICATES: `${BASE_URL}/uploads/teacher_datas/certificates`,
  GET_TEACHER_PROFILE_WITH_COURSES: `${BASE_URL}/teacher/get_teacher_profile.php`,
  GET_TEACHER_FOLLOWERS: `${BASE_URL}/teacher/get_teacher_followers.php`,
  UPDATE_TEACHER_PROFILE: `${BASE_URL}/teacher/teacher_profile_update.php`,
  GET_PENDING_TEACHERS: `${BASE_URL}/teacher/get_pending_teachers.php`,
  APPROVE_TEACHER: `${BASE_URL}/admin/approve_teacher.php`,
  FOLLOW_TEACHER: `${BASE_URL}/teacher/follow_teacher.php`,
  CHECK_TEACHER_FOLLOW_STATUS: `${BASE_URL}/user/check_teacher_follow_status.php`,
  GET_USER_FOLLOWING_TEACHERS: `${BASE_URL}/user/get_user_following_teacher.php`,

  // Enrollment
  CHECK_ENROLLMENT: `${BASE_URL}/user/check_enrollment.php`,
  ENROLL_COURSE: `${BASE_URL}/course/enroll_course.php`,
  GET_ENROLLED_COURSES: `${BASE_URL}/course/get_enrolled_courses.php`,

  // Course Orders & Payments
  CREATE_COURSE_ORDER: `${BASE_URL}/course/create_course_order.php`,
  CONFIRM_COURSE_PAYMENT: `${BASE_URL}/course/confirm_course_payment.php`,

  // Teacher Courses
  COURSE_UPLOAD: `${BASE_URL}/course/course_upload.php`,
  GET_TEACHER_COURSES: `${BASE_URL}/course/get_teacher_courses.php`,
  GET_DRAFT_COURSES: `${BASE_URL}/course/get_draft_courses.php`,
  GET_COURSE_DETAILS: `${BASE_URL}/course/get_course_details.php`,
  UPDATE_COURSE: `${BASE_URL}/course/course_update.php`,
  DELETE_COURSE: `${BASE_URL}/course/delete_course.php`,
  UPDATE_COURSE_STATUS: `${BASE_URL}/course/course_status_update.php`,

  // Teacher Analytics
  GET_TEACHER_ANALYTICS_STATS: `${BASE_URL}/teacher/analytics/get_analytics_stats.php`,
  GET_TOP_PERFORMING_COURSES: `${BASE_URL}/teacher/analytics/get_top_courses.php`,
  GET_RECENT_ENROLLMENTS: `${BASE_URL}/teacher/analytics/get_recent_enrollments.php`,
  GET_TEACHER_TRANSACTION_HISTORY: `${BASE_URL}/teacher/analytics/get_transaction_history.php`,
  GET_CANCELLED_ENROLLMENTS: `${BASE_URL}/teacher/analytics/get_cancelled_enrollments.php`,

  // Course Videos
  COURSE_VIDEOS: `${BASE_URL}/uploads/teacher_datas/course_videos`,

  // Course Thumbnails
  COURSE_THUMBNAILS: `${BASE_URL}/uploads/teacher_datas/course_thumbnails`,

  // Course Reviews
  SUBMIT_COURSE_REVIEW: `${BASE_URL}/course/submit_course_review.php`,
  DELETE_COURSE_REVIEW: `${BASE_URL}/course/delete_course_review.php`,
  TEACHER_REPLY_COURSE_REVIEW: `${BASE_URL}/course/teacher_reply_course_review.php`,
  TEACHER_DELETE_COURSE_REPLY: `${BASE_URL}/course/teacher_delete_course_reply.php`,

  // Course Progress
  GET_STUDENT_PROGRESS: `${BASE_URL}/course/get_student_progress.php`,
  MARK_VIDEO_COMPLETED: `${BASE_URL}/course/mark_video_completed.php`,
  UPDATE_VIDEO_TIMESTAMP: `${BASE_URL}/course/update_video_timestamp.php`,
  GET_STUDENT_TRANSACTIONS: `${BASE_URL}/course/get_student_transactions.php`,

  // Global Search Suggestions
  GET_SEARCH_SUGGESTIONS: `${BASE_URL}/search/get_suggestions.php`,

  // Admin
  GET_DASHBOARD_STATS: `${BASE_URL}/admin/get_dashboard_stats.php`,
  GET_ADMIN_USERS: `${BASE_URL}/admin/get_users.php`,
  GET_ADMIN_USER_DETAILS: `${BASE_URL}/admin/get_user_details.php`,
  GET_ADMIN_ANALYTICS: `${BASE_URL}/admin/get_analytics_data.php`,
  GET_OVERVIEW_STATS: `${BASE_URL}/admin/get_overview_stats.php`,
  GET_RECENT_ACTIVITY: `${BASE_URL}/admin/get_recent_activity.php`,
  CREATE_DELIVERY_BOY: `${BASE_URL}/admin/create_delivery_boy.php`,
  GET_SHIPPED_ORDERS: `${BASE_URL}/delivery/get_shipped_orders.php`,
  DELIVERY_SUCCESS_EMAIL: `${BASE_URL}/delivery/deliver_success.php`,
  CONFIRM_ORDER_DELIVERY: `${BASE_URL}/delivery/confirm_order_status.php`,
  GET_DELIVERY_REPORTS: `${BASE_URL}/delivery/get_delivery_reports.php`,

  // Home Stats
  GET_HOME_STATS: `${BASE_URL}/home/get_home_stats.php`,
};

export default API;
