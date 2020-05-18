import { memoria_elements as elements, messageDialog } from "./memoria_elements.js";
import * as background_api from './background_api.js';
import * as memoria_list_api from "./memoria_list_api.js";
import * as database_api from '../../shared/js/database_api.js';
import * as profile_api from './profile_api.js';
import * as utils from '../../shared/js/utils.js';

/**
 * Storage API for the Memoria Page.
 */

export let profiles = {};
export let lists = {};
export let settings = {};

let userId = null;

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
 * Loads the settings.
 * 
 */
const loadSettings = (snapshot) => {
  settings = snapshot.val() ? snapshot.val() : {};
  // init expanded tabs
  if (!settings.expanded_tabs) database_api.initSettings(userId);
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
  if (!settings.background_transparency) settings.background_transparency = 0;
  // display settings
  elements.memoria_list_content.style.zoom = settings.memoria_zoom / 100;
  elements.zoom_range.value = settings.memoria_zoom;
  elements.zoom_field.value = settings.memoria_zoom;
  elements.displays_per_row.value = settings.memoria_displays_per_row;
  memoria_list_api.changeDisplaysPerRow(settings.memoria_displays_per_row);
  document.querySelectorAll(".memoria_row").forEach(memoria_row => memoria_row.style.justifyContent = memoria_list_api.DIR_TO_FLEX[settings.display_alignment]);
  elements.memoria_list_content.style.padding = `${settings.padding_y}px ${settings.padding_x}px`;
  elements.display_alignment_select.value = settings.display_alignment;
  elements.display_padding_x_field.value = settings.padding_x;
  elements.display_padding_y_field.value = settings.padding_y;
  elements.background_transparency_range.value = settings.background_transparency;
  elements.background_transparency_field.value = settings.background_transparency;
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
    .filter(key => val[key].type == "memoria")
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
    .filter(key => typeof val[key].memoriaList !== "undefined")
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: val[key]
      };
    }, {});
  lists = filtered;
  memoria_list_api.setLists(lists);
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
  database_api.createList(userId, { name: name, memoriaList: false, selectedProfile: "10", selectedBackground: false });
};

/**
 * Rename the List listId with name name.
 */
export const renameList = (listId, name) => {
  database_api.updateListName(userId, listId, name);
};

/**
 * Update the list listId.
 */
export const updateList = (listId, name, memoriaList, selectedProfile, selectedBackground) => {
  if (memoriaList.length == 0) memoriaList = false;
  if (!selectedBackground) selectedBackground = false;

  if (memoriaList) {
    Object.values(memoriaList).forEach(memoria => {
      if (memoria._id) delete memoria._id;
      if (memoria.name) delete memoria.name;
      if (memoria.type) delete memoria.type;
      if (memoria.obtainability || typeof memoria.obtainability === 'undefined') delete memoria.obtainability;
    });
  }
  database_api.updateList(userId, listId, { name: name, memoriaList: memoriaList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
};

/**
 * Updates the characterList of list listId with content.
 */
export const updateListList = (listId, content) => {
  database_api.updateListList(userId, listId, "memoriaList", content);
};

/**
 * Updates the profile of list listId with profile profileId.
 */
export const updateListProfile = (listId, profileId) => {
  if (lists[listId].selectedProfile != profileId) database_api.updateListProfile(userId, listId, profileId);
};

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
  let selectedProfile = profile_api.getSelectedProfileId() || "10";
  let selectedBackground = background_api.getSelectedBackground() || false;
  database_api.createList(userId, { name: newName, memoriaList: list.memoriaList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
};

/**
 * Create and new list with all the parameters passed in.
 */
export const manualCreateList = (name, memoriaList, selectedProfile, selectedBackground) => {
  database_api.createList(userId, { name: name, memoriaList: memoriaList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
}

/**
 * Added the memoria memoria to the list listId.
 */
export const addMemoriaToList = (listId, memoria) => {
  let newMemoria = {};
  if (memoria.name) delete memoria.name;
  if (memoria.type) delete memoria.type;
  if (memoria.obtainability || typeof memoria.obtainability === 'undefined') delete memoria.obtainability;
  if (memoria._id) {
    newMemoria[memoria._id] = memoria;
    delete memoria._id;
  } else {
    newMemoria[generatePushID()] = memoria;
  }
  database_api.updateListItem(userId, listId, "memoriaList", newMemoria);
}

/**
 * Updates the memoria memoriaDisplayId with memoria memoria of list listId.
 */
export const updateMemoriaOfList = (listId, memoriaDisplayId, memoria) => {
  let newMemoria = { [memoriaDisplayId]: memoria };
  database_api.updateListItem(userId, listId, "memoriaList", newMemoria);
}

/**
 * Delete the memoria memoriaDisplayId of list listId.
 */
export const deleteMemoriaOfList = (listId, memoriaDisplayId) => {
  database_api.deleteListItem(userId, listId, "memoriaList", memoriaDisplayId);
}

/* ------------------------------ Profiles ------------------------------ */

/**
 * Create a new memoria profile with name name and settings settings.
 */
export const createProfile = (name, rules) => {
  database_api.createProfile(userId, { name: name, type: "memoria", rules: rules });
};

/**
 * Updates the profile profileId with settings settings.
 */
export const updateProfile = (profileId, rules) => {
  database_api.updateProfile(userId, profileId, { name: profiles[profileId].name, type: "memoria", rules: rules });
};

/**
 * Deletes profile profileId and updates the profiles of all other lists to default.
 */
export const deleteProfile = (profileId) => {
  database_api.deleteProfile(userId, profileId);
  Object.entries(lists).forEach(([listId, list]) => {
    if (list.selectedProfile === profileId) updateListProfile(listId, "10");
  });
};

/* ------------------------------ Settings ------------------------------ */

/**
 * Updates the setting settingsName with settings newSettings.
 */
export const updateSettings = (settingName, newSettings) => {
  database_api.updateSettings(userId, settingName, newSettings);
};