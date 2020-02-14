export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

import { AsyncStorage } from "react-native";
const API_KEY = "AIzaSyBZH2AmH2dWGiGyQc_vqxHrYixlgj419kU";
let timer;
export const authenticate = (userId, token, expiryTime) => async dispatch => {
  dispatch(setLogoutTimer(expiryTime));
  dispatch({ type: AUTHENTICATE, userId: userId, token: token });
};

export const setDidTryAL = () => {
  return {
    type: SET_DID_TRY_AL
  };
};
export const signup = (email, password) => async dispatch => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      let message = "Something went wrong";
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      if (errorId === "EMAIL_EXISTS") {
        message = "Use Account already exists";
      }
      if (errorId === "MISSING_PASSOWRD") {
        message = "The password field is required";
      }

      if (errorId.includes("WEAK_PASSWORD")) {
        message = "Password should be at least 6 characters";
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );

    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = (email, password) => async dispatch => {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      let message = "Something went wrong";
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email couldn't be found ";
      }
      if (errorId === "INVALID_PASSWORD") {
        message = "the password is incorrect";
      }

      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );

    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const setLogoutTimer = expirationTime => dispatch => {
  timer = setTimeout(() => {
    dispatch(logout());
  }, expirationTime);
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
