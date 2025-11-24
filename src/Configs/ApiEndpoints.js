const getBaseUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost/CultureConnect/backend";
  } else {
    // LAN IP or deployed server
    return `http://${hostname}/CultureConnect/backend`;
  }
};

export const BASE_URL = getBaseUrl();

export const API = {
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
  UPLOADS: `${BASE_URL}/uploads`,
  USER_PROFILE: `${BASE_URL}/user_profile.php`,
  USERNAME_PERSONAL: `${BASE_URL}/usernamePersonal.php`,
  DELETE_ACCOUNTS: `${BASE_URL}/deleteAccount.php`,
  SETTING_PASSWORD: `${BASE_URL}/settingpassword.php`,
  GET_SLIDESRS: `${BASE_URL}/get_sliders.php`,
  SELLER_REGISTRATION: `${BASE_URL}/seller_registration.php`,
  GET_SELLER_PROFILE: `${BASE_URL}/get_seller_profile.php`,
};

export default API;
