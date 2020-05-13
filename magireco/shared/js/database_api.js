const config = {
  apiKey: "AIzaSyCDOhFHwY8BHUafRA4hvAT7GISB72bUrhQ",
  authDomain: "magia-record-25fb0.firebaseapp.com",
  databaseURL: "https://magia-record-25fb0.firebaseio.com",
  storageBucket: "magia-record-25fb0.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service
const db = firebase.database().ref();
const users = db.child("users");
const lists = db.child("lists");
const profiles = db.child("profiles");
const settings = db.child("settings");
const messages = db.child("messages");

export const signin = (email, password, loginHandler, errorHandler) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCreds => {
      appendUser(userCreds.user.uid, "activity", { event: "Sign In", details: "Email", time: new Date().toString() });
      loginHandler(userCreds);
    })
    .catch(error => errorHandler(error.message));
};

export const signup = (name, email, password, loginHandler, errorHandler) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCreds => {
      appendUser(userCreds.user.uid, "activity", { event: "Sign Up", details: "Email", time: new Date().toString() } );
      loginHandler(userCreds, name);
    })
    .catch(error => errorHandler(error.message));
};

export const signInAnonymously = (loginHandler, errorHandler) => {
  firebase.auth().signInAnonymously()
    .then(userCreds => {
      appendUser(userCreds.user.uid, "activity", { event: "Sign In", details: "Anonymous", time: new Date().toString() });
      loginHandler(userCreds);
    })
    .catch(error => errorHandler(error));
};

export const signout = (details) => {
  let user = firebase.auth().currentUser;
  appendUser(user.uid, "activity", { event: "Sign Out", details: details ? details : "User", time: new Date().toString() });
  firebase.auth().signOut().then(() => { window.location.href = "/magireco/"; }).catch((error) => { console.error(error); });
};

export const onAuthStateChanged = (callback) => {
  firebase.auth().onAuthStateChanged(user => {
    sessionTimeout();
    callback(user);
  });
};

export const sessionTimeout = () => {
  let user = firebase.auth().currentUser;
  if (user && !user.isAnonymous) {
    // https://stackoverflow.com/a/58899511/7627317
    let userSessionTimeout = null;
    if (user === null && userSessionTimeout) {
      clearTimeout(userSessionTimeout);
      userSessionTimeout = null;
    } else {
      user.getIdTokenResult().then((idTokenResult) => {
        const authTime = idTokenResult.claims.auth_time * 1000;
        const sessionDurationInMilliseconds = 3 * 60 * 60 * 1000; // 3 hours
        const expirationInMilliseconds = sessionDurationInMilliseconds - (Date.now() - authTime);
        userSessionTimeout = setTimeout(() => signout("Session Timeout"), expirationInMilliseconds);
      });
    }
  }
};

export const resetPassword = (emailAddress, resolve, reject) => {
  firebase.auth().sendPasswordResetEmail(emailAddress)
    .then(resolve)
    .catch(reject);
};

export const sendEmailVerification = (resolve, reject, details) => {
  let user = firebase.auth().currentUser;
  appendUser(user.uid, "activity", { event: "Send Email Verification", details: details ? details : "User", time: new Date().toString() });
  user.sendEmailVerification()
    .then(resolve)
    .catch(reject);
};

// ---------- users ---------- //

export const createUser = (userId, name) => {
  users.child(userId).update({ name: name });
  lists.child(userId).set(false);
  profiles.child(userId).update({ "0": defaultCharacterProfile, "1": customCharacterProfile, "10": defaultMemoriaProfile, "11": customMemoriaProfile });
  settings.child(userId).set(defaultSettings);
  updateUser(userId, "activity", { createUser: { event: "Create User", time: (new Date).toString() } });
};

export const deleteUser = (userId) => {
  users.child(userId).remove();
  lists.child(userId).remove();
  profiles.child(userId).remove();
  settings.child(userId).remove();
};

export const getUser = (userId) => {
  return users.child(userId).once('value');
};

export const updateUser = (userId, userProperty, content) => {
  return users.child(`${userId}/${userProperty}`).update(content);
};

export const appendUser = (userId, userProperty, content) => {
  return users.child(`${userId}/${userProperty}`).push(content);
};


// ---------- character lists ---------- //

export const getLists = (userId) => {
  return lists.child(userId).once('value');
};

export const createList = (userId, content) => {
  return lists.child(userId).push(content);
};

export const updateListName = (userId, listId, content) => {
  return lists.child(`${userId}/${listId}/name`).set(content);
};

export const updateList = (userId, listId, content) => {
  return lists.child(`${userId}/${listId}`).set(content);
};

export const updateListProfile = (userId, listId, content) => {
  return lists.child(`${userId}/${listId}/selectedProfile`).set(content);
};

export const updateListItem = (userId, listId, listProperty, content) => {
  return lists.child(`${userId}/${listId}/${listProperty}`).update(content);
};

export const deleteListItem = (userId, listId, listProperty, content) => {
  return lists.child(`${userId}/${listId}/${listProperty}/${content}`).remove();
};

export const deleteList = (userId, listId) => {
  return lists.child(`${userId}/${listId}`).remove();
};

export const onListUpdate = (userId, callback) => {
  lists.child(userId).on('value', (snapshot) => {
    callback(snapshot);
  });
};

// ---------- profiles ---------- //

const defaultCharacterProfile = {
  name: "Default",
  type: "character",
  rules: {
    "010": {
      state: "group",
      type: "attribute",
      direction: -1
    },
    "011": {
      state: "sort",
      type: "level",
      direction: -1
    },
    "012": {
      state: "sort",
      type: "character_id",
      direction: -1
    },
  }
};

const customCharacterProfile = {
  name: "Custom",
  type: "character",
  settings: false
};

const defaultMemoriaProfile = {
  name: "Default",
  type: "memoria",
  rules: {
    "01": {
      state: "group",
      type: "rank",
      direction: -1
    },
    "012": {
      state: "sort",
      type: "memoria_id",
      direction: -1
    },
    "013": {
      state: "sort",
      type: "ascension",
      direction: -1
    }
  }
}

const customMemoriaProfile = {
  name: "Custom",
  type: "memoria",
  settings: false
};

export const getProfiles = (userId) => {
  return profiles.child(userId).once('value');
};

export const createProfile = (userId, content) => {
  return profiles.child(`${userId}`).push(content);
}

export const updateProfile = (userId, profileId, content) => {
  return profiles.child(`${userId}/${profileId}`).set(content);
};

export const deleteProfile = (userId, profileId) => {
  return profiles.child(`${userId}/${profileId}`).remove();
};

export const onProfileUpdate = (userId, callback) => {
  profiles.child(userId).on('value', (snapshot) => {
    callback(snapshot);
  });
};

// ---------- settings ---------- //

const defaultSettings = {
  valid_characters: true,
  expanded_tabs: {
    home_tab: true,
    char_tab: true,
    sort_tab: true,
    display_tab: true,
    background_tab: true,
    setting_tab: false,
    memoria_background_tab: true,
    memoria_create_tab: true,
    memoria_home_tab: true,
    memoria_sort_tab: true
  },
  displays_per_row: 10,
  display_alignment: "left",
  padding_x: 20,
  padding_y: 20,
  character_zoom: 100,
  background_transparency: 0,
};

export const updateSettings = (userId, settingName, content) => {
  return settings.child(`${userId}/${settingName}`).set(content);
};

export const getSettings = (userId) => {
  return settings.child(userId).once('value');
};

export const initSettings = (userId) => {
  return settings.child(userId).set(defaultSettings);
};

export const onSettingUpdate = (userId, callback) => {
  settings.child(userId).on('value', (snapshot) => {
    callback(snapshot);
  });
};

// ---------- messages ---------- //

export const onceMessageUpdate = (userId, callback) => {
  messages.child("global").once('value', snapshot => {
    let val = snapshot.val();
    if (val && val.message && !val.excludeUserIds.includes(userId)) callback(val.message, val.blocking);
    else callback(false);
  });
};

export const onMessageUpdate = (userId, callback) => {
  messages.child("global").on('value', snapshot => {
    let val = snapshot.val();
    if (val && val.message && !val.excludeUserIds.includes(userId)) callback(val.message, val.blocking);
    else callback(false);
  });
  messages.child(`userMessages/${userId}`).on('value', snapshot => {
    let val = snapshot.val();
    if (val && val.message) callback(val.message, val.blocking);
    else callback(false);
  });
};

