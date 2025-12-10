const getBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost/CultureConnect/backend";
  } else {
    return `http://${hostname}/CultureConnect/backend`;
  }
};

export const BASE_URL = getBaseUrl();

const API = {
  // Authentication
  GOOGLE_LOGIN: `${BASE_URL}/google_login.php`,
  SAVE_ACCOUNT: `${BASE_URL}/save_account_to_device.php`,
  CHECK_SESSION: `${BASE_URL}/check_session.php`,
  SET_PASSWORD: `${BASE_URL}/setpassword.php`,
  CHANGE_PASSWORD: `${BASE_URL}/changePassword.php`,
  FORGOT_PASSWORD: `${BASE_URL}/forgotPassword.php`,
  SIGNUP: `${BASE_URL}/signup.php`,
  LOGIN: `${BASE_URL}/login.php`,
  SIGNUP_VERIFY: `${BASE_URL}/signup_verify.php`,
  FORGOT_PASSWORD_VERIFY: `${BASE_URL}/forgotpassword_verify.php`,
  GET_SAVED_ACCOUNTS: `${BASE_URL}/get_saved_accounts.php`,
  LOGOUT: `${BASE_URL}/logout.php`,
  SWITCH_ACCOUNT: `${BASE_URL}/switch_account.php`,
  REMOVE_SAVED_ACCOUNT: `${BASE_URL}/remove_saved_account.php`,
  
  // User Profile
  UPLOADS: `${BASE_URL}/uploads`,
  USER_PROFILE: `${BASE_URL}/user_profile.php`,
  USERNAME_PERSONAL: `${BASE_URL}/usernamePersonal.php`,
  SETTING_PASSWORD: `${BASE_URL}/settingpassword.php`,
  
  // Seller
  SELLER_REGISTRATION: `${BASE_URL}/seller_registration.php`,
  GET_SELLER_PROFILE: `${BASE_URL}/get_seller_profile.php`,
  UPDATE_SELLER_PROFILE: `${BASE_URL}/seller_profile_update.php`,
  
  // Products
  PRODUCT_UPLOAD: `${BASE_URL}/product_upload.php`,
  PRODUCT_IMAGES: `${BASE_URL}/product_images`,
  GET_SELLER_PRODUCTS: `${BASE_URL}/get_seller_products.php`,
  DELETE_PRODUCT: `${BASE_URL}/product_delete.php`,
  GET_PRODUCT_DETAILS: `${BASE_URL}/get_product_details.php`,
  UPDATE_PRODUCT: `${BASE_URL}/product_update.php`,
  UPDATE_PRODUCT_STATUS: `${BASE_URL}/product_status_update.php`,
  GET_DRAFT_PRODUCTS: `${BASE_URL}/get_draft_products.php`,
};

export default API;