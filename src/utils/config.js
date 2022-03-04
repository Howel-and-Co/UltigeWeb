import Cookies from "js-cookie";
import Router from "next/router";

// set token
export const setToken = async (token, role, username, password) => {
  try {
    let authToken = "";
    authToken = token ? `Bearer ${token}` : "";
    Cookies.set("token", authToken, { expires: 1 / 8 });
    Cookies.set("role", role, { expires: 1 / 8 });
    Cookies.set("username", username, { expires: 1 / 8 });
    Cookies.set("password", password, { expires: 1 / 8 });

    if (role == "SALES CS") {
      Router.push("/product");
    }
    else {
      Router.push("/analytic");
    }
  } catch (error) {
    console.log(error);
  }
};

// set token
export const redirectPassword = async (username, password) => {
  try {
    Cookies.set("username", username, { expires: 1 / 8 });
    Cookies.set("password", password, { expires: 1 / 8 });
    Router.push("/change-password");
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
    Cookies.remove("role");
    Cookies.remove("username");
    Cookies.remove("password");
    return true;
  } catch (error) {
    return false;
  }
};
