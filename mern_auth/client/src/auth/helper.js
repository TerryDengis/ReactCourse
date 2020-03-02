import cookie from 'js-cookie';

// set  cookie
export const setCookie = (key, value) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1
    });
  }
};

// remove cookie
export const removeCookie = key => {
  if (window !== undefined) {
    cookie.remove(key, {
      expires: 1
    });
  }
};

// get from cookie such as stored token
export const getCookie = key => {
  if (window !== undefined) {
    return cookie.get(key);
  }
};

// set in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from localstorage
export const removeLocalStorage = key => {
  if (window !== undefined) {
    localStorage.removeItem(key);
  }
};

// authenticate user
export const authenticate = (res, next) => {
  setCookie('token', res.data.token);
  setLocalStorage('user', res.data.user);
  next();
};

// access user info from local storage
export const isAuth = () => {
  if (window !== undefined) {
    const cookie = getCookie('token');
    if (cookie) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
};

// clean up after sign out
export const signout = next => {
  removeCookie('token');
  removeLocalStorage('user');
  next();
};
