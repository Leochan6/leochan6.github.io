let memoria_list_api = (function () {

  let module = {};

  module.selectedList = null;

  /* ------------------------------ Constants and Mappings ------------------------------ */

  module.DIR_TO_FLEX = { "left": "flex-start", "center": "center", "right": "flex-end" };
  const TYPE_TO_NUM = { "ability": "1", "skill": "2" };
  const NUM_TO_TYPE = { "1": "skill", "2": "ability" };
  const NUM_TO_WORD = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five" };

  /* ------------------------------ Load and Select Lists ------------------------------ */

  /**
   * Loads all the lists.
   */
  module.setLists = (lists) => {
    module.selectedList = { listId: list_name_title.getAttribute("listId"), list: null };
    saved_memoria_lists.innerHTML = "";
    list_name_title.innerHTML = "";
    list_stats_list.innerHTML = "";
    for (let [listId, list] of Object.entries(lists)) {
      let div = document.createElement("div");
      div.classList.add("memoria_list_row");
      let entry = document.createElement("div");
      entry.classList.add("memoria_list_entry");
      entry.setAttribute("listId", listId);
      entry.innerHTML = list.name;
      entry.addEventListener("click", () => {
        memoria_list_api.selectList(listId, list);
      });
      div.append(entry);
      saved_memoria_lists.append(div);
    }
    if (Object.entries(lists).length > 0) {
      if (module.selectedList && module.selectedList.listId && lists[module.selectedList.listId]) {
        module.selectList(module.selectedList.listId, lists[module.selectedList.listId]);
      } else {
        let first = Object.entries(lists)[0][0];
        module.selectList(first, lists[first]);
      }
      // enable list duplicate and delete buttons
      delete_list_button.disabled = false;
      duplicate_list_form.disabled = false;
    }
    // disable list duplicate and delete buttons if no list
    else {
      delete_list_button.disabled = true;
      duplicate_list_form.disabled = true;
    }
  };

  /**
   * loads the memoria displays of the memoria_list.
   * 
   * @param {memoria_api.Display[]} memoria_list 
   */
  const loadMemoriaList = (memoria_list) => {
    memoria_list_content.innerHTML = "";
    memoria_list = memoria_list !== true ? memoria_list : {};
    Object.entries(memoria_list).forEach(([key, display]) => {
      display._id = key;
      memoria_list_content.append(memoria_api.createDisplay(display));
    });
    module.setPadding(storage_api.settings.padding_x, storage_api.settings.padding_y);
  };

  /**
   * select the list of name and loads the memoria list
   */
  module.selectList = (listId, list) => {
    for (let element of document.querySelectorAll(".memoria_list_entry")) {
      // element already selected.
      if (element.getAttribute("listId") === listId) {
        if (element.classList.contains("selectedList")) return;
        else element.classList.add("selectedList");
      }
      else if (element.classList.contains("selectedList")) element.classList.remove("selectedList");
    }
    module.selectedList = { listId: listId, list: list };
    list_name_title.innerHTML = list.name;
    list_name_title.setAttribute("listId", listId);
    loadMemoriaList(list.memoriaList);
    profile_api.setProfile(list.selectedProfile);
    module.sortOnFormUpdate();
    background_api.setBackground(list.selectedBackground);
    memoria_list_api.getStats();
    memoria_api.enableButtons();
  };

  /* ------------------------------ Create and Delete List ------------------------------ */

  /**
   * creates a new list.
   */
  module.createList = () => {
    let listName = new_list_name_field.value;
    if (!listName) {
      home_error_text.innerHTML = `The list name must not be empty.`;
      return;
    }
    if (storage_api.listExists(listName)) {
      home_error_text.innerHTML = `The list name ${listName} already exists.`;
      return;
    }
    new_list_name_field.value = "";
    new_list_button.classList.replace("minus", "add");
    list_create.style.visibility = "collapse";
    list_create.style.display = "none";
    list_name_title.innerHTML = listName;
    profile_select.value = "10";
    console.log(profile_select.value);
    memoria_list_content.innerHTML = "";
    storage_api.createList(listName);
  };

  /**
   * deletes the list.
   */
  module.deleteList = (listId) => {
    module.selectedList = null;
    storage_api.deleteList(listId);
  };

  /**
   * duplicate the list.
   */
  module.duplicateList = (list, newName) => {
    if (list && newName && newName.length > 0) {
      let newMemoriaList = {};
      Object.entries(list.memoriaList).forEach(([key, value]) => {
        newMemoriaList[generatePushID()] = value;
      });
      list.memoriaList = newMemoriaList;
      storage_api.duplicateList(list, newName);
    }
  };

  /**
   * updates the list in the database with the list name, memorias, and profile.
   * 
   * @param {String} createdName optional
   */
  module.updateList = () => {
    let listId = module.getListId();
    let listName = module.getListName();
    let memoria_list = module.getMemoriaList(false);
    let selectedProfile = profile_api.getSelectedProfileId();
    let selectedBackground = background_api.getSelectedBackground();
    if (!listName) return;
    Object.values(memoria_list).forEach(memoria => {
      memoria.type = memoria_collection.find(elem => memoria.memoria_id == elem.id).type;
    })
    storage_api.updateList(listId, listName, memoria_list, selectedProfile, selectedBackground);
  };
  /* ------------------------------ Get the Selected List ------------------------------ */


  /**
   * returns the list name.
   */
  module.getListName = () => {
    return list_name_title.innerText;
  };

  /**
   * returns the list id.
   */
  module.getListId = () => {
    return list_name_title.getAttribute("listId");
  };

  /**
   * returns all the memoria displays in a list.
   */
  module.getMemoriaList = (keep_id = true) => {
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
   */
  module.checkListName = () => {
    let listName = new_list_name_field.value;
    if (storage_api.listExists(listName)) home_error_text.innerHTML = `The list name ${listName} already exists.`;
    else home_error_text.innerHTML = "";
  };

  /** 
   * returns the selected list.
   */
  module.getSelectedList = () => {
    for (let element of document.querySelectorAll(".memoria_list_entry")) {
      if (element.classList.contains("selectedList")) return element.getAttribute("listId");
    }
    return null;
  };


  /* ------------------------------ Sort Current List ------------------------------ */

  /**
   * sorts the memoria list with the contents of the sorting profile form.
   */
  module.sortOnFormUpdate = () => {
    let properties = profile_api.getSortProperties();
    let display_groups = sortList(properties);
    memoria_list_content.innerHTML = '';
    for (var group in display_groups) {
      if (display_groups[group].length == 0) continue;
      let group_row = document.createElement("div");
      group_row.classList.add("memoria_row");
      group_row.style.width = `${properties.displays_per_row * (94)}px`;
      group_row.setAttribute("group", group);
      display_groups[group].forEach((display) => {
        let memoria_display = memoria_api.createDisplay(display, true);
        group_row.appendChild(memoria_display);
      });
      group_row.style.justifyContent = module.DIR_TO_FLEX[storage_api.settings.display_alignment];
      memoria_list_content.appendChild(group_row);
    }
  };

  /**
   * sort the memoria list with the given properties.
   * 
   * @param {Object} properties
   */
  const sortList = (properties) => {
    // get the Display of every memoria display in the list.
    let memoria_displays = [];
    document.querySelectorAll(".memoria_display:not(.preview)").forEach(child => {
      memoria_displays.push(memoria_api.getMemoriaDisplay(child));
    });

    // add each display_property to the corresponding group.
    let display_groups = group_properties(memoria_displays, properties.group_by, properties.group_dir);

    memoria_displays.forEach(display => display.type = TYPE_TO_NUM[display.type]);

    // sort each group by the specified property.
    var sortBy = [];
    if (properties.sort_by_1 != "none") {
      sortBy.push({ prop: properties.sort_by_1, direction: properties.sort_dir_1, isString: false });
    }
    if (properties.sort_by_2 != "none") {
      sortBy.push({ prop: properties.sort_by_2, direction: properties.sort_dir_2, isString: false });
    }
    sortBy.push({ prop: "memoria_id", direction: properties.sort_id_dir, isString: false });

    for (var group in display_groups) {
      display_groups[group] = display_groups[group].sort((a, b) => utils.sortArrayBy(a, b, sortBy));
    }

    memoria_displays.forEach(display => display.type = NUM_TO_TYPE[display.type]);

    return display_groups;
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

  /* ------------------------------ List Alignment and Padding ------------------------------ */

  /**
   * Sets the alignment of the memoria rows.
   */
  module.changeAlignment = (alignment) => {
    storage_api.settings.display_alignment = alignment;
    storage_api.updateSettings("display_alignment", alignment);
    document.querySelectorAll(".memoria_row").forEach(memoria_row => {
      memoria_row.style.justifyContent = module.DIR_TO_FLEX[alignment];
    });
  };

  /**
   * Changes the padding in the direction.
   */
  module.changePadding = (direction, padding) => {
    storage_api.settings[`padding_${direction}`] = padding;
    module.setPadding(storage_api.settings.padding_x, storage_api.settings.padding_y);
  };

  /**
   * Sets the padding of the list.
   */
  module.setPadding = (x, y) => {
    memoria_list_content.style.padding = `${y}px ${x}px`;
  }

  /* ------------------------------ List Zoom ------------------------------ */

  /**
   * sets the zoom of the memoria list.
   */
  module.changeZoom = (zoom) => {
    storage_api.updateSettings("memoria_zoom", zoom);
    memoria_list_content.style.zoom = zoom / 100;
  };

  /**
   * sets the zoom of the memoria list to fit.
   */
  module.zoom_fit = () => {
    if (memoria_list_content.innerHTML) {
      let row = memoria_list_content.querySelector(".memoria_row")
      let list_width = row.clientWidth;
      let list_height = row.clientHeight * memoria_list_content.querySelectorAll(".memoria_row").length;
      let container_width = memoria_list_content.clientWidth;
      let container_height = memoria_list_content.clientHeight;
      let ratio = Math.min((container_width - 40) / list_width, (container_height - 40) / list_height);
      console.log(ratio);
      ratio = ratio < 1 ? ratio : 1;
      memoria_list_content.style.zoom = ratio;
      zoom_range.value = Math.round(ratio * 100);
      zoom_field.value = Math.round(ratio * 100);
    }
  };

  /* ------------------------------ List Filters ------------------------------ */

  /**
   * Creates a new filter.
   */
  module.createFilter = (next = null) => {
    let new_filter = document.createElement("div");
    new_filter.classList.add("filter_row");
    new_filter.innerHTML = `
      <select class="state_select collapse">
        <option value="and">And</option>
        <option value="or">Or</option>
      </select>
      <select class="type_select">
        <option value="rank">Rank</option>
        <option value="ascension">Ascension</option>
        <option value="level">Level</option>
        <option value="obtainability">Obtainability</option>
      </select>
      <div class="filter_type rank_filter hidden">
        <select class="filter_field inequality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field rank_select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div class="filter_type ascension_filter hidden">
        <select class="filter_field inequality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field ascension_select">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div class="filter_type level_filter hidden">
        <select class="filter_field inequality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <input class="filter_field level_input" type="number" value=1 maxlength="3" size=2 min=1 max=50>
      </div>
      <div class="filter_type obtainability_filter hidden">
        <select class="filter_field equality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field obtainability_select">
          <option value="unlimited">Unlimited</option>
          <option value="limited">Limited</option>
        </select>
      </div>
      <button class="create" title="Add New Filter Above">+</button>
      <button class="delete" title="Delete Filter"></button>
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
      module.createFilter(new_filter);
    });

    new_filter.querySelector(".delete").addEventListener("click", () => {
      new_filter.remove();
      if (list_filters.children.length > 0) {
        let first = list_filters.children[0].querySelector(".state_select");
        if (list_filters.children.length >= 1 && !first.classList.contains("collapse")) first.classList.add("collapse");
      }
      module.getFilters();
    });

    if (list_filters.children.length > 0) new_filter.querySelector(".state_select").classList.remove("collapse");
    if (next != null) {
      list_filters.insertBefore(new_filter, next);
      if (!list_filters.children[0].querySelector(".state_select").classList.contains("collapse")) list_filters.children[0].querySelector(".state_select").classList.add("collapse");
      if (next.querySelector(".state_select").classList.contains("collapse")) next.querySelector(".state_select").classList.remove("collapse");
    }
    else list_filters.append(new_filter);
  };

  /**
   * Returns the filters.
   */
  module.getFilters = () => {
    let filters = [];
    for (let list_filter_row of Array.from(list_filters.children)) {
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
   */
  module.applyFilters = (filters = module.getFilters()) => {
    // if no filters, then show everything.
    if (filters.length == 0) {
      Array.from(memoria_list_content.children).forEach(memoria_row => {
        Array.from(memoria_row.children).forEach(memoria_display_element => {
          if (memoria_display_element.classList.contains("hidden")) {
            memoria_display_element.classList.remove("hidden");
            memoria_display_element.style.display = "flex";
          }
        });
        if (memoria_row.classList.contains("hidden")) {
          memoria_row.classList.remove("hidden");
          memoria_row.style.display = "flex";
        }
      });
      return;
    }
    Array.from(memoria_list_content.children).forEach(memoria_row => {
      Array.from(memoria_row.children).forEach(memoria_display_element => {
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
      // hide the row all children are hidden memoria_list.
      if (Array.from(memoria_row.children).every(child => child.classList.contains("hidden"))) {
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
    // console.log(memoria_display, matches, matches.some(value => value));
    return matches.some(value => value);
  };

  /**
   * Check if the memoria diaplay matches the filter.
   */
  const matchesFilter = (memoria_display, filter) => {
    if (filter[0].param === "equality") {
      if (filter[1].param === "obtainability") {
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
  module.resetFilters = () => {
    Array.from(memoria_list_content.children).forEach(memoria_row => {
      Array.from(memoria_row.children).forEach(memoria_display_element => {
        if (memoria_display_element.classList.contains("hidden")) {
          memoria_display_element.classList.remove("hidden");
          memoria_display_element.style.display = "flex";
        }
      });
      if (memoria_row.classList.contains("hidden")) {
        memoria_row.classList.remove("hidden");
        memoria_row.style.display = "flex";
      }
    });
    list_filters.innerHTML = "";
  };

  /* ------------------------------ List Stats ------------------------------ */

  /**
   * Returns the simple stats of the list.
   */
  module.getStats = () => {
    let result = {
      totalMemoria: 0,
      totalVisible: 0,
      limited: 0,
      maxAscension: 0,
      maxLevel: 0,
    };

    Array.from(memoria_list_content.children).forEach(memoria_row => {
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
    list_stats_list.innerHTML = `Visible: ${result.totalVisible}/${result.totalMemoria}`;
    return result;
  };

  /**
   * Returns all the stats of the list.
   */
  module.getMoreStats = () => {
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

    Array.from(memoria_list_content.children).forEach(memoria_row => {
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

  module.openStatsModal = () => {
    messageModal.style.display = "block";
    messageModalText.value = module.getMoreStats();
    messageModalTitle.innerHTML = `Stats of "${memoria_list_api.getListName()}"`;
    messageModalList.innerHTML = "";
  };

  /* ------------------------------ Import and Export ------------------------------ */

  /**
   * Opens the Export Modal Dialog.
   */
  module.openExportModal = () => {
    messageModal.style.display = "block";
    let list = Object.entries(module.getMemoriaList(false)).map(([key, value]) => value);
    messageModalText.value = JSON.stringify(list, null, 1);
    messageModalTitle.innerHTML = `${memoria_list_api.selectedList.list.name} Contents`;
    messageModalList.innerHTML = "";
  };

  /**
   * Opens the Export Modal Dialog.
   */
  module.openImportModal = () => {
    importListModal.style.display = "block";
    importListModalTitle.innerHTML = "Import List"
    importListModalName.value = "";
    importListModalText.innerHTML = "";
  };

  /**
   * Imports the list.
   */
  module.importList = () => {
    let data = importListModalText.value;
    let listName = importListModalName.value;
    if (!listName) {
      importListModalError.innerHTML = `The list name must not be empty.`;
      return;
    }
    if (storage_api.listExists(listName)) {
      importListModalError.innerHTML = `The list name ${listName} already exists.`;
      return;
    }
    importListModalError.innerHTML = "";
    try {
      let memoria_list = JSON.parse(data);
      if (validateMemoriaList(memoria_list)) {
        list_name_title.innerHTML = listName;
        profile_select.value = "Default";
        memoria_list_content.innerHTML = "";
        storage_api.manualCreateList(listName, memoria_list, "Default", true);
        importListModal.style.display = "none";
        importListModalName.value = "";
        importListModalText.value = "";
        importListModalText.scrollTo(0, 0);
      } else {
        importListModalError.innerHTML = "The format of the JSON is invalid. Please contact Leo Chan for details.";
        return;
      }
    } catch (e) {
      importListModalError.innerHTML = "The format of the JSON is invalid. Please contact Leo Chan for details. " + e;
      return;
    }
  };

  /**
   * Checks if the memoria list is valid.
   */
  const validateMemoriaList = (memoria_list) => {
    try {
      if (Array.from(memoria_list).every(memoria => {
        memoria_api.isValidMemoriaDisplay(memoria.memoria_id, memoria, false).length === 0
      })) return true;
    } catch (e) {
      return false;
    }
    return false;
  };

  return module;
})();