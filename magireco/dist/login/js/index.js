(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _login_elements = require("./login_elements.js");

var database = _interopRequireWildcard(require("../../shared/js/database_api.js"));

var utils = _interopRequireWildcard(require("../../shared/js/utils.js"));

var _dialog = require("../../shared/js/dialog.js");

(function () {
  "use strict";

  var userId = null;
  var userName = null;

  window.onload = function () {
    database.onAuthStateChanged(function (user) {
      if (user) {
        _login_elements.login_elements.login_content.classList.add("hidden");

        _login_elements.login_elements.anonymous_content.classList.add("hidden");

        _login_elements.login_elements.signout_button.classList.remove("hidden");

        _login_elements.login_elements.enter_character_link.classList.remove("hidden");

        _login_elements.login_elements.enter_memoria_link.classList.remove("hidden");

        _login_elements.login_elements.header_username.innerHTML = "Welcome ".concat(user.displayName || userName || "Anonymous");
        userId = user.uid;
      } else {
        _login_elements.login_elements.login_content.classList.remove("hidden");

        _login_elements.login_elements.anonymous_content.classList.remove("hidden");

        _login_elements.login_elements.signout_button.classList.add("hidden");

        _login_elements.login_elements.enter_character_link.classList.add("hidden");

        _login_elements.login_elements.enter_memoria_link.classList.add("hidden");

        _login_elements.login_elements.header_username.innerHTML = "";
        userId = null;
      }
    });

    _login_elements.login_elements.forgot_password_open_label.addEventListener("click", function (e) {
      e.preventDefault();

      _login_elements.login_elements.login_content.classList.add("hidden");

      _login_elements.login_elements.forgot_password_content.classList.remove("hidden");

      errorHandler("", false);
    });

    _login_elements.login_elements.signin_button.addEventListener("click", function (e) {
      e.preventDefault();
      var email = _login_elements.login_elements.email_text.value;
      var password = _login_elements.login_elements.password_text.value;
      if (!email) return errorHandler("Email must not be empty.");
      if (!password) return errorHandler("Password must not be empty.");
      database.signin(email, password, loginHandler, errorHandler);
    });

    _login_elements.login_elements.open_signup_button.addEventListener("click", function (e) {
      e.preventDefault();

      _login_elements.login_elements.login_content.classList.add("hidden");

      _login_elements.login_elements.signup_content.classList.remove("hidden");

      errorHandler("", false);
    });

    _login_elements.login_elements.cancel_signup_button.addEventListener("click", function (e) {
      e.preventDefault();

      _login_elements.login_elements.signup_content.classList.add("hidden");

      _login_elements.login_elements.login_content.classList.remove("hidden");

      errorSignupHandler("", false);
    });

    signup_button.addEventListener("click", function (e) {
      e.preventDefault();
      var name = _login_elements.login_elements.signup_name_text.value;
      var email = _login_elements.login_elements.signup_email_text.value;
      var password = _login_elements.login_elements.signup_password_text.value;
      var confirm_password = _login_elements.login_elements.signup_password_confirm_text.value;
      if (!name) return errorSignupHandler("Name must not be empty.");
      if (!password || !confirm_password) return errorSignupHandler("Password must not be empty.");
      if (password !== confirm_password) return errorSignupHandler("Your Password and Confirmation Password do not match.");
      userName = name;
      database.signup(name, email, password, loginHandler, errorSignupHandler);
    });

    _login_elements.login_elements.forgot_password_send_button.addEventListener("click", function (e) {
      e.preventDefault();
      var email = _login_elements.login_elements.forgot_password_email.value;
      if (!email) errorResetHandler("Email must not be empty.");
      database.resetPassword(email, resetHandler, errorResetHandler);
    });

    _login_elements.login_elements.forgot_password_cancel_button.addEventListener("click", function (e) {
      e.preventDefault();

      _login_elements.login_elements.forgot_password_content.classList.add("hidden");

      _login_elements.login_elements.login_content.classList.remove("hidden");

      errorResetHandler("", false);

      _login_elements.login_elements.reset_error.classList.add("hidden");

      _login_elements.login_elements.reset_success.innerHTML = "";

      _login_elements.login_elements.reset_success.classList.add("hidden");
    });

    _login_elements.login_elements.signin_anonymous_button.addEventListener("click", function (e) {
      e.preventDefault();
      database.signInAnonymously(loginHandler, errorAnonymousHandler);
    });

    _login_elements.login_elements.signout_button.addEventListener("click", function () {
      // new SignOutDialog((res) => {
      //   if (res) database.signout();
      // })
      var res = confirm("Are you sure you want to Sign Out?");
      if (res) database.signout();
    });

    _login_elements.login_elements.contact_button.addEventListener("click", function () {
      new _dialog.ContactDialog();
    });
  };

  var loginHandler = function loginHandler(userCred, name) {
    if (userCred.additionalUserInfo.isNewUser) {
      if (name && name.length > 0) database.sendEmailVerification(function () {}, function (errorMsg) {
        return console.error(errorMsg);
      }, "Sign Up");
      name = name ? name : "Anonymous";
      userCred.user.updateProfile({
        displayName: name
      });
      database.createUser(userCred.user.uid, name);
      _login_elements.login_elements.header_username.innerHTML = "Welcome ".concat(name);

      _login_elements.login_elements.signup_content.classList.add("hidden");

      _login_elements.login_elements.login_content.classList.remove("hidden");

      errorSignupHandler("", false);
    }

    _login_elements.login_elements.email_text.value = "";
    _login_elements.login_elements.password_text.value = "";
    _login_elements.login_elements.signup_email_text.value = "";
    _login_elements.login_elements.signup_password_text.value = "";
    _login_elements.login_elements.signup_password_confirm_text.value = "";
  };

  var errorHandler = function errorHandler(errorMsg) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    _login_elements.login_elements.email_text.value = "";
    _login_elements.login_elements.password_text.value = "";

    _login_elements.login_elements.login_error.classList.remove("hidden");

    _login_elements.login_elements.login_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  var errorSignupHandler = function errorSignupHandler(errorMsg) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    _login_elements.login_elements.signup_name_text.value = "";
    _login_elements.login_elements.signup_email_text.value = "";
    _login_elements.login_elements.signup_password_text.value = "";
    _login_elements.login_elements.signup_password_confirm_text.value = "";

    _login_elements.login_elements.signup_error.classList.remove("hidden");

    _login_elements.login_elements.signup_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  var errorAnonymousHandler = function errorAnonymousHandler(errorMsg) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _login_elements.login_elements.anonymous_error.classList.remove("hidden");

    _login_elements.login_elements.anonymous_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  var resetHandler = function resetHandler() {
    _login_elements.login_elements.reset_success.classList.remove("hidden");

    _login_elements.login_elements.reset_success.innerHTML = "A password reset email has been sent to the given email. If you do not see an email, please check the Junk or Spam folder.";
  };

  var errorResetHandler = function errorResetHandler(errorMsg) {
    var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    _login_elements.login_elements.forgot_password_email.value = "";

    _login_elements.login_elements.reset_error.classList.remove("hidden");

    _login_elements.login_elements.reset_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  utils.detectColorScheme();
})();

},{"../../shared/js/database_api.js":3,"../../shared/js/dialog.js":4,"../../shared/js/utils.js":5,"./login_elements.js":2,"@babel/runtime/helpers/interopRequireWildcard":12}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageDialog = exports.login_elements = void 0;
var login_elements = {
  signout_button: document.querySelector("#signout_button"),
  contact_button: document.querySelector("#contact_button"),
  header_buttons: document.querySelector("#header_buttons"),
  enter_character_link: document.querySelector("#enter_character_link"),
  enter_memoria_link: document.querySelector("#enter_memoria_link"),
  enter_teams_link: document.querySelector("#enter_teams_link"),
  header_username: document.querySelector("#header_username"),
  login_content: document.querySelector("#login_content"),
  email_text: document.querySelector("#email_text"),
  password_text: document.querySelector("#password_text"),
  forgot_password_open_label: document.querySelector("#forgot_password_open_label"),
  signin_button: document.querySelector("#signin_button"),
  open_signup_button: document.querySelector("#open_signup_button"),
  login_error: document.querySelector("#login_error"),
  signup_content: document.querySelector("#signup_content"),
  signup_name_text: document.querySelector("#signup_name_text"),
  signup_email_text: document.querySelector("#signup_email_text"),
  signup_password_text: document.querySelector("#signup_password_text"),
  signup_password_confirm_text: document.querySelector("#signup_password_confirm_text"),
  signup_button: document.querySelector("#signup_button"),
  cancel_signup_button: document.querySelector("#cancel_signup_button"),
  signup_error: document.querySelector("#signup_error"),
  anonymous_content: document.querySelector("#anonymous_content"),
  signin_anonymous_button: document.querySelector("#signin_anonymous_button"),
  anonymous_error: document.querySelector("#anonymous_error"),
  forgot_password_content: document.querySelector("#forgot_password_content"),
  forgot_password_email: document.querySelector("#forgot_password_email"),
  forgot_password_send_button: document.querySelector("#forgot_password_send_button"),
  forgot_password_cancel_button: document.querySelector("#forgot_password_cancel_button"),
  reset_success: document.querySelector("#reset_success"),
  reset_error: document.querySelector("#reset_error")
};
exports.login_elements = login_elements;
var messageDialog = {
  modal: document.querySelector("#messageModal"),
  content: document.querySelector("#messageModalContent"),
  title: document.querySelector("#messageModalTitle"),
  text: document.querySelector("#messageModalText"),
  list: document.querySelector("#messageModalList"),
  closeButton: document.querySelector("#messageModalClose"),
  open: function open(title) {
    var text = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var list = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    messageDialog.modal.style.display = "block";
    messageDialog.title.innerHTML = title;
    messageDialog.text.value = text;
    messageDialog.list.innerHTML = list;
  },
  close: function close() {
    messageDialog.modal.style.display = "none";
    messageDialog.title.innerHTML = "";
    messageDialog.text.value = "";
    messageDialog.text.scrollTo(0, 0);
  },
  isOpen: function isOpen() {
    return messageDialog.modal.style.display === "block";
  }
};
exports.messageDialog = messageDialog;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMessageUpdate = exports.onceMessageUpdate = exports.deleteListImage = exports.updateListImage = exports.onSettingUpdate = exports.initSettings = exports.getSettings = exports.updateSettings = exports.onProfileUpdate = exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.getProfiles = exports.onListUpdate = exports.deleteList = exports.deleteListItem = exports.updateListProperty = exports.setListProperty = exports.updateList = exports.createList = exports.getLists = exports.updateUserRecentActivity = exports.updateUserSignInCount = exports.updateUserDetails = exports.onUserUpdate = exports.removeUserProperty = exports.setUserProperty = exports.appendUser = exports.updateUser = exports.getUser = exports.deleteUser = exports.createUser = exports.sendEmailVerification = exports.resetPassword = exports.sessionTimeout = exports.onAuthStateChanged = exports.signout = exports.signInAnonymously = exports.signup = exports.signin = void 0;
var config = {
  apiKey: "AIzaSyCDOhFHwY8BHUafRA4hvAT7GISB72bUrhQ",
  authDomain: "magia-record-25fb0.firebaseapp.com",
  projectId: "magia-record-25fb0",
  databaseURL: "https://magia-record-25fb0.firebaseio.com",
  storageBucket: "magia-record-25fb0.appspot.com"
};
firebase.initializeApp(config); // Get a reference to the database service.

var db = firebase.database().ref();
var users = db.child("users");
var userDetails = db.child("userDetails");
var lists = db.child("lists");
var profiles = db.child("profiles");
var settings = db.child("settings");
var messages = db.child("messages"); // Get a reference to the storage service.

var storage = firebase.storage().ref();

var signin = function signin(email, password, loginHandler, errorHandler) {
  firebase.auth().signInWithEmailAndPassword(email, password).then(function (userCreds) {
    updateUserDetails(userCreds.user.uid, "lastSignIn", "User");
    loginHandler(userCreds);
  })["catch"](function (error) {
    return errorHandler(error.message);
  });
};

exports.signin = signin;

var signup = function signup(name, email, password, loginHandler, errorHandler) {
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userCreds) {
    updateUserDetails(userCreds.user.uid, "signUp", "Email");
    loginHandler(userCreds, name);
  })["catch"](function (error) {
    return errorHandler(error.message);
  });
};

exports.signup = signup;

var signInAnonymously = function signInAnonymously(loginHandler, errorHandler) {
  firebase.auth().signInAnonymously().then(function (userCreds) {
    updateUserDetails(userCreds.user.uid, "signUp", "Anonymous");
    loginHandler(userCreds);
  })["catch"](function (error) {
    return errorHandler(error);
  });
};

exports.signInAnonymously = signInAnonymously;

var signout = function signout(details, userId) {
  var user = firebase.auth().currentUser;
  if (!details) details = "User";
  if (user && user.uid) updateUserDetails(user.uid, "lastSignOut", details, signOutRedirect);else if (userId) updateUserDetails(userId, "lastSignOut", details, signOutRedirect);
};

exports.signout = signout;

var signOutRedirect = function signOutRedirect() {
  firebase.auth().signOut().then(function () {
    if (window.location.pathname != "/magireco/") window.location.href = "/magireco/";
  })["catch"](function (error) {
    console.error(error);
  });
};

var onAuthStateChanged = function onAuthStateChanged(callback) {
  firebase.auth().onAuthStateChanged(function (user) {
    sessionTimeout(user, callback);
  });
};

exports.onAuthStateChanged = onAuthStateChanged;

var sessionTimeout = function sessionTimeout(user, callback) {
  // let user = firebase.auth().currentUser;
  if (user && !user.isAnonymous) {
    // https://stackoverflow.com/a/58899511/7627317
    var userSessionTimeout = null;

    if (user === null && userSessionTimeout) {
      clearTimeout(userSessionTimeout);
      userSessionTimeout = null;
      return callback(null);
    } else {
      user.getIdTokenResult().then(function (idTokenResult) {
        var authTime = idTokenResult.claims.auth_time * 1000;
        var sessionDurationInMilliseconds = 3 * 60 * 60 * 1000; // 3 hours

        var expirationInMilliseconds = sessionDurationInMilliseconds - (Date.now() - authTime);
        if (expirationInMilliseconds > 1000) callback(user);
        userSessionTimeout = setTimeout(function () {
          console.log(expirationInMilliseconds, "milliseconds until auto sign out.");
          signout("Session Timeout", user.uid);
        }, expirationInMilliseconds);
      });
    }
  } else {
    return callback(user);
  }
};

exports.sessionTimeout = sessionTimeout;

var resetPassword = function resetPassword(emailAddress, resolve, reject) {
  firebase.auth().sendPasswordResetEmail(emailAddress).then(resolve)["catch"](reject);
};

exports.resetPassword = resetPassword;

var sendEmailVerification = function sendEmailVerification(resolve, reject, details) {
  var user = firebase.auth().currentUser;
  details = details ? details : "User";
  updateUserDetails(user.uid, "sendEmailVerification", details);
  user.sendEmailVerification().then(resolve)["catch"](reject);
}; // ---------- users ---------- //


exports.sendEmailVerification = sendEmailVerification;

var createUser = function createUser(userId, name) {
  users.child(userId).update({
    name: name
  });
  lists.child(userId).set(defaultLists);
  profiles.child(userId).update(defaultProfiles);
  settings.child(userId).set(defaultSettings);
};

exports.createUser = createUser;

var deleteUser = function deleteUser(userId) {
  users.child(userId).remove();
  lists.child(userId).remove();
  profiles.child(userId).remove();
  settings.child(userId).remove();
};

exports.deleteUser = deleteUser;

var getUser = function getUser(userId) {
  return users.child(userId).once('value');
};

exports.getUser = getUser;

var updateUser = function updateUser(userId, userProperty, content) {
  return users.child("".concat(userId, "/").concat(userProperty)).update(content);
};

exports.updateUser = updateUser;

var appendUser = function appendUser(userId, userProperty, content) {
  return users.child("".concat(userId, "/").concat(userProperty)).push(content);
};

exports.appendUser = appendUser;

var setUserProperty = function setUserProperty(userId, userProperty, content) {
  return users.child("".concat(userId, "/").concat(userProperty)).set(content);
};

exports.setUserProperty = setUserProperty;

var removeUserProperty = function removeUserProperty(userId, userProperty) {
  return users.child("".concat(userId, "/").concat(userProperty)).remove();
};

exports.removeUserProperty = removeUserProperty;

var onUserUpdate = function onUserUpdate(userId, callback) {
  users.child(userId).on('value', function (snapshot) {
    callback(snapshot);
  });
};

exports.onUserUpdate = onUserUpdate;
var typeToEvent = {
  signUp: "Sign Up",
  lastSignIn: "Sign In",
  lastSignOut: "Sign Out",
  sendEmailVerification: "Send Email Verification"
};

var updateUserDetails = function updateUserDetails(userId, type, details, callback) {
  var activity = {
    details: details,
    event: typeToEvent[type],
    time: new Date().toString()
  };
  userDetails.child("".concat(userId, "/").concat(type)).set(activity);
  updateUserRecentActivity(userId, activity, callback);
  if (type === "lastSignIn") updateUserSignInCount(userId);
};

exports.updateUserDetails = updateUserDetails;

var updateUserSignInCount = function updateUserSignInCount(userId) {
  userDetails.child("".concat(userId, "/signInCount")).once('value', function (snapshot) {
    var count = snapshot.val();
    if (count || count === 0) userDetails.child("".concat(userId, "/signInCount")).set(count + 1);else userDetails.child("".concat(userId, "/signInCount")).set(1);
  });
};

exports.updateUserSignInCount = updateUserSignInCount;

var updateUserRecentActivity = function updateUserRecentActivity(userId, newActivity, callback) {
  userDetails.child("".concat(userId, "/recentActivity")).once('value', function (snapshot) {
    var activity = snapshot.val();

    if (activity && activity.length >= 5) {
      activity.shift();
      activity.push(newActivity);
    } else if (activity && activity.length < 5) {
      activity.push(newActivity);
    } else {
      activity = [newActivity];
    }

    userDetails.child("".concat(userId, "/recentActivity")).set(activity);
    if (callback) callback();
  });
}; // ---------- character lists ---------- //


exports.updateUserRecentActivity = updateUserRecentActivity;
var defaultLists = {};
var listId = generatePushID();
var charId = generatePushID();
var memoListId = generatePushID();
var memoId = generatePushID();
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
defaultLists[memoListId] = {
  memoriaList: {},
  name: "Memoria",
  selectedBackground: false,
  selectedProfile: "10"
};
defaultLists[memoListId].memoriaList[memoId] = {
  memoria_id: "1001",
  ascension: "0",
  level: "1",
  archive: false,
  protect: false
};

var getLists = function getLists(userId) {
  return lists.child(userId).once('value');
};

exports.getLists = getLists;

var createList = function createList(userId, content) {
  return lists.child(userId).push(content);
};

exports.createList = createList;

var updateList = function updateList(userId, listId, content) {
  return lists.child("".concat(userId, "/").concat(listId)).set(content);
};

exports.updateList = updateList;

var setListProperty = function setListProperty(userId, listId, propertyName, content) {
  return lists.child("".concat(userId, "/").concat(listId, "/").concat(propertyName)).set(content);
};

exports.setListProperty = setListProperty;

var updateListProperty = function updateListProperty(userId, listId, propertyName, content) {
  return lists.child("".concat(userId, "/").concat(listId, "/").concat(propertyName)).update(content);
};

exports.updateListProperty = updateListProperty;

var deleteListItem = function deleteListItem(userId, listId, listProperty, content) {
  return lists.child("".concat(userId, "/").concat(listId, "/").concat(listProperty, "/").concat(content)).remove();
};

exports.deleteListItem = deleteListItem;

var deleteList = function deleteList(userId, listId) {
  return lists.child("".concat(userId, "/").concat(listId)).remove();
};

exports.deleteList = deleteList;

var onListUpdate = function onListUpdate(userId, callback) {
  lists.child(userId).on('value', function (snapshot) {
    callback(snapshot);
  });
}; // ---------- profiles ---------- //


exports.onListUpdate = onListUpdate;
var defaultProfiles = {
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
      }
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

var getProfiles = function getProfiles(userId) {
  return profiles.child(userId).once('value');
};

exports.getProfiles = getProfiles;

var createProfile = function createProfile(userId, content) {
  return profiles.child("".concat(userId)).push(content);
};

exports.createProfile = createProfile;

var updateProfile = function updateProfile(userId, profileId, content) {
  return profiles.child("".concat(userId, "/").concat(profileId)).set(content);
};

exports.updateProfile = updateProfile;

var deleteProfile = function deleteProfile(userId, profileId) {
  return profiles.child("".concat(userId, "/").concat(profileId)).remove();
};

exports.deleteProfile = deleteProfile;

var onProfileUpdate = function onProfileUpdate(userId, callback) {
  profiles.child(userId).on('value', function (snapshot) {
    callback(snapshot);
  });
}; // ---------- settings ---------- //


exports.onProfileUpdate = onProfileUpdate;
var defaultSettings = {
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
  background_transparency: 0
};

var updateSettings = function updateSettings(userId, settingName, content) {
  return settings.child("".concat(userId, "/").concat(settingName)).set(content);
};

exports.updateSettings = updateSettings;

var getSettings = function getSettings(userId) {
  return settings.child(userId).once('value');
};

exports.getSettings = getSettings;

var initSettings = function initSettings(userId) {
  return settings.child(userId).set(defaultSettings);
};

exports.initSettings = initSettings;

var onSettingUpdate = function onSettingUpdate(userId, callback) {
  settings.child(userId).on('value', function (snapshot) {
    callback(snapshot);
  });
}; // ---------- storage bucket ---------- //


exports.onSettingUpdate = onSettingUpdate;

var updateListImage = function updateListImage(playerId, dataURL) {
  return storage.child("images/lists/".concat(playerId, ".png")).putString(dataURL, 'data_url');
};

exports.updateListImage = updateListImage;

var deleteListImage = function deleteListImage(playerId) {
  return storage.child("images/lists/".concat(playerId, ".png"))["delete"]();
}; // ---------- messages ---------- //


exports.deleteListImage = deleteListImage;

var onceMessageUpdate = function onceMessageUpdate(userId, callback) {
  messages.child("global").once('value', function (snapshot) {
    var val = snapshot.val();
    if (val && val.message && !val.excludeUserIds.includes(userId)) callback(val.message, val.blocking);else callback(false);
  });
};

exports.onceMessageUpdate = onceMessageUpdate;

var onMessageUpdate = function onMessageUpdate(userId, callback) {
  messages.child("global").on('value', function (snapshot) {
    var val = snapshot.val();
    if (val && val.message && !val.excludeUserIds.includes(userId)) callback(val.message, val.blocking);else callback(false);
  });
  messages.child("userMessages/".concat(userId)).on('value', function (snapshot) {
    var val = snapshot.val();
    if (val && val.message) callback(val.message, val.blocking);else callback(false);
  });
};

exports.onMessageUpdate = onMessageUpdate;

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportListDialog = exports.BackgroundSelectDialog = exports.CharacterSelectDialog = exports.SignOutDialog = exports.AlertDialog = exports.ContactDialog = exports.MessageDialog = exports.Dialog = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = (0, _getPrototypeOf2["default"])(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return (0, _possibleConstructorReturn2["default"])(this, result);
  };
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

var Dialog = function Dialog() {
  var _this2 = this;

  (0, _classCallCheck2["default"])(this, Dialog);
  (0, _defineProperty2["default"])(this, "isOpen", function () {
    return _this2.dialog.style.display === "block";
  });
  (0, _defineProperty2["default"])(this, "close", function () {
    return;
  });
  this.dialog = document.createElement("div");
  this.dialog.style.display = "block"; // hide dialog if not drag

  var dragging = false;
  window.addEventListener("mousedown", function (event) {
    var x = event.x;
    var y = event.y;
    dragging = false;
    window.addEventListener("mousemove", function (event) {
      if (Math.abs(x - event.screenX) > 5 || Math.abs(y - event.screenY) > 5) {
        dragging = true;
      }
    });
  });
  window.addEventListener("mouseup", function (event) {
    if (!dragging && event.target == _this2.dialog && _this2.isOpen()) _this2.close();
  });
};

exports.Dialog = Dialog;

var MessageDialog = /*#__PURE__*/function (_Dialog) {
  (0, _inherits2["default"])(MessageDialog, _Dialog);

  var _super = _createSuper(MessageDialog);

  function MessageDialog(_ref) {
    var _this3;

    var title = _ref.title,
        text = _ref.text,
        list = _ref.list,
        copy = _ref.copy,
        link_name = _ref.link_name,
        link_target = _ref.link_target;
    (0, _classCallCheck2["default"])(this, MessageDialog);
    _this3 = _super.call(this);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this3), "close", function () {
      _this3.dialog.remove();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this3), "copy", function () {
      navigator.clipboard.writeText(_this3.text.value);
      alert("Text Copied to Clipboard");
    });
    _this3.dialog = document.createElement("div");
    _this3.dialog.className = "message-modal modal";
    _this3.dialog.innerHTML = "    <div class=\"modal-content modal-fit-width modal-fit-height\">      <div class=\"modal-header\">        <h2 class=\"modal-title\">".concat(title !== null && title !== void 0 ? title : "Message", "</h2>        <button class=\"modal-close\">&times;</span>      </div>      <div class=\"horizontal-divider\"></div>\n      <div class=\"modal-main\">        <textarea class=\"modal-text form_input\" readonly>").concat(text !== null && text !== void 0 ? text : "", "</textarea>        <button class=\"modal-copy small_btn\">Copy</button>        <a class=\"modal-link\" target=\"_blank\" href=\"./\">Link</a>        <div class=\"modal-list\">").concat(list !== null && list !== void 0 ? list : "", "</div>      </div>    </div>");
    document.body.appendChild(_this3.dialog);
    _this3.dialog.style.display = "block";
    _this3.title = _this3.dialog.querySelector(".modal-title");
    _this3.closeBtn = _this3.dialog.querySelector(".modal-close");
    _this3.text = _this3.dialog.querySelector(".modal-text");
    _this3.copyBtn = _this3.dialog.querySelector(".modal-copy");
    _this3.link = _this3.dialog.querySelector(".modal-link");
    _this3.list = _this3.dialog.querySelector(".modal-list");
    if (!text) _this3.text.style.display = "none";

    if (link_name) {
      _this3.link.innerHTML = link_name;

      _this3.link.setAttribute("href", link_target);
    } else _this3.link.style.display = "none";

    if (!copy) _this3.copyBtn.style.display = "none";

    _this3.closeBtn.addEventListener("click", function () {
      _this3.close();
    });

    _this3.copyBtn.addEventListener("click", function () {
      _this3.copy();
    });

    return _this3;
  }

  return MessageDialog;
}(Dialog);

exports.MessageDialog = MessageDialog;
;

var ContactDialog = /*#__PURE__*/function (_MessageDialog) {
  (0, _inherits2["default"])(ContactDialog, _MessageDialog);

  var _super2 = _createSuper(ContactDialog);

  function ContactDialog() {
    var _this4;

    (0, _classCallCheck2["default"])(this, ContactDialog);
    _this4 = _super2.call(this, {
      title: "Contact / Support",
      text: false,
      link: false,
      copy: false
    });
    _this4.list.innerHTML = "\n    <p>For assistance, support, or feedback, please contact Leo Chan at</p>\n    <li>Discord: Leo_Chan#9150 or <a target=\"_blank\" href=\"https://discord.gg/magiarecord\">PMMM: Magia Record Discord Server</a></li>\n    <li>Reddit: <a target=\"_blank\" href=\"https://www.reddit.com/message/compose/?to=Leochan6\">u/Leochan6</a></li>\n    <p>For more information and how to use, <a target=\"_blank\" href=\"https://github.com/Leochan6/leochan6.github.io/blob/master/magireco/README.md\">check the README file</a></p>";
    return _this4;
  }

  return ContactDialog;
}(MessageDialog);

exports.ContactDialog = ContactDialog;

var AlertDialog = /*#__PURE__*/function (_Dialog2) {
  (0, _inherits2["default"])(AlertDialog, _Dialog2);

  var _super3 = _createSuper(AlertDialog);

  function AlertDialog(_ref2, callback) {
    var _this5;

    var title = _ref2.title,
        text = _ref2.text,
        buttons = _ref2.buttons;
    (0, _classCallCheck2["default"])(this, AlertDialog);
    _this5 = _super3.call(this);

    var _this = (0, _assertThisInitialized2["default"])(_this5);

    _this5.dialog = document.createElement("div");
    _this5.dialog.className = "alert-modal modal";
    _this5.dialog.innerHTML = "    <div class=\"modal-content modal-fit-width modal-fit-height\">      <div class=\"modal-header\">        <h2 class=\"modal-title\">".concat(title !== null && title !== void 0 ? title : "Message", "</h2>        <button class=\"modal-close\">&times;</span>      </div>      <div class=\"horizontal-divider\"></div>\n      <div class=\"modal-main\">        <textarea class=\"modal-text form_input\" readonly>").concat(text !== null && text !== void 0 ? text : "", "</textarea>        <div class=\"modal-buttons\"></div>\n      </div>    </div>");
    document.body.appendChild(_this5.dialog);
    _this5.dialog.style.display = "block";
    _this5.title = _this5.dialog.querySelector(".modal-title");
    _this5.closeBtn = _this5.dialog.querySelector(".modal-close");
    _this5.text = _this5.dialog.querySelector(".modal-text");
    _this5.buttons = _this5.dialog.querySelector(".modal-buttons");
    if (!text) _this5.text.style.display = "none";

    if (buttons) {
      Object.values(buttons).forEach(function (_ref3) {
        var text = _ref3.text,
            res = _ref3.res;
        var button = document.createElement("button");
        button.innerHTML = text;
        button.className = "small_btn";
        button.addEventListener("click", function () {
          _this.close();

          callback(res);
        });

        _this5.buttons.appendChild(button);
      });
    }

    _this5.closeBtn.addEventListener("click", function () {
      _this.close();

      callback(false);
    });

    _this5.close = function () {
      _this5.dialog.remove();
    };

    return _this5;
  }

  return AlertDialog;
}(Dialog);

exports.AlertDialog = AlertDialog;

var SignOutDialog = /*#__PURE__*/function (_AlertDialog) {
  (0, _inherits2["default"])(SignOutDialog, _AlertDialog);

  var _super4 = _createSuper(SignOutDialog);

  function SignOutDialog(callback) {
    (0, _classCallCheck2["default"])(this, SignOutDialog);
    return _super4.call(this, {
      title: 'Are you sure you want to Sign Out?',
      buttons: {
        "true": {
          text: 'OK',
          res: true
        },
        "false": {
          text: 'Cancel',
          res: false
        }
      }
    }, callback);
  }

  return SignOutDialog;
}(AlertDialog);

exports.SignOutDialog = SignOutDialog;

var CharacterSelectDialog = /*#__PURE__*/function (_Dialog3) {
  (0, _inherits2["default"])(CharacterSelectDialog, _Dialog3);

  var _super5 = _createSuper(CharacterSelectDialog);

  function CharacterSelectDialog() {
    var _this6;

    (0, _classCallCheck2["default"])(this, CharacterSelectDialog);
    _this6 = _super5.call(this);
    _this6.dialog.className = "character-select-modal modal";
    _this6.dialog.innerHTML = "    <div class=\"modal-content modal-large-width modal-large-height\">      <div>        <div class=\"modal-header>          <h2 class=\"modal-title\">Character Select</h2>          <span class=\"modal-close\">&times;</span>        </div>        <input type=\"search\" class=\"modal-search form_input\" placeholder=\"Search\">        <label id=\"added_label\" for=\"added\">Hide Added:</label>          <input type=\"checkbox\" id=\"added\">      </div>      <div class=\"modal-body\">        <div class=\"modal-list\"></div>      </div>    </div>";
    document.body.appendChild(_this6.dialog);
    _this6.dialog.style.display = "block";
    _this6.title = _this6.dialog.querySelector(".modal-title");
    _this6.closeBtn = _this6.dialog.querySelector(".modal-close");
    _this6.search = _this6.dialog.querySelector(".modal-search");
    _this6.added = _this6.dialog.querySelector("#added");
    _this6.list = _this6.dialog.querySelector(".modal-list");

    _this6.search.focus();

    return _this6;
  }

  return CharacterSelectDialog;
}(Dialog);

exports.CharacterSelectDialog = CharacterSelectDialog;

var BackgroundSelectDialog = /*#__PURE__*/function (_Dialog4) {
  (0, _inherits2["default"])(BackgroundSelectDialog, _Dialog4);

  var _super6 = _createSuper(BackgroundSelectDialog);

  function BackgroundSelectDialog(loadPreviews) {
    var _this7;

    (0, _classCallCheck2["default"])(this, BackgroundSelectDialog);
    _this7 = _super6.call(this);
    _this7.dialog.className = "background-select-modal modal";
    _this7.dialog.innerHTML = "    <div class=\"modal-content modal-large-width modal-large-height\">      <div>        <div class=\"modal-header\">        <h2 class=\"modal-title\">Background Select</h2>        <span class=\"modal-close\">&times;</span>        </div>        <input type=\"search\" class=\"modal-search form_input\" placeholder=\"Search\">      </div>      <div class=\"modal-body\">      <div class\"modal-list\"></div>      </div>    </div>";
    document.body.appendChild(_this7.dialog);
    _this7.dialog.style.display = "block";
    _this7.title = _this7.dialog.querySelector(".modal-title");
    _this7.closeBtn = _this7.dialog.querySelector(".modal-close");
    _this7.search = _this7.dialog.querySelector(".modal-search");
    _this7.added_checkbox = _this7.dialog.querySelector("#added_checkbox");
    _this7.list = _this7.dialog.querySelector(".modal-list");

    _this7.search.focus();

    loadPreviews();
    return _this7;
  }

  return BackgroundSelectDialog;
}(Dialog);

exports.BackgroundSelectDialog = BackgroundSelectDialog;

var ImportListDialog = /*#__PURE__*/function (_Dialog5) {
  (0, _inherits2["default"])(ImportListDialog, _Dialog5);

  var _super7 = _createSuper(ImportListDialog);

  function ImportListDialog() {
    var _this8;

    (0, _classCallCheck2["default"])(this, ImportListDialog);
    _this8 = _super7.call(this);
    _this8.dialog.className = "import-list-modal modal";
    _this8.dialog.innerHTML = "    <div class=\"modal-content modal-medium-width modal-large-height\">      <div class=\"modal-header\">        <h2 class=\"modal-title\">Import List</h2>        <span class=\"modal-close\">&times;</span>      </div>      <input type=\"text\" class=\"modal-name form_input\" placeholder=\"List Name\"></textarea>      <textarea class=\"modal-text form_input\" placeholder=\"JSON\"></textarea>      <button class=\"modal-import small_btn\">Import</button>      <div class\"modal-list\"></div>      <p class=\"error_text\"></p>    </div>";
    document.body.appendChild(_this8.dialog);
    _this8.dialog.style.display = "block";
    _this8.title = _this8.dialog.querySelector(".modal-title");
    _this8.closeBtn = _this8.dialog.querySelector(".modal-close");
    _this8.name = _this8.dialog.querySelector(".modal-name");
    _this8.text = _this8.dialog.querySelector("#modal-text");
    _this8.importBtn = _this8.dialog.querySelector(".modal-import");
    _this8.list = _this8.dialog.querySelector(".modal-list");
    _this8.error = _this8.dialog.querySelector(".error_text");
    return _this8;
  }

  return ImportListDialog;
}(Dialog);

exports.ImportListDialog = ImportListDialog;

},{"@babel/runtime/helpers/assertThisInitialized":6,"@babel/runtime/helpers/classCallCheck":7,"@babel/runtime/helpers/defineProperty":8,"@babel/runtime/helpers/getPrototypeOf":9,"@babel/runtime/helpers/inherits":10,"@babel/runtime/helpers/interopRequireDefault":11,"@babel/runtime/helpers/possibleConstructorReturn":13}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTheme = exports.detectColorScheme = exports.sortArrayBy = void 0;

var sortArrayBy = function sortArrayBy(a, b, sortBy) {
  var i = 0,
      result = 0;

  while (i < sortBy.length && result === 0) {
    if (sortBy[i].isString) result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0);else result = sortBy[i].direction * (parseInt(a[sortBy[i].prop].toString()) < parseInt(b[sortBy[i].prop].toString()) ? -1 : parseInt(a[sortBy[i].prop].toString()) > parseInt(b[sortBy[i].prop].toString()) ? 1 : 0);
    i++;
  }

  return result;
}; // https://stackoverflow.com/a/56550819/7627317


exports.sortArrayBy = sortArrayBy;

var detectColorScheme = function detectColorScheme() {
  var theme = "light"; //default to light
  // local storage is used to override OS theme settings

  if (window.localStorage.getItem("theme")) {
    if (window.localStorage.getItem("theme") == "dark") {
      theme = "dark";
    }
  } else if (!window.matchMedia) {
    // matchMedia method not supported
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // OS theme setting detected as dark
    theme = "dark";
  }

  setTheme(theme);
};

exports.detectColorScheme = detectColorScheme;

var setTheme = function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  var theme_button = document.querySelector("#theme_button");

  if (theme === "light") {
    if (theme_button) {
      if (theme_button.classList.contains("light")) theme_button.classList.replace("light", "dark");else if (!theme_button.classList.contains("dark")) theme_button.classList.add("dark");
    }

    window.localStorage.setItem("theme", "light");
  } else if (theme === "dark") {
    if (theme_button) {
      if (theme_button.classList.contains("dark")) theme_button.classList.replace("dark", "light");else if (!theme_button.classList.contains("light")) theme_button.classList.add("light");
    }

    window.localStorage.setItem("theme", "dark");
  }
};

exports.setTheme = setTheme;

},{}],6:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],7:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],8:[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],9:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],10:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":14}],11:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],12:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;
},{"../helpers/typeof":15}],13:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":15,"./assertThisInitialized":6}],14:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],15:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}]},{},[1]);
