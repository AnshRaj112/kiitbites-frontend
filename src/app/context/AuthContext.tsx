"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  user: {
    name: "",
    img: "",
    email: "",
    rollNumber: "",
    school: "",
    college: "",
    contactNo: "",
    year: "",
    extra: {},
    access: "",
    editProfileCount: "",
    regForm: [],
    blurhash: "",
    token: "",
  },
  target: null,
  isAdmin: false,
  login: async (token) => {},
  logout: () => {},
  settarget: () => {},
  update: () => {},
  eventData: null,
  memberData: null,
  croppedImageFile: null,
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const remainingDuration = expirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const userdata = localStorage.getItem("user");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("user");
    return null;
  }

  const finaluser = JSON.parse(userdata);
  return {
    token: storedToken,
    duration: remainingTime,
    user: finaluser,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let logedin = false;
  let initialuser = {};

  if (tokenData) {
    initialuser = tokenData.user;
    logedin = true;
  }

  const [user, setUser] = useState(initialuser);
  const [target, setTarget] = useState("");
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(logedin);
  const [isAdmin, setIsAdmin] = useState(initialuser.access === "0");

  const targetHandler = (t) => {
    setTarget(t);
  };

  const logoutHandler = useCallback(() => {
    setUserIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("user");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = useCallback(
    (
      name,
      email,
      img,
      rollNumber,
      school,
      college,
      contactNo,
      year,
      access,
      editProfileCount,
      regForm,
      blurhash,
      token
    ) => {
      localStorage.setItem("token", token);
      const setuserdata = {
        name: name,
        img: img,
        email: email,
        rollNumber: rollNumber,
        school: school,
        college: college,
        contactNo: contactNo,
        year: year,
        extra: {},
        access: access,
        editProfileCount: editProfileCount,
        regForm: regForm,
        blurhash: blurhash,
        token: token,
      };

      localStorage.setItem("user", JSON.stringify(setuserdata));

      const nowTime = new Date().getTime();
      const exptime = nowTime + 7 * 24 * 60 * 60 * 1000; // 7 days
      const remainingTime = calculateRemainingTime(exptime);
      localStorage.setItem("expirationTime", exptime);

      logoutTimer = setTimeout(logoutHandler, remainingTime);
      setUser(setuserdata);
      setUserIsLoggedIn(true);
      setIsAdmin(access === "0");
    },
    [logoutHandler]
  );

  const updateHandler = useCallback(
    (
      name,
      email,
      img,
      rollNumber,
      school,
      college,
      contactNo,
      year,
      access,
      editProfileCount,
      regForm,
      blurhash,
      token
    ) => {
      const setuserdata = {
        name: name,
        img: img,
        email: email,
        rollNumber: rollNumber,
        school: school,
        college: college,
        contactNo: contactNo,
        year: year,
        extra: {},
        access: access,
        editProfileCount: editProfileCount,
        regForm: regForm,
        blurhash: blurhash,
        token: token,
      };

      localStorage.setItem("user", JSON.stringify(setuserdata));
      setUser(setuserdata);
      setIsAdmin(access === "0");
    },
    []
  );

  useEffect(() => {
    if (tokenData) {
      setUserIsLoggedIn(true);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = useMemo(
    () => ({
      isLoggedIn: userIsLoggedIn,
      user: user,
      target: target,
      isAdmin: isAdmin,
      login: loginHandler,
      logout: logoutHandler,
      settarget: targetHandler,
      update: updateHandler,
      eventData: null,
      memberData: null,
      croppedImageFile: null,
    }),
    [userIsLoggedIn, user, target, isAdmin, loginHandler, logoutHandler, updateHandler]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
