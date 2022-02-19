(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startUp = exports.filterBackgrounds = exports.loadBackgroundList = exports.getSelectedBackground = exports.removeBackground = exports.changeTransparency = exports.setBackground = exports.getBackgrounds = void 0;

var _character_elements = require("./character_elements.js");

var _background_collection = require("../../collection/background_collection.js");

var storage_api = _interopRequireWildcard(require("./storage_api.js"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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
/**
 * Background API for the Character Page.
 */

/**
 * Gets all the Home Screen Backgrounds.
 */


var getBackgrounds = function getBackgrounds() {
  var backgrounds = _background_collection.background_collection["home screen"];
  return backgrounds;
};
/**
 * Sets the background of the list with the background_id.
 * 
 * @param {String} background_id 
 */


exports.getBackgrounds = getBackgrounds;

var setBackground = function setBackground(background_id) {
  if (background_id) {
    background_select.value = background_id;
    _character_elements.character_elements.character_list_content.style.backgroundImage = "url(\"/magireco/assets/bg/".concat(background_id, ".jpg\")");
    changeTransparency(storage_api.settings.background_transparency);
  } else {
    _character_elements.character_elements.character_list_content.style.backgroundImage = "";
    changeTransparency(storage_api.settings.background_transparency);
    background_select.selectedIndex = -1;
  }
};
/**
 * Changes the transparency of the list to transparency / 100.
 * 
 * @param {Number} transparency 
 */


exports.setBackground = setBackground;

var changeTransparency = function changeTransparency(transparency) {
  _character_elements.character_elements.character_list_content.style.backgroundColor = "rgba(255,255,255,".concat(transparency / 100, ")");
};
/**
 * Removes the background from the list.
 */


exports.changeTransparency = changeTransparency;

var removeBackground = function removeBackground() {
  _character_elements.character_elements.character_list_content.style.backgroundImage = "";
  background_select.selectedIndex = -1;
};
/**
 * Gets the background_id of the selected background.
 */


exports.removeBackground = removeBackground;

var getSelectedBackground = function getSelectedBackground() {
  return background_select.value;
};
/**
 * Loads the background image previews into the Background Select Dialog.
 */


exports.getSelectedBackground = getSelectedBackground;

var loadBackgroundList = function loadBackgroundList() {
  var backgrounds = getBackgrounds();
  backgrounds.forEach(function (background) {
    var container = document.createElement("div");
    container.classList.add("background_image_preview");
    container.setAttribute("id", background.id);
    var image = document.createElement("img");
    image.src = "/magireco/assets/bg_min/".concat(background.id, ".jpg");
    image.title = background.name ? background.name : background.id;
    container.append(image);
    container.addEventListener("click", function () {
      background_select.value = background.id;
      background_select.dispatchEvent(new Event("change"));
      backgroundSelectModal.style.display = "none";
    });

    _character_elements.backgroundSelectDialog.list.append(container);
  });
};
/**
 * Filters the backgrounds based on the search term.
 * @param {String} search 
 */


exports.loadBackgroundList = loadBackgroundList;

var filterBackgrounds = function filterBackgrounds(search) {
  if (!search || search.length == 0) {
    Array.from(backgroundSelectModalList.children).forEach(function (child) {
      if (child.classList.contains("hidden")) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      }
    });
  }

  search = search.toLowerCase();
  Array.from(backgroundSelectModalList.children).forEach(function (child) {
    var background = getBackgrounds().find(function (back) {
      return child.getAttribute("id") === back.id;
    });

    if (background.id.includes(search) || background.name.toLowerCase().includes(search) || background.id.toLowerCase().split("_").includes(search)) {
      child.classList.remove("hidden");
      child.style.display = "inline-block";
    } else {
      child.classList.add("hidden");
      child.style.display = "none";
    }
  });
};
/**
 * Load the background_select with background names.
 */


exports.filterBackgrounds = filterBackgrounds;

var startUp = function startUp() {
  var backgrounds = getBackgrounds();
  backgrounds.forEach(function (background) {
    background_select.options.add(new Option(background.name ? background.name : background.id, background.id, false));
  });
  background_select.selectedIndex = -1;
};

exports.startUp = startUp;

},{"../../collection/background_collection.js":8,"./character_elements.js":3,"./storage_api.js":7,"@babel/runtime/helpers/typeof":31}],2:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openCharacterDialog = exports.toggleAdded = exports.filterCharacters = exports.loadCharacterSelectList = exports.enableButtons = exports.updatePreviewOnForm = exports.findAndSelectDisplay = exports.deselectDisplay = exports.selectDisplay = exports.deleteCharacter = exports.copyCharacter = exports.updateCharacter = exports.createCharacter = exports.updateFieldsOnMagia = exports.updateFieldsOnRank = exports.updateFieldsOnName = exports.maximizeDisplay = exports.minimizeDisplay = exports.getMaxRank = exports.getMinRank = exports.getMaxLevel = exports.createDisplay = exports.getCharacterDisplay = exports.isValidCharacterDisplay = exports.getBasicCharacterDisplay = exports.sanitizeCharacter = exports.getCharacter = exports.startUp = exports.Character = exports.Display = exports.selectedCharacter = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _character_collection = require("../../collection/character_collection.js");

var _character_elements = require("./character_elements.js");

var character_list_api = _interopRequireWildcard(require("./character_list_api.js"));

var storage_api = _interopRequireWildcard(require("./storage_api.js"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0, _defineProperty2["default"])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var selectedCharacter = null;
exports.selectedCharacter = selectedCharacter;

var Display = function Display(id, name, rank, post_awaken, attribute, level, magic, magia, episode, doppel, se) {
  (0, _classCallCheck2["default"])(this, Display);

  if ((0, _typeof2["default"])(rank) !== undefined) {
    this.character_id = id;
    this.name = name;
    this.rank = rank;
    this.post_awaken = post_awaken;
    this.attribute = attribute;
    this.level = level;
    this.magic = magic;
    this.magia = magia;
    this.episode = episode;
    this.doppel = doppel;
    this.se = se;
  } else {
    this._id = id;
    this.character_id = name.character_id;
    this.name = name.name;
    this.rank = name.rank;
    this.post_awaken = name.post_awaken;
    this.attribute = name.attribute;
    this.level = name.level;
    this.magic = name.magic;
    this.magia = name.magia;
    this.episode = name.episode;
    this.doppel = name.doppel;
    this.se = name.se;
  }
};

exports.Display = Display;
;

var Character = function Character(id, name, attribute, ranks) {
  (0, _classCallCheck2["default"])(this, Character);
  this.id = id;
  this.name = name;
  this.attribute = attribute;
  this.ranks = ranks;
};

exports.Character = Character;
;
/**
 * starts up the list.
 */

var startUp = function startUp() {
  // initialize name field.
  (0, _toConsumableArray2["default"])(_character_collection.character_collection).sort(function (a, b) {
    return a.name > b.name ? 1 : -1;
  }).forEach(function (character) {
    _character_elements.character_elements.name_select.options.add(new Option(character.name, character.id, false));
  });
  _character_elements.character_elements.name_select.value = 1001;

  _character_elements.character_elements.name_select.dispatchEvent(new Event("change"));

  var character = getCharacter("1001");
  updateFormEnabled(character);
  updatePreviewDisplay(getBasicCharacterDisplay(character));
};
/**
 * get the attribute and rank for the character.
 * 
 * @param {String} id 
 */


exports.startUp = startUp;

var getCharacter = function getCharacter(id) {
  try {
    var character = _character_collection.character_collection.find(function (character) {
      return character.id === id;
    });

    var name = character.name;
    var attribute = character.attribute.toLowerCase();
    var ranks = character.ranks;
    return new Character(id, name, attribute, ranks);
  } catch (e) {
    return null;
  }
};
/**
 * removes the extra properties of the character.
 * 
 * @param {Character} character 
 */


exports.getCharacter = getCharacter;

var sanitizeCharacter = function sanitizeCharacter(character) {
  var removeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var newCharacter = _objectSpread({}, character);

  if (removeId && newCharacter._id) delete newCharacter._id;
  if (newCharacter.name) delete newCharacter.name;
  if (newCharacter.attribute) delete newCharacter.attribute;
  if (newCharacter.obtainability) delete newCharacter.obtainability;
  if (newCharacter.release_date) delete newCharacter.release_date;
  return newCharacter;
};
/**
 * gets the basic display for the character.
 * 
 * @param {Character} character 
 */


exports.sanitizeCharacter = sanitizeCharacter;

var getBasicCharacterDisplay = function getBasicCharacterDisplay(character) {
  return new Display(character.id, character.name, getMinRank(character.ranks), false, character.attribute, "1", "0", "1", "1", false, "0");
};
/**
 * check if display is valid.
 * 
 * @param {String} character_id 
 * @param {Display} display 
 * @param {boolean} validName 
 */


exports.getBasicCharacterDisplay = getBasicCharacterDisplay;

var isValidCharacterDisplay = function isValidCharacterDisplay(character_id, display) {
  var validName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var character = getCharacter(character_id);
  if (!character) return ["Cannot get character."];
  var err = []; // check id.

  if (display.character_id !== character.id) err.push("Character ID ".concat(display.character_id, " does not match Character ID ").concat(character.id, ".")); // check name.

  if (display.name !== character.name && validName) err.push("Name ".concat(display.name, " does not match Character Name ").concat(character.name, ".")); // check rank.

  if (!character.ranks[display.rank]) err.push("Rank: ".concat(display.rank, " does not match Character Ranks ").concat(JSON.stringify(character.ranks))); // check level.

  var maxLevel = parseInt(getMaxLevel(display.rank));
  if (parseInt(display.level) < 1 || parseInt(display.level) > maxLevel || !display.level) err.push("Level ".concat(display.level, " for Rank ").concat(display.rank, " must be between 1 and ").concat(maxLevel, ".")); // check magic.

  if (display.magic < 0 || display.magic > 3) err.push("Magic ".concat(display.magic, " must be between 0 and 3.")); // check magia.

  if (display.magia < 1 || display.magia > 5) err.push("Magia ".concat(display.magia, " must be between 1 and 5."));
  if (display.magia > display.episode) err.push("Magia ".concat(display.magia, " must be less than or equal to Episode ").concat(display.episode, ".")); // check episode.

  if (display.episode < 1 || display.episode > 5) err.push("Episode ".concat(display.episode, " must be between 1 and 5.")); // check doppel.

  if (!(display.doppel === true || display.doppel === false) || display.doppel === true && (display.magia < 5 || display.rank < 5)) err.push("Doppel ".concat(display.doppel, " can only be true if Magia 5 and Rank 5.")); // check se.

  if (display.se < 0 || display.se > 100) err.push("Spirit Enhancement ".concat(display.se, " must be between 0 and 100."));
  return err;
};
/**
 * get Display from the form.
 * 
 * @return {Display}
 */


exports.isValidCharacterDisplay = isValidCharacterDisplay;

var getFormDisplay = function getFormDisplay() {
  var display = new Display(_character_elements.character_elements.name_select.value, _character_elements.character_elements.name_select[name_select.options.selectedIndex].text, _character_elements.character_elements.rank_select.value, _character_elements.character_elements.post_awaken_checkbox.checked, _character_collection.character_collection.find(function (_char) {
    return _char.id === _character_elements.character_elements.name_select.value;
  }).attribute.toLowerCase() || null, _character_elements.character_elements.level_select.value, _character_elements.character_elements.magic_select.value, _character_elements.character_elements.magia_select.value, _character_elements.character_elements.episode_select.value, _character_elements.character_elements.doppel_checkbox.checked, _character_elements.character_elements.se_select.value);
  return display;
};
/**
 * get Display from character display.
 * 
 * @param {HTMLDivElement} character_display
 * @return {Display}
 */


var getCharacterDisplay = function getCharacterDisplay(character_display) {
  var display = new Display(character_display.getAttribute("character_id"), character_display.getAttribute("name"), character_display.getAttribute("rank"), character_display.getAttribute("post_awaken"), character_display.getAttribute("attribute"), character_display.getAttribute("level"), character_display.getAttribute("magic"), character_display.getAttribute("magia"), character_display.getAttribute("episode"), character_display.getAttribute("doppel"), character_display.getAttribute("se"));
  display._id = character_display.getAttribute("_id");
  return display;
};
/**
 * create a character display element from Display.
 * 
 * @param {Display} display
 * @return {HTMLDivElement}
 */


exports.getCharacterDisplay = getCharacterDisplay;

var createDisplay = function createDisplay(display) {
  var listener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var character_display = document.createElement("div");
  character_display.classList.add("character_display");
  character_display.setAttribute("_id", display._id);
  character_display.setAttribute("character_id", display.character_id || display.id);
  character_display.setAttribute("name", display.name);
  character_display.setAttribute("rank", display.rank);
  character_display.setAttribute("post_awaken", display.post_awaken);
  character_display.setAttribute("attribute", display.attribute);
  character_display.setAttribute("magic", display.magic);
  character_display.setAttribute("magia", display.magia);
  character_display.setAttribute("episode", display.episode);
  character_display.setAttribute("level", display.level);
  character_display.setAttribute("doppel", display.doppel);
  character_display.setAttribute("se", display.se);
  character_display.innerHTML = "\n  <img class=\"background\" src=\"/magireco/assets/ui/bg/".concat(display.attribute, ".png\">\n  <img class=\"card_image\" src=\"/magireco/assets/image/card_").concat(display.character_id).concat(display.rank, "_f.png\">\n  <img class=\"frame_rank\" src=\"/magireco/assets/ui/frame/").concat(display.rank, ".png\">\n  <img class=\"star_rank\" src=\"/magireco/assets/ui/star/").concat(display.rank, ".png\">\n  <img class=\"attribute\" src=\"/magireco/assets/ui/attribute/").concat(display.attribute, ".png\">\n  <img class=\"magic\" src=\"/magireco/assets/ui/magic/").concat(display.magic, ".png\">\n  <img class=\"magia\" src=\"/magireco/assets/ui/magia/").concat(display.magia, "-").concat(display.episode, ".png\">\n  <div class=\"level\">\n    <div class=\"level_pre\">Lvl.</div>\n    <div class=\"level_num\">").concat(display.level, "</div>\n  </div>\n  <div class=\"se\">").concat(display.se, "/100</div>\n  <img class=\"doppel\" src=\"/magireco/assets/ui/doppel/").concat(display.doppel, ".png\">\n  <img class=\"post_awaken\" src=\"/magireco/assets/ui/gift/gift_").concat(display.post_awaken, ".png\">");

  if (listener) {
    character_display.addEventListener("click", function () {
      selectDisplay(character_display);
    });
  }

  character_display.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    openCharacterDialog(_character_collection.character_collection.find(function (elem) {
      return elem.id === display.character_id;
    }), [display]);
  });
  return character_display;
};
/**
 * Gets the maximum level for the rank
 * 
 * @param {String} rank 
 */


exports.createDisplay = createDisplay;

var getMaxLevel = function getMaxLevel(rank) {
  if (rank == "1") return "40";else if (rank == "2") return "50";else if (rank == "3") return "60";else if (rank == "4") return "80";else if (rank == "5") return "100";
};

exports.getMaxLevel = getMaxLevel;
var RANK_TO_LEVEL = {
  "1": "40",
  "2": "50",
  "3": "60",
  "4": "80",
  "5": "100"
};
/**
 * Gets the minimum (natural) rank from the character ranks object.
 * 
 * @param {Object} ranks 
 */

var getMinRank = function getMinRank(ranks) {
  var minRank = "5";
  Object.entries(ranks).reverse().forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        rank = _ref2[0],
        value = _ref2[1];

    return minRank = value ? rank : minRank;
  });
  return minRank;
};
/**
 * Gets the maximum rank from the character ranks object.
 * 
 * @param {Object} ranks 
 */


exports.getMinRank = getMinRank;

var getMaxRank = function getMaxRank(ranks) {
  var maxRank = "1";
  Object.entries(ranks).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        rank = _ref4[0],
        value = _ref4[1];

    return maxRank = value ? rank : maxRank;
  });
  return maxRank;
};
/**
 * Minimizes all the fields of the preview Character Display.
 */


exports.getMaxRank = getMaxRank;

var minimizeDisplay = function minimizeDisplay() {
  var character_display = getCharacterDisplay(display_preview.children[0]);

  var character = _character_collection.character_collection.find(function (_char2) {
    return _char2.id === character_display.character_id;
  });

  var minRank = getMinRank(character.ranks);
  var attribute = character.attribute.toLowerCase();
  var display = new Display(character.id, character.name, minRank, false, attribute, "1", "0", "1", "1", false, "0");
  updateForm(display);
  updatePreviewDisplay(display);
};
/**
 * Maximizes all the fields of the preview Character Display.
 */


exports.minimizeDisplay = minimizeDisplay;

var maximizeDisplay = function maximizeDisplay() {
  var character_display = getCharacterDisplay(display_preview.children[0]);

  var character = _character_collection.character_collection.find(function (_char3) {
    return _char3.id === character_display.character_id;
  });

  var maxRank = getMaxRank(character.ranks);
  var level = RANK_TO_LEVEL[maxRank];
  var attribute = character.attribute.toLowerCase();
  var display = new Display(character.id, character.name, maxRank, true, attribute, level, "3", "5", "5", maxRank == "5" ? true : false, "60");
  updateForm(display);
  updatePreviewDisplay(display);
};
/**
 * updates the display preview with Display.
 * 
 * @param {HTMLDivElement} display
 */


exports.maximizeDisplay = maximizeDisplay;

var updatePreviewDisplay = function updatePreviewDisplay(display) {
  var character_display = createDisplay(display);
  character_display.classList.add("preview");
  _character_elements.character_elements.display_preview.innerHTML = "";

  _character_elements.character_elements.display_preview.appendChild(character_display);
};
/**
 * updates the form with Display.
 * 
 * @param {Display} display
 */


var updateForm = function updateForm(display) {
  _character_elements.character_elements.name_select.value = display.character_id;
  _character_elements.character_elements.rank_select.value = display.rank;
  _character_elements.character_elements.post_awaken_checkbox.checked = display.post_awaken === "true" || display.post_awaken === true ? true : false;
  _character_elements.character_elements.level_select.value = display.level;
  _character_elements.character_elements.magic_select.value = display.magic;
  _character_elements.character_elements.magia_select.value = display.magia;
  _character_elements.character_elements.episode_select.value = display.episode;
  _character_elements.character_elements.doppel_checkbox.checked = display.doppel === "true" || display.doppel === true ? true : false;
  _character_elements.character_elements.se_select.value = display.se;
};
/**
 * updates the form with the available options and selects lowest.
 * 
 * @param {Character} character
 */


var updateFormEnabled = function updateFormEnabled(character) {
  // enable or disable the rank select.
  for (var i = 0; i < 5; i++) {
    _character_elements.character_elements.rank_select.options[i].disabled = !character.ranks[i + 1];
  } // if the currently select rank is disabled, then select minimum available rank.


  if (!character.ranks[rank_select.selectedIndex + 1]) {
    _character_elements.character_elements.rank_select.selectedIndex = getMinRank(character.ranks) - 1; // update the level to match max rank.

    _character_elements.character_elements.level_select.value = RANK_TO_LEVEL[_character_elements.character_elements.rank_select.value];
  } // enable or disable the doppel select.


  if (getMaxRank(character.ranks) == "5") {
    _character_elements.character_elements.doppel_checkbox.disabled = false;
  } else {
    _character_elements.character_elements.doppel_checkbox.disabled = true;
    _character_elements.character_elements.doppel_checkbox.checked = false;
  }
};
/**
 * gets the standard display given the display.
 * 
 * @param {Character} character 
 * @param {Display} display 
 */


var updateCharacterWithDisplay = function updateCharacterWithDisplay(character, display) {
  // return the default display.
  if (!display) return getBasicCharacterDisplay(character);
  return new Display(character.id, character.name, display.rank, display.post_awaken, character.attribute, display.level, display.magic, display.magia, display.episode, display.doppel, display.se);
};
/**
 * updates the form fields with the selected character.
 */


var updateFieldsOnName = function updateFieldsOnName() {
  var character = getCharacter(name_select.value);
  updateFormEnabled(character);
  var character_preview = updateCharacterWithDisplay(character, getFormDisplay());
  updateForm(character_preview);
  updatePreviewDisplay(character_preview);
};
/**
 * updates the form fields with the selected character's rank.
 */


exports.updateFieldsOnName = updateFieldsOnName;

var updateFieldsOnRank = function updateFieldsOnRank() {
  var character = getCharacter(name_select.value);
  var form_display = getFormDisplay();
  var maxLevel = RANK_TO_LEVEL[form_display.rank];
  if (parseInt(form_display.level) > parseInt(maxLevel)) form_display.level = maxLevel;
  var character_preview = updateCharacterWithDisplay(character, form_display);
  updateForm(character_preview);
  updatePreviewDisplay(character_preview);
};
/**
 * updates the form fields with the selected character's magia.
 */


exports.updateFieldsOnRank = updateFieldsOnRank;

var updateFieldsOnMagia = function updateFieldsOnMagia() {
  var character = getCharacter(name_select.value);
  var form_display = getFormDisplay();
  if (form_display.magia > form_display.episode) form_display.episode = form_display.magia;
  var character_preview = updateCharacterWithDisplay(character, form_display);
  updateForm(character_preview);
  updatePreviewDisplay(character_preview);
};
/**
 * adds a new character display to the list.
 */


exports.updateFieldsOnMagia = updateFieldsOnMagia;

var createCharacter = function createCharacter() {
  var display = getFormDisplay();
  var listId = character_list_api.getListId();
  display._id = generatePushID();
  storage_api.addCharacterToList(listId, display);
};
/**
 * updates the selected character display with the contents of the form.
 */


exports.createCharacter = createCharacter;

var updateCharacter = function updateCharacter() {
  var character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(function (child) {
    return child.classList.contains("selected");
  });
  if (!character_display) return;
  var display = getFormDisplay();
  display._id = character_display.getAttribute("_id");
  exports.selectedCharacter = selectedCharacter = {
    characterDisplayId: display._id
  };
  storage_api.updateCharacterOfList(character_list_api.getListId(), display._id, display);
};
/**
 * copies the contents of the selected display to the form.
 */


exports.updateCharacter = updateCharacter;

var copyCharacter = function copyCharacter() {
  var character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(function (child) {
    return child.classList.contains("selected");
  });
  if (!character_display) return;
  var display = getCharacterDisplay(character_display);
  getCharacter(character_display.getAttribute("character_id"), function (character) {
    return updateFormEnabled(character);
  });
  updateFormEnabled(getCharacter(display.character_id));
  updateForm(display);
  updatePreviewDisplay(display);
  _character_elements.character_elements.character_error_text.innerHTML = "";
};
/**
 * deletes the selected character display and finds the next display to be selected.
 */


exports.copyCharacter = copyCharacter;

var deleteCharacter = function deleteCharacter() {
  var character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(function (child) {
    return child.classList.contains("selected");
  });
  if (!character_display) return;
  var display = getCharacterDisplay(character_display);

  if (character_display.nextElementSibling) {
    exports.selectedCharacter = selectedCharacter = {
      characterDisplayId: character_display.nextElementSibling.getAttribute("_id")
    };
  } else if (character_display.previousElementSibling) {
    exports.selectedCharacter = selectedCharacter = {
      characterDisplayId: character_display.previousElementSibling.getAttribute("_id")
    };
  } else {
    exports.selectedCharacter = selectedCharacter = null;
  }

  var characterListId = character_list_api.getListId();

  if (Object.keys(storage_api.lists[characterListId].characterList).length === 1) {
    storage_api.updateListList(characterListId, false);
  } else {
    storage_api.deleteCharacterOfList(characterListId, display._id);
  }
};
/**
 * selects the display element.
 */


exports.deleteCharacter = deleteCharacter;

var selectDisplay = function selectDisplay(character_display) {
  // return of already selected.
  if (character_display.classList.contains("selected")) return; // deselect all other character displays

  document.querySelectorAll(".character_display:not(.preview)").forEach(function (child) {
    if (child.classList.contains("selected")) child.classList.remove("selected");
  });
  character_display.classList.add("selected");
  exports.selectedCharacter = selectedCharacter = {
    characterDisplayId: character_display.getAttribute("_id")
  };
  enableButtons(); // update the form.

  copyCharacter();
};
/**
 * deselects the select character display.
 */


exports.selectDisplay = selectDisplay;

var deselectDisplay = function deselectDisplay() {
  var deselect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (deselect) exports.selectedCharacter = selectedCharacter = null;

  if (selectedCharacter && selectedCharacter.characterDisplayId) {
    var character_display = document.querySelector(".character_display:not(.preview)[_id=\"".concat(selectedCharacter.characterDisplayId, "\"]"));
    if (character_display) character_display.classList.remove("selected");
    exports.selectedCharacter = selectedCharacter = null;
    enableButtons();
  }
};
/**
 * finds and select the display element.
 */


exports.deselectDisplay = deselectDisplay;

var findAndSelectDisplay = function findAndSelectDisplay() {
  if (selectedCharacter && selectedCharacter.characterDisplayId) {
    var character_display = document.querySelector(".character_display:not(.preview)[_id=\"".concat(selectedCharacter.characterDisplayId, "\"]"));
    if (character_display) selectDisplay(character_display);
  }
};
/**
 * updates the preview character display with the contents of the form.
 */


exports.findAndSelectDisplay = findAndSelectDisplay;

var updatePreviewOnForm = function updatePreviewOnForm() {
  var display = getFormDisplay();
  character_error_text.innerHTML = '';
  var error = isValidCharacterDisplay(name_select.value, display);

  if (error.length == 0) {
    enableButtons();
    updatePreviewDisplay(display);
    updateCharacter();
    _character_elements.character_elements.character_error_text.innerHTML = "";
  } else {
    create_button.disabled = true;
    update_button.disabled = true;
    _character_elements.character_elements.character_error_text.innerHTML = error.toString();
  }
};
/**
 * Enable and Disable the Character Buttons based on the current state.
 */


exports.updatePreviewOnForm = updatePreviewOnForm;

var enableButtons = function enableButtons() {
  if (character_list_api.selectedList && character_list_api.selectedList.listId) {
    if (_character_elements.character_elements.create_button.disabled) _character_elements.character_elements.create_button.disabled = false;
    if (_character_elements.character_elements.min_all_button.disabled) _character_elements.character_elements.min_all_button.disabled = false;
    if (_character_elements.character_elements.max_all_button.disabled) _character_elements.character_elements.max_all_button.disabled = false;

    if (selectedCharacter && selectedCharacter.characterDisplayId) {
      if (_character_elements.character_elements.update_button.disabled) _character_elements.character_elements.update_button.disabled = false;
      if (_character_elements.character_elements.copy_button.disabled) _character_elements.character_elements.copy_button.disabled = false;
      if (_character_elements.character_elements.delete_button.disabled) _character_elements.character_elements.delete_button.disabled = false;
      if (_character_elements.character_elements.selected_text.classList.contains("hidden")) _character_elements.character_elements.selected_text.classList.remove("hidden");
    } else {
      if (!_character_elements.character_elements.update_button.disabled) _character_elements.character_elements.update_button.disabled = true;
      if (!_character_elements.character_elements.copy_button.disabled) _character_elements.character_elements.copy_button.disabled = true;
      if (!_character_elements.character_elements.delete_button.disabled) _character_elements.character_elements.delete_button.disabled = true;
      if (!_character_elements.character_elements.selected_text.classList.contains("hidden")) _character_elements.character_elements.selected_text.classList.add("hidden");
    }
  } else {
    if (!_character_elements.character_elements.create_button.disabled) _character_elements.character_elements.create_button.disabled = true;
    if (!_character_elements.character_elements.update_button.disabled) _character_elements.character_elements.update_button.disabled = true;
    if (!_character_elements.character_elements.copy_button.disabled) _character_elements.character_elements.copy_button.disabled = true;
    if (!_character_elements.character_elements.delete_button.disabled) _character_elements.character_elements.delete_button.disabled = true;
    if (!_character_elements.character_elements.min_all_button.disabled) _character_elements.character_elements.min_all_button.disabled = true;
    if (!_character_elements.character_elements.max_all_button.disabled) _character_elements.character_elements.max_all_button.disabled = true;
  }
};
/**
 * opens the modal dialog for character selection user interface.
 */


exports.enableButtons = enableButtons;

var loadCharacterSelectList = function loadCharacterSelectList() {
  _character_elements.characterSelectDialog.list.innerHTML = "";

  _character_collection.character_collection.forEach(function (character) {
    var star = Object.entries(character.ranks).find(function (_ref5) {
      var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
          val = _ref6[1];

      return val === true;
    })[0][0];
    var added = Object.values(storage_api.lists[character_list_api.getListId()].characterList).filter(function (_char4) {
      return _char4.character_id === character.id;
    });
    var container = document.createElement("div");
    container.classList.add("character_image_preview");
    container.setAttribute("character_id", character.id);
    var image = document.createElement("img");
    image.src = "/magireco/assets/image/card_".concat(character.id).concat(star, "_f.png");
    image.title = character.name;
    container.append(image);

    if (added.length > 0) {
      var text = document.createElement("label");
      text.classList.add("character_label");
      text.innerHTML = "✓";
      container.append(text);
    }

    container.addEventListener("click", function () {
      name_select.value = character.id;
      name_select.dispatchEvent(new Event("change"));

      _character_elements.characterSelectDialog.close();
    });
    container.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      openCharacterDialog(character, added);
    });

    _character_elements.characterSelectDialog.list.append(container);
  });

  toggleAdded(_character_elements.characterSelectDialog.added.checked);
};
/**
 * Filters the character_image_preview's based on the search.
 * 
 * @param {String} search
 */


exports.loadCharacterSelectList = loadCharacterSelectList;

var filterCharacters = function filterCharacters(search) {
  if (!search || search.length == 0) {
    Array.from(_character_elements.characterSelectDialog.list.children).forEach(function (child) {
      if (child.classList.contains("hidden")) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      }
    });
  }

  search = search.toLowerCase();
  Array.from(_character_elements.characterSelectDialog.list.children).forEach(function (child) {
    var character = _character_collection.character_collection.find(function (_char5) {
      return child.getAttribute("character_id") === _char5.id;
    });

    if (character.id.includes(search) || character.name.toLowerCase().includes(search) || character.attribute.toLowerCase().includes(search) || Object.entries(character.ranks).some(function (_ref7) {
      var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
          rank = _ref8[0],
          value = _ref8[1];

      return value && rank.includes(search);
    })) {
      child.classList.remove("hidden");
      child.style.display = "inline-block";
    } else {
      child.classList.add("hidden");
      child.style.display = "none";
    }
  });
  toggleAdded(_character_elements.characterSelectDialog.added.checked);
};
/**
 * Toggles the visibility of the character previews of added.
 * 
 * @param {boolean} value 
 */


exports.filterCharacters = filterCharacters;

var toggleAdded = function toggleAdded(value) {
  if (value) {
    Array.from(_character_elements.characterSelectDialog.list.children).forEach(function (child) {
      if (child.querySelector(".character_label")) child.classList.add("hidden");
    });
  } else {
    Array.from(_character_elements.characterSelectDialog.list.children).forEach(function (child) {
      if (child.classList.contains("hidden")) child.classList.remove("hidden");
    });
  }
};
/**
 * Opens the Message Dialog with the Character Info.
 * 
 * @param {Character} character 
 * @param {Display} displays 
 */


exports.toggleAdded = toggleAdded;

var openCharacterDialog = function openCharacterDialog(character, displays) {
  var text = "ID: ".concat(character.id, "  \nAttribute: ").concat(character.attribute, "  \nRanks: ").concat(Object.keys(character.ranks).filter(function (key) {
    return character.ranks[key];
  }), "  \nObtainability: ").concat(character.obtainability, "  \nFandom Wiki Link:\n").concat(character.url);
  if (displays.length > 0) text += "\n\nYour Character".concat(displays.length > 1 ? "s" : "", ":");
  displays.forEach(function (display) {
    text += "\nRank: ".concat(display.rank, "    \nPost Awaken: ").concat(display.post_awaken, "    \nLevel: ").concat(display.level, "    \nMagic: ").concat(display.magic, "    \nMagia: ").concat(display.magia, "    \nEpisode: ").concat(display.episode, "    \nDoppel: ").concat(display.doppel, "    \nSpirit Enhancement: ").concat(display.se, "\n");
  });

  _character_elements.messageDialog.open("".concat(character.name, " Details"), text);
};

exports.openCharacterDialog = openCharacterDialog;

},{"../../collection/character_collection.js":9,"./character_elements.js":3,"./character_list_api.js":4,"./storage_api.js":7,"@babel/runtime/helpers/classCallCheck":18,"@babel/runtime/helpers/defineProperty":19,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/slicedToArray":29,"@babel/runtime/helpers/toConsumableArray":30,"@babel/runtime/helpers/typeof":31}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importListDialog = exports.backgroundSelectDialog = exports.characterSelectDialog = exports.messageDialog = exports.character_elements = void 0;
/**
 * Elements for the Character Page.
 */

var character_elements = {
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
  character_error_text: document.querySelector("#character_error_text"),
  profile_error_text: document.querySelector("#profile_error_text"),
  // My Character Lists
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
  saved_character_lists: document.querySelector("#saved_character_lists"),
  // Create Character Fields
  name_select: document.querySelector("#name_select"),
  rank_select: document.querySelector("#rank_select"),
  post_awaken_checkbox: document.querySelector("#post_awaken_checkbox"),
  level_select: document.querySelector("#level_select"),
  magic_select: document.querySelector("#magic_select"),
  magia_select: document.querySelector("#magia_select"),
  episode_select: document.querySelector("#episode_select"),
  doppel_checkbox: document.querySelector("#doppel_checkbox"),
  se_select: document.querySelector("#se_select"),
  // Create Character Buttons
  characterSelectModalOpen: document.querySelector("#characterSelectModalOpen"),
  create_button: document.querySelector("#create_button"),
  update_button: document.querySelector("#update_button"),
  copy_button: document.querySelector("#copy_button"),
  delete_button: document.querySelector("#delete_button"),
  min_all_button: document.querySelector("#min_all_button"),
  max_all_button: document.querySelector("#max_all_button"),
  // Character Preview
  selected_text: document.querySelector("#selected_text"),
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
  // Display Settings
  displays_per_row: document.querySelector("#displays_per_row"),
  display_alignment_select: document.querySelector("#display_alignment_select"),
  display_padding_top_field: document.querySelector("#display_padding_top_field"),
  display_padding_left_field: document.querySelector("#display_padding_left_field"),
  display_padding_right_field: document.querySelector("#display_padding_right_field"),
  display_padding_bottom_field: document.querySelector("#display_padding_bottom_field"),
  // Background
  backgroundSelectModalOpen: document.querySelector("#backgroundSelectModalOpen"),
  background_select: document.querySelector("#background_select"),
  remove_background_button: document.querySelector("#remove_background_button"),
  background_transparency_field: document.querySelector("#background_transparency_field"),
  background_transparency_range: document.querySelector("#background_transparency_range"),
  // Settings
  player_name_field: document.querySelector("#player_name_field"),
  player_id_field: document.querySelector("#player_id_field"),
  public_list_select: document.querySelector("#public_list_select"),
  update_user_button: document.querySelector("#update_user_button"),
  remove_id_button: document.querySelector("#remove_id_button"),
  link_link_button: document.querySelector("#link_link_button"),
  image_save_button: document.querySelector("#image_save_button"),
  image_delete_button: document.querySelector("#image_delete_button"),
  image_open_button: document.querySelector("#image_open_button"),
  image_copy_button: document.querySelector("#image_copy_button"),
  // Body
  list_name_title: document.querySelector("#list_name_title"),
  header_content_divider: document.querySelector("#header_content_divider"),
  content: document.querySelector("#content"),
  main: document.querySelector("#main"),
  menu_bar: document.querySelector("#menu_bar"),
  left_main_divider: document.querySelector("#left_main_divider"),
  main_header: document.querySelector("#main_header"),
  // Export and Import
  export_image_button: document.querySelector("#export_image_button"),
  export_open_button: document.querySelector("#export_open_button"),
  export_text_button: document.querySelector("#export_text_button"),
  import_text_button: document.querySelector("#import_text_button"),
  // Filters
  zoom_field: document.querySelector("#zoom_field"),
  zoom_range: document.querySelector("#zoom_range"),
  list_filters: document.querySelector("#list_filters"),
  add_filter_button: document.querySelector("#add_filter_button"),
  apply_filter_button: document.querySelector("#apply_filter_button"),
  reset_filter_button: document.querySelector("#reset_filter_button"),
  toggle_filter_button: document.querySelector("#toggle_filter_button"),
  // Stats
  list_stats_list: document.querySelector("#list_stats_list"),
  more_stats_button: document.querySelector("#more_stats_button"),
  // Character List
  character_list_container: document.querySelector("#character_list_container"),
  character_list_content: document.querySelector("#character_list_content")
}; // Message Modal

exports.character_elements = character_elements;
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
}; // Character Select Modal

exports.messageDialog = messageDialog;
var characterSelectDialog = {
  modal: document.querySelector("#characterSelectModal"),
  content: document.querySelector("#characterSelectModalContent"),
  search: document.querySelector("#characterSelectModalSearch"),
  added: document.querySelector("#characterSelectModalAdded"),
  closeButton: document.querySelector("#characterSelectModalClose"),
  list: document.querySelector("#characterSelectModalList"),
  open: function open(loadPreviews) {
    characterSelectDialog.modal.style.display = "block";
    characterSelectDialog.search.focus();
    loadPreviews();
  },
  close: function close() {
    characterSelectDialog.modal.style.display = "none";
    characterSelectDialog.search.value = "";
    characterSelectDialog.list.innerHTML = "";
    characterSelectDialog.list.scrollTo(0, 0);
  },
  isOpen: function isOpen() {
    return characterSelectDialog.modal.style.display === "block";
  }
}; // Background Select Modal

exports.characterSelectDialog = characterSelectDialog;
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

},{}],4:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importList = exports.openExportModal = exports.openStatsModal = exports.getMoreStats = exports.getStats = exports.resetFilters = exports.applyFilters = exports.getFilters = exports.createFilter = exports.zoom_fit = exports.setZoom = exports.changeZoom = exports.setPadding = exports.changePadding = exports.changeAlignment = exports.changeDisplaysPerRow = exports.createGroups = exports.displayGroups = exports.applyProfileToList = exports.getSelectedList = exports.checkListName = exports.getCharacterList = exports.getListId = exports.getListName = exports.updateList = exports.deleteList = exports.duplicateList = exports.renameList = exports.createList = exports.selectList = exports.setLists = exports.NUM_TO_WORD = exports.NUM_TO_ATT = exports.ATT_TO_NUM = exports.DIR_TO_FLEX = exports.selectedList = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _character_collection = require("../../collection/character_collection.js");

var background_api = _interopRequireWildcard(require("./background_api.js"));

var _character_elements = require("./character_elements.js");

var character_api = _interopRequireWildcard(require("./character_api.js"));

var profile_api = _interopRequireWildcard(require("./profile_api.js"));

var storage_api = _interopRequireWildcard(require("./storage_api.js"));

var utils = _interopRequireWildcard(require("../../shared/js/utils.js"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}
/**
 * Character List API for the Character Page.
 */


var selectedList = null;
/* ------------------------------ Constants and Mappings ------------------------------ */

exports.selectedList = selectedList;
var DIR_TO_FLEX = {
  "left": "flex-start",
  "center": "center",
  "right": "flex-end"
};
exports.DIR_TO_FLEX = DIR_TO_FLEX;
var ATT_TO_NUM = {
  "flame": "1",
  "aqua": "2",
  "forest": "3",
  "light": "4",
  "dark": "5",
  "void": "6"
};
exports.ATT_TO_NUM = ATT_TO_NUM;
var NUM_TO_ATT = {
  "1": "flame",
  "2": "aqua",
  "3": "forest",
  "4": "light",
  "5": "dark",
  "6": "void"
};
exports.NUM_TO_ATT = NUM_TO_ATT;
var NUM_TO_WORD = {
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five"
};
/* ------------------------------ Load and Select Lists ------------------------------ */

/**
 * Loads all the lists.
 */

exports.NUM_TO_WORD = NUM_TO_WORD;

var setLists = function setLists(lists) {
  exports.selectedList = selectedList = {
    listId: list_name_title.getAttribute("listId"),
    list: null
  };
  _character_elements.character_elements.saved_character_lists.innerHTML = "";
  _character_elements.character_elements.list_name_title.innerHTML = "";
  _character_elements.character_elements.list_stats_list.innerHTML = "";
  _character_elements.character_elements.public_list_select.innerHTML = "";

  var _loop = function _loop() {
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
        listId = _Object$entries$_i[0],
        list = _Object$entries$_i[1]; // update the fields of each character.


    Object.entries(list.characterList).forEach(function (_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          display = _ref2[1];

      display._id = key;
      if (display.doppel == "unlocked") display.doppel = true;else if (display.doppel == "locked") display.doppel = false;
      if (display.se === undefined) display.se = "0";
    });
    var div = document.createElement("div");
    div.classList.add("character_list_row");
    var entry = document.createElement("button");
    entry.classList.add("small_btn");
    entry.classList.add("character_list_entry");
    entry.setAttribute("listId", listId);
    entry.innerHTML = list.name;
    entry.addEventListener("click", function () {
      selectList(listId, list, false);
    });
    div.append(entry);

    _character_elements.character_elements.saved_character_lists.append(div);

    _character_elements.character_elements.public_list_select.options.add(new Option(list.name, listId, false));
  };

  for (var _i = 0, _Object$entries = Object.entries(lists); _i < _Object$entries.length; _i++) {
    _loop();
  }

  if (storage_api.user.publicListId) _character_elements.character_elements.public_list_select.value = storage_api.user.publicListId;else _character_elements.character_elements.public_list_select.selectedIndex = -1;

  if (Object.entries(lists).length > 0) {
    if (selectedList && selectedList.listId && lists[selectedList.listId]) {
      selectList(selectedList.listId, lists[selectedList.listId]);
    } else if (storage_api.settings.selected_character_list) {
      selectList(storage_api.settings.selected_character_list, lists[storage_api.settings.selected_character_list]);
    } else {
      var first = Object.entries(lists)[0][0];
      selectList(first, lists[first]);
    } // enable list rename, duplicate and delete buttons


    _character_elements.character_elements.rename_list_button.disabled = false;
    _character_elements.character_elements.duplicate_list_button.disabled = false;
    _character_elements.character_elements.delete_list_button.disabled = false;
  } // disable list rename, duplicate and delete buttons if no list
  else {
    _character_elements.character_elements.rename_list_button.disabled = true;
    _character_elements.character_elements.duplicate_list_button.disabled = true;
    _character_elements.character_elements.delete_list_button.disabled = true;
    _character_elements.character_elements.character_list_content.innerHTML = "";
  }
};
/**
 * Selects the list listId and applies the list.
 * 
 * @param {String} listId 
 * @param {Object} list 
 */


exports.setLists = setLists;

var selectList = function selectList(listId, list) {
  var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (listId && !list) {
    list = storage_api.lists[listId];
  } else if (!listId || !list) {
    var first = Object.entries(storage_api.lists)[0][0];
    listId = first;
    list = storage_api.lists[first];
  }

  var _iterator = _createForOfIteratorHelper(document.querySelectorAll(".character_list_entry")),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var element = _step.value; // element already selected.

      if (element.getAttribute("listId") === listId) {
        if (element.classList.contains("selected")) return;else {
          element.classList.add("selected");
          element.disabled = true;
        }
      } else if (element.classList.contains("selected")) {
        element.classList.remove("selected");
        element.disabled = false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  exports.selectedList = selectedList = {
    listId: listId,
    list: list
  };
  _character_elements.character_elements.list_name_title.innerHTML = list.name;

  _character_elements.character_elements.list_name_title.setAttribute("listId", listId);

  profile_api.setProfile(list.selectedProfile);
  applyProfileToList(listId, list.selectedProfile);
  setPadding(storage_api.settings.padding_top, storage_api.settings.padding_left, storage_api.settings.padding_right, storage_api.settings.padding_bottom);
  applyFilters();
  background_api.setBackground(list.selectedBackground);
  getStats(); // select only if refreshing list, otherwise do not select.

  if (refresh) character_api.findAndSelectDisplay();else character_api.deselectDisplay(true);
  character_api.enableButtons();
  storage_api.updateSettings("selected_character_list", listId);
};
/* ------------------------------ Create and Delete List ------------------------------ */

/**
 * creates a new list.
 */


exports.selectList = selectList;

var createList = function createList() {
  var listName = create_list_name_field.value;

  if (!listName) {
    home_error_text.innerHTML = "The list name must not be empty.";
    return;
  }

  _character_elements.character_elements.create_list_name_field.value = "";

  _character_elements.character_elements.new_list_button.classList.replace("minus", "add");

  _character_elements.character_elements.list_create.style.visibility = "collapse";
  _character_elements.character_elements.list_create.style.display = "none";
  _character_elements.character_elements.list_name_title.innerHTML = listName;
  _character_elements.character_elements.profile_select.value = "0";
  _character_elements.character_elements.character_list_content.innerHTML = "";
  storage_api.createList(listName);
};
/**
 * Renames the list listId with name newName.
 * 
 * @param {String} listId 
 * @param {String} newName 
 */


exports.createList = createList;

var renameList = function renameList(listId, newName) {
  if (listId && newName && newName.length > 0) {
    storage_api.renameList(listId, newName);
    _character_elements.character_elements.rename_list_name_field.value = "";
    _character_elements.character_elements.list_rename.style.visibility = "collapse";
    _character_elements.character_elements.list_rename.style.display = "none";
  }
};
/**
 * Duplicates the list with name newName.
 * 
 * @param {Object} list 
 * @param {String} newName 
 */


exports.renameList = renameList;

var duplicateList = function duplicateList(list, newName) {
  if (list && newName && newName.length > 0) {
    var newCharacterList = {};
    Object.values(list.characterList).forEach(function (value) {
      newCharacterList[generatePushID()] = character_api.sanitizeCharacter(value);
    });
    console.log(newCharacterList);
    if (Object.keys(newCharacterList).length === 0) newCharacterList = false;
    list.characterList = newCharacterList;
    storage_api.duplicateList(list, newName);
    _character_elements.character_elements.duplicate_list_name_field.value = "";
    _character_elements.character_elements.list_duplicate.style.visibility = "collapse";
    _character_elements.character_elements.list_duplicate.style.display = "none";
  }
};
/**
 * Deletes the list listId.
 * 
 * @param {String} listId 
 */


exports.duplicateList = duplicateList;

var deleteList = function deleteList(listId) {
  exports.selectedList = selectedList = null;
  storage_api.updateSettings("selected_character_list", false);
  storage_api.deleteList(listId);
};
/**
 * Updates the list in the database with the list name, characters, and profile.
 */


exports.deleteList = deleteList;

var updateList = function updateList() {
  var listId = getListId();
  var listName = getListName();
  var characterList = {};
  Object.entries(storage_api.lists[listId].characterList).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return characterList[key] = character_api.sanitizeCharacter(value);
  });
  var selectedProfile = profile_api.getSelectedProfileId();
  var selectedBackground = background_api.getSelectedBackground();
  if (!listName) return;
  storage_api.updateList(listId, listName, characterList, selectedProfile, selectedBackground);
};
/* ------------------------------ Get the Selected List ------------------------------ */

/**
 * returns the list name.
 */


exports.updateList = updateList;

var getListName = function getListName() {
  return _character_elements.character_elements.list_name_title.innerText;
};
/**
 * returns the list id.
 */


exports.getListName = getListName;

var getListId = function getListId() {
  return _character_elements.character_elements.list_name_title.getAttribute("listId");
};
/**
 * returns all the character displays in a list.
 * 
 * @param {boolean} keep_id
 */


exports.getListId = getListId;

var getCharacterList = function getCharacterList() {
  var keep_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var characterList = {};
  document.querySelectorAll(".character_display:not(.preview)").forEach(function (child) {
    var id = child.getAttribute("_id") !== "undefined" ? child.getAttribute("_id") : generatePushID();
    characterList[id] = character_api.getCharacterDisplay(child);
    if (!keep_id) delete characterList[id]._id;
  });
  if (Object.keys(characterList).length == 0) characterList = true;
  return characterList;
};
/**
 * checks if the list name exists.
 * 
 * @param {String} listName
 */


exports.getCharacterList = getCharacterList;

var checkListName = function checkListName(listName) {
  if (!listName || listName.length === 0) _character_elements.character_elements.home_error_text.innerHTML = "The list name must not be empty.";else if (storage_api.listExists(listName)) _character_elements.character_elements.home_error_text.innerHTML = "The list name ".concat(listName, " already exists.");else {
    _character_elements.character_elements.home_error_text.innerHTML = "";
    return true;
  }
  return false;
};
/** 
 * returns the selected list.
 */


exports.checkListName = checkListName;

var getSelectedList = function getSelectedList() {
  var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll(".character_list_entry")),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var element = _step2.value;
      if (element.classList.contains("selectedList")) return element.getAttribute("listId");
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return null;
};
/* ------------------------------ Sort Current List ------------------------------ */

/**
 * Applied the profile profileId to list listId and displays the character list.
 * 
 * @param {String} listId 
 * @param {String} profileId 
 */


exports.getSelectedList = getSelectedList;

var applyProfileToList = function applyProfileToList(listId, profileId) {
  var characterList = storage_api.lists[listId].characterList; // modify the list.

  Object.entries(characterList).forEach(function (_ref5) {
    var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
        key = _ref6[0],
        display = _ref6[1];

    display._id = key;

    var character = _character_collection.character_collection.find(function (character) {
      return display.character_id == character.id;
    });

    display.attribute = character.attribute.toLowerCase();
    display.obtainability = character.obtainability;
    display.release_date = new Date(character.release_date + "PST").getTime();
  });
  var rules = storage_api.profiles[profileId].rules;
  if (!rules) rules = profile_api.getSortSettings();
  var groups = createGroups(characterList, rules);
  _character_elements.character_elements.character_list_content.innerHTML = '';
  displayGroups(_character_elements.character_elements.character_list_content, groups);
};
/**
 * Adds the groups to the parent element.
 * 
 * @param {HTMLDivElement} parent 
 * @param {Object} groups 
 */


exports.applyProfileToList = applyProfileToList;

var displayGroups = function displayGroups(parent, groups) {
  Object.entries(groups).forEach(function (_ref7) {
    var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
        key = _ref8[0],
        group = _ref8[1];

    var group_row = document.createElement("div");
    group_row.classList.add("character_row");
    group_row.style.width = "".concat(storage_api.settings.displays_per_row * 122, "px");
    group_row.setAttribute("group", key);
    group_row.style.justifyContent = DIR_TO_FLEX[storage_api.settings.display_alignment];

    if (group instanceof Array) {
      group.forEach(function (display) {
        var character_display = character_api.createDisplay(display, true);
        group_row.appendChild(character_display);
      });
    } else {
      displayGroups(group_row, group);
    }

    parent.appendChild(group_row);
  });
};
/**
 * Create the group and sort order for the characterList and rules.
 * 
 * @param {Object} characterList 
 * @param {Object} rules 
 * 
 * @returns {Object}
 */


exports.displayGroups = displayGroups;

var createGroups = function createGroups(characterList, rules) {
  var groups = [];
  var sorts = []; // parse the rules;

  Object.entries(rules).sort(function (a, b) {
    return a[1].index > b[1].index ? 1 : -1;
  }).forEach(function (_ref9) {
    var _ref10 = (0, _slicedToArray2["default"])(_ref9, 2),
        ruleId = _ref10[0],
        rule = _ref10[1];

    if (rule.state === "group") {
      groups.push(rule);
    } else if (rule.state === "sort") {
      sorts.push({
        prop: rule.type,
        direction: rule.direction,
        isString: false
      });
    }
  });
  if (groups.length === 0) groups = [{
    type: "none"
  }];
  var characterGroups = groupAndSort(Object.values(characterList), groups, sorts);
  return characterGroups;
};
/**
 * Recursively groups the characterList into groups and then sorts.
 * 
 * @param {Array} characterList 
 * @param {Array} rules 
 * @param {Array} sorts 
 * 
 * @returns {Object}
 */


exports.createGroups = createGroups;

var groupAndSort = function groupAndSort(characterList, rules, sorts) {
  if (rules.length == 0) {
    var sorted = characterList;
    sorted.forEach(function (_char) {
      return _char.attribute = ATT_TO_NUM[_char.attribute];
    });
    sorted.sort(function (a, b) {
      return utils.sortArrayBy(a, b, sorts);
    });
    sorted.forEach(function (_char2) {
      return _char2.attribute = NUM_TO_ATT[_char2.attribute];
    });
    return sorted;
  } else {
    var rule = rules[0];
    var groups = group_properties(characterList, rule.type, rule.direction);
    Object.entries(groups).forEach(function (_ref11) {
      var _ref12 = (0, _slicedToArray2["default"])(_ref11, 2),
          key = _ref12[0],
          group = _ref12[1];

      groups[key] = groupAndSort(group, rules.slice(1), sorts);
    });
    return groups;
  }
};
/**
 * adds each display_property to the corresponding group.
 * 
 * @param {character_api.Display[]} display_properties
 * @param {String} group_by
 * @param {Number} group_dir
 * 
 * @returns {Object}
 */


var group_properties = function group_properties(display_properties, group_by, group_dir) {
  var display_groups = {};

  if (group_by == "attribute") {
    if (group_dir == 1) display_groups = {
      "flame": [],
      "aqua": [],
      "forest": [],
      "light": [],
      "dark": [],
      "void": []
    };
    if (group_dir == -1) display_groups = {
      "void": [],
      "dark": [],
      "light": [],
      "forest": [],
      "aqua": [],
      "flame": []
    };
    display_properties.forEach(function (properties) {
      display_groups[properties.attribute].push(properties);
    });
  } else if (group_by == "rank") {
    if (group_dir == 1) display_groups = {
      "one": [],
      "two": [],
      "three": [],
      "four": [],
      "five": []
    };
    if (group_dir == -1) display_groups = {
      "five": [],
      "four": [],
      "three": [],
      "two": [],
      "one": []
    };
    display_properties.forEach(function (properties) {
      display_groups[NUM_TO_WORD[properties.rank]].push(properties);
    });
  } else if (group_by == "post_awaken") {
    if (group_dir == 1) display_groups = {
      "false": [],
      "true": []
    };
    if (group_dir == -1) display_groups = {
      "true": [],
      "false": []
    };
    display_properties.forEach(function (properties) {
      display_groups[properties.post_awaken].push(properties);
    });
  } else if (group_by == "magic") {
    if (group_dir == 1) display_groups = {
      "zero": [],
      "one": [],
      "two": [],
      "three": []
    };
    if (group_dir == -1) display_groups = {
      "three": [],
      "two": [],
      "one": [],
      "zero": []
    };
    display_properties.forEach(function (properties) {
      display_groups[NUM_TO_WORD[properties.magic]].push(properties);
    });
  } else if (group_by == "magia") {
    if (group_dir == 1) display_groups = {
      "one": [],
      "two": [],
      "three": [],
      "four": [],
      "five": []
    };
    if (group_dir == -1) display_groups = {
      "five": [],
      "four": [],
      "three": [],
      "two": [],
      "one": []
    };
    display_properties.forEach(function (properties) {
      display_groups[NUM_TO_WORD[properties.magia]].push(properties);
    });
  } else if (group_by == "episode") {
    if (group_dir == 1) display_groups = {
      "one": [],
      "two": [],
      "three": [],
      "four": [],
      "five": []
    };
    if (group_dir == -1) display_groups = {
      "five": [],
      "four": [],
      "three": [],
      "two": [],
      "one": []
    };
    display_properties.forEach(function (properties) {
      display_groups[NUM_TO_WORD[properties.episode]].push(properties);
    });
  } else if (group_by == "doppel") {
    if (group_dir == 1) display_groups = {
      "false": [],
      "true": []
    };
    if (group_dir == -1) display_groups = {
      "true": [],
      "false": []
    };
    display_properties.forEach(function (properties) {
      display_groups[properties.doppel].push(properties);
    });
  } else if (group_by == "obtainability") {
    if (group_dir == 1) display_groups = {
      "unlimited": [],
      "limited": []
    };
    if (group_dir == -1) display_groups = {
      "limited": [],
      "unlimited": []
    };
    display_properties.forEach(function (properties) {
      display_groups[properties.obtainability].push(properties);
    });
  } else if (group_by == "none") {
    display_groups = {
      "none": []
    };
    display_properties.forEach(function (properties) {
      display_groups.none.push(properties);
    });
  }

  return display_groups;
};
/* ------------------------------ Display Settings ------------------------------ */

/**
 * Sets the displays per character row.
 * 
 * @param {Number} displays 
 */


var changeDisplaysPerRow = function changeDisplaysPerRow(displays) {
  storage_api.settings.displays_per_row = displays;
  document.querySelectorAll(".character_row").forEach(function (character_row) {
    character_row.style.width = "".concat(displays * 122, "px");
  });
};
/**
 * Sets the alignment of the character rows.
 * 
 * @param {String} alignment 
 */


exports.changeDisplaysPerRow = changeDisplaysPerRow;

var changeAlignment = function changeAlignment(alignment) {
  storage_api.settings.display_alignment = alignment;
  storage_api.updateSettings("display_alignment", alignment);
  document.querySelectorAll(".character_row").forEach(function (character_row) {
    character_row.style.justifyContent = DIR_TO_FLEX[alignment];
  });
};
/**
 * Changes the padding in the direction.
 * 
 * @param {String} direction 
 * @param {Number} padding 
 */


exports.changeAlignment = changeAlignment;

var changePadding = function changePadding(direction, padding) {
  storage_api.settings["padding_".concat(direction)] = padding;
  setPadding(storage_api.settings.padding_top, storage_api.settings.padding_left, storage_api.settings.padding_right, storage_api.settings.padding_bottom);
};
/**
 * Sets the padding of the list.
 * 
 * @param {Number} top 
 * @param {Number} left 
 * @param {Number} right 
 * @param {Number} bottom 
 */


exports.changePadding = changePadding;

var setPadding = function setPadding(top, left, right, bottom) {
  _character_elements.character_elements.character_list_content.style.padding = "".concat(top, "px ").concat(right, "px ").concat(bottom, "px ").concat(left, "px");
};
/* ------------------------------ List Zoom ------------------------------ */

/**
 * changes the zoom of the character list.
 * 
 * @param {Number} zoom 
 */


exports.setPadding = setPadding;

var changeZoom = function changeZoom(zoom) {
  storage_api.updateSettings("character_zoom", zoom);
  setZoom(zoom);
};
/**
 * sets the zoom of the character list.
 * 
 * @param {Number} zoom 
 */


exports.changeZoom = changeZoom;

var setZoom = function setZoom(zoom) {
  _character_elements.character_elements.character_list_content.style.zoom = zoom / 100;
};
/**
 * sets the zoom of the character list to fit.
 */


exports.setZoom = setZoom;

var zoom_fit = function zoom_fit() {
  if (_character_elements.character_elements.character_list_content.innerHTML) {
    var row = _character_elements.character_elements.character_list_content.querySelector(".character_row");

    var list_width = row.clientWidth;

    var list_height = row.clientHeight * _character_elements.character_elements.character_list_content.querySelectorAll(".character_row").length;

    var container_width = _character_elements.character_elements.character_list_content.clientWidth;
    var container_height = _character_elements.character_elements.character_list_content.clientHeight;
    var ratio = Math.min((container_width - 40) / list_width, (container_height - 40) / list_height);
    console.log(ratio);
    ratio = ratio < 1 ? ratio : 1;
    _character_elements.character_elements.character_list_content.style.zoom = ratio;
    _character_elements.character_elements.zoom_range.value = Math.round(ratio * 100);
    _character_elements.character_elements.zoom_field.value = Math.round(ratio * 100);
  }
};
/* ------------------------------ List Filters ------------------------------ */

/**
 * Creates a new filter.
 * 
 * @param {HTMLDivElement} next optional 
 */


exports.zoom_fit = zoom_fit;

var createFilter = function createFilter() {
  var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var new_filter = document.createElement("div");
  new_filter.classList.add("filter_row");
  new_filter.innerHTML = "\n      <select class=\"state_select collapse form_input\">\n        <option value=\"and\">And</option>\n        <option value=\"or\">Or</option>\n      </select>\n      <select class=\"type_select form_input\">\n        <option value=\"attribute\">Attribute</option>\n        <option value=\"rank\">Rank</option>\n        <option value=\"post_awaken\">Post Awaken</option>\n        <option value=\"min_rank\">Min Rank</option>\n        <option value=\"max_rank\">Max Rank</option>\n        <option value=\"level\">Level</option>\n        <option value=\"magic\">Magic</option>\n        <option value=\"magia\">Magia</option>\n        <option value=\"episode\">Episode</option>\n        <option value=\"doppel\">Doppel</option>\n        <option value=\"se\">SE</option>\n        <option value=\"obtainability\">Obtainability</option>\n        <option value=\"release_date\">Release Date</option>\n      </select>\n      <div class=\"filter_type attribute_filter hidden\">\n        <select class=\"filter_field equality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n        </select>\n        <select class=\"filter_field attribute_select form_input\">\n          <option value=\"dark\">Dark</option>\n          <option value=\"flame\">Flame</option>\n          <option value=\"light\">Light</option>\n          <option value=\"forest\">Forest</option>\n          <option value=\"void\">Void</option>\n          <option value=\"aqua\">Aqua</option>\n        </select>\n      </div>\n      <div class=\"filter_type rank_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <select class=\"filter_field rank_select form_input\">\n          <option value=\"1\">1</option>\n          <option value=\"2\">2</option>\n          <option value=\"3\">3</option>\n          <option value=\"4\">4</option>\n          <option value=\"5\">5</option>\n        </select>\n      </div>\n      <div class=\"filter_type post_awaken_filter hidden\">\n        <select class=\"filter_field equality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n        </select>\n        <select class=\"filter_field post_awaken_select form_input\">\n          <option value=\"false\">No</option>\n          <option value=\"true\">Yes</option>\n        </select>\n      </div>\n      <div class=\"filter_type min_rank_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <select class=\"filter_field min_rank_select form_input\">\n          <option value=\"1\">1</option>\n          <option value=\"2\">2</option>\n          <option value=\"3\">3</option>\n          <option value=\"4\">4</option>\n          <option value=\"5\">5</option>\n        </select>\n      </div>\n      <div class=\"filter_type max_rank_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <select class=\"filter_field max_rank_select form_input\">\n          <option value=\"1\">1</option>\n          <option value=\"2\">2</option>\n          <option value=\"3\">3</option>\n          <option value=\"4\">4</option>\n          <option value=\"5\">5</option>\n        </select>\n      </div>\n      <div class=\"filter_type level_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <input class=\"filter_field level_input form_input\" type=\"number\" value=1 maxlength=\"3\" size=3 min=1 max=100>\n      </div>\n      <div class=\"filter_type magic_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <select class=\"filter_field magic_select form_input\">\n          <option value=\"0\">0</option>\n          <option value=\"1\">1</option>\n          <option value=\"2\">2</option>\n          <option value=\"3\">3</option>\n        </select>\n      </div>\n      <div class=\"filter_type magia_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <select class=\"filter_field magia_select form_input\">\n          <option value=\"1\">1</option>\n          <option value=\"2\">2</option>\n          <option value=\"3\">3</option>\n          <option value=\"4\">4</option>\n          <option value=\"5\">5</option>\n        </select>\n      </div>\n      <div class=\"filter_type episode_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <select class=\"filter_field episode_select form_input\">\n          <option value=\"1\">1</option>\n          <option value=\"2\">2</option>\n          <option value=\"3\">3</option>\n          <option value=\"4\">4</option>\n          <option value=\"5\">5</option>\n        </select>\n      </div>\n      <div class=\"filter_type doppel_filter hidden\">\n        <select class=\"filter_field equality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n        </select>\n        <select class=\"filter_field doppel_select form_input\">\n          <option value=\"false\">No</option>\n          <option value=\"true\">Yes</option>\n        </select>\n      </div>\n      <div class=\"filter_type se_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n        <option value=\"eq\">=</option>\n        <option value=\"neq\">=/=</option>\n        <option value=\"lt\">&lt</option>\n        <option value=\"gt\">&gt</option>\n        <option value=\"lte\">&lt=</option>\n        <option value=\"gte\">&gt=</option>\n        </select>\n        <input class=\"filter_field se_input form_input\" type=\"number\" value=0 maxlength=\"3\" size=3 min=0 max=100>\n      </div>\n      <div class=\"filter_type obtainability_filter hidden\">\n        <select class=\"filter_field equality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n        </select>\n        <select class=\"filter_field obtainability_select form_input\">\n          <option value=\"unlimited\">Unlimited</option>\n          <option value=\"limited\">Limited</option>\n        </select>\n      </div>\n      <div class=\"filter_type release_date_filter hidden\">\n        <select class=\"filter_field inequality form_input\">\n          <option value=\"eq\">=</option>\n          <option value=\"neq\">=/=</option>\n          <option value=\"lt\">&lt</option>\n          <option value=\"gt\">&gt</option>\n          <option value=\"lte\">&lt=</option>\n          <option value=\"gte\">&gt=</option>\n        </select>\n        <input type=\"date\" class=\"filter_field release_date_select form_input\">\n      </div>\n      <button class=\"create small_btn\" title=\"Add New Filter Above\">+</button>\n      <button class=\"delete small_btn\" title=\"Delete Filter\"></button>\n    ";
  new_filter.querySelector(".type_select").selectedIndex = -1;
  new_filter.querySelector(".type_select").addEventListener("change", function () {
    var type = new_filter.querySelector(".type_select").value;
    new_filter.querySelectorAll(".filter_type").forEach(function (filter) {
      if (!filter.classList.contains("hidden") && !filter.classList.contains(".".concat(type, "_filter"))) filter.classList.add("hidden");
    });
    var filter_type = new_filter.querySelector(".".concat(type, "_filter"));
    filter_type.classList.remove("hidden");
  });
  new_filter.querySelector(".create").addEventListener("click", function () {
    createFilter(new_filter);
  });
  new_filter.querySelector(".delete").addEventListener("click", function () {
    new_filter.remove();

    if (list_filters.children.length > 0) {
      var first = list_filters.children[0].querySelector(".state_select");
      if (_character_elements.character_elements.list_filters.children.length >= 1 && !first.classList.contains("collapse")) first.classList.add("collapse");
    } else {
      if (!_character_elements.character_elements.toggle_filter_button.classList.contains("hidden")) {
        _character_elements.character_elements.toggle_filter_button.classList.add("hidden");

        if (_character_elements.character_elements.toggle_filter_button.classList.contains("add")) _character_elements.character_elements.toggle_filter_button.classList.remove("add");
        if (_character_elements.character_elements.toggle_filter_button.classList.contains("minus")) _character_elements.character_elements.toggle_filter_button.classList.remove("minus");
      }
    }

    getFilters();
  });

  if (_character_elements.character_elements.toggle_filter_button.classList.contains("hidden")) {
    _character_elements.character_elements.toggle_filter_button.classList.remove("hidden");

    _character_elements.character_elements.toggle_filter_button.classList.add("minus");
  } else {
    if (_character_elements.character_elements.toggle_filter_button.classList.contains("add")) {
      _character_elements.character_elements.toggle_filter_button.classList.replace("add", "minus");

      if (_character_elements.character_elements.list_filters.classList.contains("hidden")) _character_elements.character_elements.list_filters.classList.remove("hidden");
    }
  }

  if (list_filters.children.length > 0) new_filter.querySelector(".state_select").classList.remove("collapse");

  if (next != null) {
    _character_elements.character_elements.list_filters.insertBefore(new_filter, next);

    if (!_character_elements.character_elements.list_filters.children[0].querySelector(".state_select").classList.contains("collapse")) _character_elements.character_elements.list_filters.children[0].querySelector(".state_select").classList.add("collapse");
    if (next.querySelector(".state_select").classList.contains("collapse")) next.querySelector(".state_select").classList.remove("collapse");
  } else _character_elements.character_elements.list_filters.append(new_filter);
};
/**
 * Returns the filters.
 * 
 * @returns {Array}
 */


exports.createFilter = createFilter;

var getFilters = function getFilters() {
  var filters = [];

  var _loop2 = function _loop2() {
    var list_filter_row = _Array$from[_i2];
    var element = Array.from(list_filter_row.children).find(function (child) {
      return !child.classList.contains("hidden") && child.classList.contains("filter_type") ? 1 : 0;
    });
    var state = list_filter_row.querySelector(".state_select").value;
    if (list_filter_row.querySelector(".state_select").classList.contains("collapse")) state = "none";
    var filter = {};

    try {
      filter = {
        type: element.classList[1],
        state: state,
        value: []
      };
    } catch (_unused) {
      return "continue";
    }

    Array.from(element.children).forEach(function (child) {
      filter.value.push({
        param: child.classList[1].replace("_select", "").replace("_input", ""),
        value: child.value
      });
    });
    filters.push(filter);
  };

  for (var _i2 = 0, _Array$from = Array.from(_character_elements.character_elements.list_filters.children); _i2 < _Array$from.length; _i2++) {
    var _ret = _loop2();

    if (_ret === "continue") continue;
  }

  return filters;
};
/**
 * Applies the filters.
 * 
 * @param {Array} filters 
 */


exports.getFilters = getFilters;

var applyFilters = function applyFilters() {
  var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getFilters(); // if no filters, then show everything.

  if (filters.length == 0) {
    Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_row")).forEach(function (character_row) {
      if (character_row.classList.contains("hidden")) {
        character_row.classList.remove("hidden");
        character_row.style.display = "flex";
      }
    });
    Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_display")).forEach(function (character_display_element) {
      if (character_display_element.classList.contains("hidden")) {
        _character_elements.character_elements.character_display_element.classList.remove("hidden");

        character_display_element.style.display = "flex";
      }
    });
    return;
  }

  Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_display")).forEach(function (character_display_element) {
    var character_display = character_api.getCharacterDisplay(character_display_element);

    if (matchesAllFilters(character_display, filters)) {
      if (character_display_element.classList.contains("hidden")) {
        character_display_element.classList.remove("hidden");
        character_display_element.style.display = "flex";
      }
    } else {
      if (!character_display_element.classList.contains("hidden")) {
        character_display_element.classList.add("hidden");
        character_display_element.style.display = "none";
      }
    }
  });
  Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_row")).forEach(function (character_row) {
    // hide the row all children are hidden character_list.
    if (Array.from(character_row.querySelectorAll(".character_display")).every(function (child) {
      return child.classList.contains("hidden");
    })) {
      if (!character_row.classList.contains("hidden")) {
        character_row.classList.add("hidden");
        character_row.style.display = "none";
      }
    } else {
      if (character_row.classList.contains("hidden")) {
        character_row.classList.remove("hidden");
        character_row.style.display = "flex";
      }
    }
  });

  if (Array.from(character_list_content.querySelectorAll(".character_display")).every(function (child) {
    return child.classList.contains("hidden");
  })) {
    if (!_character_elements.character_elements.character_list_content.classList.contains("hidden")) _character_elements.character_elements.character_list_content.classList.add("hidden");
  } else {
    if (_character_elements.character_elements.character_list_content.classList.contains("hidden")) _character_elements.character_elements.character_list_content.classList.remove("hidden");
  }
};
/**
 * Check if character display matches all the filters.
 * 
 * @param {character_api.Display} character_display
 * @param {Array} filters
 * 
 * @returns {boolean}
 */


exports.applyFilters = applyFilters;

var matchesAllFilters = function matchesAllFilters(character_display, filters) {
  var matches = Array(filters.length).fill(true);
  var result = [];
  filters.forEach(function (filter, i) {
    matches[i] = matchesFilter(character_display, filter.value);
    if (i == 0 || filter.state === "or") result.push(matches[i]);else if (filter.state === "and") {
      var prev = result.pop();
      result.push(prev && matches[i]);
    }
  });
  return result.some(function (value) {
    return value;
  });
};
/**
 * Check if the character display matches the filter.
 * 
 * @param {character_api.Display} character_display 
 * @param {Array} filter 
 */


var matchesFilter = function matchesFilter(character_display, filter) {
  if (filter[0].param === "equality") {
    if (filter[1].param === "obtainability") {
      var obtainability = _character_collection.character_collection.find(function (character) {
        return character_display.character_id == character.id;
      }).obtainability;

      if (filter[0].value === "eq" && obtainability === filter[1].value) return true;else if (filter[0].value === "neq" && obtainability !== filter[1].value) return true;else return false;
    } else {
      if (filter[0].value === "eq" && character_display[filter[1].param] === filter[1].value) return true;else if (filter[0].value === "neq" && character_display[filter[1].param] !== filter[1].value) return true;else return false;
    }
  } else {
    if (filter[1].param === "release_date") {
      var release_date = new Date(_character_collection.character_collection.find(function (character) {
        return character_display.character_id == character.id;
      }).release_date + "PST");
      var filter_date = new Date(filter[1].value + "PST");
      if (filter[0].value === "eq" && release_date.getTime() === filter_date.getTime()) return true;else if (filter[0].value === "neq" && release_date.getTime() !== filter_date.getTime()) return true;else if (filter[0].value === "lt" && release_date < filter_date) return true;else if (filter[0].value === "gt" && release_date > filter_date) return true;else if (filter[0].value === "lte" && release_date <= filter_date) return true;else if (filter[0].value === "gte" && release_date >= filter_date) return true;else return false;
    } else {
      var param = 1;

      if (filter[1].param === "max_rank") {
        param = parseInt(character_api.getMaxRank(_character_collection.character_collection.find(function (character) {
          return character_display.character_id == character.id;
        }).ranks));
      } else if (filter[1].param === "min_rank") {
        param = parseInt(character_api.getMinRank(_character_collection.character_collection.find(function (character) {
          return character_display.character_id == character.id;
        }).ranks));
      } else {
        param = parseInt(character_display[filter[1].param]);
      }

      if (filter[0].value === "eq" && param === parseInt(filter[1].value)) return true;else if (filter[0].value === "neq" && param !== parseInt(filter[1].value)) return true;else if (filter[0].value === "lt" && param < parseInt(filter[1].value)) return true;else if (filter[0].value === "gt" && param > parseInt(filter[1].value)) return true;else if (filter[0].value === "lte" && param <= parseInt(filter[1].value)) return true;else if (filter[0].value === "gte" && param >= parseInt(filter[1].value)) return true;else return false;
    }
  }
};
/**
 * Removes all the filters.
 */


var resetFilters = function resetFilters() {
  Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_row")).forEach(function (character_row) {
    if (character_row.classList.contains("hidden")) {
      character_row.classList.remove("hidden");
      character_row.style.display = "flex";
    }
  });
  Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_display")).forEach(function (character_display_element) {
    if (character_display_element.classList.contains("hidden")) {
      character_display_element.classList.remove("hidden");
      character_display_element.style.display = "flex";
    }
  });
  if (_character_elements.character_elements.character_list_content.classList.contains("hidden")) _character_elements.character_elements.character_list_content.classList.remove("hidden");
  _character_elements.character_elements.list_filters.innerHTML = "";
  if (_character_elements.character_elements.toggle_filter_button.classList.contains("add")) _character_elements.character_elements.toggle_filter_button.classList.remove("add");
  if (_character_elements.character_elements.toggle_filter_button.classList.contains("minus")) _character_elements.character_elements.toggle_filter_button.classList.remove("minus");
  if (!_character_elements.character_elements.toggle_filter_button.classList.contains("hidden")) _character_elements.character_elements.toggle_filter_button.classList.add("hidden");
};
/* ------------------------------ List Stats ------------------------------ */

/**
 * Returns the simple stats of the list.
 * 
 * @returns {Object}
 */


exports.resetFilters = resetFilters;

var getStats = function getStats() {
  var result = {
    totalCharacters: 0,
    totalVisible: 0
  };
  Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_display")).forEach(function (character_display_element) {
    result.totalCharacters++;

    if (!character_display_element.classList.contains("hidden")) {
      result.totalVisible++;
    }
  });
  _character_elements.character_elements.list_stats_list.innerHTML = "Visible: ".concat(result.totalVisible, "/").concat(result.totalCharacters);
  return result;
};
/**
 * Returns all the stats of the list.
 * 
 * @returns {Object}
 */


exports.getStats = getStats;

var getMoreStats = function getMoreStats() {
  var result = {
    totalCharacters: 0,
    totalVisible: 0,
    limited: 0,
    maxLevel: 0,
    levels: {},
    maxRank: 0,
    ranks: {},
    maxMagic: 0,
    magics: {},
    maxMagia: 0,
    magias: {},
    maxEpisode: 0,
    episodes: {},
    rankCopies: {},
    ses: {},
    maxSe: 0
  };
  Array.from(_character_elements.character_elements.character_list_content.querySelectorAll(".character_display")).forEach(function (character_display_element) {
    result.totalCharacters++;

    if (!character_display_element.classList.contains("hidden")) {
      result.totalVisible++;
      var character_display = character_api.getCharacterDisplay(character_display_element);

      var character = _character_collection.character_collection.find(function (character) {
        return character_display.character_id == character.id;
      });

      if (character.obtainability == "limited") result.limited++;
      if (character_display.rank == 1 && character_display.level == 40) result.maxLevel++;else if (character_display.rank == 2 && character_display.level == 50) result.maxLevel++;else if (character_display.rank == 3 && character_display.level == 60) result.maxLevel++;else if (character_display.rank == 4 && character_display.level == 80) result.maxLevel++;else if (character_display.rank == 5 && character_display.level == 100) result.maxLevel++;
      var maxRank = character_api.getMaxRank(character.ranks);
      if (character_display.rank == maxRank) result.maxRank++;
      if (character_display.magic == "3") result.maxMagic++;
      if (character_display.magia == "5") result.maxMagia++;
      if (character_display.episode == "5") result.maxEpisode++;
      result.ranks[character_display.rank] = result.ranks[character_display.rank] + 1 || 1;
      result.levels[character_display.level] = result.levels[character_display.level] + 1 || 1;
      result.magics[character_display.magic] = result.magics[character_display.magic] + 1 || 1;
      result.magias[character_display.magia] = result.magias[character_display.magia] + 1 || 1;
      result.episodes[character_display.episode] = result.episodes[character_display.episode] + 1 || 1;
      var minRank = character_api.getMinRank(character.ranks);
      var totalCopies = 0;
      if (minRank == 1) totalCopies = 10 * parseInt(character_display.magic) + 1;else if (minRank == 2) totalCopies = 10 * parseInt(character_display.magic) + 1;else if (minRank == 3) totalCopies = 3 * parseInt(character_display.magic) + 1;else if (minRank == 4) totalCopies = 1 * parseInt(character_display.magic) + 1;
      result.rankCopies[minRank] = result.rankCopies[minRank] ? result.rankCopies[minRank] + totalCopies : totalCopies;
      if (character_display.se == "60") result.maxSe++;
      result.ses[character_display.se] = result.ses[character_display.se] + 1 || 1;
    }
  });
  return "Total Characters: ".concat(result.totalCharacters, "\nTotal Visible: ").concat(result.totalVisible, "\nLimited: ").concat(result.limited, "\nUnlimited: ").concat(result.totalVisible - result.limited, "      \nMax Level: ").concat(result.maxLevel, "\nMax Rank: ").concat(result.maxRank, "\nMax Magic: ").concat(result.maxMagic, "\nMax Magia: ").concat(result.maxMagia, "\nMax Episode: ").concat(result.maxEpisode, "      \nMax Spirit Enhancement: ").concat(result.maxSe, "      \nLevels:").concat(Object.entries(result.levels).map(function (_ref13) {
    var _ref14 = (0, _slicedToArray2["default"])(_ref13, 2),
        level = _ref14[0],
        count = _ref14[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString(), "      \nRanks:").concat(Object.entries(result.ranks).map(function (_ref15) {
    var _ref16 = (0, _slicedToArray2["default"])(_ref15, 2),
        level = _ref16[0],
        count = _ref16[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString(), "      \nMagic Levels:").concat(Object.entries(result.magics).map(function (_ref17) {
    var _ref18 = (0, _slicedToArray2["default"])(_ref17, 2),
        level = _ref18[0],
        count = _ref18[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString(), "      \nMagia Levels:").concat(Object.entries(result.magias).map(function (_ref19) {
    var _ref20 = (0, _slicedToArray2["default"])(_ref19, 2),
        level = _ref20[0],
        count = _ref20[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString(), "      \nEpisode Levels:").concat(Object.entries(result.episodes).map(function (_ref21) {
    var _ref22 = (0, _slicedToArray2["default"])(_ref21, 2),
        level = _ref22[0],
        count = _ref22[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString(), "      \nSpirit Enhancement Levels:").concat(Object.entries(result.ses).map(function (_ref23) {
    var _ref24 = (0, _slicedToArray2["default"])(_ref23, 2),
        level = _ref24[0],
        count = _ref24[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString(), "      \nCopies of Each Rank:").concat(Object.entries(result.rankCopies).map(function (_ref25) {
    var _ref26 = (0, _slicedToArray2["default"])(_ref25, 2),
        level = _ref26[0],
        count = _ref26[1];

    return "\n  ".concat(level, ": ").concat(count);
  }).toString());
};
/**
 * Opens the Message Dialog with the list stats.
 */


exports.getMoreStats = getMoreStats;

var openStatsModal = function openStatsModal() {
  _character_elements.messageDialog.open("Stats of \"".concat(getListName(), "\""), getMoreStats());
};
/* ------------------------------ Import and Export ------------------------------ */

/**
 * Opens the Export Modal Dialog.
 */


exports.openStatsModal = openStatsModal;

var openExportModal = function openExportModal() {
  var list = Object.values(storage_api.lists[getListId()].characterList).map(function (value) {
    return character_api.sanitizeCharacter(value);
  }).sort(function (a, b) {
    return a.character_id > b.character_id ? 1 : -1;
  });

  _character_elements.messageDialog.open("\"".concat(selectedList.list.name, "\" Export as Text"), JSON.stringify(list, null, 2));
};
/**
 * Imports the list.
 */


exports.openExportModal = openExportModal;

var importList = function importList() {
  var data = _character_elements.importListDialog.text.value;
  var listName = _character_elements.importListDialog.name.value;

  if (!listName) {
    _character_elements.importListDialog.error.innerHTML = "The list name must not be empty.";
    return;
  }

  if (storage_api.listExists(listName)) {
    _character_elements.importListDialog.error.innerHTML = "The list name ".concat(listName, " already exists.");
    return;
  }

  _character_elements.importListDialog.error.innerHTML = "";

  try {
    var characterList = JSON.parse(data);

    if (validateCharacterList(characterList)) {
      _character_elements.character_elements.list_name_title.innerHTML = listName;
      _character_elements.character_elements.profile_select.value = "Default";
      _character_elements.character_elements.character_list_content.innerHTML = "";
      var newCharacterList = {};
      Object.entries(characterList).forEach(function (_ref27) {
        var _ref28 = (0, _slicedToArray2["default"])(_ref27, 2),
            key = _ref28[0],
            value = _ref28[1];

        return newCharacterList[generatePushID()] = character_api.sanitizeCharacter(value);
      });
      storage_api.manualCreateList(listName, newCharacterList, "0", false);

      _character_elements.importListDialog.close();
    } else {
      _character_elements.importListDialog.error.innerHTML = "The format of the JSON is invalid. Please contact Leo Chan for details.";
      return;
    }
  } catch (e) {
    _character_elements.importListDialog.error.innerHTML = "The format of the JSON is invalid. Please contact Leo Chan for details. " + e;
    return;
  }
};
/**
 * Checks if the character list is valid.
 * 
 * @param {HTMLDivElement[]} character_list
 * 
 * @returns {boolean}
 */


exports.importList = importList;

var validateCharacterList = function validateCharacterList(character_list) {
  try {
    if (Array.from(character_list).every(function (character) {
      var errors = character_api.isValidCharacterDisplay(character.character_id, character, false);
      if (errors.length > 0) console.log(errors, character);
      return errors.length === 0;
    })) return true;
  } catch (e) {
    return false;
  }

  return false;
};

},{"../../collection/character_collection.js":9,"../../shared/js/utils.js":13,"./background_api.js":1,"./character_api.js":2,"./character_elements.js":3,"./profile_api.js":6,"./storage_api.js":7,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/slicedToArray":29,"@babel/runtime/helpers/typeof":31}],5:[function(require,module,exports){
"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

var character_api = _interopRequireWildcard(require("./character_api.js"));

var character_list_api = _interopRequireWildcard(require("./character_list_api.js"));

var background_api = _interopRequireWildcard(require("./background_api.js"));

var profile_api = _interopRequireWildcard(require("./profile_api.js"));

var storage_api = _interopRequireWildcard(require("./storage_api.js"));

var database_api = _interopRequireWildcard(require("../../shared/js/database_api.js"));

var utils = _interopRequireWildcard(require("../../shared/js/utils.js"));

var functions = _interopRequireWildcard(require("../../shared/js/functions.js"));

var _character_elements = require("./character_elements.js");

var _dialog = require("../../shared/js/dialog.js");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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
/**
 * Event Handlers for the Character Page.
 */


(function () {
  "use strict";

  window.onload = function () {
    /* ============================== Content ============================== */

    /* ------------------------------ Header Buttons ------------------------------ */
    // sign out button.
    _character_elements.character_elements.signout_button.addEventListener("click", function () {
      var res = confirm("Are you sure you want to Sign Out?");
      if (res) database_api.signout();
    }); // contact button.


    _character_elements.character_elements.contact_button.addEventListener("click", function () {
      new _dialog.ContactDialog();
    }); // theme toggle button.


    _character_elements.character_elements.theme_button.addEventListener("click", function () {
      var theme = "light";
      if (_character_elements.character_elements.theme_button.classList.contains("dark")) theme = "dark";else if (_character_elements.character_elements.theme_button.classList.contains("light")) theme = "light";
      storage_api.updateSettings("theme", theme);
    }); // verify email button


    _character_elements.character_elements.verify_email_button.addEventListener("click", function () {
      database_api.sendEmailVerification(function () {
        _character_elements.character_elements.verify_email_success.classList.remove("hidden");

        _character_elements.character_elements.verify_email_success.innerHTML = "A email verification email has been sent to your email. If you do not see an email, please check the Junk or Spam folder.";
      }, function (errorMsg) {
        _character_elements.character_elements.verify_email_error.classList.remove("hidden");

        _character_elements.character_elements.verify_email_error.innerHTML = errorMsg;
      });
    });

    _character_elements.character_elements.verify_email_close.addEventListener("click", function () {
      _character_elements.character_elements.verify_email.classList.add("hidden");
    });
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
        [_character_elements.messageDialog, _character_elements.characterSelectDialog, _character_elements.backgroundSelectDialog, _character_elements.importListDialog].forEach(function (dialog) {
          if (event.target == dialog.modal && dialog.isOpen()) dialog.close();
        });
      }
    });
    window.addEventListener("keyup", function (e) {
      if (e.key === "Escape") {
        [_character_elements.messageDialog, _character_elements.characterSelectDialog, _character_elements.backgroundSelectDialog, _character_elements.importListDialog].forEach(function (dialog) {
          if (e.target == dialog.modal && dialog.isOpen()) return dialog.close();
        });

        if (character_api.selectedCharacter) {
          character_api.deselectDisplay();
        }
      }
    });
    /* ------------------------------ Message Modal Dialog ------------------------------ */
    // hide message modal dialog

    _character_elements.messageDialog.closeButton.addEventListener("click", function () {
      _character_elements.messageDialog.close();
    }); // message modal dialog copy button.


    _character_elements.messageDialog.copy.addEventListener("click", function () {
      navigator.clipboard.writeText(_character_elements.messageDialog.text.value);
    });
    /* ------------------------------ Character Select Modal Dialog ------------------------------ */
    // hide character select modal dialog


    _character_elements.characterSelectDialog.closeButton.addEventListener("click", function () {
      _character_elements.characterSelectDialog.close();
    }); // search change character select modal dialog.


    ["keyup", "change", "search"].forEach(function (event) {
      _character_elements.characterSelectDialog.search.addEventListener(event, function () {
        character_api.filterCharacters(_character_elements.characterSelectDialog.search.value);
      });
    });

    _character_elements.characterSelectDialog.added.addEventListener("click", function () {
      character_api.toggleAdded(_character_elements.characterSelectDialog.added.checked);
    });
    /* ------------------------------ Background Select Modal Dialog ------------------------------ */
    // hide background select modal dialog


    _character_elements.backgroundSelectDialog.closeButton.addEventListener("click", function () {
      _character_elements.backgroundSelectDialog.close();
    }); // search change background select modal dialog.


    ["keyup", "change", "search"].forEach(function (event) {
      _character_elements.backgroundSelectDialog.search.addEventListener(event, function () {
        background_api.filterBackgrounds(_character_elements.backgroundSelectDialog.search.value);
      });
    });
    /* ------------------------------ Import List Modal Dialog ------------------------------ */
    // hide import list modal dialog

    _character_elements.importListDialog.closeButton.addEventListener("click", function () {
      _character_elements.importListDialog.close();
    }); // import the text as a new list.


    _character_elements.importListDialog.importButton.addEventListener("click", function () {
      character_list_api.importList();
    });
    /* ============================== Menu Bar ============================== */

    /* ------------------------------ Tabs ------------------------------ */
    // toggle visibility of the tab when heading clicked.


    document.querySelectorAll(".tab_header").forEach(function (element) {
      element.addEventListener("click", function () {
        var contents = element.parentElement.querySelector(".tab_contents");
        var toggle = element.querySelector(".tab_toggle");
        var tab_name = element.querySelector(".tab_heading").getAttribute("tab_name");

        if (!contents.classList.contains("hidden")) {
          contents.classList.add("hidden");
          toggle.classList.replace("down", "right");
          storage_api.updateSettings("expanded_tabs/".concat(tab_name), false);
        } else if (contents.classList.contains("hidden")) {
          contents.classList.remove("hidden");
          toggle.classList.replace("right", "down");
          storage_api.updateSettings("expanded_tabs/".concat(tab_name), true);
        }
      });
    });
    /* ------------------------------ My Character Lists Tab ------------------------------ */
    // show or hide the create new list form, rename list form, and duplicate list form.

    [_character_elements.character_elements.new_list_button, _character_elements.character_elements.rename_list_button, _character_elements.character_elements.duplicate_list_button].forEach(function (button) {
      button.addEventListener("click", function () {
        var list_form = document.querySelector("#list_".concat(button.name));
        document.querySelectorAll(".list_form").forEach(function (element) {
          if (element !== list_form) {
            if (element.style.visibility === "visible") element.style.visibility = "collapse";
            if (element.style.display === "block") element.style.display = "none";
          }
        });

        if (list_form.style.display === "none") {
          list_form.style.visibility = "visible";
          list_form.style.display = "block";
          document.querySelector("#".concat(button.name, "_list_name_field")).focus();
        } else {
          list_form.style.visibility = "collapse";
          list_form.style.display = "none";
        }
      });
    }); // create a new list.

    _character_elements.character_elements.create_list_create_button.addEventListener("click", function (e) {
      e.preventDefault();
      var newName = _character_elements.character_elements.create_list_name_field.value;
      if (character_list_api.checkListName(newName)) character_list_api.createList(newName);
    }); // rename the selected list.


    _character_elements.character_elements.rename_list_create_button.addEventListener("click", function (e) {
      e.preventDefault();
      var newName = _character_elements.character_elements.rename_list_name_field.value;
      if (character_list_api.checkListName(newName)) character_list_api.renameList(character_list_api.selectedList.listId, newName);
    }); // duplicate list.


    _character_elements.character_elements.duplicate_list_create_button.addEventListener("click", function (e) {
      e.preventDefault();
      var newName = _character_elements.character_elements.duplicate_list_name_field.value;
      if (character_list_api.checkListName(newName)) character_list_api.duplicateList(character_list_api.selectedList.list, newName);
    }); // delete the selected list.


    _character_elements.character_elements.delete_list_button.addEventListener("click", function () {
      if (character_list_api.selectedList.listId) {
        var res = confirm("Are you sure you want to delete the list ".concat(character_list_api.selectedList.list.name, "?"));
        if (res) character_list_api.deleteList(character_list_api.selectedList.listId);
      }
    });
    /* ------------------------------ Create Character Tab ------------------------------ */
    // update the available fields on name change and update preview display.


    _character_elements.character_elements.name_select.addEventListener("change", function () {
      character_api.updateFieldsOnName();
    }); // update the available fields on rank change and update preview display.


    _character_elements.character_elements.rank_select.addEventListener("change", function () {
      character_api.updateFieldsOnRank();
    }); // update the available fields on magia change and update preview display.


    _character_elements.character_elements.magia_select.addEventListener("change", function () {
      character_api.updateFieldsOnMagia();
    }); // open character select modal


    _character_elements.character_elements.characterSelectModalOpen.addEventListener("click", function () {
      _character_elements.characterSelectDialog.open(character_api.loadCharacterSelectList);
    }); // update the preview display on form change.


    document.querySelectorAll(".form").forEach(function (element) {
      ["change", "keyup", "input"].forEach(function (event) {
        element.addEventListener(event, function () {
          character_api.updatePreviewOnForm();
        });
      });
    }); // add new character display to list.

    _character_elements.character_elements.create_button.addEventListener("click", function () {
      if (!_character_elements.character_elements.create_button.disabled) character_api.createCharacter();
    }); // updates the character display with the form.


    _character_elements.character_elements.update_button.addEventListener("click", function () {
      if (!_character_elements.character_elements.create_button.disabled) character_api.updateCharacter();
    }); // copies the character display to the form.


    _character_elements.character_elements.copy_button.addEventListener("click", function () {
      if (!_character_elements.character_elements.create_button.disabled) character_api.copyCharacter();
    }); // delete the selected character display from list.


    _character_elements.character_elements.delete_button.addEventListener("click", function () {
      if (!_character_elements.character_elements.create_button.disabled) character_api.deleteCharacter();
    }); // mines all the fields.


    _character_elements.character_elements.min_all_button.addEventListener("click", function () {
      if (!_character_elements.character_elements.min_all_button.disabled) {
        character_api.minimizeDisplay();
        character_api.updateCharacter();
      }
    }); // maxes all the fields.


    _character_elements.character_elements.max_all_button.addEventListener("click", function () {
      if (!_character_elements.character_elements.max_all_button.disabled) {
        character_api.maximizeDisplay();
        character_api.updateCharacter();
      }
    });
    /* ------------------------------ Sorting Profile Tab ------------------------------ */
    // check set the profile properties on change.


    _character_elements.character_elements.profile_select.addEventListener("change", function () {
      var profileId = _character_elements.character_elements.profile_select.value;
      if (profileId === "0" || profileId === "1") _character_elements.character_elements.delete_profile_button.disabled = true;else _character_elements.character_elements.delete_profile_button.disabled = false;
      profile_api.setProfile(profileId);
      var listId = character_list_api.getListId();
      character_list_api.applyProfileToList(listId, profileId);
      storage_api.updateListProfile(listId, profileId);
    }); // show the save new profile form.


    _character_elements.character_elements.new_profile_button.addEventListener("click", function () {
      if (_character_elements.character_elements.new_profile_button.classList.contains("add")) {
        _character_elements.character_elements.new_profile_button.classList.replace("add", "minus");

        _character_elements.character_elements.profile_create_block.classList.remove("hidden");

        _character_elements.character_elements.new_profile_field.focus();
      } else {
        _character_elements.character_elements.new_profile_button.classList.replace("minus", "add");

        _character_elements.character_elements.profile_create_block.classList.add("hidden");
      }
    }); // check the profile name on change.


    _character_elements.character_elements.new_profile_field.addEventListener("change", function () {
      profile_api.checkProfile(_character_elements.character_elements.new_profile_field.value);
    }); // create a new profile.


    _character_elements.character_elements.create_profile_button.addEventListener("click", function (e) {
      e.preventDefault();
      profile_api.saveProfile();
    }); // delete the selected profile.


    _character_elements.character_elements.delete_profile_button.addEventListener("click", function () {
      var res = confirm("Are you sure you want to delete the sorting profile ".concat(profile_api.getSelectedProfileName(), "?"));
      if (res) profile_api.deleteProfile();
    });
    /* ------------------------------ Display Settings Tab ------------------------------ */
    // change the number of displays per row.


    ["input", "change"].forEach(function (event) {
      _character_elements.character_elements.displays_per_row.addEventListener(event, function () {
        var value = _character_elements.character_elements.displays_per_row.value;
        character_list_api.changeDisplaysPerRow(value);
        if (event === "change") storage_api.updateSettings("displays_per_row", value);
      });
    }); // change the alignment of the list.

    _character_elements.character_elements.display_alignment_select.addEventListener("change", function () {
      character_list_api.changeAlignment(_character_elements.character_elements.display_alignment_select.value);
    });

    ["input", "change"].forEach(function (event) {
      // change the padding of the list in the top direction.
      _character_elements.character_elements.display_padding_top_field.addEventListener(event, function () {
        var value = _character_elements.character_elements.display_padding_top_field.value;
        character_list_api.changePadding("top", value);
        if (event === "change") storage_api.updateSettings("padding_top", value);
      }); // change the padding of the list in the left direction.


      _character_elements.character_elements.display_padding_left_field.addEventListener(event, function () {
        var value = _character_elements.character_elements.display_padding_left_field.value;
        character_list_api.changePadding("left", value);
        if (event === "change") storage_api.updateSettings("padding_left", value);
      }); // change the padding of the list in the right direction.


      _character_elements.character_elements.display_padding_right_field.addEventListener(event, function () {
        var value = _character_elements.character_elements.display_padding_right_field.value;
        character_list_api.changePadding("right", value);
        if (event === "change") storage_api.updateSettings("padding_right", value);
      }); // change the padding of the list in the bottom direction.


      _character_elements.character_elements.display_padding_bottom_field.addEventListener(event, function () {
        var value = _character_elements.character_elements.display_padding_bottom_field.value;
        character_list_api.changePadding("bottom", value);
        if (event === "change") storage_api.updateSettings("padding_bottom", value);
      });
    });
    /* ------------------------------ Background Tab ------------------------------ */
    // open background select modal dialog

    _character_elements.character_elements.backgroundSelectModalOpen.addEventListener("click", function () {
      _character_elements.backgroundSelectDialog.open(background_api.loadBackgroundList);
    }); // set the background.


    _character_elements.character_elements.background_select.addEventListener("change", function () {
      var backgroundId = _character_elements.character_elements.background_select.value;
      background_api.setBackground(backgroundId);
      storage_api.updateListBackground(character_list_api.getListId(), backgroundId);
    }); // remove the background.


    _character_elements.character_elements.remove_background_button.addEventListener("click", function () {
      background_api.removeBackground();
      storage_api.updateListBackground(character_list_api.getListId(), false);
    }); // transparency field input.


    ["input", "change"].forEach(function (event) {
      _character_elements.character_elements.background_transparency_field.addEventListener(event, function () {
        var value = _character_elements.character_elements.background_transparency_field.value;
        if (value > 500) value = 500;else if (value < 1) value = 1;
        if (value !== _character_elements.character_elements.background_transparency_field.value) _character_elements.character_elements.background_transparency_field.value = value;
        _character_elements.character_elements.background_transparency_range.value = _character_elements.character_elements.background_transparency_field.value;
        background_api.changeTransparency(_character_elements.character_elements.background_transparency_range.value);
        if (event === "change") storage_api.updateSettings("background_transparency", background_transparency_field.value);
      });
    }); // transparency range slider.

    ["input", "change", "wheel"].forEach(function (event) {
      _character_elements.character_elements.background_transparency_range.addEventListener(event, function (e) {
        if (event === "wheel") {
          _character_elements.character_elements.background_transparency_range.value = parseInt(_character_elements.character_elements.background_transparency_range.value) - e.deltaY / 100 * (e.shiftKey ? 25 : 1);
        }

        _character_elements.character_elements.background_transparency_field.value = _character_elements.character_elements.background_transparency_range.value;
        background_api.changeTransparency(_character_elements.character_elements.background_transparency_range.value);
        if (event === "change") storage_api.updateSettings("background_transparency", background_transparency_range.value);
      });
    });
    /* ------------------------------ Settings Tab ------------------------------ */
    // update user button.

    _character_elements.character_elements.update_user_button.addEventListener("click", function () {
      var name = _character_elements.character_elements.player_name_field.value;
      var playerId = _character_elements.character_elements.player_id_field.value;
      var listId = _character_elements.character_elements.public_list_select.value;
      if (name && name !== storage_api.user.name) storage_api.setUserProperty("name", name);

      if (playerId && playerId.length == 8 && playerId !== storage_api.user.playerId) {
        functions.validPlayerID({
          playerId: playerId
        }).then(function (result) {
          if (result.data) storage_api.setUserProperty("playerId", playerId);else {
            alert("Player ID \"".concat(playerId, "\" already in use. If this is a mistake, please contact Leo Chan."));
            _character_elements.character_elements.player_id_field.value = "";
          }
        })["catch"](function (error) {
          alert(error);
        });
      } else if (playerId && playerId.length != 8) alert("Player ID must be 8 alphanumeric characters long (case sensitive).");

      if (listId && listId !== storage_api.user.publicListId) storage_api.setUserProperty("publicListId", listId);
    }); // remove id button.


    _character_elements.character_elements.remove_id_button.addEventListener("click", function () {
      storage_api.removeUserProperty("playerId");
      storage_api.removeUserProperty("publicListId");
    }); // list link button.


    _character_elements.character_elements.link_link_button.addEventListener("click", function () {
      if (storage_api.user.playerId && storage_api.user.publicListId) {
        window.open("../friend/?playerId=".concat(storage_api.user.playerId));
      } else {
        alert("Please set a Player ID and Public List before link is available.");
      }
    }); // save image button.


    _character_elements.character_elements.image_save_button.addEventListener("click", function () {
      if (storage_api.user.playerId && storage_api.user.publicListId) {
        character_list_api.selectList(storage_api.user.publicListId);
        setTimeout(function () {}, 500);
        html2canvas(_character_elements.character_elements.character_list_content, {
          backgroundColor: null
        }).then(function (canvas) {
          var data = canvas.toDataURL("image/png");
          storage_api.updateListImage(data).then(function () {
            storage_api.setUserProperty("savedList", true);
            new _dialog.MessageDialog({
              title: "Save Image Success"
            });
          })["catch"](function (error) {
            new _dialog.MessageDialog({
              title: "Save Image Failed",
              text: error.code ? error.code : "Error"
            });
          });
        });
      } else if (!storage_api.user.playerId) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "Player ID must be set."
        });
      } else if (!storage_api.user.publicListId) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "Public List ID must be set."
        });
      }
    }); // delete image button.


    _character_elements.character_elements.image_delete_button.addEventListener("click", function () {
      if (storage_api.user.playerId && storage_api.user.publicListId && storage_api.user.savedList) {
        storage_api.deleteListImage().then(function () {
          storage_api.setUserProperty("savedList", false);
          new _dialog.MessageDialog({
            title: "Delete Image Success"
          });
        })["catch"](function (error) {
          new _dialog.MessageDialog({
            title: "Delete Image Failed",
            text: error.code === "storage/object-not-found" ? "No Image to Delete" : error.code ? error.code : "Error"
          });
        });
      } else if (!storage_api.user.playerId) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "Player ID must be set."
        });
      } else if (!storage_api.user.publicListId) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "Public List ID must be set."
        });
      } else if (!storage_api.user.savedList) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "No Image Saved."
        });
      }
    }); // open image button.


    _character_elements.character_elements.image_open_button.addEventListener("click", function () {
      if (storage_api.user.playerId && storage_api.user.publicListId && storage_api.user.savedList) {
        window.open("https://leo-chan.me/magireco/list/?id=".concat(storage_api.user.playerId));
      } else if (!storage_api.user.playerId) {
        new _dialog.MessageDialog({
          title: "Open Image Failed",
          text: "Player ID must be set."
        });
      } else if (!storage_api.user.publicListId) {
        new _dialog.MessageDialog({
          title: "Open Image Failed",
          text: "Public List ID must be set."
        });
      } else if (!storage_api.user.savedList) {
        new _dialog.MessageDialog({
          title: "Open Image Failed",
          text: "No Image Saved."
        });
      }
    }); // copy image button.


    _character_elements.character_elements.image_copy_button.addEventListener("click", function () {
      if (storage_api.user.playerId && storage_api.user.publicListId && storage_api.user.savedList) {
        navigator.clipboard.writeText("https://leo-chan.me/magireco/list/?id=".concat(storage_api.user.playerId));
      } else if (!storage_api.user.playerId) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "Player ID must be set."
        });
      } else if (!storage_api.user.publicListId) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "Public List ID must be set."
        });
      } else if (!storage_api.user.savedList) {
        new _dialog.MessageDialog({
          title: "Delete Image Failed",
          text: "No Image Saved."
        });
      }
    });
    /* ============================== Main ============================== */

    /* ------------------------------ Export and Import ------------------------------ */
    // export image button.


    _character_elements.character_elements.export_image_button.addEventListener("click", function () {
      var date = new Date();
      var time = "_".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate(), "_").concat(date.getHours(), "_").concat(date.getMinutes(), "_").concat(date.getSeconds());
      var imageName = "".concat(character_list_api.getListName() ? character_list_api.getListName().replace(" ", "_") : "list");
      html2canvas(_character_elements.character_elements.character_list_content, {
        backgroundColor: null
      }).then(function (canvas) {
        var data = canvas.toDataURL("image/png");
        var a = document.createElement('a');
        a.href = data;
        a.download = imageName + time + ".png";
        a.click();
        a.remove();
      });
    });

    _character_elements.character_elements.export_open_button.addEventListener("click", function () {
      var date = new Date();
      var time = "_".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate(), "_").concat(date.getHours(), "_").concat(date.getMinutes(), "_").concat(date.getSeconds());
      var imageName = "".concat(character_list_api.getListName() ? character_list_api.getListName().replace(" ", "_") : "list");
      html2canvas(_character_elements.character_elements.character_list_content, {
        backgroundColor: null
      }).then(function (canvas) {
        var data = canvas.toDataURL("image/png");
        var w = window.open("_blank");
        var image = new Image();
        image.src = data;
        image.name = imageName + time + ".png";
        image.setAttribute("download", imageName + time + ".png");
        w.document.write(image.outerHTML);
      });
    }); // export text button.


    _character_elements.character_elements.export_text_button.addEventListener("click", function () {
      character_list_api.openExportModal();
    }); // import text button.


    _character_elements.character_elements.import_text_button.addEventListener("click", function () {
      _character_elements.importListDialog.open();
    });
    /* ------------------------------ Filters ------------------------------ */
    // add new filter.


    _character_elements.character_elements.add_filter_button.addEventListener("click", function () {
      character_list_api.createFilter();
    }); // apply the filters.


    _character_elements.character_elements.apply_filter_button.addEventListener("click", function () {
      character_list_api.applyFilters();
      character_list_api.getStats();
    }); // reset the filters.


    _character_elements.character_elements.reset_filter_button.addEventListener("click", function () {
      character_list_api.resetFilters();
      character_list_api.getStats();
    });

    _character_elements.character_elements.toggle_filter_button.addEventListener("click", function () {
      if (_character_elements.character_elements.toggle_filter_button.classList.contains("add")) {
        _character_elements.character_elements.toggle_filter_button.classList.replace("add", "minus");

        if (_character_elements.character_elements.list_filters.classList.contains("hidden")) _character_elements.character_elements.list_filters.classList.remove("hidden");
      } else if (_character_elements.character_elements.toggle_filter_button.classList.contains("minus")) {
        _character_elements.character_elements.toggle_filter_button.classList.replace("minus", "add");

        if (!_character_elements.character_elements.list_filters.classList.contains("hidden")) _character_elements.character_elements.list_filters.classList.add("hidden");
      }
    });
    /* ------------------------------ Zoom ------------------------------ */
    // zoom field input.


    ["input", "change"].forEach(function (event) {
      _character_elements.character_elements.zoom_field.addEventListener(event, function () {
        var value = zoom_field.value;
        if (value > 500) value = 500;else if (value < 1) value = 1;
        if (value !== _character_elements.character_elements.zoom_field.value) _character_elements.character_elements.zoom_field.value = value;
        _character_elements.character_elements.zoom_range.value = _character_elements.character_elements.zoom_field.value;
        character_list_api.changeZoom(_character_elements.character_elements.zoom_range.value);
        if (event === "change") storage_api.updateSettings("character_zoom", _character_elements.character_elements.zoom_field.value);
      });
    }); // zoom range slider.

    ["input", "change", "wheel"].forEach(function (event) {
      _character_elements.character_elements.zoom_range.addEventListener(event, function (e) {
        if (event === "wheel") {
          _character_elements.character_elements.zoom_range.value = parseInt(zoom_range.value) - e.deltaY / 100 * (e.shiftKey ? 50 : 1);
        }

        _character_elements.character_elements.zoom_field.value = _character_elements.character_elements.zoom_range.value;
        character_list_api.changeZoom(_character_elements.character_elements.zoom_range.value);
        if (event === "change") storage_api.updateSettings("character_zoom", zoom_range.value);
      });
    });
    /* ------------------------------ Stats ------------------------------ */
    // get more stats button.

    _character_elements.character_elements.more_stats_button.addEventListener("click", function () {
      character_list_api.openStatsModal();
    });
    /* ------------------------------ Character Display ------------------------------ */
    // deselect currently selected.


    _character_elements.character_elements.character_list_container.addEventListener("click", function (e) {
      if (character_api.selectedCharacter) {
        try {
          if (e.target.parentElement.className.indexOf("character_display") === -1 && e.target.parentElement.parentElement.className.indexOf("character_display") === -1) {
            character_api.deselectDisplay();
          }
        } catch (error) {
          character_api.deselectDisplay();
        }
      }
    });
    /* ------------------------------ Character List Content ------------------------------ */
    // resort when character list changes.


    _character_elements.character_elements.character_list_content.addEventListener("change", function () {
      character_list_api.applyProfileToList(character_list_api.getListId(), profile_api.getSelectedProfileId());
      character_list_api.updateList();
    });
  };
  /* ------------------------------ Page Start Up ------------------------------ */


  utils.detectColorScheme(); // update form and preview display on startup.

  character_api.startUp(); // update the background form.

  background_api.startUp(); // load the settings, profiles, and character lists from storage.

  database_api.onAuthStateChanged(function (user) {
    if (user) {
      _character_elements.character_elements.header_username.innerHTML = "Welcome ".concat(user.displayName || "Anonymous");
      storage_api.startUp(user);
      if (!user.isAnonymous && !user.emailVerified) _character_elements.character_elements.verify_email.classList.remove("hidden");
    } else {
      _character_elements.character_elements.header_username.innerHTML = "";
      window.location.href = "../";
    }
  });
})();

},{"../../shared/js/database_api.js":10,"../../shared/js/dialog.js":11,"../../shared/js/functions.js":12,"../../shared/js/utils.js":13,"./background_api.js":1,"./character_api.js":2,"./character_elements.js":3,"./character_list_api.js":4,"./profile_api.js":6,"./storage_api.js":7,"@babel/runtime/helpers/typeof":31}],6:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadsRules = exports.loadRule = exports.createProfileRule = exports.changeToCustom = exports.getProfileId = exports.getSelectedProfileName = exports.getSelectedProfileId = exports.setProfile = exports.deleteProfile = exports.checkProfile = exports.updateProfile = exports.saveProfile = exports.getSortSettings = exports.setProfiles = exports.selectedProfile = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _character_elements = require("./character_elements.js");

var character_list_api = _interopRequireWildcard(require("./character_list_api.js"));

var storage_api = _interopRequireWildcard(require("./storage_api.js"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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
/**
 * Profile API for the Character Page.
 */


var selectedProfile = null;
/**
 * Sets the profiles in the profile_select and loads the profile.
 * @param {Object} profiles 
 * @param {String} previous 
 */

exports.selectedProfile = selectedProfile;

var setProfiles = function setProfiles(profiles, previous) {
  _character_elements.character_elements.profile_select.innerHTML = "";
  Object.entries(profiles).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        id = _ref2[0],
        profile = _ref2[1];

    _character_elements.character_elements.profile_select.options.add(new Option(profile.name, id, false));
  });

  if (selectedProfile !== null && selectedProfile.name !== null) {
    var profileId = getProfileId(selectedProfile.name);
    _character_elements.character_elements.profile_select.value = profileId;
    var listId = character_list_api.getListId();
    if (listId) storage_api.updateListProfile(listId, profileId);
  } else if (previous && Array.from(_character_elements.character_elements.profile_select.options).some(function (option) {
    return option.value === previous;
  })) {
    _character_elements.character_elements.profile_select.value = previous;

    var _listId = character_list_api.getListId();

    if (_listId) storage_api.updateListProfile(_listId, previous);
  } else {
    _character_elements.character_elements.profile_select.value = "0";

    var _listId2 = character_list_api.getListId();

    if (_listId2) storage_api.updateListProfile(_listId2, "0");
  }

  loadsRules(_character_elements.character_elements.profile_select.value);
};
/**
 * Gets the Sorting Settings from the Profile Rules.
 * 
 * @returns {Object}
 */


exports.setProfiles = setProfiles;

var getSortSettings = function getSortSettings() {
  var settings = {};
  Array.from(_character_elements.character_elements.profile_rules.children).forEach(function (child, index) {
    var childRuleId = child.getAttribute("ruleId");
    var ruleId = childRuleId && childRuleId.length > 3 ? childRuleId : generatePushID();
    settings[ruleId] = {
      state: child.querySelector(".state_select").value,
      type: child.querySelector(".type_select").value,
      direction: child.querySelector(".sort_dir").classList.contains("up") ? 1 : -1,
      index: index
    };
  });
  return settings;
};
/**
 * Saves a new profile.
 */


exports.getSortSettings = getSortSettings;

var saveProfile = function saveProfile() {
  var profileName = new_profile_field.value;

  if (Object.values(storage_api.profiles).some(function (profile) {
    return profile.name === profileName;
  })) {
    profile_error_text.innerHTML = "The sorting profile ".concat(profileName, " already exists.");
    return;
  }

  if (profileName.length === 0) {
    profile_error_text.innerHTML = "The sorting profile name must not be empty.";
    return;
  }

  new_profile_field.value = "";
  var properties = getSortSettings();
  exports.selectedProfile = selectedProfile = {
    name: profileName,
    id: null
  };
  storage_api.createProfile(profileName, properties);
  if (!profile_create_block.classList.contains("hidden")) profile_create_block.classList.add("hidden");
  if (new_profile_button.classList.contains("minus")) new_profile_button.classList.replace("minus", "add");
};
/**
 * Updates the selected profile.
 */


exports.saveProfile = saveProfile;

var updateProfile = function updateProfile() {
  var profileId = getSelectedProfileId();
  var properties = getSortSettings();
  storage_api.updateProfile(profileId, properties);
  if (!profile_create_block.classList.contains("hidden")) profile_create_block.classList.add("hidden");
  if (new_profile_button.classList.contains("minus")) new_profile_button.classList.replace("minus", "add");
};
/**
 * Check if the profile name exists.
 * 
 * @param {String} profileName 
 */


exports.updateProfile = updateProfile;

var checkProfile = function checkProfile(profileName) {
  if (Object.values(storage_api.profiles).some(function (profile) {
    return profile.name === profileName;
  })) profile_error_text.innerHTML = "The sorting profile ".concat(profileName, " already exists.");else profile_error_text.innerHTML = "";
};
/**
 * Deletes the selected profile.
 */


exports.checkProfile = checkProfile;

var deleteProfile = function deleteProfile() {
  var profileId = getSelectedProfileId();

  if (storage_api.profiles[profileId].name !== "Default" && storage_api.profiles[profileId].name !== "Custom") {
    storage_api.deleteProfile(profileId);
    exports.selectedProfile = selectedProfile = {
      name: "Default",
      id: "0"
    };
    _character_elements.character_elements.profile_select.value = "0";
    var listId = character_list_api.getListId();
    if (listId) storage_api.updateListProfile(listId, "0");
  }
};
/**
 * Sets the profile and loads the rules.
 * 
 * @param {String} profileId 
 */


exports.deleteProfile = deleteProfile;

var setProfile = function setProfile(profileId) {
  _character_elements.character_elements.profile_select.value = profileId;
  if (storage_api.profiles[profileId].rules) loadsRules(profileId);
  if (profileId === "0" || profileId === "1") _character_elements.character_elements.delete_profile_button.disabled = true;else _character_elements.character_elements.delete_profile_button.disabled = false;
};
/**
 * Returns the selected profile id.
 */


exports.setProfile = setProfile;

var getSelectedProfileId = function getSelectedProfileId() {
  if (_character_elements.character_elements.profile_select.selectedIndex > -1) return _character_elements.character_elements.profile_select.value;else return "0";
};
/**
 * returns the selected profile name.
 */


exports.getSelectedProfileId = getSelectedProfileId;

var getSelectedProfileName = function getSelectedProfileName() {
  if (_character_elements.character_elements.profile_select.options[_character_elements.character_elements.profile_select.selectedIndex]) return _character_elements.character_elements.profile_select.options[_character_elements.character_elements.profile_select.selectedIndex].text;else return "Default";
};
/**
 * Returns the profile id of profileName.
 * 
 * @param {String} profileName 
 */


exports.getSelectedProfileName = getSelectedProfileName;

var getProfileId = function getProfileId(profileName) {
  var profile = Object.entries(storage_api.profiles).find(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        id = _ref4[0],
        profile = _ref4[1];

    return profile.name === profileName;
  });
  return profile[0];
};
/**
 * Changes the profile_select to Custom.
 */


exports.getProfileId = getProfileId;

var changeToCustom = function changeToCustom() {
  _character_elements.character_elements.profile_select.value = "1";
};
/**
 * Create a new sorting profile rule.
 * 
 * @param {HTMLDivElement} next optional.
 */


exports.changeToCustom = changeToCustom;

var createProfileRule = function createProfileRule() {
  var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var new_rule = document.createElement("div");
  new_rule.classList.add("profile_rule");
  new_rule.innerHTML = "\n      <select class=\"state_select form_input\">\n        <option value=\"sort\">Sort By</option>\n        <option value=\"group\">Group By</option>\n      </select>\n      <select class=\"type_select form_input\">\n        <option value=\"attribute\">Attribute</option>\n        <option value=\"rank\">Rank</option>\n        <option value=\"post_awaken\">Post Awaken</option>\n        <option value=\"level\">Level</option>\n        <option value=\"magic\">Magic</option>\n        <option value=\"magia\">Magia</option>\n        <option value=\"episode\">Episode</option>\n        <option value=\"doppel\">Doppel</option>\n        <option value=\"se\">SE</option>\n        <option value=\"obtainability\">Obtainability</option>\n        <option value=\"release_date\">Release Date</option>\n        <option value=\"character_id\">Character ID</option>\n      </select>\n      <button class=\"sort_dir down small_btn\"></button>\n      <button class=\"create add small_btn\" title=\"Add New Rule Below\"></button>\n      <button class=\"delete small_btn\" title=\"Delete Rule\"></button>";
  var state_select = new_rule.querySelector(".state_select");
  var type_select = new_rule.querySelector(".type_select");
  var sort_dir = new_rule.querySelector(".sort_dir");
  state_select.selectedIndex = -1;
  type_select.selectedIndex = -1;
  new_rule.querySelector(".create").addEventListener("click", function () {
    createProfileRule(new_rule);
  });
  new_rule.querySelector(".delete").addEventListener("click", function () {
    new_rule.remove();

    var first_rule = _character_elements.character_elements.profile_rules.children[0].querySelector(".delete");

    if (_character_elements.character_elements.profile_rules.children.length === 1 && !first_rule.disabled) first_rule.disabled = true;
    if (getSelectedProfileName() === "Default") changeToCustom();
    updateProfile();
    character_list_api.applyProfileToList(character_list_api.getListId(), getSelectedProfileId());
  });
  sort_dir.addEventListener("click", function () {
    if (sort_dir.classList.contains("up")) {
      sort_dir.classList.replace("up", "down");
    } else if (sort_dir.classList.contains("down")) {
      sort_dir.classList.replace("down", "up");
    }

    if (getSelectedProfileName() === "Default") changeToCustom();
    updateProfile();
    character_list_api.applyProfileToList(character_list_api.getListId(), getSelectedProfileId());
  }); // update the list on sort form change.

  [state_select, type_select].forEach(function (element) {
    element.addEventListener("change", function () {
      if (getSelectedProfileName() === "Default") changeToCustom();

      if (state_select.value && type_select.value) {
        updateProfile();
        character_list_api.applyProfileToList(character_list_api.getListId(), getSelectedProfileId());
      }
    });
  }); // disable group or id level.

  state_select.addEventListener("change", function () {
    if (state_select.value === "group") {
      if (type_select.value === "character_id" || type_select.value === "release_date" || type_select.value === "level") {
        type_select.selectedIndex = -1;
      }

      type_select.options[3].disabled = true;
      type_select.options[8].disabled = true;
      type_select.options[10].disabled = true;
      type_select.options[11].disabled = true;
    } else {
      type_select.options[3].disabled = false;
      type_select.options[8].disabled = false;
      type_select.options[10].disabled = false;
      type_select.options[11].disabled = false;
    }
  });
  type_select.addEventListener("change", function () {
    if (type_select.value === "character_id" || type_select.value === "release_date" || type_select.value === "level") {
      if (state_select.value === "group") {
        state_select.selectedIndex = -1;
      }

      state_select.options[1].disabled = true;
    } else state_select.options[1].disabled = false;
  });
  if (next !== null) next.after(new_rule);else _character_elements.character_elements.profile_rules.append(new_rule);
  return new_rule;
};
/**
 * Loads the rule with the settings.
 * 
 * @param {String} ruleId 
 * @param {Object} settings 
 */


exports.createProfileRule = createProfileRule;

var loadRule = function loadRule(ruleId, settings) {
  var rule = createProfileRule();
  var state_select = rule.querySelector(".state_select");
  var type_select = rule.querySelector(".type_select");
  var sort_dir = rule.querySelector(".sort_dir");
  rule.setAttribute("ruleId", ruleId);
  state_select.value = settings.state;
  type_select.value = settings.type;
  if (settings.direction == 1 && sort_dir.classList.contains("down")) sort_dir.classList.replace("down", "up");else if (settings.direction == -1 && sort_dir.classList.contains("up")) sort_dir.classList.replace("up", "down");

  if (state_select.value === "group") {
    if (type_select.value === "character_id" || type_select.value === "release_date" || type_select.value === "level" || type_select.value === "se") {
      type_select.selectedIndex = -1;
    }

    type_select.options[3].disabled = true;
    type_select.options[8].disabled = true;
    type_select.options[10].disabled = true;
    type_select.options[11].disabled = true;
  } else {
    type_select.options[3].disabled = false;
    type_select.options[8].disabled = false;
    type_select.options[10].disabled = false;
    type_select.options[11].disabled = false;
  }

  if (type_select.value === "character_id" || type_select.value === "release_date" || type_select.value === "level" || type_select.value === "se") {
    if (state_select.value === "group") {
      state_select.selectedIndex = -1;
    }

    state_select.options[1].disabled = true;
  } else state_select.options[1].disabled = false;
};
/**
 * Loads all the rules for the profile.
 * 
 * @param {String} profileId 
 */


exports.loadRule = loadRule;

var loadsRules = function loadsRules(profileId) {
  if (!storage_api.profiles[profileId].rules) return;
  _character_elements.character_elements.profile_rules.innerHTML = "";
  Object.entries(storage_api.profiles[profileId].rules).sort(function (a, b) {
    return a[1].index > b[1].index ? 1 : -1;
  }).forEach(function (_ref5) {
    var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
        ruleId = _ref6[0],
        settings = _ref6[1];

    loadRule(ruleId, settings);
  });

  if (_character_elements.character_elements.profile_rules.children.length > 0) {
    var first_rule = _character_elements.character_elements.profile_rules.children[0].querySelector(".delete");

    if (_character_elements.character_elements.profile_rules.children.length === 1 && !first_rule.disabled) first_rule.disabled = true;
  }
};

exports.loadsRules = loadsRules;

},{"./character_elements.js":3,"./character_list_api.js":4,"./storage_api.js":7,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/slicedToArray":29,"@babel/runtime/helpers/typeof":31}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteListImage = exports.updateListImage = exports.removeUserProperty = exports.setUserProperty = exports.updateSettings = exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.deleteCharacterOfList = exports.updateCharacterOfList = exports.addCharacterToList = exports.manualCreateList = exports.duplicateList = exports.deleteList = exports.updateListBackground = exports.updateListProfile = exports.updateListList = exports.updateList = exports.renameList = exports.createList = exports.listExists = exports.startUp = exports.user = exports.settings = exports.lists = exports.profiles = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _character_elements = require("./character_elements.js");

var background_api = _interopRequireWildcard(require("./background_api.js"));

var character_api = _interopRequireWildcard(require("./character_api.js"));

var character_list_api = _interopRequireWildcard(require("./character_list_api.js"));

var database_api = _interopRequireWildcard(require("../../shared/js/database_api.js"));

var profile_api = _interopRequireWildcard(require("./profile_api.js"));

var utils = _interopRequireWildcard(require("../../shared/js/utils.js"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0, _defineProperty2["default"])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
/**
 * Storage API for the Character Page.
 */


var profiles = {};
exports.profiles = profiles;
var lists = {};
exports.lists = lists;
var settings = {};
exports.settings = settings;
var user = {};
exports.user = user;
var userId = null;
var prevCharacter = null;
/* ------------------------------ Start Up ------------------------------ */

/**
 * Sets the user id, then loads the message or loads everything else.
 */

var startUp = function startUp(user) {
  userId = user.uid;
  loadUserName();
  database_api.onceMessageUpdate(userId, function (message, blocking) {
    if (message && blocking) {
      loadMessage(message);
    } else {
      database_api.onUserUpdate(userId, loadUser);
      database_api.onSettingUpdate(userId, loadSettings);
      database_api.onProfileUpdate(userId, loadProfiles);
      database_api.onListUpdate(userId, loadLists);
      database_api.onMessageUpdate(userId, loadMessage);
    }
  });
};
/**
 * Loads the user's name.
 */


exports.startUp = startUp;

var loadUserName = function loadUserName() {
  database_api.onAuthStateChanged(function (user) {
    var name = user && user.displayName ? user.displayName : "Anonymous";
    _character_elements.character_elements.header_username.innerHTML = "Welcome " + name;
  });
};
/**
 * Loads the user.
 * 
 */


var loadUser = function loadUser(snapshot) {
  exports.user = user = snapshot.val() ? snapshot.val() : {};
  if (user.name !== undefined) _character_elements.character_elements.player_name_field.value = user.name;else _character_elements.character_elements.player_name_field.value = "";
  if (user.playerId !== undefined) _character_elements.character_elements.player_id_field.value = user.playerId;else _character_elements.character_elements.player_id_field.value = "";
  if (user.publicListId !== undefined) _character_elements.character_elements.public_list_select.value = user.publicListId;else _character_elements.character_elements.public_list_select.selectedIndex = -1;
};
/**
 * Loads the settings.
 * 
 */


var loadSettings = function loadSettings(snapshot) {
  exports.settings = settings = snapshot.val() ? snapshot.val() : {}; // expand tabs

  Object.entries(settings.expanded_tabs).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        tab_id = _ref2[0],
        expanded = _ref2[1];

    var tab = document.querySelector("#".concat(tab_id));

    if (tab) {
      var tab_contents = tab.querySelector(".tab_contents");
      var tab_toggle = tab.querySelector(".tab_toggle");

      if (expanded) {
        if (tab_contents.classList.contains("hidden")) tab_contents.classList.remove("hidden");
        if (tab_toggle.classList.contains("right")) tab_toggle.classList.replace("right", "down");
      } else if (!expanded) {
        if (!tab_contents.classList.contains("hidden")) tab_contents.classList.add("hidden");
        if (tab_toggle.classList.contains("down")) tab_toggle.classList.replace("down", "right");
      }
    }
  }); // display settings

  character_list_api.setZoom(settings.character_zoom);
  _character_elements.character_elements.zoom_range.value = settings.character_zoom;
  _character_elements.character_elements.zoom_field.value = settings.character_zoom;
  _character_elements.character_elements.displays_per_row.value = settings.displays_per_row;
  character_list_api.changeDisplaysPerRow(settings.displays_per_row);
  document.querySelectorAll(".character_row").forEach(function (character_row) {
    return character_row.style.justifyContent = character_list_api.DIR_TO_FLEX[settings.display_alignment];
  });
  _character_elements.character_elements.display_alignment_select.value = settings.display_alignment;
  character_list_api.setPadding(settings.padding_top, settings.padding_left, settings.padding_right, settings.padding_bottom);
  _character_elements.character_elements.display_padding_top_field.value = settings.padding_top;
  _character_elements.character_elements.display_padding_left_field.value = settings.padding_left;
  _character_elements.character_elements.display_padding_right_field.value = settings.padding_right;
  _character_elements.character_elements.display_padding_bottom_field.value = settings.padding_bottom; // background settings

  if (!settings.background_transparency) settings.background_transparency = 0;
  _character_elements.character_elements.background_transparency_range.value = settings.background_transparency;
  _character_elements.character_elements.background_transparency_field.value = settings.background_transparency; // theme

  utils.setTheme(settings.theme);
};
/**
 * Loads the profiles.
 * 
 */


var loadProfiles = function loadProfiles(snapshot) {
  // get the previous profile.
  var previous = profile_api.getSelectedProfileId(); // get the settings.

  var val = snapshot.val();
  var filtered = Object.keys(val).filter(function (key) {
    return val[key].type == "character";
  }).reduce(function (obj, key) {
    return _objectSpread(_objectSpread({}, obj), {}, (0, _defineProperty2["default"])({}, key, val[key]));
  }, {}); // add index property if undefined.

  Object.values(filtered).forEach(function (profile) {
    if (profile.rules) {
      Object.values(profile.rules).forEach(function (rule, index) {
        if (!rule.index) rule.index = index;
      });
    }
  });
  exports.profiles = profiles = filtered; // update the profile select.

  profile_api.setProfiles(profiles, previous);
};
/**
 * Loads the lists.
 * 
 */


var loadLists = function loadLists(snapshot) {
  var val = snapshot.val() ? snapshot.val() : {};
  var filtered = Object.keys(val).filter(function (key) {
    return typeof val[key].characterList !== "undefined";
  }).reduce(function (obj, key) {
    return _objectSpread(_objectSpread({}, obj), {}, (0, _defineProperty2["default"])({}, key, val[key]));
  }, {});
  exports.lists = lists = filtered;
  character_list_api.setLists(lists);
};
/**
 * Loads the message.
 */


var loadMessage = function loadMessage(message) {
  if (message !== false) {
    _character_elements.messageDialog.open("Message", message);
  }
};
/* ------------------------------ Lists ------------------------------ */

/**
 * Check if list with name name exists.
 */


var listExists = function listExists(name) {
  if (Object.entries(lists).some(function (key, list) {
    return list.name === name;
  })) return true;
  return false;
};
/**
 * Create new List of name name.
 */


exports.listExists = listExists;

var createList = function createList(name) {
  database_api.createList(userId, {
    name: name,
    characterList: false,
    selectedProfile: "0",
    selectedBackground: false
  });
};
/**
 * Rename the List listId with name name.
 */


exports.createList = createList;

var renameList = function renameList(listId, name) {
  if (lists[listId].name != name) database_api.setListProperty(userId, listId, "name", name);
};
/**
 * Update the list listId.
 */


exports.renameList = renameList;

var updateList = function updateList(listId, name, characterList, selectedProfile, selectedBackground) {
  if (characterList && Object.keys(characterList).length > 0) {
    Object.entries(characterList).forEach(function (_ref3) {
      var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      return characterList[key] = character_api.sanitizeCharacter(value);
    });
  } else characterList = false;

  if (!selectedBackground) selectedBackground = false;
  database_api.updateList(userId, listId, {
    name: name,
    characterList: characterList,
    selectedProfile: selectedProfile,
    selectedBackground: selectedBackground
  });
};
/**
 * Updates the characterList of list listId with content.
 */


exports.updateList = updateList;

var updateListList = function updateListList(listId, content) {
  database_api.setListProperty(userId, listId, "characterList", content);
};
/**
 * Updates the profile of list listId with profile profileId.
 */


exports.updateListList = updateListList;

var updateListProfile = function updateListProfile(listId, profileId) {
  if (lists[listId].selectedProfile != profileId) database_api.setListProperty(userId, listId, "selectedProfile", profileId);
};
/**
 * Updates the profile of list listId with profile profileId.
 */


exports.updateListProfile = updateListProfile;

var updateListBackground = function updateListBackground(listId, backgroundId) {
  if (lists[listId].selectedBackground != backgroundId) database_api.setListProperty(userId, listId, "selectedBackground", backgroundId);
};
/**
 * Deletes the list listId.
 */


exports.updateListBackground = updateListBackground;

var deleteList = function deleteList(listId) {
  database_api.deleteList(userId, listId);
};
/**
 * Duplicates list with name newName.
 */


exports.deleteList = deleteList;

var duplicateList = function duplicateList(list, newName) {
  var selectedProfile = profile_api.getSelectedProfileId() || "0";
  var selectedBackground = background_api.getSelectedBackground() || false;
  database_api.createList(userId, {
    name: newName,
    characterList: list.characterList,
    selectedProfile: selectedProfile,
    selectedBackground: selectedBackground
  });
};
/**
 * Create and new list with all the parameters passed in.
 */


exports.duplicateList = duplicateList;

var manualCreateList = function manualCreateList(name, characterList, selectedProfile, selectedBackground) {
  database_api.createList(userId, {
    name: name,
    characterList: characterList,
    selectedProfile: selectedProfile,
    selectedBackground: selectedBackground
  });
};
/**
 * Added the character character to the list listId.
 */


exports.manualCreateList = manualCreateList;

var addCharacterToList = function addCharacterToList(listId, character) {
  var newCharacter = {};
  if (character._id) newCharacter[character._id] = character_api.sanitizeCharacter(_objectSpread({}, character));else newCharacter[generatePushID()] = character_api.sanitizeCharacter(_objectSpread({}, character));
  database_api.updateListProperty(userId, listId, "characterList", newCharacter);
};
/**
 * Updates the character characterDisplayId with character character of list listId.
 */


exports.addCharacterToList = addCharacterToList;

var updateCharacterOfList = function updateCharacterOfList(listId, characterDisplayId, character) {
  character = character_api.sanitizeCharacter(character);
  if (JSON.stringify(character) === JSON.stringify(prevCharacter)) return;else prevCharacter = character;
  var newCharacter = (0, _defineProperty2["default"])({}, characterDisplayId, character);
  database_api.updateListProperty(userId, listId, "characterList", newCharacter);
};
/**
 * Delete the character characterDisplayId of list listId.
 */


exports.updateCharacterOfList = updateCharacterOfList;

var deleteCharacterOfList = function deleteCharacterOfList(listId, characterDisplayId) {
  database_api.deleteListItem(userId, listId, "characterList", characterDisplayId);
};
/* ------------------------------ Profiles ------------------------------ */

/**
 * Create a new character profile with name name and settings settings.
 */


exports.deleteCharacterOfList = deleteCharacterOfList;

var createProfile = function createProfile(name, rules) {
  database_api.createProfile(userId, {
    name: name,
    type: "character",
    rules: rules
  });
};
/**
 * Updates the profile profileId with settings settings.
 */


exports.createProfile = createProfile;

var updateProfile = function updateProfile(profileId, rules) {
  database_api.updateProfile(userId, profileId, {
    name: profiles[profileId].name,
    type: "character",
    rules: rules
  });
};
/**
 * Deletes profile profileId and updates the profiles of all other lists to default.
 */


exports.updateProfile = updateProfile;

var deleteProfile = function deleteProfile(profileId) {
  database_api.deleteProfile(userId, profileId);
  Object.entries(lists).forEach(function (_ref5) {
    var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
        listId = _ref6[0],
        list = _ref6[1];

    if (list.selectedProfile === profileId) updateListProfile(listId, "0");
  });
};
/* ------------------------------ Settings ------------------------------ */

/**
 * Updates the setting settingsName with settings newSettings.
 */


exports.deleteProfile = deleteProfile;

var updateSettings = function updateSettings(settingName, newSettings) {
  database_api.updateSettings(userId, settingName, newSettings);
};
/* ------------------------------ User ------------------------------ */

/**
 * Sets the user property settingsName with settings newSettings.
 */


exports.updateSettings = updateSettings;

var setUserProperty = function setUserProperty(settingName, newSettings) {
  database_api.setUserProperty(userId, settingName, newSettings);
};
/**
 * Removes the user property settingsName with settings newSettings.
 */


exports.setUserProperty = setUserProperty;

var removeUserProperty = function removeUserProperty(settingName) {
  database_api.removeUserProperty(userId, settingName);
};
/**
 * Updates storage bucket.
 */


exports.removeUserProperty = removeUserProperty;

var updateListImage = function updateListImage(dataURL) {
  var playerId = user.playerId;
  if (playerId) return database_api.updateListImage(playerId, dataURL);else return Promise.reject("No Player ID.");
};
/**
 * Delete storage bucket.
 */


exports.updateListImage = updateListImage;

var deleteListImage = function deleteListImage() {
  var playerId = user.playerId;
  if (playerId) return database_api.deleteListImage(playerId);else return Promise.reject("No Player ID.");
};

exports.deleteListImage = deleteListImage;

},{"../../shared/js/database_api.js":10,"../../shared/js/utils.js":13,"./background_api.js":1,"./character_api.js":2,"./character_elements.js":3,"./character_list_api.js":4,"./profile_api.js":6,"@babel/runtime/helpers/defineProperty":19,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/slicedToArray":29,"@babel/runtime/helpers/typeof":31}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.background_collection = void 0;
var background_collection = {
  "story": [{
    "id": "bg_adv_11011",
    "name": null
  }, {
    "id": "bg_adv_11012",
    "name": null
  }, {
    "id": "bg_adv_11013",
    "name": null
  }, {
    "id": "bg_adv_11021",
    "name": null
  }, {
    "id": "bg_adv_11022",
    "name": null
  }, {
    "id": "bg_adv_11023",
    "name": null
  }, {
    "id": "bg_adv_11024",
    "name": null
  }, {
    "id": "bg_adv_11041",
    "name": null
  }, {
    "id": "bg_adv_11042",
    "name": null
  }, {
    "id": "bg_adv_11043",
    "name": null
  }, {
    "id": "bg_adv_11044",
    "name": null
  }, {
    "id": "bg_adv_11051",
    "name": null
  }, {
    "id": "bg_adv_11061",
    "name": null
  }, {
    "id": "bg_adv_11062",
    "name": null
  }, {
    "id": "bg_adv_11063",
    "name": null
  }, {
    "id": "bg_adv_11071",
    "name": null
  }, {
    "id": "bg_adv_11072",
    "name": null
  }, {
    "id": "bg_adv_11073",
    "name": null
  }, {
    "id": "bg_adv_11081",
    "name": null
  }, {
    "id": "bg_adv_11082",
    "name": null
  }, {
    "id": "bg_adv_11083",
    "name": null
  }, {
    "id": "bg_adv_11091",
    "name": null
  }, {
    "id": "bg_adv_11092",
    "name": null
  }, {
    "id": "bg_adv_11093",
    "name": null
  }, {
    "id": "bg_adv_11094",
    "name": null
  }, {
    "id": "bg_adv_12011",
    "name": null
  }, {
    "id": "bg_adv_12012",
    "name": null
  }, {
    "id": "bg_adv_12013",
    "name": null
  }, {
    "id": "bg_adv_12021",
    "name": null
  }, {
    "id": "bg_adv_12022",
    "name": null
  }, {
    "id": "bg_adv_12023",
    "name": null
  }, {
    "id": "bg_adv_12024",
    "name": null
  }, {
    "id": "bg_adv_12041",
    "name": null
  }, {
    "id": "bg_adv_12042",
    "name": null
  }, {
    "id": "bg_adv_12043",
    "name": null
  }, {
    "id": "bg_adv_12051",
    "name": null
  }, {
    "id": "bg_adv_12052",
    "name": null
  }, {
    "id": "bg_adv_12061",
    "name": null
  }, {
    "id": "bg_adv_12062",
    "name": null
  }, {
    "id": "bg_adv_12063",
    "name": null
  }, {
    "id": "bg_adv_12064",
    "name": null
  }, {
    "id": "bg_adv_12065",
    "name": null
  }, {
    "id": "bg_adv_12066",
    "name": null
  }, {
    "id": "bg_adv_12071",
    "name": null
  }, {
    "id": "bg_adv_12072",
    "name": null
  }, {
    "id": "bg_adv_12073",
    "name": null
  }, {
    "id": "bg_adv_12081",
    "name": null
  }, {
    "id": "bg_adv_12082",
    "name": null
  }, {
    "id": "bg_adv_12083",
    "name": null
  }, {
    "id": "bg_adv_12091",
    "name": null
  }, {
    "id": "bg_adv_13011",
    "name": null
  }, {
    "id": "bg_adv_13012",
    "name": null
  }, {
    "id": "bg_adv_13013",
    "name": null
  }, {
    "id": "bg_adv_13014",
    "name": null
  }, {
    "id": "bg_adv_13021",
    "name": null
  }, {
    "id": "bg_adv_13022",
    "name": null
  }, {
    "id": "bg_adv_13023",
    "name": null
  }, {
    "id": "bg_adv_13024",
    "name": null
  }, {
    "id": "bg_adv_13041",
    "name": null
  }, {
    "id": "bg_adv_13042",
    "name": null
  }, {
    "id": "bg_adv_13043",
    "name": null
  }, {
    "id": "bg_adv_13051",
    "name": null
  }, {
    "id": "bg_adv_13052",
    "name": null
  }, {
    "id": "bg_adv_13053",
    "name": null
  }, {
    "id": "bg_adv_13061",
    "name": null
  }, {
    "id": "bg_adv_13062",
    "name": null
  }, {
    "id": "bg_adv_13063",
    "name": null
  }, {
    "id": "bg_adv_13071",
    "name": null
  }, {
    "id": "bg_adv_13072",
    "name": null
  }, {
    "id": "bg_adv_13081",
    "name": null
  }, {
    "id": "bg_adv_13082",
    "name": null
  }, {
    "id": "bg_adv_13091",
    "name": null
  }, {
    "id": "bg_adv_14011",
    "name": null
  }, {
    "id": "bg_adv_14012",
    "name": null
  }, {
    "id": "bg_adv_14013",
    "name": null
  }, {
    "id": "bg_adv_14021",
    "name": null
  }, {
    "id": "bg_adv_14022",
    "name": null
  }, {
    "id": "bg_adv_14023",
    "name": null
  }, {
    "id": "bg_adv_14024",
    "name": null
  }, {
    "id": "bg_adv_14025",
    "name": null
  }, {
    "id": "bg_adv_14026",
    "name": null
  }, {
    "id": "bg_adv_14028",
    "name": null
  }, {
    "id": "bg_adv_14041",
    "name": null
  }, {
    "id": "bg_adv_14042",
    "name": null
  }, {
    "id": "bg_adv_14043",
    "name": null
  }, {
    "id": "bg_adv_14044",
    "name": null
  }, {
    "id": "bg_adv_14051",
    "name": null
  }, {
    "id": "bg_adv_14052",
    "name": null
  }, {
    "id": "bg_adv_14053",
    "name": null
  }, {
    "id": "bg_adv_14061",
    "name": null
  }, {
    "id": "bg_adv_14062",
    "name": null
  }, {
    "id": "bg_adv_14063",
    "name": null
  }, {
    "id": "bg_adv_14071",
    "name": null
  }, {
    "id": "bg_adv_14072",
    "name": null
  }, {
    "id": "bg_adv_14073",
    "name": null
  }, {
    "id": "bg_adv_14081",
    "name": null
  }, {
    "id": "bg_adv_14082",
    "name": null
  }, {
    "id": "bg_adv_14083",
    "name": null
  }, {
    "id": "bg_adv_14084",
    "name": null
  }, {
    "id": "bg_adv_15011",
    "name": null
  }, {
    "id": "bg_adv_15021",
    "name": null
  }, {
    "id": "bg_adv_15022",
    "name": null
  }, {
    "id": "bg_adv_15023",
    "name": null
  }, {
    "id": "bg_adv_15024",
    "name": null
  }, {
    "id": "bg_adv_15025",
    "name": null
  }, {
    "id": "bg_adv_15026",
    "name": null
  }, {
    "id": "bg_adv_15041",
    "name": null
  }, {
    "id": "bg_adv_15042",
    "name": null
  }, {
    "id": "bg_adv_15043",
    "name": null
  }, {
    "id": "bg_adv_15051",
    "name": null
  }, {
    "id": "bg_adv_15052",
    "name": null
  }, {
    "id": "bg_adv_15053",
    "name": null
  }, {
    "id": "bg_adv_15054",
    "name": null
  }, {
    "id": "bg_adv_15061",
    "name": null
  }, {
    "id": "bg_adv_15062",
    "name": null
  }, {
    "id": "bg_adv_15071",
    "name": null
  }, {
    "id": "bg_adv_15072",
    "name": null
  }, {
    "id": "bg_adv_15081",
    "name": null
  }, {
    "id": "bg_adv_16011",
    "name": null
  }, {
    "id": "bg_adv_16021",
    "name": null
  }, {
    "id": "bg_adv_16022",
    "name": null
  }, {
    "id": "bg_adv_16023",
    "name": null
  }, {
    "id": "bg_adv_16024",
    "name": null
  }, {
    "id": "bg_adv_16041",
    "name": null
  }, {
    "id": "bg_adv_16042",
    "name": null
  }, {
    "id": "bg_adv_16043",
    "name": null
  }, {
    "id": "bg_adv_16044",
    "name": null
  }, {
    "id": "bg_adv_16051",
    "name": null
  }, {
    "id": "bg_adv_16052",
    "name": null
  }, {
    "id": "bg_adv_16061",
    "name": null
  }, {
    "id": "bg_adv_16062",
    "name": null
  }, {
    "id": "bg_adv_16063",
    "name": null
  }, {
    "id": "bg_adv_16071",
    "name": null
  }, {
    "id": "bg_adv_16141",
    "name": null
  }, {
    "id": "bg_adv_17012",
    "name": null
  }, {
    "id": "bg_adv_17021",
    "name": null
  }, {
    "id": "bg_adv_17022",
    "name": null
  }, {
    "id": "bg_adv_17023",
    "name": null
  }, {
    "id": "bg_adv_17041",
    "name": null
  }, {
    "id": "bg_adv_17042",
    "name": null
  }, {
    "id": "bg_adv_17043",
    "name": null
  }, {
    "id": "bg_adv_17051",
    "name": null
  }, {
    "id": "bg_adv_17052",
    "name": null
  }, {
    "id": "bg_adv_17053",
    "name": null
  }, {
    "id": "bg_adv_17061",
    "name": null
  }, {
    "id": "bg_adv_17071",
    "name": null
  }, {
    "id": "bg_adv_17081",
    "name": null
  }, {
    "id": "bg_adv_17082",
    "name": null
  }, {
    "id": "bg_adv_17091",
    "name": null
  }, {
    "id": "bg_adv_17092",
    "name": null
  }, {
    "id": "bg_adv_17093",
    "name": null
  }, {
    "id": "bg_adv_17101",
    "name": null
  }, {
    "id": "bg_adv_17102",
    "name": null
  }, {
    "id": "bg_adv_17103",
    "name": null
  }, {
    "id": "bg_adv_17111",
    "name": null
  }, {
    "id": "bg_adv_17112",
    "name": null
  }, {
    "id": "bg_adv_17113",
    "name": null
  }, {
    "id": "bg_adv_17121",
    "name": null
  }, {
    "id": "bg_adv_17131",
    "name": null
  }, {
    "id": "bg_adv_17141",
    "name": null
  }, {
    "id": "bg_adv_17142",
    "name": null
  }, {
    "id": "bg_adv_17143",
    "name": null
  }, {
    "id": "bg_adv_17151",
    "name": null
  }, {
    "id": "bg_adv_17161",
    "name": null
  }, {
    "id": "bg_adv_18012",
    "name": null
  }, {
    "id": "bg_adv_18021",
    "name": null
  }, {
    "id": "bg_adv_18022",
    "name": null
  }, {
    "id": "bg_adv_18023",
    "name": null
  }, {
    "id": "bg_adv_18024",
    "name": null
  }, {
    "id": "bg_adv_18041",
    "name": null
  }, {
    "id": "bg_adv_18042",
    "name": null
  }, {
    "id": "bg_adv_18043",
    "name": null
  }, {
    "id": "bg_adv_18051",
    "name": null
  }, {
    "id": "bg_adv_18052",
    "name": null
  }, {
    "id": "bg_adv_18053",
    "name": null
  }, {
    "id": "bg_adv_18054",
    "name": null
  }, {
    "id": "bg_adv_18101",
    "name": null
  }, {
    "id": "bg_adv_19011",
    "name": null
  }, {
    "id": "bg_adv_19021",
    "name": null
  }, {
    "id": "bg_adv_19022",
    "name": null
  }, {
    "id": "bg_adv_19023",
    "name": null
  }, {
    "id": "bg_adv_19041",
    "name": null
  }, {
    "id": "bg_adv_19042",
    "name": null
  }, {
    "id": "bg_adv_19043",
    "name": null
  }, {
    "id": "bg_adv_19051",
    "name": null
  }, {
    "id": "bg_adv_19061",
    "name": null
  }, {
    "id": "bg_adv_19071",
    "name": null
  }, {
    "id": "bg_adv_19081",
    "name": null
  }, {
    "id": "bg_adv_19091",
    "name": null
  }, {
    "id": "bg_adv_19092",
    "name": null
  }, {
    "id": "bg_adv_19101",
    "name": null
  }, {
    "id": "bg_adv_19111",
    "name": null
  }, {
    "id": "bg_adv_19112",
    "name": null
  }, {
    "id": "bg_adv_19121",
    "name": null
  }, {
    "id": "bg_adv_19122",
    "name": null
  }, {
    "id": "bg_adv_19131",
    "name": null
  }, {
    "id": "bg_adv_19132",
    "name": null
  }, {
    "id": "bg_adv_19133",
    "name": null
  }, {
    "id": "bg_adv_19134",
    "name": null
  }, {
    "id": "bg_adv_19136",
    "name": null
  }, {
    "id": "bg_adv_19141",
    "name": null
  }, {
    "id": "bg_adv_19142",
    "name": null
  }, {
    "id": "bg_adv_19161",
    "name": null
  }, {
    "id": "bg_adv_19162",
    "name": null
  }, {
    "id": "bg_adv_19163",
    "name": null
  }, {
    "id": "bg_adv_19171",
    "name": null
  }, {
    "id": "bg_adv_19172",
    "name": null
  }, {
    "id": "bg_adv_19173",
    "name": null
  }, {
    "id": "bg_adv_19174",
    "name": null
  }, {
    "id": "bg_adv_19175",
    "name": null
  }, {
    "id": "bg_adv_19176",
    "name": null
  }, {
    "id": "bg_adv_19177",
    "name": null
  }, {
    "id": "bg_adv_19181",
    "name": null
  }, {
    "id": "bg_adv_19182",
    "name": null
  }, {
    "id": "bg_adv_19183",
    "name": null
  }, {
    "id": "bg_adv_19184",
    "name": null
  }, {
    "id": "bg_adv_19185",
    "name": null
  }, {
    "id": "bg_adv_19191",
    "name": null
  }, {
    "id": "bg_adv_19201",
    "name": null
  }, {
    "id": "bg_adv_19202",
    "name": null
  }, {
    "id": "bg_adv_19203",
    "name": null
  }, {
    "id": "bg_adv_19211",
    "name": null
  }, {
    "id": "bg_adv_19243",
    "name": null
  }, {
    "id": "bg_adv_19251",
    "name": null
  }, {
    "id": "bg_adv_19252",
    "name": null
  }, {
    "id": "bg_adv_20011",
    "name": null
  }, {
    "id": "bg_adv_20012",
    "name": null
  }, {
    "id": "bg_adv_20013",
    "name": null
  }, {
    "id": "bg_adv_20014",
    "name": null
  }, {
    "id": "bg_adv_20015",
    "name": null
  }, {
    "id": "bg_adv_20021",
    "name": null
  }, {
    "id": "bg_adv_20022",
    "name": null
  }, {
    "id": "bg_adv_20023",
    "name": null
  }, {
    "id": "bg_adv_20031",
    "name": null
  }, {
    "id": "bg_adv_20032",
    "name": null
  }, {
    "id": "bg_adv_20033",
    "name": null
  }, {
    "id": "bg_adv_20041",
    "name": null
  }, {
    "id": "bg_adv_20051",
    "name": null
  }, {
    "id": "bg_adv_20052",
    "name": null
  }, {
    "id": "bg_adv_20061",
    "name": null
  }, {
    "id": "bg_adv_20071",
    "name": null
  }, {
    "id": "bg_adv_20072",
    "name": null
  }, {
    "id": "bg_adv_20073",
    "name": null
  }, {
    "id": "bg_adv_20081",
    "name": null
  }, {
    "id": "bg_adv_20082",
    "name": null
  }, {
    "id": "bg_adv_20083",
    "name": null
  }, {
    "id": "bg_adv_20091",
    "name": null
  }, {
    "id": "bg_adv_20092",
    "name": null
  }, {
    "id": "bg_adv_20093",
    "name": null
  }, {
    "id": "bg_adv_20101",
    "name": null
  }, {
    "id": "bg_adv_20102",
    "name": null
  }, {
    "id": "bg_adv_20103",
    "name": null
  }, {
    "id": "bg_adv_20111",
    "name": null
  }, {
    "id": "bg_adv_20112",
    "name": null
  }, {
    "id": "bg_adv_20121",
    "name": null
  }, {
    "id": "bg_adv_20122",
    "name": null
  }, {
    "id": "bg_adv_20131",
    "name": null
  }, {
    "id": "bg_adv_20141",
    "name": null
  }, {
    "id": "bg_adv_20142",
    "name": null
  }, {
    "id": "bg_adv_20151",
    "name": null
  }, {
    "id": "bg_adv_20152",
    "name": null
  }, {
    "id": "bg_adv_20161",
    "name": null
  }, {
    "id": "bg_adv_20162",
    "name": null
  }, {
    "id": "bg_adv_20171",
    "name": null
  }, {
    "id": "bg_adv_20181",
    "name": null
  }, {
    "id": "bg_adv_20191",
    "name": null
  }, {
    "id": "bg_adv_20201",
    "name": null
  }, {
    "id": "bg_adv_20211",
    "name": null
  }, {
    "id": "bg_adv_20221",
    "name": null
  }, {
    "id": "bg_adv_20231",
    "name": null
  }, {
    "id": "bg_adv_20241",
    "name": null
  }, {
    "id": "bg_adv_20251",
    "name": null
  }, {
    "id": "bg_adv_20252",
    "name": null
  }, {
    "id": "bg_adv_20253",
    "name": null
  }, {
    "id": "bg_adv_20255",
    "name": null
  }, {
    "id": "bg_adv_20256",
    "name": null
  }, {
    "id": "bg_adv_20257",
    "name": null
  }, {
    "id": "bg_adv_20261",
    "name": null
  }, {
    "id": "bg_adv_20262",
    "name": null
  }, {
    "id": "bg_adv_20263",
    "name": null
  }, {
    "id": "bg_adv_20264",
    "name": null
  }, {
    "id": "bg_adv_20271",
    "name": null
  }, {
    "id": "bg_adv_20272",
    "name": null
  }, {
    "id": "bg_adv_20273",
    "name": null
  }, {
    "id": "bg_adv_20281",
    "name": null
  }, {
    "id": "bg_adv_20282",
    "name": null
  }, {
    "id": "bg_adv_20283",
    "name": null
  }, {
    "id": "bg_adv_20284",
    "name": null
  }, {
    "id": "bg_adv_20285",
    "name": null
  }, {
    "id": "bg_adv_20291",
    "name": null
  }, {
    "id": "bg_adv_20292",
    "name": null
  }, {
    "id": "bg_adv_20293",
    "name": null
  }, {
    "id": "bg_adv_20301",
    "name": null
  }, {
    "id": "bg_adv_20302",
    "name": null
  }, {
    "id": "bg_adv_20303",
    "name": null
  }, {
    "id": "bg_adv_20311",
    "name": null
  }, {
    "id": "bg_adv_20312",
    "name": null
  }, {
    "id": "bg_adv_20321",
    "name": null
  }, {
    "id": "bg_adv_20331",
    "name": null
  }, {
    "id": "bg_adv_20341",
    "name": null
  }, {
    "id": "bg_adv_20342",
    "name": null
  }, {
    "id": "bg_adv_20351",
    "name": null
  }, {
    "id": "bg_adv_20352",
    "name": null
  }, {
    "id": "bg_adv_20353",
    "name": null
  }, {
    "id": "bg_adv_20361",
    "name": null
  }, {
    "id": "bg_adv_20371",
    "name": null
  }, {
    "id": "bg_adv_20382",
    "name": null
  }, {
    "id": "bg_adv_20391",
    "name": null
  }, {
    "id": "bg_adv_20401",
    "name": null
  }, {
    "id": "bg_adv_20402",
    "name": null
  }, {
    "id": "bg_adv_20411",
    "name": null
  }, {
    "id": "bg_adv_20421",
    "name": null
  }, {
    "id": "bg_adv_20431",
    "name": null
  }, {
    "id": "bg_adv_20432",
    "name": null
  }, {
    "id": "bg_adv_20441",
    "name": null
  }, {
    "id": "bg_adv_20451",
    "name": null
  }, {
    "id": "bg_adv_20461",
    "name": null
  }, {
    "id": "bg_adv_20463",
    "name": null
  }, {
    "id": "bg_adv_20471",
    "name": null
  }, {
    "id": "bg_adv_20472",
    "name": null
  }, {
    "id": "bg_adv_21011",
    "name": null
  }, {
    "id": "bg_adv_21012",
    "name": null
  }, {
    "id": "bg_adv_21013",
    "name": null
  }, {
    "id": "bg_adv_21014",
    "name": null
  }, {
    "id": "bg_adv_21015",
    "name": null
  }, {
    "id": "bg_adv_21016",
    "name": null
  }, {
    "id": "bg_adv_21017",
    "name": null
  }, {
    "id": "bg_adv_21018",
    "name": null
  }, {
    "id": "bg_adv_21019",
    "name": null
  }, {
    "id": "bg_adv_21021",
    "name": null
  }, {
    "id": "bg_adv_21022",
    "name": null
  }, {
    "id": "bg_adv_21023",
    "name": null
  }, {
    "id": "bg_adv_21025",
    "name": null
  }, {
    "id": "bg_adv_21026",
    "name": null
  }, {
    "id": "bg_adv_21027",
    "name": null
  }, {
    "id": "bg_adv_21028",
    "name": null
  }, {
    "id": "bg_adv_21029",
    "name": null
  }, {
    "id": "bg_adv_21031",
    "name": null
  }, {
    "id": "bg_adv_21041",
    "name": null
  }, {
    "id": "bg_adv_21061",
    "name": null
  }, {
    "id": "bg_adv_21071",
    "name": null
  }, {
    "id": "bg_adv_21072",
    "name": null
  }, {
    "id": "bg_adv_21073",
    "name": null
  }, {
    "id": "bg_adv_21081",
    "name": null
  }, {
    "id": "bg_adv_21082",
    "name": null
  }, {
    "id": "bg_adv_21083",
    "name": null
  }, {
    "id": "bg_adv_21091",
    "name": null
  }, {
    "id": "bg_adv_21101",
    "name": null
  }, {
    "id": "bg_adv_21111",
    "name": null
  }, {
    "id": "bg_adv_21121",
    "name": null
  }, {
    "id": "bg_adv_21122",
    "name": null
  }, {
    "id": "bg_adv_21123",
    "name": null
  }, {
    "id": "bg_adv_21131",
    "name": null
  }, {
    "id": "bg_adv_21132",
    "name": null
  }, {
    "id": "bg_adv_21133",
    "name": null
  }, {
    "id": "bg_adv_21141",
    "name": null
  }, {
    "id": "bg_adv_21142",
    "name": null
  }, {
    "id": "bg_adv_21143",
    "name": null
  }, {
    "id": "bg_adv_21151",
    "name": null
  }, {
    "id": "bg_adv_21152",
    "name": null
  }, {
    "id": "bg_adv_21153",
    "name": null
  }, {
    "id": "bg_adv_21161",
    "name": null
  }, {
    "id": "bg_adv_21162",
    "name": null
  }, {
    "id": "bg_adv_21163",
    "name": null
  }, {
    "id": "bg_adv_21171",
    "name": null
  }, {
    "id": "bg_adv_21172",
    "name": null
  }, {
    "id": "bg_adv_21173",
    "name": null
  }, {
    "id": "bg_adv_21174",
    "name": null
  }, {
    "id": "bg_adv_21175",
    "name": null
  }, {
    "id": "bg_adv_21176",
    "name": null
  }, {
    "id": "bg_adv_21177",
    "name": null
  }, {
    "id": "bg_adv_21178",
    "name": null
  }, {
    "id": "bg_adv_21181",
    "name": null
  }, {
    "id": "bg_adv_21182",
    "name": null
  }, {
    "id": "bg_adv_21183",
    "name": null
  }, {
    "id": "bg_adv_21191",
    "name": null
  }, {
    "id": "bg_adv_21192",
    "name": null
  }, {
    "id": "bg_adv_21193",
    "name": null
  }, {
    "id": "bg_adv_21201",
    "name": null
  }, {
    "id": "bg_adv_21202",
    "name": null
  }, {
    "id": "bg_adv_21203",
    "name": null
  }, {
    "id": "bg_adv_21205",
    "name": null
  }, {
    "id": "bg_adv_21206",
    "name": null
  }, {
    "id": "bg_adv_21211",
    "name": null
  }, {
    "id": "bg_adv_21212",
    "name": null
  }, {
    "id": "bg_adv_21221",
    "name": null
  }, {
    "id": "bg_adv_21231",
    "name": null
  }, {
    "id": "bg_adv_21232",
    "name": null
  }, {
    "id": "bg_adv_21241",
    "name": null
  }, {
    "id": "bg_adv_21242",
    "name": null
  }, {
    "id": "bg_adv_21243",
    "name": null
  }, {
    "id": "bg_adv_21244",
    "name": null
  }, {
    "id": "bg_adv_21251",
    "name": null
  }, {
    "id": "bg_adv_21252",
    "name": null
  }, {
    "id": "bg_adv_21261",
    "name": null
  }, {
    "id": "bg_adv_21262",
    "name": null
  }, {
    "id": "bg_adv_21263",
    "name": null
  }, {
    "id": "bg_adv_21264",
    "name": null
  }, {
    "id": "bg_adv_21271",
    "name": null
  }, {
    "id": "bg_adv_21281",
    "name": null
  }, {
    "id": "bg_adv_21291",
    "name": null
  }, {
    "id": "bg_adv_21292",
    "name": null
  }, {
    "id": "bg_adv_21293",
    "name": null
  }, {
    "id": "bg_adv_21294",
    "name": null
  }, {
    "id": "bg_adv_21295",
    "name": null
  }, {
    "id": "bg_adv_21301",
    "name": null
  }, {
    "id": "bg_adv_21311",
    "name": null
  }, {
    "id": "bg_adv_21321",
    "name": null
  }, {
    "id": "bg_adv_21334",
    "name": null
  }, {
    "id": "bg_adv_21351",
    "name": null
  }, {
    "id": "bg_adv_21352",
    "name": null
  }, {
    "id": "bg_adv_21353",
    "name": null
  }, {
    "id": "bg_adv_21354",
    "name": null
  }, {
    "id": "bg_adv_21355",
    "name": null
  }, {
    "id": "bg_adv_21356",
    "name": null
  }, {
    "id": "bg_adv_21357",
    "name": null
  }, {
    "id": "bg_adv_21358",
    "name": null
  }, {
    "id": "bg_adv_21359",
    "name": null
  }, {
    "id": "bg_adv_21371",
    "name": null
  }, {
    "id": "bg_adv_21372",
    "name": null
  }, {
    "id": "bg_adv_21381",
    "name": null
  }, {
    "id": "bg_adv_21391",
    "name": null
  }, {
    "id": "bg_adv_21393",
    "name": null
  }, {
    "id": "bg_adv_21411",
    "name": null
  }, {
    "id": "bg_adv_21421",
    "name": null
  }, {
    "id": "bg_adv_21461",
    "name": null
  }, {
    "id": "bg_adv_21471",
    "name": null
  }, {
    "id": "bg_adv_21481",
    "name": null
  }, {
    "id": "bg_adv_21482",
    "name": null
  }, {
    "id": "bg_adv_21483",
    "name": null
  }, {
    "id": "bg_adv_23011",
    "name": null
  }, {
    "id": "bg_adv_23021",
    "name": null
  }, {
    "id": "bg_adv_23031",
    "name": null
  }, {
    "id": "bg_adv_23041",
    "name": null
  }, {
    "id": "bg_adv_24011",
    "name": null
  }, {
    "id": "bg_adv_31021",
    "name": null
  }, {
    "id": "bg_adv_31031",
    "name": null
  }, {
    "id": "bg_adv_31032",
    "name": null
  }, {
    "id": "bg_adv_46000",
    "name": null
  }, {
    "id": "bg_adv_46001",
    "name": null
  }, {
    "id": "bg_adv_46103",
    "name": null
  }, {
    "id": "bg_adv_46104",
    "name": null
  }, {
    "id": "bg_adv_46105",
    "name": null
  }, {
    "id": "bg_adv_46106",
    "name": null
  }, {
    "id": "bg_adv_46107",
    "name": null
  }, {
    "id": "bg_adv_46108",
    "name": null
  }, {
    "id": "bg_adv_46201",
    "name": null
  }, {
    "id": "bg_adv_46213",
    "name": null
  }, {
    "id": "bg_adv_46400",
    "name": null
  }, {
    "id": "bg_adv_46401",
    "name": null
  }, {
    "id": "bg_adv_46403",
    "name": null
  }, {
    "id": "bg_adv_46404",
    "name": null
  }, {
    "id": "bg_adv_46500",
    "name": null
  }, {
    "id": "bg_adv_47000",
    "name": null
  }, {
    "id": "bg_adv_47001",
    "name": null
  }, {
    "id": "bg_adv_47103",
    "name": null
  }, {
    "id": "bg_adv_47104",
    "name": null
  }, {
    "id": "bg_adv_47105",
    "name": null
  }, {
    "id": "bg_adv_47106",
    "name": null
  }, {
    "id": "bg_adv_47107",
    "name": null
  }, {
    "id": "bg_adv_47108",
    "name": null
  }, {
    "id": "bg_adv_47109",
    "name": null
  }, {
    "id": "bg_adv_48000",
    "name": null
  }, {
    "id": "bg_adv_48001",
    "name": null
  }, {
    "id": "bg_adv_90071",
    "name": null
  }, {
    "id": "bg_adv_90091",
    "name": null
  }, {
    "id": "bg_adv_91022",
    "name": null
  }, {
    "id": "bg_adv_91023",
    "name": null
  }, {
    "id": "bg_adv_91024",
    "name": null
  }, {
    "id": "bg_adv_91094",
    "name": null
  }, {
    "id": "bg_adv_91151",
    "name": null
  }, {
    "id": "bg_adv_91181",
    "name": null
  }, {
    "id": "bg_adv_92021",
    "name": null
  }, {
    "id": "bg_adv_92062",
    "name": null
  }, {
    "id": "bg_adv_92063",
    "name": null
  }, {
    "id": "bg_adv_92064",
    "name": null
  }, {
    "id": "bg_adv_93062",
    "name": null
  }, {
    "id": "bg_adv_93071",
    "name": null
  }, {
    "id": "bg_adv_93072",
    "name": null
  }, {
    "id": "bg_adv_93081",
    "name": null
  }, {
    "id": "bg_adv_93082",
    "name": null
  }, {
    "id": "bg_adv_94023",
    "name": null
  }, {
    "id": "bg_adv_94072",
    "name": null
  }, {
    "id": "bg_adv_94081",
    "name": null
  }, {
    "id": "bg_adv_95053",
    "name": null
  }, {
    "id": "bg_adv_95061",
    "name": null
  }, {
    "id": "bg_adv_95062",
    "name": null
  }, {
    "id": "bg_adv_95072",
    "name": null
  }, {
    "id": "bg_adv_96000",
    "name": null
  }, {
    "id": "bg_adv_96001",
    "name": null
  }, {
    "id": "bg_adv_96103",
    "name": null
  }, {
    "id": "bg_adv_96104",
    "name": null
  }, {
    "id": "bg_adv_96105",
    "name": null
  }, {
    "id": "bg_adv_96106",
    "name": null
  }, {
    "id": "bg_adv_96400",
    "name": null
  }, {
    "id": "bg_adv_96401",
    "name": null
  }, {
    "id": "bg_adv_96500",
    "name": null
  }, {
    "id": "bg_adv_97000",
    "name": null
  }, {
    "id": "bg_adv_97001",
    "name": null
  }, {
    "id": "bg_adv_97103",
    "name": null
  }, {
    "id": "bg_adv_97104",
    "name": null
  }, {
    "id": "bg_adv_97105",
    "name": null
  }, {
    "id": "bg_adv_97106",
    "name": null
  }, {
    "id": "bg_adv_doppel",
    "name": null
  }, {
    "id": "bg_adv_narration",
    "name": null
  }, {
    "id": "bg_adv_red",
    "name": null
  }],
  "home screen": [{
    "id": "Blue_Skies_(Default)_Background",
    "name": "Blue Skies (Default)"
  }, {
    "id": "A_Diary_to_Write_With_You_Background",
    "name": "My Diary With You"
  }, {
    "id": "New_West_Ward_(Midday)_Background",
    "name": "Shinsei Ward Panorama (Day)"
  }, {
    "id": "New_West_Ward_(Evening)_Background",
    "name": "Shinsei Ward Panorama (Sunset)"
  }, {
    "id": "New_West_Ward_(Night)_Background",
    "name": "Shinsei Ward Panorama (Night)"
  }, {
    "id": "Magical_Halloween_Theater__A_Magical_Girl_Troupe_for_a_Day__Background",
    "name": "Halloween Theater"
  }, {
    "id": "We_Passed_the_First_of_That_Day_Background",
    "name": "Reaching a Happier Height"
  }, {
    "id": "Another_Daze_Background",
    "name": "Another Daze"
  }, {
    "id": "The_Crescent_Moon_Manor's_Merry_Christmas_Background",
    "name": "Christmas at Mikazuki Villa"
  }, {
    "id": "Happy_New_Year_at_the_Mizuna_Shrine!_Background",
    "name": "New Year's at Mizuna Shrine"
  }, {
    "id": "À_La_Carte_Valentine__Delivering_Everyone's_Feelings__Background",
    "name": "À la Carte Valentines"
  }, {
    "id": "The_Chiming_Bell_that_Transcends_Time_Background",
    "name": "The Maiden of Hope"
  }, {
    "id": "Bye_Bye,_See_You_Tomorrow_Background",
    "name": "See You Tomorrow"
  }, {
    "id": "The_Howa-Howa_Girl_Tries_Her_Best!_Background",
    "name": "Wait, You Got It Wrong!"
  }, {
    "id": "FM_Kamihama_Holy_Radio_Station_Background",
    "name": "FM Kamihama"
  }, {
    "id": "Cross_Connection_Background",
    "name": "CROSS CONNECTION"
  }, {
    "id": "A_Voice_From_Beyond_That_Strokes_the_Ears_Background",
    "name": "Voices from Beyond"
  }, {
    "id": "Spurred_to_Separation_Background",
    "name": "Breakpoint"
  }, {
    "id": "Newbie_Maid_Carefree_Kanagi_Background",
    "name": "Let's See What You're Maid Of"
  }, {
    "id": "The_Ribbon_at_the_Beach_(1)_Background",
    "name": "Beachside Bonds Background 1"
  }, {
    "id": "The_Ribbon_at_the_Beach_(2)_Background",
    "name": "Beachside Bonds Background 2"
  }, {
    "id": "The_Crescent_Moon_Manor's_Summer_Vacation_Background",
    "name": "The_Crescent_Moon_Manor's_Summer_Vacation"
  }, {
    "id": "Yes,_Let's_Go_to_the_Baths!_Background",
    "name": "Let's Hit the Suitoku Baths!"
  }, {
    "id": "And_From_Here_On._(1)_Background",
    "name": "Hereafter 1"
  }, {
    "id": "And_From_Here_On._(2)_Background",
    "name": "Hereafter 2"
  }, {
    "id": "It's_Okay_to_Be_Clumsy_Background",
    "name": "It's Okay to Be Clumsy"
  }, {
    "id": "Whereabouts_of_the_Feather_Background",
    "name": "Wings in the Wind"
  }, {
    "id": "Alina_Is_Coming_to_Town_(1)_Background",
    "name": "Alina is Comin' to Town 1"
  }, {
    "id": "Alina_Is_Coming_to_Town_(2)_Background",
    "name": "Alina is Comin' to Town 2"
  }, {
    "id": "Mitama_and_the_Delicious_New_Year's_Party_Background",
    "name": "Mitama's Festive Feast"
  }, {
    "id": "Beginning_and_Eternal_Background",
    "name": "Endless Beginnings"
  }, {
    "id": "Madogatari_Exhibition_Collaboration_Background",
    "name": "Madogatari_Exhibition_Collaboration"
  }, {
    "id": "Kamihama_Rarity_Star_(1)_Background",
    "name": "Kamihama_Rarity_Star_(1)"
  }, {
    "id": "Kamihama_Rarity_Star_(2)_Background",
    "name": "Kamihama_Rarity_Star_(2)"
  }, {
    "id": "Leaving_the_Nest_Looking_Skyward_Background",
    "name": "A Fledgling's First Flight"
  }, {
    "id": "Sayuki_Steps_Up!_(1)_Background",
    "name": "Sayuki Steps Up! 1"
  }, {
    "id": "Sayuki_Steps_Up!_(2)_Background",
    "name": "Sayuki Steps Up! 2"
  }, {
    "id": "The_Ephemeral_Summer_Night_Background",
    "name": "One Fleeting Summer Night"
  }, {
    "id": "Rebels_from_the_Land_of_Everlasting_Night_Background",
    "name": "Rebel of a Dawnless Land"
  }, {
    "id": "CoCo_ICHI_Collab_Background",
    "name": "CoCo_ICHI_Collab"
  }, {
    "id": "SamaTore!_The_Summer_Treasure_that_Disappeared_into_the_Fire_(1)_Background",
    "name": "Summer Treasures 1"
  }, {
    "id": "SamaTore!_The_Summer_Treasure_that_Disappeared_into_the_Fire_(2)_Background",
    "name": "Summer Treasures 2"
  }, {
    "id": "The_Green_Jasper_Diviners_(1)_Background",
    "name": "The_Green_Jasper_Diviners_(1)"
  }, {
    "id": "The_Green_Jasper_Diviners_(2)_Background",
    "name": "The_Green_Jasper_Diviners_(2)"
  }, {
    "id": "From_New_Breath_(1)_Background",
    "name": "A New Beginning 1"
  }, {
    "id": "From_New_Breath_(2)_Background",
    "name": "A New Beginning 2"
  }, {
    "id": "Dawn_of_the_Shallow_Dream_(1)_Background",
    "name": "Dawn_of_the_Shallow_Dream_(1)"
  }, {
    "id": "Dawn_of_the_Shallow_Dream_(2)_Background",
    "name": "Dawn_of_the_Shallow_Dream_(2)"
  }, {
    "id": "Dawn_of_the_Shallow_Dream_(3)_Background",
    "name": "Dawn_of_the_Shallow_Dream_(3)"
  }, {
    "id": "Crimson_Resolve_Background",
    "name": "Crimson_Resolve"
  }, {
    "id": "Rumors_in_Disguise_Background",
    "name": "Rumors_in_Disguise"
  }, {
    "id": "Rondo_of_Oblivion_Sleeps_for_Eternity_(1)_Background",
    "name": "Rondo_of_Oblivion_Sleeps_for_Eternity_(1)"
  }, {
    "id": "Rondo_of_Oblivion_Sleeps_for_Eternity_(2)_Background",
    "name": "Rondo_of_Oblivion_Sleeps_for_Eternity_(2)"
  }, {
    "id": "The_Page_I_Write_on_the_Holy_Night_(1)_Background",
    "name": "The_Page_I_Write_on_the_Holy_Night_(1)"
  }, {
    "id": "The_Page_I_Write_on_the_Holy_Night_(2)_Background",
    "name": "The_Page_I_Write_on_the_Holy_Night_(2)"
  }, {
    "id": "Happy_New_Year's_First_Festival!_Background",
    "name": "Happy_New_Year's_First_Festival!"
  }, {
    "id": "I'll_Keep_Waving_At_You_Background",
    "name": "I'll_Keep_Waving_At_You"
  }, {
    "id": "Warming_Valentine_Background",
    "name": "Warming_Valentine"
  }, {
    "id": "The_Mirror_World_Chocolatier_Part_1_Background",
    "name": "The_Mirror_World_Chocolatier_Part_1"
  }, {
    "id": "The_Mirror_World_Chocolatier_Part_2_Background",
    "name": "The_Mirror_World_Chocolatier_Part_2"
  }, {
    "id": "Tracks_of_Cherry_Blossom_Background",
    "name": "Tracks_of_Cherry_Blossom"
  }, {
    "id": "Idol_Office_Background",
    "name": "Idol_Office"
  }, {
    "id": "KamiFest_Background",
    "name": "KamiFest"
  }]
};
exports.background_collection = background_collection;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.character_collection = void 0;
var character_collection = [{
  "id": "1001",
  "name": "Tamaki Iroha",
  "name_jp": "環 いろは",
  "name_na": "Iroha Tamaki",
  "attribute": "Light",
  "ranks": {
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tamaki_Iroha"
}, {
  "id": "1002",
  "name": "Nanami Yachiyo",
  "name_jp": "七海 やちよ",
  "name_na": "Yachiyo Nanami",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Nanami_Yachiyo"
}, {
  "id": "1003",
  "name": "Yui Tsuruno",
  "name_jp": "由比 鶴乃",
  "name_na": "Tsuruno Yui",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yui_Tsuruno"
}, {
  "id": "1004",
  "name": "Futaba Sana",
  "name_jp": "二葉 さな",
  "name_na": "Sana Futaba",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-10-23",
  "release_date_na": "2019-08-06",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Futaba_Sana"
}, {
  "id": "1005",
  "name": "Mitsuki Felicia",
  "name_jp": "深月 フェリシア",
  "name_na": "Felicia Mitsuki",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-09-04",
  "release_date_na": "2019-07-18",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Mitsuki_Felicia"
}, {
  "id": "1006",
  "name": "Azusa Mifuyu",
  "name_jp": "梓 みふゆ",
  "name_na": "Mifuyu Azusa",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-06-08",
  "release_date_na": "2020-01-30",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Azusa_Mifuyu"
}, {
  "id": "1007",
  "name": "Satomi Touka",
  "name_jp": "里見 灯花",
  "name_na": "Touka Satomi",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-03-05",
  "release_date_na": "2020-06-15",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Satomi_Touka"
}, {
  "id": "1008",
  "name": "Alina Gray",
  "name_jp": "アリナ・グレイ",
  "name_na": "Alina Gray",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-03-02",
  "release_date_na": "2019-09-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Alina_Gray"
}, {
  "id": "1009",
  "name": "Minami Rena",
  "name_jp": "水波 レナ",
  "name_na": "Rena Minami",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Minami_Rena"
}, {
  "id": "1010",
  "name": "Togame Momoko",
  "name_jp": "十咎 ももこ",
  "name_na": "Momoko Togame",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Togame_Momoko"
}, {
  "id": "1011",
  "name": "Akino Kaede",
  "name_jp": "秋野 かえで",
  "name_na": "Kaede Akino",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Akino_Kaede"
}, {
  "id": "1012",
  "name": "Misono Karin",
  "name_jp": "御園 かりん",
  "name_na": "Karin Misono",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-10-30",
  "release_date_na": "2019-10-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Misono_Karin"
}, {
  "id": "1013",
  "name": "Tatsuki Asuka",
  "name_jp": "竜城 明日香",
  "name_na": "Asuka Tatsuki",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Tatsuki_Asuka"
}, {
  "id": "1014",
  "name": "Hiiragi Nemu",
  "name_jp": "柊 ねむ",
  "name_na": "Nemu Hiiragi",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-03-15",
  "release_date_na": "2020-06-19",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Hiiragi_Nemu"
}, {
  "id": "1015",
  "name": "Tamaki Ui",
  "name_jp": "環 うい",
  "name_na": "Ui Tamaki",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-04-26",
  "release_date_na": "2020-07-07",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Tamaki_Ui"
}, {
  "id": "1016",
  "name": "Izumi Kanagi",
  "name_jp": "和泉 十七夜",
  "name_na": "Kanagi Izumi",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-06-25",
  "release_date_na": "2020-03-09",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Izumi_Kanagi"
}, {
  "id": "1017",
  "name": "Yakumo Mitama",
  "name_jp": "八雲 みたま",
  "name_na": "Mitama Yakumo",
  "attribute": "Void",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-04-13",
  "release_date_na": "2019-11-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yakumo_Mitama"
}, {
  "id": "1018",
  "name": "Amane Tsukuyo",
  "name_jp": "天音 月夜",
  "name_na": "Tsukuyo Amane",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-11-30",
  "release_date_na": "2019-08-22",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Amane_Tsukuyo"
}, {
  "id": "1019",
  "name": "Amane Tsukasa",
  "name_jp": "天音 月咲",
  "name_na": "Tsukasa Amane",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-11-30",
  "release_date_na": "2019-08-22",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Amane_Tsukasa"
}, {
  "id": "1021",
  "name": "Kureha Yuna",
  "name_jp": "紅晴 結菜",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-08-10",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kureha_Yuna"
}, {
  "id": "1022",
  "name": "Kirari Hikaru",
  "name_jp": "煌里 ひかる",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-10-15",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kirari_Hikaru"
}, {
  "id": "1023",
  "name": "Kasane Ao",
  "name_jp": "笠音 アオ",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-04-13",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kasane_Ao"
}, {
  "id": "1024",
  "name": "Ooba Juri",
  "name_jp": "大庭 樹里",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-01-18",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Ooba_Juri"
}, {
  "id": "1025",
  "name": "Tokime Shizuka",
  "name_jp": "時女 静香",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-09-18",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Tokime_Shizuka"
}, {
  "id": "1026",
  "name": "Hiroe Chiharu",
  "name_jp": "広江 ちはる",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-08-09",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Hiroe_Chiharu"
}, {
  "id": "1027",
  "name": "Toki Sunao",
  "name_jp": "土岐 すなお",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-11-11",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Toki_Sunao"
}, {
  "id": "1029",
  "name": "Miyabi Shigure",
  "name_jp": "宮尾 時雨",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-12-09",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Miyabi_Shigure"
}, {
  "id": "1030",
  "name": "Azumi Hagumu",
  "name_jp": "安積 はぐむ",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-02-25",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Azumi_Hagumu"
}, {
  "id": "1031",
  "name": "Kagura San",
  "name_jp": "神楽 燦",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-11-12",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kagura_San"
}, {
  "id": "1032",
  "name": "Yukari Miyuri",
  "name_jp": "遊狩 ミユリ",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-11-19",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yukari_Miyuri"
}, {
  "id": "1034",
  "name": "Miura Asahi",
  "name_jp": "三浦 旭",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2022-01-28",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Miura_Asahi"
}, {
  "id": "1035",
  "name": "Kurusu Alexandra",
  "name_jp": "栗栖 アレクサンドラ",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-04-14",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kurusu_Alexandra"
}, {
  "id": "1037",
  "name": "Satomi Nayuta",
  "name_jp": "里見 那由他",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-06-11",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Satomi_Nayuta"
}, {
  "id": "1038",
  "name": "Yakumo Mikage",
  "name_jp": "八雲 みかげ",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-11-16",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yakumo_Mikage"
}, {
  "id": "1039",
  "name": "Sawa Sudachi",
  "name_jp": "佐和月出里",
  "name_na": "",
  "attribute": "Void",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-07-06",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Sawa_Sudachi"
}, {
  "id": "1040",
  "name": "Sasame Yozuru",
  "name_jp": "篠目 ヨヅル",
  "name_na": "",
  "attribute": "Void",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-03-09",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Sasame_Yozuru"
}, {
  "id": "1041",
  "name": "Livia Medeiros",
  "name_jp": "リヴィア・メディロス",
  "name_na": "",
  "attribute": "Void",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-01-17",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Livia_Medeiros"
}, {
  "id": "1042",
  "name": "Little Kyubey",
  "name_jp": "小さなキュゥべえ",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-08-21",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Little_Kyubey"
}, {
  "id": "1101",
  "name": "Tamaki Iroha (Mizugi ver.)",
  "name_jp": "環 いろは (水着ver.)",
  "name_na": "Iroha Tamaki (Swimsuit)",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-08-08",
  "release_date_na": "2020-06-02",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tamaki_Iroha_(Mizugi_ver.)"
}, {
  "id": "1102",
  "name": "Yachiyo & Mifuyu (Beginning ver.)",
  "name_jp": "やちよ & ふゆ (始まり ver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-10-12",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Yachiyo_%26_Mifuyu_(Beginning_ver.)"
}, {
  "id": "1103",
  "name": "Rumor Tsuruno",
  "name_jp": "ウワサの鶴乃",
  "name_na": "Uwasa Tsuruno",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-06-01",
  "release_date_na": "2020-01-17",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rumor_Tsuruno"
}, {
  "id": "1104",
  "name": "Rumor Sana",
  "name_jp": "ウワサのさな",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-02-12",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rumor_Sana"
}, {
  "id": "1105",
  "name": "Felicia-chan",
  "name_jp": "フェリシアちゃん",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2019-04-15",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Felicia-chan"
}, {
  "id": "1107",
  "name": "Touka & Nemu (Holy Night ver.)",
  "name_jp": "灯花・ねむ (聖夜ver.)",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-12-16",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Touka_%26_Nemu_(Holy_Night_ver.)"
}, {
  "id": "1108",
  "name": "Holy Alina",
  "name_jp": "ホーリーアリナ",
  "name_na": "Holy Alina",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-12-11",
  "release_date_na": "2019-12-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Holy_Alina"
}, {
  "id": "1109",
  "name": "Rena-chan (Idol ver.)",
  "name_jp": "レナちゃん (アイドル ver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-04-02",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rena-chan_(Idol_ver.)"
}, {
  "id": "1110",
  "name": "Togame Momoko (Sister ver.)",
  "name_jp": "十咎ももこ (シスターver.)",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-11-02",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Togame_Momoko_(Sister_ver.)"
}, {
  "id": "1112",
  "name": "Karin & Alina (Halloween ver.)",
  "name_jp": "かりん・アリナ (ハロウィンver.)",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-11-19",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Karin_%26_Alina_(Halloween_ver.)"
}, {
  "id": "1116",
  "name": "Izumi Kanagi (Vampire ver.)",
  "name_jp": "十咎ももこ (シスターver.)",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-10-23",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Izumi_Kanagi_(Vampire_ver.)"
}, {
  "id": "1117",
  "name": "Yakumo Mitama (Haregi ver.)",
  "name_jp": "八雲 みたま (晴着ver.)",
  "name_na": "Mitama Yakumo (Kimono)",
  "attribute": "Void",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-01-01",
  "release_date_na": "2020-01-08",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Yakumo_Mitama_(Haregi_ver.)"
}, {
  "id": "1118",
  "name": "Amane Sisters (Mizugi ver.)",
  "name_jp": "天音姉妹",
  "name_na": "Amane Sisters (Swimsuit)",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-07-01",
  "release_date_na": "2020-07-15",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Amane_Sisters_(Mizugi_ver.)"
}, {
  "id": "1125",
  "name": "Tokime Shizuka (First Sunrise of the Year ver.)",
  "name_jp": "時女 静香 (初日の出ver.)",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2022-01-01",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tokime_Shizuka_(First_Sunrise_of_the_Year_ver.)"
}, {
  "id": "1137",
  "name": "Nayuta & Mikage (Christmas ver.)",
  "name_jp": "那由他・みかげ (クリスマスver.)",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-12-20",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Nayuta_%26_Mikage_(Christmas_ver.)"
}, {
  "id": "1201",
  "name": "Iroha-chan",
  "name_jp": "いろはちゃん",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-04-15",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Iroha-chan"
}, {
  "id": "1202",
  "name": "Nanami Yachiyo (Tanabata ver.)",
  "name_jp": "七海 やちよ (七夕ver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-06-28",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Nanami_Yachiyo_(Tanabata_ver.)"
}, {
  "id": "1203",
  "name": "Tsuruno & Felicia (Delivery ver.)",
  "name_jp": "鶴乃・フェリシア (宅配ver.)",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-12-04",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tsuruno_%26_Felicia_(Delivery_ver.)"
}, {
  "id": "1209",
  "name": "Rena & Kaede (Mizugi ver.)",
  "name_jp": "レナ・かえで (水着ver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-07-15",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rena_&_Kaede_(Mizugi_ver.)"
}, {
  "id": "1210",
  "name": "Momoko & Mitama (Mermaid ver.)",
  "name_jp": "ももこ・みたま (人魚ver.)",
  "name_na": "",
  "attribute": "Void",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-07-12",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Momoko_%26_Mitama_(Mermaid_ver.)"
}, {
  "id": "1301",
  "name": "Iroha & Yachiyo (Final Battle ver.)",
  "name_jp": "いろは・やちよ（決戦ver.",
  "name_na": "Iroha & Yachiyo (Final Battle)",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-08-22",
  "release_date_na": "2020-08-12",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Iroha_&_Yachiyo_(Final_Battle_ver.)"
}, {
  "id": "1302",
  "name": "Nanami Yachiyo (Anime ver.)",
  "name_jp": "七海 やちよ (アニメver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2022-01-11",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Nanami_Yachiyo_(Anime_ver.)"
}, {
  "id": "1401",
  "name": "Iroha & Ui (Miko ver.)",
  "name_jp": "いろは・うい (巫女ver.)",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-01-01",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Iroha_%26_Ui_(Miko_ver.)"
}, {
  "id": "2001",
  "name": "Kaname Madoka",
  "name_jp": "鹿目 まどか",
  "name_na": "Madoka Kaname",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kaname_Madoka"
}, {
  "id": "2002",
  "name": "Akemi Homura",
  "name_jp": "暁美 ほむら",
  "name_na": "Homura Akemi",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-01-21",
  "release_date_na": "2020-04-03",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Akemi_Homura"
}, {
  "id": "2003",
  "name": "Akemi Homura (Megane ver.)",
  "name_jp": "暁美 ほむら (眼鏡ver.)",
  "name_na": "Homura Akemi (Glasses)",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Akemi_Homura_(Megane_ver.)"
}, {
  "id": "2004",
  "name": "Miki Sayaka",
  "name_jp": "美樹 さやか",
  "name_na": "Sayaka Miki",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-01-22",
  "release_date_na": "2019-08-29",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Miki_Sayaka"
}, {
  "id": "2005",
  "name": "Tomoe Mami",
  "name_jp": "巴 マミ",
  "name_na": "Mami Tomoe",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Tomoe_Mami"
}, {
  "id": "2006",
  "name": "Sakura Kyouko",
  "name_jp": "佐倉 杏子",
  "name_na": "Kyoko Sakura",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-09-29",
  "release_date_na": "2019-07-02",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Sakura_Kyouko"
}, {
  "id": "2007",
  "name": "Momoe Nagisa",
  "name_jp": "百江 なぎさ",
  "name_na": "Nagisa Momoe",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-10-29",
  "release_date_na": "2020-04-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Momoe_Nagisa"
}, {
  "id": "2100",
  "name": "Kaname Madoka (Haregi ver.)",
  "name_jp": "鹿目 まどか (晴着ver.)",
  "name_na": "Madoka Kaname (Kimono)",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-01-01",
  "release_date_na": "2020-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Kaname_Madoka_(Haregi_ver.)"
}, {
  "id": "2101",
  "name": "Ultimate Madoka",
  "name_jp": "アルティメットまどか",
  "name_na": "Ultimate Madoka",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-08-21",
  "release_date_na": "2020-02-25",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Ultimate_Madoka"
}, {
  "id": "2102",
  "name": "Madoka-senpai",
  "name_jp": "まどか先輩",
  "name_na": "Madoka-senpai",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-04-02",
  "release_date_na": "2019-11-05",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Madoka-senpai"
}, {
  "id": "2103",
  "name": "Ultimate Madoka-senpai",
  "name_jp": "究極まどか先輩",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-04-02",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Ultimate_Madoka-senpai"
}, {
  "id": "2104",
  "name": "Madoka & Iroha",
  "name_jp": "まどか・いろは",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-08-22",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Madoka_%26_Iroha"
}, {
  "id": "2300",
  "name": "Akemi Homura (Mizugi ver.)",
  "name_jp": "暁美 ほむら (水着ver.)",
  "name_na": "Homura Akemi (Swimsuit)",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-07-20",
  "release_date_na": "2020-05-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Akemi_Homura_(Mizugi_ver.)"
}, {
  "id": "2400",
  "name": "Miki Sayaka (Haregi ver.)",
  "name_jp": "美樹 さやか (晴着ver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-01-01",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Miki_Sayaka (Haregi ver.)"
}, {
  "id": "2401",
  "name": "Miki Sayaka (Surfing ver.)",
  "name_jp": "美樹 さやか (波乗りver.)",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-07-30",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Miki_Sayaka_(Surfing_ver.)"
}, {
  "id": "2500",
  "name": "Holy Mami",
  "name_jp": "ホーリーマミ",
  "name_na": "Holy Mami",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-12-15",
  "release_date_na": "2019-12-04",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Holy_Mami"
}, {
  "id": "2501",
  "name": "Tomoe Mami (Mizugi ver.)",
  "name_jp": "巴 マミ (水着ver.)",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-07-27",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tomoe_Mami_(Mizugi_ver.)"
}, {
  "id": "2502",
  "name": "Holy Mami (Anime ver.)",
  "name_jp": "ホーリーマミ (アニメver.)",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-12-10",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Holy_Mami_(Anime_ver.)"
}, {
  "id": "2600",
  "name": "Sakura Kyouko (Mizugi ver.)",
  "name_jp": "佐倉 杏子（水着ver.",
  "name_na": "Kyoko Sakura (Swimsuit)",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-07-26",
  "release_date_na": "2020-08-03",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Sakura_Kyouko_(Mizugi_ver.)"
}, {
  "id": "2602",
  "name": "Sakura Kyouko (Doppel ver.)",
  "name_jp": "佐倉 杏子 (ドッペルver.)",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2022-02-10",
  "release_date_na": "2050-01-04",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Sakura_Kyouko_(Doppel_ver.)"
}, {
  "id": "2700",
  "name": "Momoe Nagisa (Valentine's ver.)",
  "name_jp": "百江 なぎさ（バレンタインver.）",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-02-14",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Momoe_Nagisa_(Valentine's_ver.)"
}, {
  "id": "3001",
  "name": "Yayoi Kanoko",
  "name_jp": "矢宵 かのこ",
  "name_na": "Kanoko Yayoi",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yayoi_Kanoko"
}, {
  "id": "3002",
  "name": "Utsuho Natsuki",
  "name_jp": "空穂 夏希",
  "name_na": "Natsuki Utsuho",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Utsuho_Natsuki"
}, {
  "id": "3003",
  "name": "Miyako Hinano",
  "name_jp": "都 ひなの",
  "name_na": "Hinano Miyako",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Miyako_Hinano"
}, {
  "id": "3004",
  "name": "Minagi Sasara",
  "name_jp": "美凪 ささら",
  "name_na": "Sasara Minagi",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Minagi_Sasara"
}, {
  "id": "3005",
  "name": "Tokiwa Nanaka",
  "name_jp": "常盤 ななか",
  "name_na": "Nanaka Tokiwa",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Tokiwa_Nanaka"
}, {
  "id": "3006",
  "name": "Kisaki Emiri",
  "name_jp": "木崎 衣美里",
  "name_na": "Emiri Kisaki",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kisaki_Emiri"
}, {
  "id": "3007",
  "name": "Hozumi Shizuku",
  "name_jp": "保澄 雫",
  "name_na": "Shizuku Hozumi",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Hozumi_Shizuku"
}, {
  "id": "3008",
  "name": "Shinobu Akira",
  "name_jp": "志伸 あきら",
  "name_na": "Akira Shinobu",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Shinobu_Akira"
}, {
  "id": "3009",
  "name": "Kurumi Manaka",
  "name_jp": "胡桃 まなか",
  "name_na": "Manaka Kurumi",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kurumi_Manaka"
}, {
  "id": "3010",
  "name": "Ami Ria",
  "name_jp": "阿見 莉愛",
  "name_na": "Ria Ami",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2018-04-23",
  "release_date_na": "2019-10-11",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Ami_Ria"
}, {
  "id": "3011",
  "name": "Natsume Kako",
  "name_jp": "夏目 かこ",
  "name_na": "Kako Natsume",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Natsume_Kako"
}, {
  "id": "3012",
  "name": "Chun Meiyui",
  "name_jp": "純 美雨",
  "name_na": "Meiyui Chun",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Chun_Meiyui"
}, {
  "id": "3013",
  "name": "Ibuki Reira",
  "name_jp": "伊吹 れいら",
  "name_na": "Leila Ibuki",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2018-03-12",
  "release_date_na": "2019-09-30",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Ibuki_Reira"
}, {
  "id": "3014",
  "name": "Kumi Seika",
  "name_jp": "桑水 せいか",
  "name_na": "Seika Kumi",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2018-03-12",
  "release_date_na": "2019-09-30",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Kumi_Seika"
}, {
  "id": "3015",
  "name": "Aino Mito",
  "name_jp": "相野 みと",
  "name_na": "Mito Aino",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-03-12",
  "release_date_na": "2019-09-30",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Aino_Mito"
}, {
  "id": "3016",
  "name": "Awane Kokoro",
  "name_jp": "粟根 こころ",
  "name_na": "Kokoro Awane",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-11-10",
  "release_date_na": "2019-08-06",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Awane_Kokoro"
}, {
  "id": "3017",
  "name": "Nanase Yukika",
  "name_jp": "七瀬 ゆきか",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-09-17",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Nanase_Yukika"
}, {
  "id": "3018",
  "name": "Sarasa Hanna",
  "name_jp": "更紗 帆奈",
  "name_na": "Hanna Sarasa",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-05-24",
  "release_date_na": "2020-08-21",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Sarasa_Hanna"
}, {
  "id": "3019",
  "name": "Mariko Ayaka",
  "name_jp": "毬子 あやか",
  "name_na": "Ayaka Mariko",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Mariko_Ayaka"
}, {
  "id": "3020",
  "name": "Mao Himika",
  "name_jp": "眞尾 ひみか",
  "name_na": "Himika Mao",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-04-02",
  "release_date_na": "2019-11-05",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Mao_Himika"
}, {
  "id": "3021",
  "name": "Suzuka Sakuya",
  "name_jp": "鈴鹿 さくや",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-01-27",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Suzuka_Sakuya"
}, {
  "id": "3023",
  "name": "Eri Aimi",
  "name_jp": "江利 あいみ",
  "name_na": "Aimi Eri",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-10-23",
  "release_date_na": "2019-08-06",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Eri_Aimi"
}, {
  "id": "3024",
  "name": "Wakana Tsumugi",
  "name_jp": "若菜 つむぎ",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-05-18",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Wakana_Tsumugi"
}, {
  "id": "3025",
  "name": "Isuzu Ren",
  "name_jp": "五十鈴 れん",
  "name_na": "Ren Isuzu",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-09-15",
  "release_date_na": "2019-07-09",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Isuzu_Ren"
}, {
  "id": "3026",
  "name": "Shizumi Konoha",
  "name_jp": "静海 このは",
  "name_na": "Konoha Shizumi",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-10-10",
  "release_date_na": "2019-07-23",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Shizumi_Konoha"
}, {
  "id": "3027",
  "name": "Yusa Hazuki",
  "name_jp": "遊佐 葉月",
  "name_na": "Hazuki Yusa",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-10-10",
  "release_date_na": "2019-07-23",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yusa_Hazuki"
}, {
  "id": "3028",
  "name": "Mikuri Ayame",
  "name_jp": "三栗 あやめ",
  "name_na": "Ayame Mikuri",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-10-10",
  "release_date_na": "2019-07-23",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Mikuri_Ayame"
}, {
  "id": "3029",
  "name": "Kagami Masara",
  "name_jp": "加賀見 まさら",
  "name_na": "Masara Kagami",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kagami_Masara"
}, {
  "id": "3030",
  "name": "Haruna Konomi",
  "name_jp": "春名 このみ",
  "name_na": "Konomi Haruna",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Haruna_Konomi"
}, {
  "id": "3031",
  "name": "Ayano Rika",
  "name_jp": "綾野 梨花",
  "name_na": "Rika Ayano",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Ayano_Rika"
}, {
  "id": "3032",
  "name": "Kozue Mayu",
  "name_jp": "梢 麻友",
  "name_na": "Mayu Kozue",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-03-23",
  "release_date_na": "2019-11-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kozue_Mayu"
}, {
  "id": "3033",
  "name": "Fumino Sayuki",
  "name_jp": "史乃 沙優希",
  "name_na": "Sayuki Fumino",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-06-10",
  "release_date_na": "2020-05-22",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Fumino_Sayuki"
}, {
  "id": "3034",
  "name": "Megumi Moka",
  "name_jp": "恵 萌花",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-02-25",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Megumi_Moka"
}, {
  "id": "3035",
  "name": "Chiaki Riko",
  "name_jp": "千秋 理子",
  "name_na": "Riko Chiaki",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-10-09",
  "release_date_na": "2020-03-19",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Chiaki_Riko"
}, {
  "id": "3036",
  "name": "Yuki Maria",
  "name_jp": "由貴真里愛",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-04-13",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yuki_Maria"
}, {
  "id": "3037",
  "name": "Anna Meru",
  "name_jp": "安名 メル",
  "name_na": "Mel Anna",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-05-21",
  "release_date_na": "2020-1-21",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Anna_Meru"
}, {
  "id": "3038",
  "name": "Komachi Mikura",
  "name_jp": "古町 みくら",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-11-29",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Komachi_Mikura"
}, {
  "id": "3039",
  "name": "Mihono Seira",
  "name_jp": "三穂野 せいら",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2019-11-29",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Mihono_Seira"
}, {
  "id": "3040",
  "name": "Kira Temari",
  "name_jp": "吉良 てまり",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2019-11-29",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kira_Temari"
}, {
  "id": "3041",
  "name": "Yuzuki Hotori",
  "name_jp": "柚希 ほとり",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-05-29",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yuzuki_Hotori"
}, {
  "id": "3042",
  "name": "Hibiki Meguru",
  "name_jp": "枇々木 めぐる",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-03-09",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Hibiki_Meguru"
}, {
  "id": "3043",
  "name": "Rumor of the Ten-Thousand-Year Sakura",
  "name_jp": "万年桜のウワサ",
  "name_na": "Eternal Sakura",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-03-25",
  "release_date_na": "2020-06-29",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rumor_of_the_Ten-Thousand-Year_Sakura"
}, {
  "id": "3044",
  "name": "Chizu Ranka",
  "name_jp": "智珠 らんか",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-01-17",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Chizu_Ranka"
}, {
  "id": "3045",
  "name": "Yuzuki Rion",
  "name_jp": "柚希 りおん",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-05-29",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Yuzuki_Rion"
}, {
  "id": "3046",
  "name": "Midori Ryou",
  "name_jp": "観鳥 令",
  "name_na": "Ryo Midori",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-11-12",
  "release_date_na": "2020-04-22",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Midori_Ryou"
}, {
  "id": "3047",
  "name": "Aoba Chika",
  "name_jp": "青葉ちか",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2020-07-06",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Aoba_Chika"
}, {
  "id": "3048",
  "name": "Yura Hotaru",
  "name_jp": "由良 蛍",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": false
  },
  "release_date": "2021-08-13",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yura_Hotaru"
}, {
  "id": "3049",
  "name": "Yukino Kanae",
  "name_jp": "雪野 かなえ",
  "name_na": "Kanae Yukino",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-05-21",
  "release_date_na": "2020-01-21",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Yukino_Kanae"
}, {
  "id": "3050",
  "name": "Kaharu Yuuna",
  "name_jp": "香春 ゆうな",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-05-29",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kaharu_Yuuna"
}, {
  "id": "3051",
  "name": "Kazari Jun",
  "name_jp": "飾利 潤",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-09-28",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kazari_Jun"
}, {
  "id": "3052",
  "name": "Ashley Taylor",
  "name_jp": "",
  "name_na": "Ashley Taylor",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2050-01-01",
  "release_date_na": "2020-03-27",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Ashley_Taylor"
}, {
  "id": "3053",
  "name": "Makino Ikumi",
  "name_jp": "牧野 郁美",
  "name_na": "Ikumi Makino",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-11-12",
  "release_date_na": "2020-04-22",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Makino_Ikumi"
}, {
  "id": "3054",
  "name": "Miwa Mitsune",
  "name_jp": "三輪 みつね",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-03-22",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Miwa_Mitsune"
}, {
  "id": "3055",
  "name": "Kirino Sae",
  "name_jp": "桐野 紗枝",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-06-04",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kirino_Sae"
}, {
  "id": "3056",
  "name": "Mizuki Rui",
  "name_jp": "水樹 塁",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-05-01",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Mizuki_Rui"
}, {
  "id": "3058",
  "name": "Natsu Ryouko",
  "name_jp": "南津 涼子",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-01-27",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Natsu_Ryouko"
}, {
  "id": "3059",
  "name": "Irina Kushu",
  "name_jp": "入名 クシュ",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-09-21",
  "release_date_na": "2050-01-01",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Irina_Kushu"
}, {
  "id": "3501",
  "name": "Rika & Ren (Christmas ver.)",
  "name_jp": "梨花・れん クリスマスver.",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-12-16",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rika_& Ren (Christmas ver.)"
}, {
  "id": "3502",
  "name": "Rumor of the Ten-Thousand-Year Sakura (Mizugi ver.)",
  "name_jp": "万年桜のウワサ (水着ver.)",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-08-07",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Rumor_of_the_Ten-Thousand-Year_Sakura_(Mizugi_ver.)"
}, {
  "id": "3503",
  "name": "Konoha & Hazuki",
  "name_jp": "このは・葉月",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-04-30",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Konoha_%26_Hazuki"
}, {
  "id": "3900",
  "name": "Kuro",
  "name_jp": "黒",
  "name_na": "Kuro",
  "attribute": "Dark",
  "ranks": {
    "1": true,
    "2": false,
    "3": false,
    "4": false,
    "5": false
  },
  "release_date": "2018-02-15",
  "release_date_na": "2020-02-14",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Kuro"
}, {
  "id": "4001",
  "name": "Mikuni Oriko",
  "name_jp": "美国 織莉子",
  "name_na": "Oriko Mikuni",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Mikuni_Oriko"
}, {
  "id": "4002",
  "name": "Kure Kirika",
  "name_jp": "呉 キリカ",
  "name_na": "Kirika Kure",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Kure_Kirika"
}, {
  "id": "4003",
  "name": "Chitose Yuma",
  "name_jp": "千歳 ゆま",
  "name_na": "Yuma Chitose",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-08-22",
  "release_date_na": "2019-06-25",
  "obtainability": "unlimited",
  "url": "https://magireco.fandom.com/wiki/Chitose_Yuma"
}, {
  "id": "4011",
  "name": "Kazumi",
  "name_jp": "かずみ",
  "name_na": "Kazumi",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2017-11-20",
  "release_date_na": "2019-08-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Kazumi"
}, {
  "id": "4012",
  "name": "Misaki Umika",
  "name_jp": "御崎 海香",
  "name_na": "Umika Misaki",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-11-20",
  "release_date_na": "2019-08-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Misaki_Umika"
}, {
  "id": "4013",
  "name": "Maki Kaoru",
  "name_jp": "牧 カオル",
  "name_na": "Kaoru Maki",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2017-11-20",
  "release_date_na": "2019-08-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Maki_Kaoru"
}, {
  "id": "4014",
  "name": "Subaru Kazumi",
  "name_jp": "昴 かずみ",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-10-20",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Subaru_Kazumi"
}, {
  "id": "4021",
  "name": "Tart",
  "name_jp": "タルト",
  "name_na": "Darc",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-02-15",
  "release_date_na": "2019-09-11",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tart"
}, {
  "id": "4022",
  "name": "Riz Hawkwood",
  "name_jp": "リズ・ハークウッド",
  "name_na": "Liz Hawkwood",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-02-21",
  "release_date_na": "2019-09-19",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Riz_Hawkwood"
}, {
  "id": "4023",
  "name": "Melissa de Vignolles",
  "name_jp": "メリッサ・ド・ウィニョル",
  "name_na": "Melissa",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-02-15",
  "release_date_na": "2019-09-11",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Melissa_de Vignolles"
}, {
  "id": "4024",
  "name": "Minou",
  "name_jp": "ミヌゥ",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-05-24",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Minou"
}, {
  "id": "4025",
  "name": "Corbeau",
  "name_jp": "コルボー",
  "name_na": "Corbeau",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2019-07-12",
  "release_date_na": "2020-07-22",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Corbeau"
}, {
  "id": "4026",
  "name": "Elisa Celjska",
  "name_jp": "エリザ・ツェリスカ",
  "name_na": "Elisa Celjska",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-07-12",
  "release_date_na": "2020-07-22",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Elisa_Celjska"
}, {
  "id": "4027",
  "name": "Lapine",
  "name_jp": "ラピヌ",
  "name_na": "Lapin",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2020-06-19",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Lapine"
}, {
  "id": "4028",
  "name": "Tart (Final ver.)",
  "name_jp": "タルトver.Final",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2020-06-19",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Tart_(Final_ver.)"
}, {
  "id": "4031",
  "name": "Amano Suzune",
  "name_jp": "天乃 鈴音",
  "name_na": "Suzune Amano",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-05-01",
  "release_date_na": "2019-10-15",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Amano_Suzune"
}, {
  "id": "4032",
  "name": "Hinata Matsuri",
  "name_jp": "日向 茉莉",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-10-31",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Hinata_Matsuri"
}, {
  "id": "4033",
  "name": "Narumi Arisa",
  "name_jp": "成見 亜里紗",
  "name_na": "Arisa Narumi",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-05-01",
  "release_date_na": "2019-10-15",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Narumi_Arisa"
}, {
  "id": "4034",
  "name": "Shion Chisato",
  "name_jp": "詩音 千里",
  "name_na": "Chisato Shion",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-05-01",
  "release_date_na": "2019-10-15",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Shion_Chisato"
}, {
  "id": "4035",
  "name": "Kanade Haruka",
  "name_jp": "奏 遥香",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2019-10-31",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Kanade_Haruka"
}, {
  "id": "4036",
  "name": "Mikoto Tsubaki",
  "name_jp": "美琴 椿",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-01-25",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Mikoto_Tsubaki"
}, {
  "id": "4041",
  "name": "Senjougahara Hitagi",
  "name_jp": "戦場ヶ原 ひたぎ",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2018-09-25",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Senjougahara_Hitagi"
}, {
  "id": "4042",
  "name": "Hachikuji Mayoi",
  "name_jp": "八九寺 真宵",
  "name_na": "",
  "attribute": "Aqua",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-11-26",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Hachikuji_Mayoi"
}, {
  "id": "4043",
  "name": "Kanbaru Suruga",
  "name_jp": "神原 駿河",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-02-15",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Kanbaru_Suruga"
}, {
  "id": "4044",
  "name": "Sengoku Nadeko",
  "name_jp": "千石 撫子",
  "name_na": "",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-09-25",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Sengoku_Nadeko"
}, {
  "id": "4045",
  "name": "Hanekawa Tsubasa",
  "name_jp": "羽川 翼",
  "name_na": "",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2018-12-03",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Hanekawa_Tsubasa"
}, {
  "id": "4046",
  "name": "Oshino Shinobu",
  "name_jp": "忍野 忍",
  "name_na": "",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-02-22",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Oshino_Shinobu"
}, {
  "id": "4051",
  "name": "Takamachi Nanoha",
  "name_jp": "高町 なのは",
  "name_na": "Nanoha Takamachi",
  "attribute": "Flame",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-06-17",
  "release_date_na": "2019-11-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Takamachi_Nanoha"
}, {
  "id": "4052",
  "name": "Fate T. Harlaown",
  "name_jp": "フェイト·T·ハラオウン",
  "name_na": "Fate T. Harlaown",
  "attribute": "Light",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2019-06-24",
  "release_date_na": "2019-11-19",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Fate_T. Harlaown"
}, {
  "id": "4053",
  "name": "Yagami Hayate",
  "name_jp": "八神 はやて",
  "name_na": "Hayate Yagami",
  "attribute": "Forest",
  "ranks": {
    "1": false,
    "2": false,
    "3": true,
    "4": true,
    "5": true
  },
  "release_date": "2019-06-17",
  "release_date_na": "2019-11-13",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Yagami_Hayate"
}, {
  "id": "4121",
  "name": "Isabeau (Witch ver.)",
  "name_jp": "イザボー (魔女ver.)",
  "name_na": "",
  "attribute": "Dark",
  "ranks": {
    "1": false,
    "2": false,
    "3": false,
    "4": true,
    "5": true
  },
  "release_date": "2021-05-24",
  "release_date_na": "2050-01-01",
  "obtainability": "limited",
  "url": "https://magireco.fandom.com/wiki/Isabeau_(Witch_ver.)"
}];
exports.character_collection = character_collection;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
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
    _this4.list.innerHTML = "\n    <p>For assistance, support, or feedback, please contact Leo Chan at</p>\n    <li>Discord: Leo_Chan#9150 or <a target=\"_blank\" href=\"https://discord.gg/magiarecord\">PMMM: Magia Record Discord Server</a></li>\n    <li>Reddit: <a target=\"_blank\" href=\"https://www.reddit.com/message/compose/?to=Leochan6\">u/Leochan6</a></li>\n    <p>For more information and how to use, <a target=\"_blank\" href=\"https://github.com/Leochan6/leochan6.github.io/blob/master/magireco/README.md\">check the README file</a></p>\n    <p>If the Navigation Buttons do not appear or the page is not loading, please clear your Cookies and Reload.";
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

},{"@babel/runtime/helpers/assertThisInitialized":17,"@babel/runtime/helpers/classCallCheck":18,"@babel/runtime/helpers/defineProperty":19,"@babel/runtime/helpers/getPrototypeOf":20,"@babel/runtime/helpers/inherits":21,"@babel/runtime/helpers/interopRequireDefault":22,"@babel/runtime/helpers/possibleConstructorReturn":27}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validPlayerID = exports.getPlayerList = void 0;
var getPlayerList = firebase.functions().httpsCallable('getPlayerList');
exports.getPlayerList = getPlayerList;
var validPlayerID = firebase.functions().httpsCallable('validPlayerID');
exports.validPlayerID = validPlayerID;

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],15:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],16:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayLikeToArray.js":14}],17:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],18:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],21:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf.js");

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
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./setPrototypeOf.js":28}],22:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],23:[function(require,module,exports){
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],24:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],25:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],26:[function(require,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],27:[function(require,module,exports){
var _typeof = require("@babel/runtime/helpers/typeof")["default"];

var assertThisInitialized = require("./assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./assertThisInitialized.js":17,"@babel/runtime/helpers/typeof":31}],28:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],29:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles.js");

var iterableToArrayLimit = require("./iterableToArrayLimit.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableRest = require("./nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayWithHoles.js":15,"./iterableToArrayLimit.js":24,"./nonIterableRest.js":25,"./unsupportedIterableToArray.js":32}],30:[function(require,module,exports){
var arrayWithoutHoles = require("./arrayWithoutHoles.js");

var iterableToArray = require("./iterableToArray.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableSpread = require("./nonIterableSpread.js");

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayWithoutHoles.js":16,"./iterableToArray.js":23,"./nonIterableSpread.js":26,"./unsupportedIterableToArray.js":32}],31:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],32:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayLikeToArray.js":14}]},{},[5]);
