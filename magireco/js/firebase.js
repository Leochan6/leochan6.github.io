let database = (() => {

  const config = {
    apiKey: "AIzaSyCDOhFHwY8BHUafRA4hvAT7GISB72bUrhQ",
    authDomain: "magia-record-25fb0.firebaseapp.com",
    projectId: "(default)"
  };
  firebase.initializeApp(config);

  const db = firebase.firestore();
  db.collection("users").add({
    name: "leo"
  }).then(doc => {
    console.log(doc);
  }).catch(err => {
    console.error(err);
  })






  let module = {};
  return module;

  /*

  const config = {
    apiKey: "AIzaSyCDOhFHwY8BHUafRA4hvAT7GISB72bUrhQ",
    authDomain: "magia-record-25fb0.firebaseapp.com",
    databaseURL: "https://magia-record-25fb0.firebaseio.com",
    storageBucket: "magia-record-25fb0.appspot.com"
  };

  // Get a reference to the database service
  const db = firebase.database().ref();
  const users = db.child("users");
  const lists = db.child("lists");
  const profiles = db.child("profiles");
  const settings = db.child("settings");

  let module = {};

  // ---------- users ---------- //

  module.createUser = (name) => {
    let userId = users.push({ name: name }).key;
    lists.push({ userId: userId, lists: [] });
    profiles.push({
      userId: userId,
      profiles: [defaultProfile, customProfile]
    });
    settings.push({
      userId: userId,
      settings: defaultSettings
    });
    return userId;
  };

  module.deleteUser = (userId) => {
    users.child(userId).remove();
    lists.orderByChild("userId").equalTo(userId).remove();
    profiles.orderByChild("userId").equalTo(userId).remove();
    settings.orderByChild("userId").equalTo(userId).remove();
  };

  module.getUser = (userId) => {
    return users.child(userId).once('value');
  };

  // ---------- character lists ---------- //

  module.createList = (userId, content) => {
    return lists.orderByChild("userId").equalTo(userId)
      .child("lists").push(content).key;
  };

  module.updateList = (userId, listName, content) => {
    return lists.orderByChild("userId").equalTo(userId)
      // .child("lists").orderByChild("name").equalTo(listName).set(content);
      .child("lists").orderByChild("name").equalTo(listName).set(content);
  };

  module.deleteList = (userId, listName) => {
    return lists.orderByChild("userId").equalTo(userId)
      .child("lists").orderByChild("name").equalTo(listName).remove();
  };

  module.getList = (userId, listName) => {
    if (listName) return lists.orderByChild("userId").equalTo(userId)
      .child("lists").orderByChild("name").equalTo(listName).once('value');
    else return lists.orderByChild("userId").equalTo(userId).once('value');
  };

  module.listExists = (userId, listName) => {

  }

  // ---------- Profiles profiles ---------- //

  const defaultProfile = {
    name: "Default",
    settings: {
      group_by: "attribute",
      group_by_dir: 1,
      sort_by_1: "level",
      sort_dir_1: -1,
      sort_by_2: "none",
      sort_dir_2: -1,
      sort_id_dir: -1,
      displays_per_row: 8
    },
    isDefault: true
  };

  const customProfile = {
    name: "Custom",
    settings: {},
    isDefault: false
  };

  module.createProfile = (userId, content) => {
    return profiles.orderByChild("userId").equalTo(userId)
      .child("lists").push(content).key;
  };

  module.updateProfile = (userId, profileName, content) => {
    return profiles.orderByChild("userId").equalTo(userId)
      .child("lists").orderByChild("name").equalTo(profileName).set(content);
  };

  module.deleteProfile = (userId, list) => {
    return profiles.orderByChild("userId").equalTo(userId)
      .child("lists").orderByChild("name").equalTo(profileName).remove();
  };

  module.getProfile = (userId, profileName) => {
    if (profileName) profiles.orderByChild("userId").equalTo(userId)
      .child("lists").orderByChild("name").equalTo(profileName).once('value');
    else return profiles.orderByChild("userId").equalTo(userId).once('value');
  };

  // ---------- settings ---------- //

  const defaultSettings = {
    show_all_menus: true,
    valid_characters: true
  }

  module.updateSettings = (userId, content) => {
    return settings.orderByChild("userId").equalTo(userId).child("lists").set(content);
  };

  module.getSettings = (userId) => {
    return settings.orderByChild("userId").equalTo(userId).once('value');
  };
  return module;
  */
})();