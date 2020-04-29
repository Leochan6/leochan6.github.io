let database = (() => {

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

  let module = {};

  module.signin = (email, password, loginHandler, errorHandler) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCreds => loginHandler(userCreds))
      .catch(error => errorHandler(error.message));
  };

  module.signup = (name, email, password, loginHandler, errorHandler) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCreds => loginHandler(userCreds, name))
      .catch(error => errorHandler(error.message));
  };

  module.signInAnonymously = (loginHandler, errorHandler) => {
    firebase.auth().signInAnonymously()
      .then(userCreds => loginHandler(userCreds))
      .catch(error => errorHandler(error));
  };

  module.signout = () => {
    let user = firebase.auth().currentUser;
    /* if (signout.isAnonymous) {
      users.child(user.userId).remove();
      lists.child(user.userId).remove();
      profiles.child(user.userId).remove();
      settings.child(user.userId).remove();
    } */
    firebase.auth().signOut().then(() => { window.location.href = "/magireco/"; }).catch((error) => { console.error(error); });
  };

  module.onAuthStateChanged = (callback) => {
    firebase.auth().onAuthStateChanged(user => {
      callback(user);
    });
  };

  // ---------- users ---------- //

  module.createUser = (userId, name) => {
    users.update({ [userId]: { name: name } });
    lists.update({ [userId]: true });
    profiles.update({ [userId]: { "Default": defaultProfile, "Custom": customProfile } });
    settings.update({ [userId]: defaultSettings });
  };

  module.deleteUser = (userId) => {
    users.child(userId).remove();
    lists.child(userId).remove();
    profiles.child(userId).remove();
    settings.child(userId).remove();
  };

  module.getUser = (userId) => {
    return users.child(userId).once('value');
  };

  // ---------- character lists ---------- //

  module.getLists = (userId) => {
    return lists.child(userId).once('value');
  };

  module.createList = (userId, content) => {
    return lists.child(userId).push(content);
  };

  module.updateList = (userId, listId, content) => {
    return lists.child(`${userId}/${listId}`).set(content);
  };

  module.deleteList = (userId, listId) => {
    return lists.child(`${userId}/${listId}`).remove();
  };

  module.onListUpdate = (userId, callback) => {
    lists.child(userId).on('value', (snapshot) => {
      callback(snapshot);
    });
  };

  // ---------- profiles ---------- //

  const defaultProfile = {
    group_by: "attribute",
    group_by_dir: 1,
    sort_by_1: "level",
    sort_dir_1: -1,
    sort_by_2: "none",
    sort_dir_2: -1,
    sort_id_dir: -1,
    displays_per_row: 10
  };

  const customProfile = true;

  module.getProfiles = (userId) => {
    return profiles.child(userId).once('value');
  };

  module.updateProfile = (userId, profileName, content) => {
    return profiles.child(`${userId}/${profileName}`).set(content);
  };

  module.deleteProfile = (userId, profileName) => {
    return profiles.child(`${userId}/${profileName}`).remove();
  };

  module.onProfileUpdate = (userId, callback) => {
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
      setting_tab: false
    },
    display_alignment: "left",
    padding_x: 0,
    padding_y: 0
  };

  module.updateSettings = (userId, settingName, content) => {
    return settings.child(`${userId}/${settingName}`).set(content);
  };

  module.getSettings = (userId) => {
    return settings.child(userId).once('value');
  };

  module.initSettings = (userId) => {
    return settings.child(userId).set(defaultSettings);
  };

  module.onSettingUpdate = (userId, callback) => {
    settings.child(userId).on('value', (snapshot) => {
      callback(snapshot);
    });
  };

  settings.once('value', snapshot => {
    Object.entries(snapshot.val()).forEach(([userId, value]) => {
      settings.child(userId).set(defaultSettings);
    });
  });

  return module;

})();