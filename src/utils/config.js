import Cookies from "js-cookie";

// set token
let authToken = "";
export const setToken = async (token) => {
  try {
    authToken = token ? `Bearer ${token}` : "";
    Cookies.set("token", authToken, { expires: 1 / 8 });
    window.location.href = "/analytic";
  } catch (error) {
    console.log(error);
  }
};

// check if token is available
export const checkToken = () => {
  try {
    const token = Cookies.get("token");
    if (token.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// remove token
export const removeToken = () => {
  try {
    Cookies.remove("token");
    return true;
  } catch (error) {
    return false;
  }
};
