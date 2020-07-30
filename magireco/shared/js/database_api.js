const config = {
  apiKey: "AIzaSyCDOhFHwY8BHUafRA4hvAT7GISB72bUrhQ",
  authDomain: "magia-record-25fb0.firebaseapp.com",
  projectId: "magia-record-25fb0",
  databaseURL: "https://magia-record-25fb0.firebaseio.com",
  storageBucket: "magia-record-25fb0.appspot.com"
};
firebase.initializeApp(config);

// Get a reference to the database service.
const db = firebase.database().ref();
const users = db.child("users");
const userDetails = db.child("userDetails");
const lists = db.child("lists");
const profiles = db.child("profiles");
const settings = db.child("settings");
const messages = db.child("messages");

// Get a reference to the storage service.
const storage = firebase.storage().ref();

export const signin = (email, password, loginHandler, errorHandler) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCreds => {
      updateUserDetails(userCreds.user.uid, "lastSignIn", "User");
      loginHandler(userCreds);
    })
    .catch(error => errorHandler(error.message));
};

export const signup = (name, email, password, loginHandler, errorHandler) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCreds => {
      updateUserDetails(userCreds.user.uid, "signUp", "Email");
      loginHandler(userCreds, name);
    })
    .catch(error => errorHandler(error.message));
};

export const signInAnonymously = (loginHandler, errorHandler) => {
  firebase.auth().signInAnonymously()
    .then(userCreds => {
      updateUserDetails(userCreds.user.uid, "signUp", "Anonymous");
      loginHandler(userCreds);
    })
    .catch(error => errorHandler(error));
};

export const signout = (details, userId) => {
  let user = firebase.auth().currentUser;
  if (!details) details = "User"
  if (user && user.uid) updateUserDetails(user.uid, "lastSignOut", details, signOutRedirect);
  else if (userId) updateUserDetails(userId, "lastSignOut", details, signOutRedirect);
};

const signOutRedirect = () => {
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
        userSessionTimeout = setTimeout(() => signout("Session Timeout", user.uid), expirationInMilliseconds);
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
  details = details ? details : "User"
  updateUserDetails(user.uid, "sendEmailVerification", details);
  user.sendEmailVerification()
    .then(resolve)
    .catch(reject);
};

// ---------- users ---------- //

export const createUser = (userId, name) => {
  users.child(userId).update({ name: name });
  lists.child(userId).set(defaultLists);
  profiles.child(userId).update(defaultProfiles);
  settings.child(userId).set(defaultSettings);
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

export const setUserProperty = (userId, userProperty, content) => {
  return users.child(`${userId}/${userProperty}`).set(content);
};

export const removeUserProperty = (userId, userProperty) => {
  return users.child(`${userId}/${userProperty}`).remove();
};

export const onUserUpdate = (userId, callback) => {
  users.child(userId).on('value', (snapshot) => {
    callback(snapshot);
  });
};

const typeToEvent = { signUp: "Sign Up", lastSignIn: "Sign In", lastSignOut: "Sign Out", sendEmailVerification: "Send Email Verification" };

export const updateUserDetails = (userId, type, details, callback) => {
  let activity = { details: details, event: typeToEvent[type], time: new Date().toString() };
  userDetails.child(`${userId}/${type}`).set(activity);
  updateUserRecentActivity(userId, activity, callback);
  if (type === "lastSignIn") updateUserSignInCount(userId);
};

export const updateUserSignInCount = (userId) => {
  userDetails.child(`${userId}/signInCount`).once('value', (snapshot) => {
    let count = snapshot.val();
    if (count || count === 0) userDetails.child(`${userId}/signInCount`).set(count + 1);
    else userDetails.child(`${userId}/signInCount`).set(1);
  });
};

export const updateUserRecentActivity = (userId, newActivity, callback) => {
  userDetails.child(`${userId}/recentActivity`).once('value', (snapshot) => {
    let activity = snapshot.val();
    if (activity && activity.length >= 5) {
      activity.shift();
      activity.push(newActivity);
    } else if (activity && activity.length < 5) {
      activity.push(newActivity);
    } else {
      activity = [newActivity];
    }
    userDetails.child(`${userId}/recentActivity`).set(activity);
    if (callback) callback();
  });
};

// ---------- character lists ---------- //

const defaultLists = {};
let listId = generatePushID();
let charId = generatePushID();
defaultLists[listId] = {
  characterList: {},
  name: "Magical Girls",
  selectedBackground: false,
  selectedProfile: "0"
};
defaultLists[listId].characterList[charId] = {
  character_id: "1001",
  doppel: "locked",
  episode: "1",
  level: "1",
  magia: "1",
  magic: "0",
  post_awaken: false,
  rank: "1"
};
defaultLists[generatePushID()] = {
  memoriaList: false,
  name: "Memoria",
  selectedBackground: false,
  selectedProfile: "10"
};

export const getLists = (userId) => {
  return lists.child(userId).once('value');
};

export const createList = (userId, content) => {
  return lists.child(userId).push(content);
};

export const updateList = (userId, listId, content) => {
  return lists.child(`${userId}/${listId}`).set(content);
};

export const setListProperty = (userId, listId, propertyName, content) => {
  return lists.child(`${userId}/${listId}/${propertyName}`).set(content);
};

export const updateListProperty = (userId, listId, propertyName, content) => {
  return lists.child(`${userId}/${listId}/${propertyName}`).update(content);
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

const defaultProfiles = {
  "0": {
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
  },
  "1": {
    name: "Custom",
    type: "character",
    settings: false
  },
  "10": {
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
  },
  "11": {
    name: "Custom",
    type: "memoria",
    settings: false
  }
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
  expanded_tabs: {
    home_tab: true,
    char_tab: true,
    sort_tab: true,
    display_tab: true,
    background_tab: true,
    setting_tab: true,
    memoria_background_tab: true,
    memoria_create_tab: true,
    memoria_home_tab: true,
    memoria_sort_tab: true
  },
  displays_per_row: 10,
  memoria_displays_per_row: 16,
  display_alignment: "left",
  padding_top: 20,
  padding_left: 20,
  padding_right: 20,
  padding_bottom: 20,
  character_zoom: 100,
  memoria_zoom: 100,
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

// ---------- storage bucket ---------- //

export const updateListImage = (playerId, dataURL) => {
  return storage.child(`images/lists/${playerId}.png`).putString(dataURL, 'data_url');
};

export const deleteListImage = (playerId) => {
  return storage.child(`images/lists/${playerId}.png`).delete();
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
