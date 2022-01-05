class LocalCache {
  setCache(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  setCookie(key, value, expireTimes, path, domain, secure, sameSite) {
    window.$cookies.set(
      key,
      JSON.stringify(value),
      expireTimes,
      path,
      domain,
      secure,
      sameSite
    );
  }

  setSession(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  getCache(key) {
    const value = window.localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  getCookie(key) {
    const value = window.$cookies.get(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  getSession(key) {
    const value = window.sessionStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  deleteCache(key) {
    window.localStorage.removeItem(key);
  }

  deleteCookie(key, path, domain) {
    window.$cookies.remove(key, path, domain);
  }

  deleteSession(key) {
    window.sessionStorage.removeItem(key);
  }

  clearCache() {
    window.localStorage.clear();
  }

  clearSession() {
    window.sessionStorage.clear();
  }
}

export default new LocalCache();
