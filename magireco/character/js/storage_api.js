import { character_elements as elements, messageDialog } from "./character_elements.js";
import * as background_api from './background_api.js';
import * as character_api from "./character_api.js";
import * as character_list_api from "./character_list_api.js";
import * as database_api from '../../shared/js/database_api.js';
import * as profile_api from './profile_api.js';
import * as utils from '../../shared/js/utils.js';

/**
 * Storage API for the Character Page.
 */

export let profiles = {};
export let lists = {};
export let settings = {};
export let user = {};

let userId = null;
let prevCharacter = null;

/* ------------------------------ Start Up ------------------------------ */

/**
 * Sets the user id, then loads the message or loads everything else.
 */
export const startUp = (user) => {
  userId = user.uid;
  loadUserName();
  database_api.onceMessageUpdate(userId, (message, blocking) => {
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
const loadUserName = () => {
  database_api.onAuthStateChanged(user => {
    let name = user && user.displayName ? user.displayName : "Anonymous";
    elements.header_username.innerHTML = "Welcome " + name;
  });
};

/**
 * Loads the user.
 * 
 */
const loadUser = (snapshot) => {
  user = snapshot.val() ? snapshot.val() : {};
  if (user.name !== undefined) elements.player_name_field.value = user.name;
  else elements.player_name_field.value = "";
  if (user.playerId !== undefined) elements.player_id_field.value = user.playerId;
  else elements.player_id_field.value = "";
  if (user.publicListId !== undefined) elements.public_list_select.value = user.publicListId;
  else elements.public_list_select.selectedIndex = -1;
};

/**
 * Loads the settings.
 * 
 */
const loadSettings = (snapshot) => {
  settings = snapshot.val() ? snapshot.val() : {};
  // expand tabs
  Object.entries(settings.expanded_tabs).forEach(([tab_id, expanded]) => {
    let tab = document.querySelector(`#${tab_id}`);
    if (tab) {
      let tab_contents = tab.querySelector(".tab_contents");
      let tab_toggle = tab.querySelector(".tab_toggle");
      if (expanded) {
        if (tab_contents.classList.contains("hidden")) tab_contents.classList.remove("hidden");
        if (tab_toggle.classList.contains("right")) tab_toggle.classList.replace("right", "down");
      } else if (!expanded) {
        if (!tab_contents.classList.contains("hidden")) tab_contents.classList.add("hidden");
        if (tab_toggle.classList.contains("down")) tab_toggle.classList.replace("down", "right");
      }
    }
  });

  // display settings
  character_list_api.setZoom(settings.character_zoom);
  elements.zoom_range.value = settings.character_zoom;
  elements.zoom_field.value = settings.character_zoom;
  elements.displays_per_row.value = settings.displays_per_row;
  character_list_api.changeDisplaysPerRow(settings.displays_per_row);
  document.querySelectorAll(".character_row").forEach(character_row => character_row.style.justifyContent = character_list_api.DIR_TO_FLEX[settings.display_alignment]);
  elements.display_alignment_select.value = settings.display_alignment;
  character_list_api.setPadding(settings.padding_top, settings.padding_left, settings.padding_right, settings.padding_bottom);
  elements.display_padding_top_field.value = settings.padding_top;
  elements.display_padding_left_field.value = settings.padding_left;
  elements.display_padding_right_field.value = settings.padding_right;
  elements.display_padding_bottom_field.value = settings.padding_bottom;

  // background settings
  if (!settings.background_transparency) settings.background_transparency = 0;
  elements.background_transparency_range.value = settings.background_transparency;
  elements.background_transparency_field.value = settings.background_transparency;

  // theme
  utils.setTheme(settings.theme);
};

/**
 * Loads the profiles.
 * 
 */
const loadProfiles = (snapshot) => {
  // get the previous profile.
  let previous = profile_api.getSelectedProfileId();
  // get the settings.
  let val = snapshot.val();
  let filtered = Object.keys(val)
    .filter(key => val[key].type == "character")
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: val[key]
      };
    }, {});
  // add index property if undefined.
  Object.values(filtered).forEach(profile => {
    if (profile.rules) {
      Object.values(profile.rules).forEach((rule, index) => {
        if (!rule.index) rule.index = index;
      });
    }
  });
  profiles = filtered;
  // update the profile select.
  profile_api.setProfiles(profiles, previous);
};

/**
 * Loads the lists.
 * 
 */
const loadLists = (snapshot) => {
  let val = snapshot.val() ? snapshot.val() : {};
  const filtered = Object.keys(val)
    .filter(key => typeof val[key].characterList !== "undefined")
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: val[key]
      };
    }, {});
  lists = filtered;
  character_list_api.setLists(lists);
};

/**
 * Loads the message.
 */
const loadMessage = (message) => {
  if (message !== false) {
    messageDialog.open("Message", message);
  }
};

/* ------------------------------ Lists ------------------------------ */

/**
 * Check if list with name name exists.
 */
export const listExists = (name) => {
  if (Object.entries(lists).some((key, list) => list.name === name)) return true;
  return false;
};

/**
 * Create new List of name name.
 */
export const createList = (name) => {
  database_api.createList(userId, { name: name, characterList: false, selectedProfile: "0", selectedBackground: false });
};

/**
 * Rename the List listId with name name.
 */
export const renameList = (listId, name) => {
  if (lists[listId].name != name) database_api.setListProperty(userId, listId, "name", name);
};

/**
 * Update the list listId.
 */
export const updateList = (listId, name, characterList, selectedProfile, selectedBackground) => {
  if (characterList && Object.keys(characterList).length > 0) {
    Object.entries(characterList).forEach(([key, value]) => characterList[key] = character_api.sanitizeCharacter(value));
  }
  else characterList = false;
  if (!selectedBackground) selectedBackground = false;
  database_api.updateList(userId, listId, { name: name, characterList: characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
};

/**
 * Updates the characterList of list listId with content.
 */
export const updateListList = (listId, content) => {
  database_api.setListProperty(userId, listId, "characterList", content);
};

/**
 * Updates the profile of list listId with profile profileId.
 */
export const updateListProfile = (listId, profileId) => {
  if (lists[listId].selectedProfile != profileId) database_api.setListProperty(userId, listId, "selectedProfile", profileId);
}

/**
 * Updates the profile of list listId with profile profileId.
 */
export const updateListBackground = (listId, backgroundId) => {
  if (lists[listId].selectedBackground != backgroundId) database_api.setListProperty(userId, listId, "selectedBackground", backgroundId);
}

/**
 * Deletes the list listId.
 */
export const deleteList = (listId) => {
  database_api.deleteList(userId, listId);
};

/**
 * Duplicates list with name newName.
 */
export const duplicateList = (list, newName) => {
  let selectedProfile = profile_api.getSelectedProfileId() || "0";
  let selectedBackground = background_api.getSelectedBackground() || false;
  database_api.createList(userId, { name: newName, characterList: list.characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
};

/**
 * Create and new list with all the parameters passed in.
 */
export const manualCreateList = (name, characterList, selectedProfile, selectedBackground) => {
  database_api.createList(userId, { name: name, characterList: characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
}

/**
 * Added the character character to the list listId.
 */
export const addCharacterToList = (listId, character) => {
  let newCharacter = {};
  if (character._id) newCharacter[character._id] = character_api.sanitizeCharacter({ ...character});
  else newCharacter[generatePushID()] = character_api.sanitizeCharacter({ ...character});
  database_api.updateListProperty(userId, listId, "characterList", newCharacter);
}

/**
 * Updates the character characterDisplayId with character character of list listId.
 */
export const updateCharacterOfList = (listId, characterDisplayId, character) => {
  character = character_api.sanitizeCharacter(character);
  if (JSON.stringify(character) === JSON.stringify(prevCharacter)) return;
  else prevCharacter = character;
  let newCharacter = { [characterDisplayId]: character };
  database_api.updateListProperty(userId, listId, "characterList", newCharacter);
}

/**
 * Delete the character characterDisplayId of list listId.
 */
export const deleteCharacterOfList = (listId, characterDisplayId) => {
  database_api.deleteListItem(userId, listId, "characterList", characterDisplayId);
}

/* ------------------------------ Profiles ------------------------------ */

/**
 * Create a new character profile with name name and settings settings.
 */
export const createProfile = (name, rules) => {
  database_api.createProfile(userId, { name: name, type: "character", rules: rules });
};

/**
 * Updates the profile profileId with settings settings.
 */
export const updateProfile = (profileId, rules) => {
  database_api.updateProfile(userId, profileId, { name: profiles[profileId].name, type: "character", rules: rules });
};

/**
 * Deletes profile profileId and updates the profiles of all other lists to default.
 */
export const deleteProfile = (profileId) => {
  database_api.deleteProfile(userId, profileId);
  Object.entries(lists).forEach(([listId, list]) => {
    if (list.selectedProfile === profileId) updateListProfile(listId, "0");
  });
};

/* ------------------------------ Settings ------------------------------ */

/**
 * Updates the setting settingsName with settings newSettings.
 */
export const updateSettings = (settingName, newSettings) => {
  database_api.updateSettings(userId, settingName, newSettings);
};

/* ------------------------------ User ------------------------------ */

/**
 * Sets the user property settingsName with settings newSettings.
 */
export const setUserProperty = (settingName, newSettings) => {
  database_api.setUserProperty(userId, settingName, newSettings);
};

/**
 * Removes the user property settingsName with settings newSettings.
 */
export const removeUserProperty = (settingName) => {
  database_api.removeUserProperty(userId, settingName);
};

/**
 * Updates storage bucket.
 */
export const updateListImage = (dataURL) => {
  let playerId = user.playerId;
  if (playerId) return database_api.updateListImage(playerId, dataURL);
  else return Promise.reject("No Player ID.");
};

/**
 * Delete storage bucket.
 */
export const deleteListImage = () => {
  let playerId = user.playerId;
  if (playerId) return database_api.deleteListImage(playerId);
  else return Promise.reject("No Player ID.");
};