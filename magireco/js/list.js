let list_api = (function () {

  let module = {};

  module.selectedList = null;

  /**
   * loads the character displays of the character_list.
   * 
   * @param {character_api.Display[]} character_list 
   */
  const loadCharacterList = (character_list) => {
    character_list_content.innerHTML = "";
    character_list = character_list !== true ? character_list : [];
    character_list.forEach(display => {
      character_list_content.append(character_api.createDisplay(display));
    });
  };

  /**
   * sort the character list with the given properties.
   * 
   * @param {Object} properties
   */
  const sortList = (properties) => {
    // get the Display of every character display in the list.
    let character_displays = [];
    document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
      character_displays.push(character_api.getCharacterDisplay(child));
    });

    // add each display_property to the corresponding group.
    let display_groups = group_properties(character_displays, properties.group_by, properties.group_dir);

    // sort each group by the specified property.
    var sortBy = [];
    if (properties.sort_by_1 != "none") {
      sortBy.push({ prop: properties.sort_by_1, direction: properties.sort_dir_1, isString: false });
    }
    if (properties.sort_by_2 != "none") {
      sortBy.push({ prop: properties.sort_by_2, direction: properties.sort_dir_2, isString: false });
    }
    sortBy.push({ prop: "id", direction: properties.sort_id_dir, isString: false });

    for (var group in display_groups) {
      display_groups[group] = display_groups[group].sort((a, b) => utils.sortArrayBy(a, b, sortBy));
    }
    // placeCharacterDisplays(display_groups, num_per_row);
    return display_groups;
  };

  /**
   * mapping of numbers to numbers.
   */
  const NUM_TO_WORD = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five" };

  /**
   * adds each display_property to the corresponding group.
   * 
   * @param {character_api.Display} display_properties
   * @param {String} group_by
   * @param {Number} group_dir
   */
  const group_properties = (display_properties, group_by, group_dir) => {
    let display_groups = {};
    if (group_by == "attribute") {
      if (group_dir == 1) display_groups = { "fire": [], "water": [], "forest": [], "light": [], "dark": [], "void": [] };
      if (group_dir == -1) display_groups = { "void": [], "dark": [], "light": [], "forest": [], "water": [], "fire": [] };
      display_properties.forEach(properties => {
        display_groups[properties.attribute].push(properties);
      });
    } else if (group_by == "rank") {
      if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
      if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
      display_properties.forEach(properties => {
        display_groups[NUM_TO_WORD[properties.rank]].push(properties);
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
    } else if (group_by == "none") {
      display_groups = { "none": [] };
      display_properties.forEach(properties => {
        display_groups.none.push(properties);
      });
    }
    return display_groups;
  };

  /**
   * sorts the character list with the contents of the sorting profile form.
   */
  module.sortOnFormUpdate = () => {
    let properties = profile_api.getSortProperties();
    let display_groups = sortList(properties);
    character_list_content.innerHTML = '';
    for (var group in display_groups) {
      if (display_groups[group].length == 0) continue;
      let group_row = document.createElement("div");
      group_row.classList.add("character_row");
      group_row.style.width = `${properties.displays_per_row * 122}px`;
      group_row.setAttribute("group", group);
      display_groups[group].forEach((display) => {
        let character_display = character_api.createDisplay(display, true);
        group_row.appendChild(character_display);
      });
      character_list_content.appendChild(group_row);
    }
  };

  /**
   * updates the list in the database with the list name, characters, and profile.
   * 
   * @param {String} createdName optional
   */
  module.updateList = () => {
    let listId = module.getListId();
    let listName = module.getListName();
    let character_list = module.getCharacterList();
    let selectedProfile = profile_api.getSelectedProfile();
    let selectedBackground = background_api.getSelectedBackground();
    if (!listName) return;
    storage_api.updateList(listId, listName, character_list, selectedProfile, selectedBackground);
  };

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
   * returns all the character displays in a list.
   */
  module.getCharacterList = () => {
    let character_list = [];
    document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
      character_list.push(character_api.getCharacterDisplay(child));
    });
    return character_list;
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
    profile_select.value = "Default";
    character_list_content.innerHTML = "";
    storage_api.createList(listName);
  };

  /** 
   * returns the selected list.
   */
  module.getSelectedList = () => {
    for (let element of document.querySelectorAll(".character_list_entry")) {
      if (element.classList.contains("selectedList")) return element.innerHTML;
    }
    return null;
  };

  /**
   * select the list of name and loads the character list list
   */
  module.selectList = (listId, list) => {
    for (let element of document.querySelectorAll(".character_list_entry")) {
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
    loadCharacterList(list.characterList);
    profile_select.value = list.selectedProfile;
    profile_api.setProfile();
    module.sortOnFormUpdate();
    background_select.value = list.selectedBackground
    background_api.setBackground(list.selectedBackground);
    list_api.getStats();
    character_api.enableButtons();
  };

  /**
   * deletes the list from the database.
   */
  module.deleteList = (listId) => {
    module.selectedList = null;
    storage_api.deleteList(listId);
  };

  module.setLists = (lists) => {
    module.selectedList = { listId: list_name_title.getAttribute("listId"), list: null };
    saved_character_lists.innerHTML = "";
    for (let [listId, list] of Object.entries(lists)) {
      let div = document.createElement("div");
      div.classList.add("character_list_row");
      let entry = document.createElement("div");
      entry.classList.add("character_list_entry");
      entry.setAttribute("listId", listId);
      entry.innerHTML = list.name;
      entry.addEventListener("click", () => {
        list_api.selectList(listId, list);
      });
      let deleteButton = document.createElement("button");
      deleteButton.className = "small_btn delete";
      deleteButton.addEventListener("click", () => {
        let res = confirm(`Are you sure you want to delete the list ${list.name}?`);
        if (res) list_api.deleteList(listId, list);
      });
      div.append(entry);
      div.append(deleteButton);
      saved_character_lists.append(div);
    }
    if (Object.entries(lists).length > 0) {
      if (module.selectedList && module.selectedList.listId && lists[module.selectedList.listId]) {
        return module.selectList(module.selectedList.listId, lists[module.selectedList.listId]);
      }
      else {
        let first = Object.entries(lists)[0][0];
        return module.selectList(first, lists[first]);
      }
    }
  }

  /**
   * sets the zoom of the character list.
   */
  module.changeZoom = (zoom) => {
    character_list_content.style.zoom = zoom / 100;
  };

  /**
   * sets the zoom of the character list to fit.
   */
  module.zoom_fit = () => {
    if (character_list_content.innerHTML) {
      // let widthRatio = Math.max((document.querySelector("body").clientWidth - left_bar.clientWidth - left_main_divider.clientWidth - 10 - 10 - 20), 500) / character_list_content.clientWidth;
      // let heightRatio = Math.max((document.querySelector("body").clientHeight - main_header.clientHeight - header_content_divider.clientHeight - main_header.clientHeight - 10 - 10 - 20), 300) / character_list_content.clientHeight;
      // let zoom = Math.min(widthRatio, heightRatio);
      // zoom = zoom < 1 ? zoom : 1;
      // character_list_content.style.zoom = zoom;
      // zoom_range.value = Math.round(zoom * 100);
      // zoom_field.value = Math.round(zoom * 100);
      let row = character_list_content.querySelector(".character_row")
      let list_width = row.clientWidth;
      let list_height = row.clientHeight * character_list_content.querySelectorAll(".character_row").length;
      let container_width = character_list_content.clientWidth;
      let container_height = character_list_content.clientHeight;
      console.log(list_width);
      console.log(container_width);
      console.log(list_height);
      console.log(container_height);
      let ratio = Math.min((container_width - 40) / list_width, (container_height - 40) / list_height);
      console.log(ratio);
      ratio = ratio < 1 ? ratio : 1;
      character_list_content.style.zoom = ratio;
      zoom_range.value = Math.round(ratio * 100);
      zoom_field.value = Math.round(ratio * 100);
    }
  };

  module.createFilter = (next = null) => {
    let new_filter = document.createElement("div");
    new_filter.classList.add("filter_row");
    new_filter.innerHTML = `
      <select class="state_select collapse">
        <option value="and">And</option>
        <option value="or">Or</option>
      </select>
      <select class="type_select">
        <option value="attribute">Attribute</option>
        <option value="rank">Rank</option>
        <option value="level">Level</option>
        <option value="magic">Magic</option>
        <option value="magia">Magia</option>
        <option value="episode">Episode</option>
        <option value="obtainability">Obtainability</option>
      </select>
      <div class="filter_type attribute_filter hidden">
        <select class="filter_field equality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
        </select>
        <select class="filter_field attribute_select">
          <option value="dark">Dark</option>
          <option value="fire">Fire</option>
          <option value="light">Light</option>
          <option value="forest">Forest</option>
          <option value="void">Void</option>
          <option value="water">Water</option>
        </select>
      </div>
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
          <option value="5">5</option>
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
        <input class="filter_field level_input" type="number" value=1 maxlength="3" size=3 min=1 max=100>
      </div>
      <div class="filter_type magic_filter hidden">
        <select class="filter_field inequality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field magic_select">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="filter_type magia_filter hidden">
        <select class="filter_field inequality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field magia_select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="filter_type episode_filter hidden">
        <select class="filter_field inequality">
          <option value="eq">=</option>
          <option value="neq">=/=</option>
          <option value="lt">&lt</option>
          <option value="gt">&gt</option>
          <option value="lte">&lt=</option>
          <option value="gte">&gt=</option>
        </select>
        <select class="filter_field episode_select">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
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
      <button class="create">+</button>
      <button class="delete"></button>
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
        if (list_filters.children.length == 1 && !first.classList.contains("collapse")) first.classList.add("collapse");
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

  module.applyFilters = (filters = module.getFilters()) => {
    // if no filters, then show everything.
    if (filters.length == 0) {
      Array.from(character_list_content.children).forEach(character_row => {
        Array.from(character_row.children).forEach(character_display_element => {
          if (character_display_element.classList.contains("hidden")) {
            character_display_element.classList.remove("hidden");
            character_display_element.style.display = "flex";
          }
        });
        if (character_row.classList.contains("hidden")) {
          character_row.classList.remove("hidden");
          character_row.style.display = "flex";
        }
      });
      return;
    }
    Array.from(character_list_content.children).forEach(character_row => {
      Array.from(character_row.children).forEach(character_display_element => {
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
      // hide the row all children are hidden character_list.
      if (Array.from(character_row.children).every(child => child.classList.contains("hidden"))) {
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
  };

  const matchesAllFilters = (character_display, filters) => {
    let matches = Array(filters.length).fill(true);
    filters.forEach((filter, i) => {
      matches[i] = matchesFilter(character_display, filter.value);
      if (i > 0 && filter.state === "and") {
        let and = matches[i - 1] && matches[i];
        matches[i] = and;
        matches[i - 1] = and;
      }
    });
    // console.log(character_display, matches, matches.some(value => value));
    return matches.some(value => value);
  };

  const matchesFilter = (character_display, filter) => {
    if (filter[0].param === "equality") {
      if (filter[1].param === "obtainability") {
        let obtainability = character_api.characters.find(character => character_display.id == character.id).obtainability;
        if (filter[0].value === "eq" && obtainability === filter[1].value) return true;
        else if (filter[0].value === "neq" && obtainability !== filter[1].value) return true;
        else return false;
      } else {
        if (filter[0].value === "eq" && character_display[filter[1].param] === filter[1].value) return true;
        else if (filter[0].value === "neq" && character_display[filter[1].param] !== filter[1].value) return true;
        else return false;
      }
    } else {
      if (filter[0].value === "eq" && parseInt(character_display[filter[1].param]) === parseInt(filter[1].value)) return true;
      else if (filter[0].value === "neq" && parseInt(character_display[filter[1].param]) !== parseInt(filter[1].value)) return true;
      else if (filter[0].value === "lt" && parseInt(character_display[filter[1].param]) < parseInt(filter[1].value)) return true;
      else if (filter[0].value === "gt" && parseInt(character_display[filter[1].param]) > parseInt(filter[1].value)) return true;
      else if (filter[0].value === "lte" && parseInt(character_display[filter[1].param]) <= parseInt(filter[1].value)) return true;
      else if (filter[0].value === "gte" && parseInt(character_display[filter[1].param]) >= parseInt(filter[1].value)) return true;
      else return false;
    }
  };

  module.resetFilters = () => {
    Array.from(character_list_content.children).forEach(character_row => {
      Array.from(character_row.children).forEach(character_display_element => {
        if (character_display_element.classList.contains("hidden")) {
          character_display_element.classList.remove("hidden");
          character_display_element.style.display = "flex";
        }
      });
      if (character_row.classList.contains("hidden")) {
        character_row.classList.remove("hidden");
        character_row.style.display = "flex";
      }
    });
    list_filters.innerHTML = "";
  };

  module.getStats = () => {
    let result = {
      totalCharacters: 0,
      totalVisible: 0,
      limited: 0,
      maxLevel: 0,
      maxRank: 0,
      maxMagic: 0,
      maxMagia: 0,
      maxEpisode: 0
    };

    Array.from(character_list_content.children).forEach(character_row => {
      Array.from(character_row.children).forEach(character_display_element => {
        result.totalCharacters++;
        if (!character_display_element.classList.contains("hidden")) {
          result.totalVisible++;
          let character_display = character_api.getCharacterDisplay(character_display_element);
          if (character_api.characters.find(character => character_display.id == character.id).obtainability == "limited") result.limited++;
          if (character_display.rank == 1 && character_display.level == 40) result.maxLevel++;
          else if (character_display.rank == 2 && character_display.level == 50) result.maxLevel++;
          else if (character_display.rank == 3 && character_display.level == 60) result.maxLevel++;
          else if (character_display.rank == 4 && character_display.level == 80) result.maxLevel++;
          else if (character_display.rank == 5 && character_display.level == 100) result.maxLevel++;
          let character = character_api.characters.find(character => character.id == character_display.id);
          let maxRank = "1";
          Object.entries(character.ranks).forEach(([rank, value]) => maxRank = value ? rank : maxRank);
          if (character_display.rank == maxRank) result.maxRank++;
          if (character_display.magic == "3") result.maxMagic++;
          if (character_display.magia == "5") result.maxMagia++;
          if (character_display.episode == "5") result.maxEpisode++;
        }
      });
    });

    list_stats_list.innerHTML = `Max Level: ${result.maxLevel}, Max Rank: ${result.maxRank}, Max Magic: ${result.maxMagic}, 
      Max Magia: ${result.maxMagia}, Max Episode: ${result.maxEpisode}, Limited: ${result.limited}, Visible: ${result.totalVisible}/${result.totalCharacters}`;

    return result;
  };

  module.getMoreStats = () => {
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
      maxEpisode: 0,
      episodes: {},
      rankCopies: {}
    };

    Array.from(character_list_content.children).forEach(character_row => {
      Array.from(character_row.children).forEach(character_display_element => {
        result.totalCharacters++;
        if (!character_display_element.classList.contains("hidden")) {
          result.totalVisible++;
          let character_display = character_api.getCharacterDisplay(character_display_element);
          if (character_api.characters.find(character => character_display.id == character.id).obtainability == "limited") result.limited++;
          if (character_display.rank == 1 && character_display.level == 40) result.maxLevel++;
          else if (character_display.rank == 2 && character_display.level == 50) result.maxLevel++;
          else if (character_display.rank == 3 && character_display.level == 60) result.maxLevel++;
          else if (character_display.rank == 4 && character_display.level == 80) result.maxLevel++;
          else if (character_display.rank == 5 && character_display.level == 100) result.maxLevel++;
          let character = character_api.characters.find(character => character.id == character_display.id);
          let maxRank = "1";
          Object.entries(character.ranks).forEach(([rank, value]) => maxRank = value ? rank : maxRank);
          if (character_display.rank == maxRank) result.maxRank++;
          if (character_display.magic == "3") result.maxMagic++;
          if (character_display.magia == "5") result.maxMagia++;
          if (character_display.episode == "5") result.maxEpisode++;
          result.ranks[character_display.rank] = result.ranks[character_display.rank] + 1 || 1;
          result.levels[character_display.level] = result.levels[character_display.level] + 1 || 1;
          result.magics[character_display.magic] = result.magics[character_display.magic] + 1 || 1;
          result.magias[character_display.magia] = result.magias[character_display.magia] + 1 || 1;
          result.episodes[character_display.episode] = result.ranks[character_display.episode] + 1 || 1;
          let minRank = "5";
          Object.entries(character.ranks).forEach(([rank, value]) => minRank = value && rank < minRank ? rank : minRank);
          let totalCopies = 0;
          if (minRank == 1) totalCopies = 10 * (parseInt(character_display.magic) + 1);
          else if (minRank == 2) totalCopies = 10 * (parseInt(character_display.magic) + 1);
          else if (minRank == 3) totalCopies = 3 * (parseInt(character_display.magic) + 1);
          else if (minRank == 4) totalCopies = 1 * (parseInt(character_display.magic) + 1);
          result.rankCopies[minRank] = result.rankCopies[minRank] ? result.rankCopies[minRank] + totalCopies : totalCopies;
        }
      });
    });

    return `Total Characters: ${result.totalCharacters}\nTotal Visible: ${result.totalVisible}\nLimited: ${result.limited}\nUnlimited: ${result.totalVisible - result.limited}
      \nMax Level: ${result.maxLevel}\nMax Rank: ${result.maxRank}\nMax Magic: ${result.maxMagic}\nMax Magia: ${result.maxMagia}\nMax Episode: ${result.maxEpisode}
      \nLevels:${Object.entries(result.levels).map(([level, count]) => ` ${level}: ${count}`).toString()}
      \nRanks: ${Object.entries(result.ranks).map(([level, count]) => ` ${level}: ${count}`).toString()}
      \nMagics: ${Object.entries(result.magics).map(([level, count]) => ` ${level}: ${count}`).toString()}
      \nMagias: ${Object.entries(result.magias).map(([level, count]) => ` ${level}: ${count}`).toString()}
      \nEpisodes: ${Object.entries(result.episodes).map(([level, count]) => ` ${level}: ${count}`).toString()}
      \nRank Copies: ${Object.entries(result.rankCopies).map(([level, count]) => ` ${level}: ${count}`).toString()}`;
  };

  module.openExportModal = () => {
    messageModal.style.display = "block";
    messageModalText.value = JSON.stringify(module.getCharacterList());
    messageModalTitle.innerHTML = `${list_api.getSelectedList()} Contents`;
    messageModalContent.innerHTML = "";
  };

  module.openStatsModal = () => {
    messageModal.style.display = "block";
    messageModalText.value = module.getMoreStats();
    messageModalTitle.innerHTML = `More ${list_api.getSelectedList()} Stats`;
    messageModalContent.innerHTML = "";
  };

  return module;
})();