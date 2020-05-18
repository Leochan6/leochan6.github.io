import { memoria_collection } from '../../collection/memoria_collection.js';
import * as background_api from './background_api.js';
import { memoria_elements as elements, messageDialog, importListDialog } from './memoria_elements.js';
import * as memoria_api from './memoria_api.js';
import * as profile_api from './profile_api.js';
import * as storage_api from './storage_api.js';
import * as utils from '../../shared/js/utils.js';

/**
 * Memoria List API for the Memoria Page.
 */

export let selectedList = null;

/* ------------------------------ Constants and Mappings ------------------------------ */

export const DIR_TO_FLEX = { "left": "flex-start", "center": "center", "right": "flex-end" };
const TYPE_TO_NUM = { "ability": "1", "skill": "2" };
const NUM_TO_TYPE = { "1": "skill", "2": "ability" };
const NUM_TO_WORD = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five" };

/* ------------------------------ Load and Select Lists ------------------------------ */

/**
 * Loads all the lists.
 */
export const setLists = (lists) => {
  selectedList = { listId: list_name_title.getAttribute("listId"), list: null };
  elements.saved_memoria_lists.innerHTML = "";
  elements.list_name_title.innerHTML = "";
  elements.list_stats_list.innerHTML = "";
  for (let [listId, list] of Object.entries(lists)) {
    // update the fields of each memoria.
    Object.entries(list.memoriaList).forEach(([key, display]) => {
      display._id = key;
    });
    let div = document.createElement("div");
    div.classList.add("memoria_list_row");
    let entry = document.createElement("button");
    entry.classList.add("small_btn");
    entry.classList.add("memoria_list_entry");
    entry.setAttribute("listId", listId);
    entry.innerHTML = list.name;
    entry.addEventListener("click", () => {
      selectList(listId, list);
    });
    div.append(entry);
    elements.saved_memoria_lists.append(div);
  }
  if (Object.entries(lists).length > 0) {
    if (selectedList && selectedList.listId && lists[selectedList.listId]) {
      selectList(selectedList.listId, lists[selectedList.listId]);
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
    elements.memoria_list_content.innerHTML = "";
  }
};

/**
 * select the list of name and loads the memoria list
 * 
 * @param {String} listId 
 * @param {Object} list 
 */
export const selectList = (listId, list) => {
  for (let element of document.querySelectorAll(".memoria_list_entry")) {
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
  setPadding(storage_api.settings.padding_x, storage_api.settings.padding_y);
  background_api.setBackground(list.selectedBackground);
  getStats();
  memoria_api.findAndSelectDisplay();
  memoria_api.enableButtons();
};

/* ------------------------------ Create and Delete List ------------------------------ */

/**
 * creates a new list.
 */
export const createList = () => {
  let listName = new_list_name_field.value;
  if (!listName) {
    elements.home_error_text.innerHTML = `The list name must not be empty.`;
    return;
  }
  elements.new_list_name_field.value = "";
  elements.new_list_button.classList.replace("minus", "add");
  elements.list_create.style.visibility = "collapse";
  elements.list_create.style.display = "none";
  elements.list_name_title.innerHTML = listName;
  elements.profile_select.value = "10";
  elements.memoria_list_content.innerHTML = "";
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
 * duplicate the list.
 * 
 * @param {Object} list 
 * @param {String} newName 
 */
export const duplicateList = (list, newName) => {
  if (list && newName && newName.length > 0) {
    let newMemoriaList = {};
    Object.entries(list.memoriaList).forEach(([key, value]) => {
      newMemoriaList[generatePushID()] = value;
    });
    list.memoriaList = newMemoriaList;
    storage_api.duplicateList(list, newName);
    elements.duplicate_list_name_field.value = "";
    elements.list_duplicate.style.visibility = "collapse";
    elements.list_duplicate.style.display = "none";
  }
};

/**
 * deletes the list.
 */
export const deleteList = (listId) => {
  selectedList = null;
  storage_api.deleteList(listId);
};

/**
 * updates the list in the database with the list name, memoria, and profile.
 * 
 * @param {String} createdName optional
 */
export const updateList = () => {
  let listId = getListId();
  let listName = getListName();
  let memoriaList = storage_api.lists[listId].memoriaList;
  Object.values(memoriaList).forEach(value => {
    if (value._id) delete value._id;
  });
  let selectedProfile = profile_api.getSelectedProfileId();
  let selectedBackground = background_api.getSelectedBackground();
  if (!listName) return;
  // Object.values(memoriaList).forEach(memoria => {
  //   memoria.type = memoria_collection.find(elem => memoria.memoria_id == elem.id).type;
  // })
  storage_api.updateList(listId, listName, memoriaList, selectedProfile, selectedBackground);
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
 * returns all the memoria displays in a list.
 * 
 * @param {boolean} keep_id
 */
export const getMemoriaList = (keep_id = true) => {
  let memoriaList = {};
  document.querySelectorAll(".memoria_display:not(.preview)").forEach(child => {
    let id = child.getAttribute("_id") !== "undefined" ? child.getAttribute("_id") : child.getAttribute("memoria_id");
    memoriaList[id] = memoria_api.getMemoriaDisplay(child);
    if (!keep_id) delete memoriaList[id]._id;
  });
  if (Object.keys(memoriaList).length == 0) memoriaList = true;
  return memoriaList;
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
  for (let element of document.querySelectorAll(".memoria_list_entry")) {
    if (element.classList.contains("selectedList")) return element.getAttribute("listId");
  }
  return null;
};


/* ------------------------------ Sort Current List ------------------------------ */

/**
 * Applied the profile profileId to list listId and displays the memoria list.
 * 
 * @param {String} listId 
 * @param {String} profileId 
 */
export const applyProfileToList = (listId, profileId) => {
  let memoriaList = storage_api.lists[listId].memoriaList;
  // modify the list.
  Object.entries(memoriaList).forEach(([key, display]) => {
    display._id = key;
    let memoria = memoria_collection.find(memoria => display.memoria_id == memoria.id);
    display.type = memoria.type;
    display.rank = memoria.rank;
    display.obtainability = memoria.obtainability;
  });
  let rules = storage_api.profiles[profileId].rules;
  if (!rules) rules = profile_api.getSortSettings();
  let groups = createGroups(memoriaList, rules);
  elements.memoria_list_content.innerHTML = '';
  displayGroups(elements.memoria_list_content, groups);
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
    group_row.classList.add("memoria_row");
    group_row.style.width = `${storage_api.settings.memoria_displays_per_row * (94)}px`;
    group_row.setAttribute("group", key);
    group_row.style.justifyContent = DIR_TO_FLEX[storage_api.settings.display_alignment];

    if (group instanceof Array) {
      group.forEach((display) => {
        let memoria_display = memoria_api.createDisplay(display, true);
        group_row.appendChild(memoria_display);
      });
    } else {
      displayGroups(group_row, group);
    }
    parent.appendChild(group_row);
  });
};

/**
 * Create the group and sort order for the memoriaList and rules.
 * 
 * @param {Object} memoriaList 
 * @param {Object} rules 
 * 
 * @returns {Object}
 */
export const createGroups = (memoriaList, rules) => {
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
  let memoriaGroups = groupAndSort(Object.values(memoriaList), groups, sorts);
  return memoriaGroups;
};

/**
 * Recursively groups the memoriaList into groups and then sorts.
 * 
 * @param {Array} memoriaList 
 * @param {Array} rules 
 * @param {Array} sorts 
 * 
 * @returns {Object}
 */
const groupAndSort = (memoriaList, rules, sorts) => {
  if (rules.length == 0) {
    let sorted = memoriaList;
    sorted.forEach(char => char.type = TYPE_TO_NUM[char.type]);
    sorted.sort((a, b) => utils.sortArrayBy(a, b, sorts));
    sorted.forEach(char => char.type = NUM_TO_TYPE[char.type]);
    return sorted;
  } else {
    let rule = rules[0];
    let groups = group_properties(memoriaList, rule.type, rule.direction)
    Object.entries(groups).forEach(([key, group]) => {
      groups[key] = groupAndSort(group, rules.slice(1), sorts);
    });
    return groups;
  }
};

/**
 * adds each display_property to the corresponding group.
 * 
 * @param {memoria_api.Display} display_properties
 * @param {String} group_by
 * @param {Number} group_dir
 */
const group_properties = (display_properties, group_by, group_dir) => {
  let display_groups = {};
  if (group_by == "type") {
    if (group_dir == 1) display_groups = { "ability": [], "skill": [] };
    if (group_dir == -1) display_groups = { "skill": [], "ability": [] };
    display_properties.forEach(properties => {
      display_groups[properties.type].push(properties);
    });
  } else if (group_by == "rank") {
    if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [] };
    if (group_dir == -1) display_groups = { "four": [], "three": [], "two": [], "one": [] };
    display_properties.forEach(properties => {
      display_groups[NUM_TO_WORD[properties.rank]].push(properties);
    });
  } else if (group_by == "ascension") {
    if (group_dir == 1) display_groups = { "zero": [], "one": [], "two": [], "three": [], "four": [] };
    if (group_dir == -1) display_groups = { "four": [], "three": [], "two": [], "one": [], "zero": [] };
    display_properties.forEach(properties => {
      display_groups[NUM_TO_WORD[properties.ascension]].push(properties);
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
 * Sets the displays per memoria row.
 * 
 * @param {Number} displays 
 */
export const changeDisplaysPerRow = (displays) => {
  document.querySelectorAll(".memoria_row").forEach(memoria_row => {
    memoria_row.style.width = `${displays * (94)}px`;
  });
  storage_api.updateSettings("memoria_displays_per_row", displays);
};

/**
 * Sets the alignment of the memoria rows.
 * 
 * @param {String} alignment 
 */
export const changeAlignment = (alignment) => {
  storage_api.settings.display_alignment = alignment;
  storage_api.updateSettings("display_alignment", alignment);
  document.querySelectorAll(".memoria_row").forEach(memoria_row => {
    memoria_row.style.justifyContent = DIR_TO_FLEX[alignment];
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
  setPadding(storage_api.settings.padding_x, storage_api.settings.padding_y);
};

/**
 * Sets the padding of the list.
 * 
 * @param {Number} x 
 * @param {Number} y 
 */
export const setPadding = (x, y) => {
  elements.memoria_list_content.style.padding = `${y}px ${x}px`;
}

/* ------------------------------ List Zoom ------------------------------ */

/**
 * sets the zoom of the memoria list.
 */
export const changeZoom = (zoom) => {
  storage_api.updateSettings("memoria_zoom", zoom);
  elements.memoria_list_content.style.zoom = zoom / 100;
};

/**
 * sets the zoom of the memoria list to fit.
 */
export const zoom_fit = () => {
  if (elements.memoria_list_content.innerHTML) {
    let row = elements.memoria_list_content.querySelector(".memoria_row")
    let list_width = row.clientWidth;
    let list_height = row.clientHeight * elements.memoria_list_content.querySelectorAll(".memoria_row").length;
    let container_width = elements.memoria_list_content.clientWidth;
    let container_height = elements.memoria_list_content.clientHeight;
    let ratio = Math.min((container_width - 40) / list_width, (container_height - 40) / list_height);
    console.log(ratio);
    ratio = ratio < 1 ? ratio : 1;
    elements.memoria_list_content.style.zoom = ratio;
    elements.zoom_range.value = Math.round(ratio * 100);
    elements.zoom_field.value = Math.round(ratio * 100);
  }
};

/* ------------------------------ List Filters ------------------------------ */

/**
 * Creates a new filter.
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
        <option value="type">Type</option>
        <option value="rank">Rank</option>
        <option value="ascension">Ascension</option>
        <option value="level">Level</option>
        <option value="obtainability">Obtainability</option>
      </select>
      <div class="filter_type type_filter hidden">
        <select class="filter_field equality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field type_select form_input">
          <option value="ability">Ability</option>
          <option value="skill">Skill</option>
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
        </select>
      </div>
      <div class="filter_type ascension_filter hidden">
        <select class="filter_field inequality form_input">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field ascension_select form_input">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
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
        <input class="filter_field level_input form_input" type="number" value=1 maxlength="3" size=2 min=1 max=50>
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

  if (elements.list_filters.children.length > 0) new_filter.querySelector(".state_select").classList.remove("collapse");
  if (next != null) {
    elements.list_filters.insertBefore(new_filter, next);
    if (!elements.list_filters.children[0].querySelector(".state_select").classList.contains("collapse")) list_filters.children[0].querySelector(".state_select").classList.add("collapse");
    if (next.querySelector(".state_select").classList.contains("collapse")) next.querySelector(".state_select").classList.remove("collapse");
  }
  else elements.list_filters.append(new_filter);
};

/**
 * Returns the filters.
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
    Array.from(elements.memoria_list_content.querySelectorAll(".memoria_row")).forEach(memoria_row => {
      if (memoria_row.classList.contains("hidden")) {
        memoria_row.classList.remove("hidden");
        memoria_row.style.display = "flex";
      }
    });
    Array.from(elements.memoria_list_content.querySelectorAll(".memoria_display")).forEach(memoria_display_element => {
      if (memoria_display_element.classList.contains("hidden")) {
        elements.memoria_display_element.classList.remove("hidden");
        memoria_display_element.style.display = "flex";
      }
    });
    return;
  }
  Array.from(elements.memoria_list_content.querySelectorAll(".memoria_display")).forEach(memoria_display_element => {
    let memoria_display = memoria_api.getMemoriaDisplay(memoria_display_element);
    if (matchesAllFilters(memoria_display, filters)) {
      if (memoria_display_element.classList.contains("hidden")) {
        memoria_display_element.classList.remove("hidden");
        memoria_display_element.style.display = "flex";
      }
    } else {
      if (!memoria_display_element.classList.contains("hidden")) {
        memoria_display_element.classList.add("hidden");
        memoria_display_element.style.display = "none";
      }
    }
  });
  Array.from(elements.memoria_list_content.querySelectorAll(".memoria_row")).forEach(memoria_row => {
    // hide the row all children are hidden memoria_list.
    if (Array.from(memoria_row.querySelectorAll(".memoria_display")).every(child => child.classList.contains("hidden"))) {
      if (!memoria_row.classList.contains("hidden")) {
        memoria_row.classList.add("hidden");
        memoria_row.style.display = "none";
      }
    } else {
      if (memoria_row.classList.contains("hidden")) {
        memoria_row.classList.remove("hidden");
        memoria_row.style.display = "flex";
      }
    }
  });
};

/**
 * Check if memoria display matches all the filters.
 * 
 * @param {memoria_api.Display} memoria_display
 * @param {Array} filters
 * 
 * @returns {boolean}
 */
const matchesAllFilters = (memoria_display, filters) => {
  let matches = Array(filters.length).fill(true);
  filters.forEach((filter, i) => {
    matches[i] = matchesFilter(memoria_display, filter.value);
    if (i > 0 && filter.state === "and") {
      let and = matches[i - 1] && matches[i];
      matches[i] = and;
      matches[i - 1] = and;
    }
  });
  return matches.some(value => value);
};

/**
 * Check if the memoria display matches the filter.
 * 
 * @param {memoria_api.Display} memoria_display 
 * @param {Array} filter 
 */
const matchesFilter = (memoria_display, filter) => {
  if (filter[0].param === "equality") {
    if (filter[1].param === "type") {
      let type = memoria_collection.find(memoria => memoria_display.memoria_id == memoria.id).type;
      if (filter[0].value === "eq" && type === filter[1].value) return true;
      else if (filter[0].value === "neq" && type !== filter[1].value) return true;
      else return false;
    } else if (filter[1].param === "obtainability") {
      let obtainability = memoria_collection.find(memoria => memoria_display.memoria_id == memoria.id).obtainability;
      if (filter[0].value === "eq" && obtainability === filter[1].value) return true;
      else if (filter[0].value === "neq" && obtainability !== filter[1].value) return true;
      else return false;
    } else {
      if (filter[0].value === "eq" && memoria_display[filter[1].param] === filter[1].value) return true;
      else if (filter[0].value === "neq" && memoria_display[filter[1].param] !== filter[1].value) return true;
      else return false;
    }
  } else {
    let param = 1;
    if (filter[1].param === "max_rank") {
      param = parseInt(memoria_api.getMaxRank(memoria_collection.find(memoria => memoria_display.memoria_id == memoria.id).ranks))
    } else if (filter[1].param === "min_rank") {
      param = parseInt(memoria_api.getMinRank(memoria_collection.find(memoria => memoria_display.memoria_id == memoria.id).ranks))
    } else {
      param = parseInt(memoria_display[filter[1].param]);
    }
    if (filter[0].value === "eq" && param === parseInt(filter[1].value)) return true;
    else if (filter[0].value === "neq" && param !== parseInt(filter[1].value)) return true;
    else if (filter[0].value === "lt" && param < parseInt(filter[1].value)) return true;
    else if (filter[0].value === "gt" && param > parseInt(filter[1].value)) return true;
    else if (filter[0].value === "lte" && param <= parseInt(filter[1].value)) return true;
    else if (filter[0].value === "gte" && param >= parseInt(filter[1].value)) return true;
    else return false;
  }
};

/**
 * Removes all the filters.
 */
export const resetFilters = () => {
  Array.from(elements.memoria_list_content.querySelectorAll(".memoria_row")).forEach(memoria_row => {
    if (memoria_row.classList.contains("hidden")) {
      memoria_row.classList.remove("hidden");
      memoria_row.style.display = "flex";
    }
  });
  Array.from(elements.memoria_list_content.querySelectorAll(".memoria_display")).forEach(memoria_display_element => {
    if (memoria_display_element.classList.contains("hidden")) {
      memoria_display_element.classList.remove("hidden");
      memoria_display_element.style.display = "flex";
    }
  });
  elements.list_filters.innerHTML = "";
  if (elements.toggle_filter_button.classList.contains("add")) elements.toggle_filter_button.classList.remove("add");
  if (elements.toggle_filter_button.classList.contains("minus")) elements.toggle_filter_button.classList.remove("minus");
  if (!elements.toggle_filter_button.classList.contains("hidden")) elements.toggle_filter_button.classList.add("hidden");
};

/* ------------------------------ List Stats ------------------------------ */

/**
 * Returns the simple stats of the list.
 */
export const getStats = () => {
  let result = {
    totalMemoria: 0,
    totalVisible: 0,
    limited: 0,
    maxAscension: 0,
    maxLevel: 0,
  };

  Array.from(elements.memoria_list_content.children).forEach(memoria_row => {
    Array.from(memoria_row.children).forEach(memoria_display_element => {
      result.totalMemoria++;
      if (!memoria_display_element.classList.contains("hidden")) {
        result.totalVisible++;
        let memoria_display = memoria_api.getMemoriaDisplay(memoria_display_element);
        let memoria = memoria_collection.find(memoria => memoria.id == memoria_display.memoria_id);
        if (memoria.obtainability == "limited") result.limited++;
        if (memoria_api.getMaxLevel(memoria.ascension, memoria.rank) == memoria_display.level) result.maxLevel++;
        if (memoria.ascension == 4) result.maxAscension++;
      }
    });
  });
  elements.list_stats_list.innerHTML = `Visible: ${result.totalVisible}/${result.totalMemoria}`;
  return result;
};

/**
 * Returns all the stats of the list.
 */
export const getMoreStats = () => {
  let result = {
    totalMemoria: 0,
    totalVisible: 0,
    limited: 0,
    maxLevel: 0,
    levels: {},
    maxAscension: 0,
    ascensions: {},
    ranks: {},
    rankCopies: {}
  };

  Array.from(elements.memoria_list_content.children).forEach(memoria_row => {
    Array.from(memoria_row.children).forEach(memoria_display_element => {
      result.totalMemoria++;
      if (!memoria_display_element.classList.contains("hidden")) {
        result.totalVisible++;
        let memoria_display = memoria_api.getMemoriaDisplay(memoria_display_element);
        let memoria = memoria_collection.find(memoria => memoria_display.memoria_id == memoria.id)
        if (memoria.obtainability == "limited") result.limited++;
        if (memoria_api.getMaxLevel(memoria.ascension, memoria.rank) == memoria_display.level) result.maxLevel++;
        if (memoria.ascension == 4) result.maxAscension++;
        result.ranks[memoria_display.rank] = result.ranks[memoria_display.rank] + 1 || 1;
        result.ascensions[memoria_display.ascension] = result.ascensions[memoria_display.ascension] + 1 || 1;
        result.levels[memoria_display.level] = result.levels[memoria_display.level] + 1 || 1;
        let totalCopies = parseInt(memoria_display.ascension) + 1;
        result.rankCopies[memoria_display.rank] = result.rankCopies[memoria_display.rank] ? result.rankCopies[memoria_display.rank] + totalCopies : totalCopies;
      }
    });
  });

  return `Total Memoria: ${result.totalMemoria}\nTotal Visible: ${result.totalVisible}\nLimited: ${result.limited}\nUnlimited: ${result.totalVisible - result.limited}\
      \nMax Level: ${result.maxLevel}\nMax Ascension: ${result.maxAscension}\
      \nLevels:${Object.entries(result.levels).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
      \nRanks:${Object.entries(result.ranks).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
      \nAscensions:${Object.entries(result.ascensions).map(([level, count]) => `\n  ${level}: ${count}`).toString()}\
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
  let list = Object.entries(getMemoriaList(false))
    .map(([key, value]) => value).sort((a, b) => a.memoria_id > b.memoria_id ? 1 : -1);
  messageDialog.open(`${selectedList.list.name} Contents`, JSON.stringify(list, null, 1));
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
    let memoria_list = JSON.parse(data);
    if (validateMemoriaList(memoria_list)) {
      elements.list_name_title.innerHTML = listName;
      elements.profile_select.value = "Default";
      elements.memoria_list_content.innerHTML = "";
      let newMemoriaList = {}
      Object.entries(memoriaList).forEach(([key, value]) => {
        newMemoriaList[generatePushID()] = value;
      });
      storage_api.manualCreateList(listName, newMemoriaList, "10", false);
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
 * Checks if the memoria list is valid.
 * 
 * @param {HTMLDivElement[]} memoria_list
 * 
 * @returns {boolean}
 */
const validateMemoriaList = (memoria_list) => {
  try {
    if (Array.from(memoria_list).every(memoria => {
      let errors = memoria_api.isValidMemoriaDisplay(memoria.memoria_id, memoria, false);
      return errors.length === 0
    })) return true;
  } catch (e) {
    return false;
  }
  return false;
};