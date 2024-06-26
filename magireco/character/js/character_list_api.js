import { character_collection } from '../../collection/character_collection.js';
import * as background_api from './background_api.js';
import { character_elements as elements, messageDialog, importListDialog } from './character_elements.js';
import * as character_api from './character_api.js';
import * as profile_api from './profile_api.js';
import * as storage_api from './storage_api.js';
import * as utils from '../../shared/js/utils.js';

/**
 * Character List API for the Character Page.
 */

export let selectedList = null;

/* ------------------------------ Constants and Mappings ------------------------------ */

export const DIR_TO_FLEX = { "left": "flex-start", "center": "center", "right": "flex-end" };
export const ATT_TO_NUM = { "flame": "1", "aqua": "2", "forest": "3", "light": "4", "dark": "5", "void": "6" };
export const NUM_TO_ATT = { "1": "flame", "2": "aqua", "3": "forest", "4": "light", "5": "dark", "6": "void" };
export const NUM_TO_WORD = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five" };

/* ------------------------------ Load and Select Lists ------------------------------ */

/**
 * Loads all the lists.
 */
export const setLists = (lists) => {
  selectedList = { listId: list_name_title.getAttribute("listId"), list: null };
  elements.saved_character_lists.innerHTML = "";
  elements.list_name_title.innerHTML = "";
  elements.list_stats_list.innerHTML = "";
  elements.public_list_select.innerHTML = "";
  for (let [listId, list] of Object.entries(lists)) {
    // update the fields of each character.
    Object.entries(list.characterList).forEach(([key, display]) => {
      display._id = key;
      if (display.doppel == "unlocked") display.doppel = true;
      else if (display.doppel == "locked") display.doppel = false;
      if (display.se === undefined) display.se = "0"
    });
    let div = document.createElement("div");
    div.classList.add("character_list_row");
    let entry = document.createElement("button");
    entry.classList.add("small_btn");
    entry.classList.add("character_list_entry");
    entry.setAttribute("listId", listId);
    entry.innerHTML = list.name;
    entry.addEventListener("click", () => {
      selectList(listId, list, false);
    });
    div.append(entry);
    elements.saved_character_lists.append(div);
    elements.public_list_select.options.add(new Option(list.name, listId, false));
  }
  
  if (storage_api.user.publicListId) elements.public_list_select.value = storage_api.user.publicListId;
  else elements.public_list_select.selectedIndex = -1;

  if (Object.entries(lists).length > 0) {
    if (selectedList && selectedList.listId && lists[selectedList.listId]) {
      selectList(selectedList.listId, lists[selectedList.listId]);
    } else if (storage_api.settings.selected_character_list) {
      selectList(storage_api.settings.selected_character_list, lists[storage_api.settings.selected_character_list]);
    } else {
      let first = Object.entries(lists)[0][0];
      selectList(first, lists[first]);
    }
    // enable list rename, duplicate and delete buttons
    elements.rename_list_button.disabled = false;
    elements.duplicate_list_button.disabled = false;
    elements.delete_list_button.disabled = false;
  }
  // disable list rename, duplicate and delete buttons if no list
  else {
    elements.rename_list_button.disabled = true;
    elements.duplicate_list_button.disabled = true;
    elements.delete_list_button.disabled = true;
    elements.character_list_content.innerHTML = "";
  }
};

/**
 * Selects the list listId and applies the list.
 * 
 * @param {String} listId 
 * @param {Object} list 
 */
export const selectList = (listId, list, refresh = true) => {
  if (listId && !list) {
    list = storage_api.lists[listId];
  } else if (!listId || !list) {
    let first = Object.entries(storage_api.lists)[0][0];
    listId = first;
    list = storage_api.lists[first];
  }
  for (let element of document.querySelectorAll(".character_list_entry")) {
    // element already selected.
    if (element.getAttribute("listId") === listId) {
      if (element.classList.contains("selected")) return;
      else {
        element.classList.add("selected");
        element.disabled = true;
      }
    }
    else if (element.classList.contains("selected")) {
      element.classList.remove("selected");
      element.disabled = false;
    }
  }
  selectedList = { listId: listId, list: list };
  elements.list_name_title.innerHTML = list.name;
  elements.list_name_title.setAttribute("listId", listId);
  profile_api.setProfile(list.selectedProfile);
  applyProfileToList(listId, list.selectedProfile);
  setPadding(storage_api.settings.padding_top, storage_api.settings.padding_left, storage_api.settings.padding_right, storage_api.settings.padding_bottom);
  applyFilters();
  background_api.setBackground(list.selectedBackground);
  getStats();
  // select only if refreshing list, otherwise do not select.
  if (refresh) character_api.findAndSelectDisplay();
  else character_api.deselectDisplay(true);
  character_api.enableButtons();
  storage_api.updateSettings("selected_character_list", listId);
};

/* ------------------------------ Create and Delete List ------------------------------ */

/**
 * creates a new list.
 */
export const createList = () => {
  let listName = create_list_name_field.value;
  if (!listName) {
    home_error_text.innerHTML = `The list name must not be empty.`;
    return;
  }
  elements.create_list_name_field.value = "";
  elements.new_list_button.classList.replace("minus", "add");
  elements.list_create.style.visibility = "collapse";
  elements.list_create.style.display = "none";
  elements.list_name_title.innerHTML = listName;
  elements.profile_select.value = "0";
  elements.character_list_content.innerHTML = "";
  storage_api.createList(listName);
};

/**
 * Renames the list listId with name newName.
 * 
 * @param {String} listId 
 * @param {String} newName 
 */
export const renameList = (listId, newName) => {
  if (listId && newName && newName.length > 0) {
    storage_api.renameList(listId, newName);
    elements.rename_list_name_field.value = "";
    elements.list_rename.style.visibility = "collapse";
    elements.list_rename.style.display = "none";
  }
};

/**
 * Duplicates the list with name newName.
 * 
 * @param {Object} list 
 * @param {String} newName 
 */
export const duplicateList = (list, newName) => {
  if (list && newName && newName.length > 0) {
    let newCharacterList = {};
    Object.values(list.characterList).forEach(value => {
      newCharacterList[generatePushID()] = character_api.sanitizeCharacter(value);
    });
    console.log(newCharacterList);
    if (Object.keys(newCharacterList).length === 0) newCharacterList = false;
    list.characterList = newCharacterList;
    storage_api.duplicateList(list, newName);
    elements.duplicate_list_name_field.value = "";
    elements.list_duplicate.style.visibility = "collapse";
    elements.list_duplicate.style.display = "none";
  }
};

/**
 * Deletes the list listId.
 * 
 * @param {String} listId 
 */
export const deleteList = (listId) => {
  selectedList = null;
  storage_api.updateSettings("selected_character_list", false);
  storage_api.deleteList(listId);
};

/**
 * Updates the list in the database with the list name, characters, and profile.
 */
export const updateList = () => {
  let listId = getListId();
  let listName = getListName();
  let characterList = {};
  Object.entries(storage_api.lists[listId].characterList)
    .forEach(([key, value]) => characterList[key] = character_api.sanitizeCharacter(value));
  let selectedProfile = profile_api.getSelectedProfileId();
  let selectedBackground = background_api.getSelectedBackground();
  if (!listName) return;
  storage_api.updateList(listId, listName, characterList, selectedProfile, selectedBackground);
};

/* ------------------------------ Get the Selected List ------------------------------ */

/**
 * returns the list name.
 */
export const getListName = () => {
  return elements.list_name_title.innerText;
};

/**
 * returns the list id.
 */
export const getListId = () => {
  return elements.list_name_title.getAttribute("listId");
};

/**
 * returns all the character displays in a list.
 * 
 * @param {boolean} keep_id
 */
export const getCharacterList = (keep_id = true) => {
  let characterList = {};
  document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
    let id = child.getAttribute("_id") !== "undefined" ? child.getAttribute("_id") : generatePushID();
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
export const checkListName = (listName) => {
  if (!listName || listName.length === 0) elements.home_error_text.innerHTML = `The list name must not be empty.`;
  else if (storage_api.listExists(listName)) elements.home_error_text.innerHTML = `The list name ${listName} already exists.`;
  else {
    elements.home_error_text.innerHTML = "";
    return true;
  }
  return false;
};

/** 
 * returns the selected list.
 */
export const getSelectedList = () => {
  for (let element of document.querySelectorAll(".character_list_entry")) {
    if (element.classList.contains("selectedList")) return element.getAttribute("listId");
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
export const applyProfileToList = (listId, profileId) => {
  let characterList = storage_api.lists[listId].characterList;
  // modify the list.
  Object.entries(characterList).forEach(([key, display]) => {
    display._id = key;
    let character = character_collection.find(character => display.character_id == character.id);
    display.attribute = character.attribute.toLowerCase();
    display.obtainability = character.obtainability;
    display.release_date = new Date(character.release_date + "PST").getTime();
  });
  let rules = storage_api.profiles[profileId].rules;
  if (!rules) rules = profile_api.getSortSettings();
  let groups = createGroups(characterList, rules);
  elements.character_list_content.innerHTML = '';
  displayGroups(elements.character_list_content, groups);
};

/**
 * Adds the groups to the parent element.
 * 
 * @param {HTMLDivElement} parent 
 * @param {Object} groups 
 */
export const displayGroups = (parent, groups) => {
  Object.entries(groups).forEach(([key, group]) => {
    let group_row = document.createElement("div");
    group_row.classList.add("character_row");
    group_row.style.width = `${storage_api.settings.displays_per_row * (122)}px`;
    group_row.setAttribute("group", key);
    group_row.style.justifyContent = DIR_TO_FLEX[storage_api.settings.display_alignment];

    if (group instanceof Array) {
      group.forEach((display) => {
        let character_display = character_api.createDisplay(display, true);
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
export const createGroups = (characterList, rules) => {
  let groups = []
  let sorts = [];
  // parse the rules;
  Object.entries(rules).sort((a, b) => a[1].index > b[1].index ? 1 : -1).forEach(([ruleId, rule]) => {
    if (rule.state === "group") {
      groups.push(rule);
    } else if (rule.state === "sort") {
      sorts.push({ prop: rule.type, direction: rule.direction, isString: false });
    }
  });

  if (groups.length === 0) groups = [{ type: "none" }];
  let characterGroups = groupAndSort(Object.values(characterList), groups, sorts);
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
const groupAndSort = (characterList, rules, sorts) => {
  if (rules.length == 0) {
    let sorted = characterList;
    sorted.forEach(char => char.attribute = ATT_TO_NUM[char.attribute]);
    sorted.sort((a, b) => utils.sortArrayBy(a, b, sorts));
    sorted.forEach(char => char.attribute = NUM_TO_ATT[char.attribute]);
    return sorted;
  } else {
    let rule = rules[0];
    let groups = group_properties(characterList, rule.type, rule.direction)
    Object.entries(groups).forEach(([key, group]) => {
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
const group_properties = (display_properties, group_by, group_dir) => {
  let display_groups = {};
  if (group_by == "attribute") {
    if (group_dir == 1) display_groups = { "flame": [], "aqua": [], "forest": [], "light": [], "dark": [], "void": [] };
    if (group_dir == -1) display_groups = { "void": [], "dark": [], "light": [], "forest": [], "aqua": [], "flame": [] };
    display_properties.forEach(properties => {
      display_groups[properties.attribute].push(properties);
    });
  } else if (group_by == "rank") {
    if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
    if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
    display_properties.forEach(properties => {
      display_groups[NUM_TO_WORD[properties.rank]].push(properties);
    });
  } else if (group_by == "post_awaken") {
    if (group_dir == 1) display_groups = { false: [], true: [] };
    if (group_dir == -1) display_groups = { true: [], false: [] };
    display_properties.forEach(properties => {
      display_groups[properties.post_awaken].push(properties);
    });
  } else if (group_by == "magic") {
    if (group_dir == 1) display_groups = { "zero": [], "one": [], "two": [], "three": [] };
    if (group_dir == -1) display_groups = { "three": [], "two": [], "one": [], "zero": [] };
    display_properties.forEach(properties => {
      display_groups[NUM_TO_WORD[properties.magic]].push(properties);
    });
  } else if (group_by == "magia") {
    if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
    if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
    display_properties.forEach(properties => {
      display_groups[NUM_TO_WORD[properties.magia]].push(properties);
    });
  } else if (group_by == "episode") {
    if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
    if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
    display_properties.forEach(properties => {
      display_groups[NUM_TO_WORD[properties.episode]].push(properties);
    });
  } else if (group_by == "doppel") {
    if (group_dir == 1) display_groups = { false: [], true: [] };
    if (group_dir == -1) display_groups = { true: [], false: [] };
    display_properties.forEach(properties => {
      display_groups[properties.doppel].push(properties);
    });
  } else if (group_by == "obtainability") {
    if (group_dir == 1) display_groups = { "unlimited": [], "limited": [] };
    if (group_dir == -1) display_groups = { "limited": [], "unlimited": [] };
    display_properties.forEach(properties => {
      display_groups[properties.obtainability].push(properties);
    });
  } else if (group_by == "none") {
    display_groups = { "none": [] };
    display_properties.forEach(properties => {
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
export const changeDisplaysPerRow = (displays) => {
  storage_api.settings.displays_per_row = displays;
  document.querySelectorAll(".character_row").forEach(character_row => {
    character_row.style.width = `${displays * (122)}px`;
  });
};

/**
 * Sets the alignment of the character rows.
 * 
 * @param {String} alignment 
 */
export const changeAlignment = (alignment) => {
  storage_api.settings.display_alignment = alignment;
  storage_api.updateSettings("display_alignment", alignment);
  document.querySelectorAll(".character_row").forEach(character_row => {
    character_row.style.justifyContent = DIR_TO_FLEX[alignment];
  });
};

/**
 * Changes the padding in the direction.
 * 
 * @param {String} direction 
 * @param {Number} padding 
 */
export const changePadding = (direction, padding) => {
  storage_api.settings[`padding_${direction}`] = padding;
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
export const setPadding = (top, left, right, bottom) => {
  elements.character_list_content.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
}

/* ------------------------------ List Zoom ------------------------------ */

/**
 * changes the zoom of the character list.
 * 
 * @param {Number} zoom 
 */
export const changeZoom = (zoom) => {
  storage_api.updateSettings("character_zoom", zoom);
  setZoom(zoom);
};

/**
 * sets the zoom of the character list.
 * 
 * @param {Number} zoom 
 */
export const setZoom = (zoom) => {
  elements.character_list_content.style.zoom = zoom / 100;
}

/**
 * sets the zoom of the character list to fit.
 */
export const zoom_fit = () => {
  if (elements.character_list_content.innerHTML) {
    let row = elements.character_list_content.querySelector(".character_row")
    let list_width = row.clientWidth;
    let list_height = row.clientHeight * elements.character_list_content.querySelectorAll(".character_row").length;
    let container_width = elements.character_list_content.clientWidth;
    let container_height = elements.character_list_content.clientHeight;
    let ratio = Math.min((container_width - 40) / list_width, (container_height - 40) / list_height);
    console.log(ratio);
    ratio = ratio < 1 ? ratio : 1;
    elements.character_list_content.style.zoom = ratio;
    elements.zoom_range.value = Math.round(ratio * 100);
    elements.zoom_field.value = Math.round(ratio * 100);
  }
};

/* ------------------------------ List Filters ------------------------------ */

/**
 * Creates a new filter.
 * 
 * @param {HTMLDivElement} next optional 
 */
export const createFilter = (next = null) => {
  let new_filter = document.createElement("div");
  new_filter.classList.add("filter_row");
  new_filter.innerHTML = `
      <select class="state_select collapse form_input">
        <option value="and">And</option>
        <option value="or">Or</option>
      </select>
      <select class="type_select form_input">
        <option value="attribute">Attribute</option>
        <option value="rank">Rank</option>
        <option value="post_awaken">Post Awaken</option>
        <option value="min_rank">Min Rank</option>
        <option value="max_rank">Max Rank</option>
        <option value="level">Level</option>
        <option value="magic">Magic</option>
        <option value="magia">Magia</option>
        <option value="episode">Episode</option>
        <option value="doppel">Doppel</option>
        <option value="se">SE</option>
        <option value="obtainability">Obtainability</option>
        <option value="release_date">Release Date</option>
      </select>
      <div class="filter_type attribute_filter hidden">
        <select class="filter_field equality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field attribute_select form_input">
          <option value="dark">Dark</option>
          <option value="flame">Flame</option>
          <option value="light">Light</option>
          <option value="forest">Forest</option>
          <option value="void">Void</option>
          <option value="aqua">Aqua</option>
        </select>
      </div>
      <div class="filter_type rank_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field rank_select form_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="filter_type post_awaken_filter hidden">
        <select class="filter_field equality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field post_awaken_select form_input">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      <div class="filter_type min_rank_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field min_rank_select form_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="filter_type max_rank_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field max_rank_select form_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="filter_type level_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <input class="filter_field level_input form_input" type="number" value=1 maxlength="3" size=3 min=1 max=100>
      </div>
      <div class="filter_type magic_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field magic_select form_input">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="filter_type magia_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field magia_select form_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="filter_type episode_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field episode_select form_input">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="filter_type doppel_filter hidden">
        <select class="filter_field equality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field doppel_select form_input">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      <div class="filter_type se_filter hidden">
        <select class="filter_field inequality form_input">
        <option value="eq">=</option>
        <option value="neq">=/=</option>
        <option value="lt">&lt</option>
        <option value="gt">&gt</option>
        <option value="lte">&lt=</option>
        <option value="gte">&gt=</option>
        </select>
        <input class="filter_field se_input form_input" type="number" value=0 maxlength="3" size=3 min=0 max=100>
      </div>
      <div class="filter_type obtainability_filter hidden">
        <select class="filter_field equality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field obtainability_select form_input">
          <option value="unlimited">Unlimited</option>
          <option value="limited">Limited</option>
        </select>
      </div>
      <div class="filter_type release_date_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <input type="date" class="filter_field release_date_select form_input">
      </div>
      <button class="create small_btn" title="Add New Filter Above">+</button>
      <button class="delete small_btn" title="Delete Filter"></button>
    `;

  new_filter.querySelector(".type_select").selectedIndex = -1;

  new_filter.querySelector(".type_select").addEventListener("change", () => {
    let type = new_filter.querySelector(".type_select").value;
    new_filter.querySelectorAll(".filter_type").forEach(filter => {
      if (!filter.classList.contains("hidden") && !filter.classList.contains(`.${type}_filter`)) filter.classList.add("hidden");
    });
    let filter_type = new_filter.querySelector(`.${type}_filter`);
    filter_type.classList.remove("hidden");
  });

  new_filter.querySelector(".create").addEventListener("click", () => {
    createFilter(new_filter);
  });

  new_filter.querySelector(".delete").addEventListener("click", () => {
    new_filter.remove();
    if (list_filters.children.length > 0) {
      let first = list_filters.children[0].querySelector(".state_select");
      if (elements.list_filters.children.length >= 1 && !first.classList.contains("collapse")) first.classList.add("collapse");
    } else {
      if (!elements.toggle_filter_button.classList.contains("hidden")) {
        elements.toggle_filter_button.classList.add("hidden");
        if (elements.toggle_filter_button.classList.contains("add")) elements.toggle_filter_button.classList.remove("add");
        if (elements.toggle_filter_button.classList.contains("minus")) elements.toggle_filter_button.classList.remove("minus");
      }
    }
    getFilters();
  });

  if (elements.toggle_filter_button.classList.contains("hidden")) {
    elements.toggle_filter_button.classList.remove("hidden");
    elements.toggle_filter_button.classList.add("minus");
  } else {
    if (elements.toggle_filter_button.classList.contains("add")) {
      elements.toggle_filter_button.classList.replace("add", "minus");
      if (elements.list_filters.classList.contains("hidden")) elements.list_filters.classList.remove("hidden");
    }
  }

  if (list_filters.children.length > 0) new_filter.querySelector(".state_select").classList.remove("collapse");
  if (next != null) {
    elements.list_filters.insertBefore(new_filter, next);
    if (!elements.list_filters.children[0].querySelector(".state_select").classList.contains("collapse")) elements.list_filters.children[0].querySelector(".state_select").classList.add("collapse");
    if (next.querySelector(".state_select").classList.contains("collapse")) next.querySelector(".state_select").classList.remove("collapse");
  }
  else elements.list_filters.append(new_filter);
};

/**
 * Returns the filters.
 * 
 * @returns {Array}
 */
export const getFilters = () => {
  let filters = [];
  for (let list_filter_row of Array.from(elements.list_filters.children)) {
    let element = Array.from(list_filter_row.children).find(child => !child.classList.contains("hidden") && child.classList.contains("filter_type") ? 1 : 0);
    let state = list_filter_row.querySelector(".state_select").value;
    if (list_filter_row.querySelector(".state_select").classList.contains("collapse")) state = "none";
    let filter = {};
    try {
      filter = { type: element.classList[1], state: state, value: [] };
    } catch {
      continue;
    }
    Array.from(element.children).forEach(child => {
      filter.value.push({ param: child.classList[1].replace("_select", "").replace("_input", ""), value: child.value });
    });
    filters.push(filter);
  }
  return filters;
};

/**
 * Applies the filters.
 * 
 * @param {Array} filters 
 */
export const applyFilters = (filters = getFilters()) => {
  // if no filters, then show everything.
  if (filters.length == 0) {
    Array.from(elements.character_list_content.querySelectorAll(".character_row")).forEach(character_row => {
      if (character_row.classList.contains("hidden")) {
        character_row.classList.remove("hidden");
        character_row.style.display = "flex";
      }
    });
    Array.from(elements.character_list_content.querySelectorAll(".character_display")).forEach(character_display_element => {
      if (character_display_element.classList.contains("hidden")) {
        elements.character_display_element.classList.remove("hidden");
        character_display_element.style.display = "flex";
      }
    });
    return;
  }
  Array.from(elements.character_list_content.querySelectorAll(".character_display")).forEach(character_display_element => {
    let character_display = character_api.getCharacterDisplay(character_display_element);
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
  Array.from(elements.character_list_content.querySelectorAll(".character_row")).forEach(character_row => {
    // hide the row all children are hidden character_list.
    if (Array.from(character_row.querySelectorAll(".character_display")).every(child => child.classList.contains("hidden"))) {
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
  if (Array.from(character_list_content.querySelectorAll(".character_display")).every(child => child.classList.contains("hidden"))) {
    if (!elements.character_list_content.classList.contains("hidden")) elements.character_list_content.classList.add("hidden");
  } else {
    if (elements.character_list_content.classList.contains("hidden")) elements.character_list_content.classList.remove("hidden");
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
const matchesAllFilters = (character_display, filters) => {
  let matches = Array(filters.length).fill(true);
  let result = [];
  filters.forEach((filter, i) => {
    matches[i] = matchesFilter(character_display, filter.value);
    if (i == 0 || filter.state === "or") result.push(matches[i]);
    else if (filter.state === "and") {
      let prev = result.pop();
      result.push(prev && matches[i]);
    }
  });
  return result.some(value => value);
};

/**
 * Check if the character display matches the filter.
 * 
 * @param {character_api.Display} character_display 
 * @param {Array} filter 
 */
const matchesFilter = (character_display, filter) => {
  if (filter[0].param === "equality") {
    if (filter[1].param === "obtainability") {
      let obtainability = character_collection.find(character => character_display.character_id == character.id).obtainability;
      if (filter[0].value === "eq" && obtainability === filter[1].value) return true;
      else if (filter[0].value === "neq" && obtainability !== filter[1].value) return true;
      else return false;
    }  else {
      if (filter[0].value === "eq" && character_display[filter[1].param] === filter[1].value) return true;
      else if (filter[0].value === "neq" && character_display[filter[1].param] !== filter[1].value) return true;
      else return false;
    }
  } else {
    if (filter[1].param === "release_date") {
      let release_date = new Date(character_collection.find(character => character_display.character_id == character.id).release_date + "PST");
      let filter_date = new Date(filter[1].value + "PST")
      if (filter[0].value === "eq" && release_date.getTime() === filter_date.getTime()) return true;
      else if (filter[0].value === "neq" && release_date.getTime() !== filter_date.getTime()) return true;
      else if (filter[0].value === "lt" && release_date < filter_date) return true;
      else if (filter[0].value === "gt" && release_date > filter_date) return true;
      else if (filter[0].value === "lte" && release_date <= filter_date) return true;
      else if (filter[0].value === "gte" && release_date >= filter_date) return true;
      else return false;
    } else {
      let param = 1;
      if (filter[1].param === "max_rank") {
        param = parseInt(character_api.getMaxRank(character_collection.find(character => character_display.character_id == character.id).ranks))
      } else if (filter[1].param === "min_rank") {
        param = parseInt(character_api.getMinRank(character_collection.find(character => character_display.character_id == character.id).ranks))
      } else {
        param = parseInt(character_display[filter[1].param]);
      }
      if (filter[0].value === "eq" && param === parseInt(filter[1].value)) return true;
      else if (filter[0].value === "neq" && param !== parseInt(filter[1].value)) return true;
      else if (filter[0].value === "lt" && param < parseInt(filter[1].value)) return true;
      else if (filter[0].value === "gt" && param > parseInt(filter[1].value)) return true;
      else if (filter[0].value === "lte" && param <= parseInt(filter[1].value)) return true;
      else if (filter[0].value === "gte" && param >= parseInt(filter[1].value)) return true;
      else return false;
    }
  }
};

/**
 * Removes all the filters.
 */
export const resetFilters = () => {
  Array.from(elements.character_list_content.querySelectorAll(".character_row")).forEach(character_row => {
    if (character_row.classList.contains("hidden")) {
      character_row.classList.remove("hidden");
      character_row.style.display = "flex";
    }
  });
  Array.from(elements.character_list_content.querySelectorAll(".character_display")).forEach(character_display_element => {
    if (character_display_element.classList.contains("hidden")) {
      character_display_element.classList.remove("hidden");
      character_display_element.style.display = "flex";
    }
  });
  if (elements.character_list_content.classList.contains("hidden")) elements.character_list_content.classList.remove("hidden");
  elements.list_filters.innerHTML = "";
  if (elements.toggle_filter_button.classList.contains("add")) elements.toggle_filter_button.classList.remove("add");
  if (elements.toggle_filter_button.classList.contains("minus")) elements.toggle_filter_button.classList.remove("minus");
  if (!elements.toggle_filter_button.classList.contains("hidden")) elements.toggle_filter_button.classList.add("hidden");
};

/* ------------------------------ List Stats ------------------------------ */

/**
 * Returns the simple stats of the list.
 * 
 * @returns {Object}
 */
export const getStats = () => {
  let result = {
    totalCharacters: 0,
    totalVisible: 0,
  };

  Array.from(elements.character_list_content.querySelectorAll(".character_display")).forEach(character_display_element => {
    result.totalCharacters++;
    if (!character_display_element.classList.contains("hidden")) {
      result.totalVisible++;
    }
  });
  elements.list_stats_list.innerHTML = `Visible: ${result.totalVisible}/${result.totalCharacters}`;
  return result;
};

/**
 * Returns all the stats of the list.
 * 
 * @returns {Object}
 */
export const getMoreStats = () => {
  let result = {
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
    doppel: 0,
    maxEpisode: 0,
    episodes: {},
    rankCopies: {},
    ses: {},
    maxSe: 0
  };

  Array.from(elements.character_list_content.querySelectorAll(".character_display")).forEach(character_display_element => {
    result.totalCharacters++;
    if (!character_display_element.classList.contains("hidden")) {
      result.totalVisible++;
      let character_display = character_api.getCharacterDisplay(character_display_element);
      let character = character_collection.find(character => character_display.character_id == character.id)
      if (character.obtainability == "limited") result.limited++;
      if (character_display.rank == 1 && character_display.level == 40) result.maxLevel++;
      else if (character_display.rank == 2 && character_display.level == 50) result.maxLevel++;
      else if (character_display.rank == 3 && character_display.level == 60) result.maxLevel++;
      else if (character_display.rank == 4 && character_display.level == 80) result.maxLevel++;
      else if (character_display.rank == 5 && character_display.level == 100) result.maxLevel++;
      let maxRank = character_api.getMaxRank(character.ranks);
      if (character_display.rank == maxRank) result.maxRank++;
      if (character_display.magic == "3") result.maxMagic++;
      if (character_display.magia == "5") result.maxMagia++;
      if (character_display.doppel == "true") result.doppel++;
      if (character_display.episode == "5") result.maxEpisode++;
      result.ranks[character_display.rank] = result.ranks[character_display.rank] + 1 || 1;
      result.levels[character_display.level] = result.levels[character_display.level] + 1 || 1;
      result.magics[character_display.magic] = result.magics[character_display.magic] + 1 || 1;
      result.magias[character_display.magia] = result.magias[character_display.magia] + 1 || 1;
      result.episodes[character_display.episode] = result.episodes[character_display.episode] + 1 || 1;
      let minRank = character_api.getMinRank(character.ranks);
      let totalCopies = 0;
      if (minRank == 1) totalCopies = 10 * (parseInt(character_display.magic)) + 1;
      else if (minRank == 2) totalCopies = 10 * (parseInt(character_display.magic)) + 1;
      else if (minRank == 3) totalCopies = 3 * (parseInt(character_display.magic)) + 1;
      else if (minRank == 4) totalCopies = 1 * (parseInt(character_display.magic)) + 1;
      result.rankCopies[minRank] = result.rankCopies[minRank] ? result.rankCopies[minRank] + totalCopies : totalCopies;
      if (character_display.se == (character_display.character_id == 2101 || character_display.character_id == 2202 ? "105" : "100")) result.maxSe++;
      result.ses[character_display.se] = result.ses[character_display.se] + 1 || 1;
    }
  });

  return `Total Characters: ${result.totalCharacters}\
\nTotal Visible: ${result.totalVisible}\
\nLimited: ${result.limited}\
\nUnlimited: ${result.totalVisible - result.limited}\
\nMax Level: ${result.maxLevel}\
\nMax Rank: ${result.maxRank}\
\nMax Magic: ${result.maxMagic}\
\nMax Magia: ${result.maxMagia}\
\nMax Episode: ${result.maxEpisode}\
\nDoppels: ${result.doppel}\
\nMax Spirit Enhancement: ${result.maxSe}\
\nLevels:${Object.entries(result.levels).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
\nRanks:${Object.entries(result.ranks).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
\nMagic Levels:${Object.entries(result.magics).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
\nMagia Levels:${Object.entries(result.magias).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
\nEpisode Levels:${Object.entries(result.episodes).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
\nSpirit Enhancement Levels:${Object.entries(result.ses).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
\nCopies of Each Rank:${Object.entries(result.rankCopies).map(([level, count]) => `\n  ${level}: ${count}`).toString()}`;
};

/**
 * Opens the Message Dialog with the list stats.
 */
export const openStatsModal = () => {
  messageDialog.open(`Stats of "${getListName()}"`, getMoreStats());
};

/* ------------------------------ Import and Export ------------------------------ */

/**
 * Opens the Export Modal Dialog.
 */
export const openExportModal = () => {
  let list = Object.values(storage_api.lists[getListId()].characterList)
    .map(value => character_api.sanitizeCharacter(value))
    .sort((a, b) => a.character_id > b.character_id ? 1 : -1);
  messageDialog.open(`"${selectedList.list.name}" Export as Text`, JSON.stringify(list, null, 2));
};

/**
 * Imports the list.
 */
export const importList = () => {
  let data = importListDialog.text.value;
  let listName = importListDialog.name.value;
  if (!listName) {
    importListDialog.error.innerHTML = `The list name must not be empty.`;
    return;
  }
  if (storage_api.listExists(listName)) {
    importListDialog.error.innerHTML = `The list name ${listName} already exists.`;
    return;
  }
  importListDialog.error.innerHTML = "";
  try {
    let characterList = JSON.parse(data);
    if (validateCharacterList(characterList)) {
      elements.list_name_title.innerHTML = listName;
      elements.profile_select.value = "Default";
      elements.character_list_content.innerHTML = "";
      let newCharacterList = {};
      Object.entries(characterList).forEach(([key, value]) =>
        newCharacterList[generatePushID()] = character_api.sanitizeCharacter(value));
      storage_api.manualCreateList(listName, newCharacterList, "0", false);
      importListDialog.close();
    } else {
      importListDialog.error.innerHTML = "The format of the JSON is invalid. Please contact Leo Chan for details.";
      return;
    }
  } catch (e) {
    importListDialog.error.innerHTML = "The format of the JSON is invalid. Please contact Leo Chan for details. " + e;
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
const validateCharacterList = (character_list) => {
  try {
    if (Array.from(character_list).every(character => {
      let errors = character_api.isValidCharacterDisplay(character.character_id, character, false);
      if (errors.length > 0) console.log(errors, character);
      return errors.length === 0
    })) return true;
  } catch (e) {
    return false;
  }
  return false;
};