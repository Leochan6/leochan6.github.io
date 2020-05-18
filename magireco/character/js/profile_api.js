import { character_elements as elements } from './character_elements.js';
import * as character_list_api from './character_list_api.js';
import * as storage_api from './storage_api.js';

/**
 * Profile API for the Character Page.
 */

export let selectedProfile = null;

/**
 * Sets the profiles in the profile_select and loads the profile.
 * @param {Object} profiles 
 * @param {String} previous 
 */
export const setProfiles = (profiles, previous) => {
  elements.profile_select.innerHTML = "";
  Object.entries(profiles).forEach(([id, profile]) => {
    elements.profile_select.options.add(new Option(profile.name, id, false));
  });
  if (selectedProfile !== null && selectedProfile.name !== null) {
    let profileId = getProfileId(selectedProfile.name)
    elements.profile_select.value = profileId;
    let listId = character_list_api.getListId();
    if (listId) storage_api.updateListProfile(listId, profileId);
  }
  else if (previous && Array.from(elements.profile_select.options).some(option => option.value === previous)) {
    elements.profile_select.value = previous;
    let listId = character_list_api.getListId();
    if (listId) storage_api.updateListProfile(listId, previous);
  }
  else {
    elements.profile_select.value = "0";
    let listId = character_list_api.getListId();
    if (listId) storage_api.updateListProfile(listId, "0");
  }
  loadsRules(elements.profile_select.value);
};

/**
 * Gets the Sorting Settings from the Profile Rules.
 * 
 * @returns {Object}
 */
export const getSortSettings = () => {
  let settings = {};
  Array.from(profile_rules.children).forEach((child, index) => {
    let childRuleId = child.getAttribute("ruleId")
    let ruleId = childRuleId && childRuleId.length > 3 ? childRuleId : generatePushID();
    settings[ruleId] = {
      state: child.querySelector(".state_select").value,
      type: child.querySelector(".type_select").value,
      direction: child.querySelector(".sort_dir").classList.contains("up") ? 1 : -1,
      index: index
    }
  });
  return settings;
};

/**
 * Saves a new profile.
 */
export const saveProfile = () => {
  let profileName = new_profile_field.value;
  if (Object.values(storage_api.profiles).some(profile => profile.name === profileName)) {
    profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
    return;
  }
  if (profileName.length === 0) {
    profile_error_text.innerHTML = `The sorting profile name must not be empty.`;
    return;
  }
  new_profile_field.value = "";
  let properties = getSortSettings();
  selectedProfile = { name: profileName, id: null };
  storage_api.createProfile(profileName, properties);
  if (!profile_create_block.classList.contains("hidden")) profile_create_block.classList.add("hidden");
  if (new_profile_button.classList.contains("minus")) new_profile_button.classList.replace("minus", "add");
};

/**
 * Updates the selected profile.
 */
export const updateProfile = () => {
  let profileId = getSelectedProfileId();
  let properties = getSortSettings();
  storage_api.updateProfile(profileId, properties);
  if (!profile_create_block.classList.contains("hidden")) profile_create_block.classList.add("hidden");
  if (new_profile_button.classList.contains("minus")) new_profile_button.classList.replace("minus", "add");
};

/**
 * Check if the profile name exists.
 * 
 * @param {String} profileName 
 */
export const checkProfile = (profileName) => {
  if (Object.values(storage_api.profiles).some(profile => profile.name === profileName)) profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
  else profile_error_text.innerHTML = "";
};

/**
 * Deletes the selected profile.
 */
export const deleteProfile = () => {
  let profileId = getSelectedProfileId();
  if (storage_api.profiles[profileId].name !== "Default" && storage_api.profiles[profileId].name !== "Custom") {
    storage_api.deleteProfile(profileId);
    selectedProfile = { name: "Default", id: "0" };
    elements.profile_select.value = "0";
    let listId = character_list_api.getListId();
    if (listId) storage_api.updateList(listId, character_list_api.getListName(), storage_api.lists[listId].characterList, "0", background_api.getSelectedBackground() || "");
  }
};

/**
 * Sets the profile and loads the rules.
 * 
 * @param {String} profileId 
 */
export const setProfile = (profileId) => {
  elements.profile_select.value = profileId;
  if (storage_api.profiles[profileId].rules) loadsRules(profileId);
  if (profileId === "0" || profileId === "1") elements.delete_profile_button.disabled = true;
  else elements.delete_profile_button.disabled = false;
};

/**
 * Returns the selected profile id.
 */
export const getSelectedProfileId = () => {
  if (elements.profile_select.selectedIndex > -1)
    return elements.profile_select.value;
  else return "0";
};

/**
 * returns the selected profile name.
 */
export const getSelectedProfileName = () => {
  if (elements.profile_select.options[elements.profile_select.selectedIndex])
    return elements.profile_select.options[elements.profile_select.selectedIndex].text;
  else return "Default";
};


/**
 * Returns the profile id of profileName.
 * 
 * @param {String} profileName 
 */
export const getProfileId = (profileName) => {
  let profile = Object.entries(storage_api.profiles).find(([id, profile]) => profile.name === profileName);
  return profile[0];
};

/**
 * Changes the profile_select to Custom.
 */
export const changeToCustom = () => {
  elements.profile_select.value = "1";
};

/**
 * Create a new sorting profile rule.
 * 
 * @param {HTMLDivElement} next optional.
 */
export const createProfileRule = (next = null) => {
  let new_rule = document.createElement("div");
  new_rule.classList.add("profile_rule");
  new_rule.innerHTML = `
      <select class="state_select form_input">
        <option value="sort">Sort By</option>
        <option value="group">Group By</option>
      </select>
      <select class="type_select form_input">
        <option value="attribute">Attribute</option>
        <option value="rank">Rank</option>
        <option value="post_awaken">Post Awaken</option>
        <option value="level">Level</option>
        <option value="magic">Magic</option>
        <option value="magia">Magia</option>
        <option value="episode">Episode</option>
        <option value="doppel">Doppel</option>
        <option value="obtainability">Obtainability</option>
        <option value="character_id">Character ID</option>
      </select>
      <button class="sort_dir down small_btn"></button>
      <button class="create add small_btn" title="Add New Rule Below"></button>
      <button class="delete small_btn" title="Delete Rule"></button>`;

  let state_select = new_rule.querySelector(".state_select")
  let type_select = new_rule.querySelector(".type_select")
  let sort_dir = new_rule.querySelector(".sort_dir");
  state_select.selectedIndex = -1;
  type_select.selectedIndex = -1;

  new_rule.querySelector(".create").addEventListener("click", () => {
    createProfileRule(new_rule);
  });
  new_rule.querySelector(".delete").addEventListener("click", () => {
    new_rule.remove();
    let first_rule = profile_rules.children[0].querySelector(".delete");
    if (profile_rules.children.length === 1 && !first_rule.disabled) first_rule.disabled = true;

    if (getSelectedProfileName() === "Default") changeToCustom();
    character_list_api.updateList();
    updateProfile();
    character_list_api.applyProfileToList(character_list_api.getListId(), getSelectedProfileId());
  });

  sort_dir.addEventListener("click", () => {
    if (sort_dir.classList.contains("up")) {
      sort_dir.classList.replace("up", "down");
    }
    else if (sort_dir.classList.contains("down")) {
      sort_dir.classList.replace("down", "up");
    }
    if (getSelectedProfileName() === "Default") changeToCustom();
    character_list_api.updateList();
    updateProfile();
    character_list_api.applyProfileToList(character_list_api.getListId(), getSelectedProfileId());
  });

  // update the list on sort form change.
  [state_select, type_select].forEach(element => {
    element.addEventListener("change", () => {
      if (getSelectedProfileName() === "Default") changeToCustom();
      if (state_select.value && type_select.value) {
        character_list_api.updateList();
        updateProfile();
        character_list_api.applyProfileToList(character_list_api.getListId(), getSelectedProfileId());
      }
    });
  });

  // disable group or id level.
  state_select.addEventListener("change", () => {
    if (state_select.value === "group") {
      if (type_select.value === "character_id" || type_select.value === "level") {
        type_select.selectedIndex = -1;
      }
      type_select.options[3].disabled = true;
      type_select.options[9].disabled = true;
    } else {
      type_select.options[3].disabled = false;
      type_select.options[9].disabled = false;
    }
  });

  type_select.addEventListener("change", () => {
    if (type_select.value === "character_id" || type_select.value === "level") {
      if (state_select.value === "group") {
        state_select.selectedIndex = -1;
      }
      state_select.options[1].disabled = true;
    } else state_select.options[1].disabled = false;
  });

  if (next !== null) next.after(new_rule);
  else profile_rules.append(new_rule);
  return new_rule;
};

/**
 * Loads the rule with the settings.
 * 
 * @param {String} ruleId 
 * @param {Object} settings 
 */
export const loadRule = (ruleId, settings) => {
  let rule = createProfileRule();
  let state_select = rule.querySelector(".state_select");
  let type_select = rule.querySelector(".type_select");
  let sort_dir = rule.querySelector(".sort_dir");
  rule.setAttribute("ruleId", ruleId)
  state_select.value = settings.state;
  type_select.value = settings.type;
  if (settings.direction == 1 && sort_dir.classList.contains("down")) sort_dir.classList.replace("down", "up");
  else if (settings.direction == -1 && sort_dir.classList.contains("up")) sort_dir.classList.replace("up", "down");

  if (state_select.value === "group") {
    if (type_select.value === "character_id" || type_select.value === "level") {
      type_select.selectedIndex = -1;
    }
    type_select.options[3].disabled = true;
    type_select.options[9].disabled = true;
  } else {
    type_select.options[3].disabled = false;
    type_select.options[9].disabled = false;
  }

  if (type_select.value === "character_id" || type_select.value === "level") {
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
export const loadsRules = (profileId) => {
  if (!storage_api.profiles[profileId].rules) return;
  profile_rules.innerHTML = "";
  Object.entries(storage_api.profiles[profileId].rules).sort((a, b) => a[1].index > b[1].index ? 1 : -1).forEach(([ruleId, settings]) => {
    loadRule(ruleId, settings);
  });
  if (profile_rules.children.length > 0) {
    let first_rule = profile_rules.children[0].querySelector(".delete");
    if (profile_rules.children.length === 1 && !first_rule.disabled) first_rule.disabled = true;
  }
};
