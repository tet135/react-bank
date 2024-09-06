export const SESSION_KEY = "bankSession";

export const saveSession = (session) => {
  //   console.log("session", session);
  try {
    window.session = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    window.session = null;
  }
};

export const loadSession = (session) => {
  //   console.log("session", session);
  window.session = session;

  try {
    const json = localStorage.getItem(SESSION_KEY);
    const session = JSON.parse(json);

    if (session) {
      window.session = session;
    } else {
      window.session = null;
    }
  } catch (err) {
    console.log(err);
    window.session = null;
  }
};

export const getTokenSession = () => {
  try {
    const session = getSession();

    return session ? session.token : null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSession = () => {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) || window.session
    );
    return session || null;
  } catch (err) {
    console.log(err);
    return null;
  }
};
