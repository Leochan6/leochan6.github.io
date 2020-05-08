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
  const messages = db.child("messages");

  let module = {};

  module.signin = (email, password, loginHandler, errorHandler) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCreds => {
        module.updateUser(userCreds.user.uid, "activity", { signIn: { event: "Sign In", details: "Email", time: new Date().toString() } });
        loginHandler(userCreds);
      })
      .catch(error => errorHandler(error.message));
  };

  module.signup = (name, email, password, loginHandler, errorHandler) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCreds => {
        module.updateUser(userCreds.user.uid, "activity", { signUp: { event: "Sign Up", details: "Email", time: new Date().toString() } });
        loginHandler(userCreds, name);
      })
      .catch(error => errorHandler(error.message));
  };

  module.signInAnonymously = (loginHandler, errorHandler) => {
    firebase.auth().signInAnonymously()
      .then(userCreds => {
        module.updateUser(userCreds.user.uid, "activity", { signIn: { event: "Sign In", details: "Anonymous", time: new Date().toString() } });
        loginHandler(userCreds);
      })
      .catch(error => errorHandler(error));
  };

  module.signout = (details) => {
    let user = firebase.auth().currentUser;
    module.updateUser(user.uid, "activity", { signOut: { event: "Sign Out", details: details ? details : "User", time: new Date().toString() } });
    firebase.auth().signOut().then(() => { window.location.href = "/magireco/"; }).catch((error) => { console.error(error); });
  };

  module.onAuthStateChanged = (callback) => {
    firebase.auth().onAuthStateChanged(user => {
      module.sessionTimeout();
      callback(user);
    });
  };

  module.sessionTimeout = () => {
    let user = firebase.auth().currentUser;
    if (user && !user.isAnonymous) {
      console.log(user.isAnonymous);
      // https://stackoverflow.com/a/58899511/7627317
      let userSessionTimeout = null;
      if (user === null && userSessionTimeout) {
        clearTimeout(userSessionTimeout);
        userSessionTimeout = null;
      } else {
        user.getIdTokenResult().then((idTokenResult) => {
          const authTime = idTokenResult.claims.auth_time * 1000;
          const sessionDurationInMilliseconds = 60 * 60 * 1000; // 60 min
          const expirationInMilliseconds = sessionDurationInMilliseconds - (Date.now() - authTime);
          userSessionTimeout = setTimeout(() => module.signout("Session Timeout"), expirationInMilliseconds);
        });
      }
    }
  };

  // ---------- users ---------- //

  module.createUser = (userId, name) => {
    users.child(userId).update({ name: name });
    lists.child(userId).set(false);
    profiles.child(userId).update({ "0": defaultCharacterProfile, "1": customCharacterProfile, "10": defaultMemoriaProfile, "11": customMemoriaProfile });
    settings.child(userId).set(defaultSettings);
    module.updateUser(userId, "activity", { createUser: { event: "Create User", time: (new Date).toString() } });
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

  module.updateUser = (userId, userProperty, content) => {
    return users.child(`${userId}/${userProperty}`).update(content);
  };

  module.appendUser = (userId, userProperty, content) => {
    return users.child(`${userId}/${userProperty}`).push(content);
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

  module.updateListProfile = (userId, listId, content) => {
    return lists.child(`${userId}/${listId}/selectedProfile`).set(content);
  };

  module.updateListItem = (userId, listId, listProperty, content) => {
    return lists.child(`${userId}/${listId}/${listProperty}`).update(content);
  };

  module.deleteListItem = (userId, listId, listProperty, content) => {
    return lists.child(`${userId}/${listId}/${listProperty}/${content}`).remove();
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
        type: "magia",
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

  module.getProfiles = (userId) => {
    return profiles.child(userId).once('value');
  };

  module.createProfile = (userId, content) => {
    return profiles.child(`${userId}`).push(content);
  }

  module.updateProfile = (userId, profileId, content) => {
    return profiles.child(`${userId}/${profileId}`).set(content);
  };

  module.deleteProfile = (userId, profileId) => {
    return profiles.child(`${userId}/${profileId}`).remove();
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

  module.onMessageUpdate = (userId, callback) => {
    messages.on('value', snapshot => {
      let val = snapshot.val();
      if (userId != val.userId && val.message) callback(val.message);
      else callback(false);
    });
  };

  return module;

})();