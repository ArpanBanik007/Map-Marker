import Cookies from "js-cookie";

export const setAuthToken = (token) => {
  Cookies.set("authToken", token, { expires: 7, secure: true });
};

export const getAuthToken = () => Cookies.get("authToken");

export const removeAuthToken = () => {
  Cookies.remove("authToken");
};
