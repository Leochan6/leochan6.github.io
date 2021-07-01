(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _team_elements = require("./team_elements.js");
/* ------------------------------ General Modal Dialogs ------------------------------ */
// hide modal dialogs if not drag


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
  if (!dragging) {
    // [messageDialog, characterSelectDialog, backgroundSelectDialog, importListDialog].forEach(dialog => {
    [_team_elements.messageDialog].forEach(function (dialog) {
      if (event.target == dialog.modal && dialog.isOpen()) dialog.close();
    });
  }
});
window.addEventListener("keyup", function (e) {
  if (e.key === "Escape") {
    [_team_elements.messageDialog].forEach(function (dialog) {
      if (e.target == dialog.modal && dialog.isOpen()) return dialog.close();
    });

    if (character_api.selectedCharacter) {
      character_api.deselectDisplay();
    }
  }
});
/* ------------------------------ Message Modal Dialog ------------------------------ */
// hide message modal dialog

_team_elements.messageDialog.closeButton.addEventListener("click", function () {
  _team_elements.messageDialog.close();
}); // message modal dialog copy button.


_team_elements.messageDialog.copy.addEventListener("click", function () {
  navigator.clipboard.writeText(_team_elements.messageDialog.text.value);
});

},{"./team_elements.js":2}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importListDialog = exports.backgroundSelectDialog = exports.memoriaSelectDialog = exports.messageDialog = exports.team_elements = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _team_elements;

var team_elements = (_team_elements = {
  // Header
  theme_button: document.querySelector("#theme_button"),
  contact_button: document.querySelector("#contact_button"),
  signout_button: document.querySelector("#signout_button"),
  header_username: document.querySelector("#header_username"),
  verify_email: document.querySelector("#verify_email"),
  verify_email_close: document.querySelector("#verify_email_close"),
  verify_email_button: document.querySelector("#verify_email_button"),
  verify_email_success: document.querySelector("#verify_email_success"),
  verify_email_error: document.querySelector("#verify_email_error"),
  // Error Text
  home_error_text: document.querySelector("#home_error_text"),
  memoria_error_text: document.querySelector("#memoria_error_text"),
  profile_error_text: document.querySelector("#profile_error_text"),
  // Home Buttons
  list_create: document.querySelector("#list_create"),
  list_rename: document.querySelector("#list_rename"),
  list_duplicate: document.querySelector("#list_duplicate"),
  new_list_button: document.querySelector("#new_list_button"),
  rename_list_button: document.querySelector("#rename_list_button"),
  create_list_form: document.querySelector("#create_list_form"),
  create_list_name_field: document.querySelector("#create_list_name_field"),
  create_list_create_button: document.querySelector("#create_list_create_button"),
  duplicate_list_button: document.querySelector("#duplicate_list_button"),
  delete_list_button: document.querySelector("#delete_list_button"),
  duplicate_list_form: document.querySelector("#duplicate_list_form"),
  duplicate_list_name_field: document.querySelector("#duplicate_list_name_field"),
  duplicate_list_create_button: document.querySelector("#duplicate_list_create_button"),
  rename_list_form: document.querySelector("#rename_list_form"),
  rename_list_name_field: document.querySelector("#rename_list_name_field"),
  rename_list_create_button: document.querySelector("#rename_list_create_button"),
  saved_memoria_lists: document.querySelector("#saved_memoria_lists"),
  // Create Memoria Fields
  name_select: document.querySelector("#name_select"),
  type_select: document.querySelector("#type_select"),
  rank_select: document.querySelector("#rank_select"),
  ascension_select: document.querySelector("#ascension_select"),
  level_select: document.querySelector("#level_select"),
  // Create Memoria Buttons
  memoriaSelectModalOpen: document.querySelector("#memoriaSelectModalOpen"),
  create_button: document.querySelector("#create_button"),
  update_button: document.querySelector("#update_button"),
  copy_button: document.querySelector("#copy_button"),
  delete_button: document.querySelector("#delete_button"),
  min_all_button: document.querySelector("#min_all_button"),
  max_all_button: document.querySelector("#max_all_button"),
  // Character Preview
  display_preview: document.querySelector("#display_preview"),
  // Sorting Profiles
  profile_select: document.querySelector("#profile_select"),
  new_profile_button: document.querySelector("#new_profile_button"),
  profile_create_block: document.querySelector("#profile_create_block"),
  new_profile_field: document.querySelector("#new_profile_field"),
  new_name_field: document.querySelector("#new_name_field"),
  create_profile_button: document.querySelector("#create_profile_button"),
  close_new_profile_button: document.querySelector("#close_new_profile_button"),
  delete_profile_button: document.querySelector("#delete_profile_button"),
  profile_rules: document.querySelector("#profile_rules"),
  // Sorting Fields
  group_by_select: document.querySelector("#group_by_select"),
  group_dir_select: document.querySelector("#group_dir_select"),
  sort_by_1_select: document.querySelector("#sort_by_1_select"),
  sort_dir_1_select: document.querySelector("#sort_dir_1_select"),
  sort_by_2_select: document.querySelector("#sort_by_2_select"),
  sort_dir_2_select: document.querySelector("#sort_dir_2_select"),
  sort_id_dir_select: document.querySelector("#sort_id_dir_select"),
  displays_per_row: document.querySelector("#displays_per_row")
}, (0, _defineProperty2["default"])(_team_elements, "displays_per_row", document.querySelector("#displays_per_row")), (0, _defineProperty2["default"])(_team_elements, "display_alignment_select", document.querySelector("#display_alignment_select")), (0, _defineProperty2["default"])(_team_elements, "backgroundSelectModalOpen", document.querySelector("#backgroundSelectModalOpen")), (0, _defineProperty2["default"])(_team_elements, "background_select", document.querySelector("#background_select")), (0, _defineProperty2["default"])(_team_elements, "remove_background_button", document.querySelector("#remove_background_button")), (0, _defineProperty2["default"])(_team_elements, "background_transparency_field", document.querySelector("#background_transparency_field")), (0, _defineProperty2["default"])(_team_elements, "background_transparency_range", document.querySelector("#background_transparency_range")), (0, _defineProperty2["default"])(_team_elements, "list_name_title", document.querySelector("#list_name_title")), (0, _defineProperty2["default"])(_team_elements, "header_content_divider", document.querySelector("#header_content_divider")), (0, _defineProperty2["default"])(_team_elements, "content", document.querySelector("#content")), (0, _defineProperty2["default"])(_team_elements, "main", document.querySelector("#main")), (0, _defineProperty2["default"])(_team_elements, "menu_bar", document.querySelector("#menu_bar")), (0, _defineProperty2["default"])(_team_elements, "left_main_divider", document.querySelector("#left_main_divider")), (0, _defineProperty2["default"])(_team_elements, "main_header", document.querySelector("#main_header")), (0, _defineProperty2["default"])(_team_elements, "export_image_button", document.querySelector("#export_image_button")), (0, _defineProperty2["default"])(_team_elements, "export_open_button", document.querySelector("#export_open_button")), (0, _defineProperty2["default"])(_team_elements, "export_text_button", document.querySelector("#export_text_button")), (0, _defineProperty2["default"])(_team_elements, "import_text_button", document.querySelector("#import_text_button")), (0, _defineProperty2["default"])(_team_elements, "zoom_field", document.querySelector("#zoom_field")), (0, _defineProperty2["default"])(_team_elements, "zoom_range", document.querySelector("#zoom_range")), (0, _defineProperty2["default"])(_team_elements, "list_filters", document.querySelector("#list_filters")), (0, _defineProperty2["default"])(_team_elements, "add_filter_button", document.querySelector("#add_filter_button")), (0, _defineProperty2["default"])(_team_elements, "apply_filter_button", document.querySelector("#apply_filter_button")), (0, _defineProperty2["default"])(_team_elements, "reset_filter_button", document.querySelector("#reset_filter_button")), (0, _defineProperty2["default"])(_team_elements, "toggle_filter_button", document.querySelector("#toggle_filter_button")), (0, _defineProperty2["default"])(_team_elements, "list_stats_list", document.querySelector("#list_stats_list")), (0, _defineProperty2["default"])(_team_elements, "more_stats_button", document.querySelector("#more_stats_button")), (0, _defineProperty2["default"])(_team_elements, "memoria_list_container", document.querySelector("#memoria_list_container")), (0, _defineProperty2["default"])(_team_elements, "memoria_list_content", document.querySelector("#memoria_list_content")), _team_elements); // Message Modal

exports.team_elements = team_elements;
var messageDialog = {
  modal: document.querySelector("#messageModal"),
  content: document.querySelector("#messageModalContent"),
  title: document.querySelector("#messageModalTitle"),
  text: document.querySelector("#messageModalText"),
  closeButton: document.querySelector("#messageModalClose"),
  copy: document.querySelector("#messageModalCopy"),
  list: document.querySelector("#messageModalList"),
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
    messageDialog.list.innerHTML = "";
  },
  isOpen: function isOpen() {
    return messageDialog.modal.style.display === "block";
  }
}; // Memoria Select Modal

exports.messageDialog = messageDialog;
var memoriaSelectDialog = {
  modal: document.querySelector("#memoriaSelectModal"),
  content: document.querySelector("#memoriaSelectModalContent"),
  search: document.querySelector("#memoriaSelectModalSearch"),
  added: document.querySelector("#memoriaSelectModalAdded"),
  closeButton: document.querySelector("#memoriaSelectModalClose"),
  list: document.querySelector("#memoriaSelectModalList"),
  open: function open(loadPreviews) {
    memoriaSelectDialog.modal.style.display = "block";
    memoriaSelectDialog.search.focus();
    loadPreviews();
  },
  close: function close() {
    memoriaSelectDialog.modal.style.display = "none";
    memoriaSelectDialog.search.value = "";
    memoriaSelectDialog.list.innerHTML = "";
    memoriaSelectDialog.list.scrollTo(0, 0);
  },
  isOpen: function isOpen() {
    return memoriaSelectDialog.modal.style.display === "block";
  }
}; // Background Select Modal

exports.memoriaSelectDialog = memoriaSelectDialog;
var backgroundSelectDialog = {
  modal: document.querySelector("#backgroundSelectModal"),
  closeButton: document.querySelector("#backgroundSelectModalClose"),
  search: document.querySelector("#backgroundSelectModalSearch"),
  list: document.querySelector("#backgroundSelectModalList"),
  open: function open(loadPreviews) {
    backgroundSelectDialog.modal.style.display = "block";
    backgroundSelectDialog.search.focus();
    loadPreviews();
  },
  close: function close() {
    backgroundSelectDialog.modal.style.display = "none";
    backgroundSelectDialog.search.value = "";
    backgroundSelectDialog.list.innerHTML = "";
    backgroundSelectDialog.list.scrollTo(0, 0);
  },
  isOpen: function isOpen() {
    return backgroundSelectDialog.modal.style.display === "block";
  }
}; // Import List Modal

exports.backgroundSelectDialog = backgroundSelectDialog;
var importListDialog = {
  modal: document.querySelector("#importListModal"),
  content: document.querySelector("#importListModalContent"),
  title: document.querySelector("#importListModalTitle"),
  name: document.querySelector("#importListModalName"),
  closeButton: document.querySelector("#importListModalClose"),
  text: document.querySelector("#importListModalText"),
  importButton: document.querySelector("#importListModalImport"),
  list: document.querySelector("#importListModalList"),
  error: document.querySelector("#importListModalError"),
  open: function open() {
    importListDialog.modal.style.display = "block";
    importListDialog.name.focus();
  },
  close: function close() {
    importListDialog.modal.style.display = "none";
    importListDialog.name.value = "";
    importListDialog.text.value = "";
    importListDialog.list.innerHTML = "";
    importListDialog.error.innerHTML = "";
  },
  isOpen: function isOpen() {
    return importListDialog.modal.style.display === "block";
  }
};
exports.importListDialog = importListDialog;

},{"@babel/runtime/helpers/defineProperty":3,"@babel/runtime/helpers/interopRequireDefault":4}],3:[function(require,module,exports){
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
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],4:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}]},{},[1]);
