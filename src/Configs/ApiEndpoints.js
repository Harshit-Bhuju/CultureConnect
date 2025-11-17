export const BASE_URL = "http://localhost/CultureConnect/backend";

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
};

export default API;
