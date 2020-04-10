let character_api = (() => {

  let module = {};

  module.Display = class Display {
    constructor(id, name, rank, attribute, level, magic, magia, episode) {
      this.id = id;
      this.name = name;
      this.rank = rank;
      this.attribute = attribute;
      this.level = level;
      this.magic = magic;
      this.magia = magia;
      this.episode = episode;
    }
  }

  module.Character = class Character {
    constructor(id, name, attribute, ranks) {
      this.id = id;
      this.name = name;
      this.attribute = attribute;
      this.ranks = ranks;
    }
  }

  // get the list of names.
  module.getNames = (callback) => {
    let names = collection.map(character => { return { id: character.id, name: character.name } });
    names = [...new Set(names)];
    names = names.sort((a, b) => a.name > b.name ? 1 : -1);
    callback(names);
  };

  // get the attribute and rank for the character.
  const getCharacter = (id, callback) => {
    let character_list = collection.filter(character => character.id === id);
    let name = character_list[0].name
    let attribute = character_list[0].attribute.toLowerCase();
    let rank_list = character_list.map((character) => character.rank);
    let ranks = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
      if (rank_list.indexOf((i + 1).toString(10)) != -1) ranks[i] = true;
    }
    let character = new module.Character(id, name, attribute, ranks);
    callback(character);
  };

  // gets the basic display for the character.
  const getBasicCharacterDisplay = (character) => {
    return new module.Display(character.id, character.name, character.ranks.indexOf(true) + 1, character.attribute, "1", "0", "1", "1");
  };

  // check if disaply is valid.
  const isValidCharacterDisplay = (character_id, display, callback) => {
    getCharacter(character_id, character => {
      let err = [];
      // check id.
      if (display.id !== character.id) err.push(`Display Id ${display.id} does not match Character ID ${character.id}.`);
      // check name.
      if (display.name !== character.name) err.push(`Display Name ${display.name} does not match Character Name ${character.Name}.`);
      // check rank.
      if (!character.ranks[display.rank - 1]) err.push(`Display Rank ${display.rank} does not match Character Ranks ${character.ranks}`)
      // check level.
      if (display.rank == "1" && (display.level < 1 || display.level > 40)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 40.`);
      else if (display.rank == "2" && (display.level < 1 || display.level > 50)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 50.`);
      else if (display.rank == "3" && (display.level < 1 || display.level > 60)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 60.`);
      else if (display.rank == "4" && (display.level < 1 || display.level > 80)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 80.`);
      else if (display.rank == "5" && (display.level < 1 || display.level > 100)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 100.`);
      // check magic.
      if (display.magic < 0 || display.magic > 3) err.push(`Display Magic ${display.magic} must be between 0 and 3.`);
      // check magia.
      if (display.magia < 1 || display.magia > 5) err.push(`Display Magia ${display.magia} must be between 1 and 5.`);
      if (display.magia > display.episode) err.push(`Display Magia ${display.magia} must be less than or equal to Display Episode ${display.episode}.`);
      // check episode.
      if (display.episode < 1 || display.episode > 5) err.push(`Display Episode ${display.episode} must be between 1 and 5.`);
      callback(err);
    });
  };

  /**
   * get Display from the form.
   * 
   * @return {Display}
   */
  const getFormDisplay = () => {
    let display = new character_api.Display(
      name_select.value,
      name_select[name_select.options.selectedIndex].text,
      rank_select.value,
      attr_select.value,
      level_select.value,
      magic_select.value,
      magia_select.value,
      episode_select.value);
    character_preview = display;
    return display;
  };

  const getSortProperties = () => {
    let properties = {
      group_by: group_by_select.value,
      group_dir: group_dir_select.classList.contains("ascend") ? 1 : -1,
      sort_by_1: sort_by_1_select.value,
      sort_dir_1: sort_dir_1_select.classList.contains("ascend") ? 1 : -1,
      sort_by_2: sort_by_2_select.value,
      sort_dir_2: sort_dir_2_select.classList.contains("ascend") ? 1 : -1,
      sort_id_dir: sort_id_dir_select.classList.contains("ascend") ? 1 : -1,
      displays_per_row: parseInt(displays_per_row.value)
    }
    return properties;
  };

  /**
   * get Display from character display.
   * 
   * @param {HTMLDivElement} character_display
   * @return {Display}
   */
  const getCharacterDisplay = (character_display) => {
    let display = new character_api.Display(
      character_display.getAttribute("character_id"),
      character_display.getAttribute("name"),
      character_display.getAttribute("rank"),
      character_display.getAttribute("attribute"),
      character_display.getAttribute("level"),
      character_display.getAttribute("magic"),
      character_display.getAttribute("magia"),
      character_display.getAttribute("episode"));
    return display;
  };

  /**
   * create a character display element from Display.
   * 
   * @param {Display} display
   * @return {HTMLDivElement}
   */
  const createDisplay = (display, listener) => {
    let character_display = document.createElement("div");
    character_display.classList.add("character_display");
    character_display.setAttribute("character_id", display.id);
    character_display.setAttribute("name", display.name);
    character_display.setAttribute("rank", display.rank);
    character_display.setAttribute("attribute", display.attribute);
    character_display.setAttribute("magic", display.magic);
    character_display.setAttribute("magia", display.magia);
    character_display.setAttribute("episode", display.episode);
    character_display.setAttribute("level", display.level);
    character_display.innerHTML = `
    <img class="background" src="/magireco/assets/ui/bg/${display.attribute}.png">
    <img class="card_image" src="/magireco/assets/image/card_${display.id}${display.rank}_d.png">
    <img class="frame_rank" src="/magireco/assets/ui/frame/${display.rank}.png">
    <img class="star_rank" src="/magireco/assets/ui/star/${display.rank}.png">
    <img class="attribute" src="/magireco/assets/ui/attribute/${display.attribute}.png">
    <img class="magic" src="/magireco/assets/ui/magic/${display.magic}.png">
    <img class="magia" src="/magireco/assets/ui/magia/${display.magia}-${display.episode}.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}</div>
    </div>`;
    if (listener) {
      character_display.addEventListener("click", () => {
        // return of already selected.
        if (character_display.classList.contains("selected")) return;
        // deselect all other character displays
        document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
          if (child.classList.contains("selected")) child.classList.remove("selected");
        });
        character_display.classList.add("selected");
      });
    }
    return character_display;
  }

  /**
   * updates the display preview with Display.
   * 
   * @param {HTMLDivElement} display
   */
  const updatePreviewDisplay = (display) => {
    let character_display = createDisplay(display);
    character_display.classList.add("preview");
    display_preview.innerHTML = "";
    display_preview.appendChild(character_display);
  };

  /**
   * updates the form with Display.
   * 
   * @param {Display} display
   */
  const updateForm = (display) => {
    name_select.value = display.id;
    rank_select.value = display.rank;
    attr_select.value = display.attribute;
    level_select.value = display.level;
    magic_select.value = display.magic;
    magia_select.value = display.magia;
    episode_select.value = display.episode;
  };

  /**
   * updates the form with the available options and selects lowest.
   * 
   * @param {Character} character
   */
  const updateFormEnabled = (character) => {
    // enable or disable the attribute select.
    for (let i = 0; i < 6; i++) {
      attr_select.options[i].disabled = attr_select.options[i].value != character.attribute;
    }
    attr_select.value = character.attribute;
    // enable or disable the rank select.
    for (let i = 0; i < 5; i++) {
      rank_select.options[i].disabled = !character.ranks[i];
    }
    // if the currently select rank is disabled, then select minimum available rank.
    if (!character.ranks[rank_select.selectedIndex]) {
      rank_select.selectedIndex = character.ranks.indexOf(true);
    }
  };

  const sortList = (properties) => {
    // get the Display of every character display in the list.
    let character_displays = [];
    document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
      character_displays.push(getCharacterDisplay(child));
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

  const NUM_TO_WORD = { "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five" };

  // adds each display_property to the corresponding group.
  const group_properties = (display_properties, group_by, group_dir) => {
    let display_groups = {};
    if (group_by == "attribute") {
      if (group_dir == 1) display_groups = { "fire": [], "water": [], "forest": [], "light": [], "dark": [], "void": [] };
      if (group_dir == -1) display_groups = { "void": [], "dark": [], "light": [], "forest": [], "water": [], "fire": [] };
      display_properties.forEach(properties => {
        display_groups[properties["attribute"]].push(properties);
      });
    } else if (group_by == "rank") {
      if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
      if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
      display_properties.forEach(properties => {
        display_groups[NUM_TO_WORD[properties["rank"]]].push(properties);
      });
    } else if (group_by == "magic") {
      if (group_dir == 1) display_groups = { "zero": [], "one": [], "two": [], "three": [] };
      if (group_dir == -1) display_groups = { "three": [], "two": [], "one": [], "zero": [] };
      display_properties.forEach(properties => {
        display_groups[NUM_TO_WORD[properties["magic"]]].push(properties);
      });
    } else if (group_by == "magia") {
      if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
      if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
      display_properties.forEach(properties => {
        display_groups[NUM_TO_WORD[properties["magia"]]].push(properties);
      });
    } else if (group_by == "episode") {
      if (group_dir == 1) display_groups = { "one": [], "two": [], "three": [], "four": [], "five": [] };
      if (group_dir == -1) display_groups = { "five": [], "four": [], "three": [], "two": [], "one": [] };
      display_properties.forEach(properties => {
        display_groups[NUM_TO_WORD[properties["episode"]]].push(properties);
      });
    } else if (group_by == "none") {
      display_groups = { "none": [] };
      display_properties.forEach(properties => {
        display_groups["none"].push(properties);
      });
    }
    return display_groups;
  }

  const updateCharacterWithDisplay = (character, display) => {
    // return the default display.
    if (!display) return getBasicCharacterDisplay(character);
    return new module.Display(character.id, character.name, display.rank, character.attribute, display.level, display.magic, display.magia, display.episode);
  }

  const loadCharacterList = (character_list) => {
    character_list_content.innerHTML = "";
    character_list = character_list !== true ? character_list : [];
    character_list.forEach(display => {
      character_list_content.append(createDisplay(display));
    })
    // character_list_content.dispatchEvent(new Event("change"));
  };

  module.startUp = (listener) => {
    getCharacter("1001", character => {
      updateFormEnabled(character);
      updatePreviewDisplay(getBasicCharacterDisplay(character));
    });
  };

  module.updateFieldsOnName = () => {
    getCharacter(name_select.value, character => {
      updateFormEnabled(character);
      character_preview = updateCharacterWithDisplay(character, getFormDisplay());
      updateForm(character_preview);
      updatePreviewDisplay(character_preview);
    });
  };

  module.createAddDisplay = () => {
    let display = getFormDisplay();
    let character_display = createDisplay(display, true);
    character_list_content.appendChild(character_display);
    character_list_content.dispatchEvent(new Event("change"));
  };

  module.updateSelectedDisplay = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    character_display.remove()

    let display = getFormDisplay();
    character_display = createDisplay(display, true);
    character_list_content.appendChild(character_display);
    character_list_content.dispatchEvent(new Event("change"));
  };

  module.copyDisplay = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = getCharacterDisplay(character_display);
    getCharacter(character_display.getAttribute("character_id"), character => updateFormEnabled(character));
    updateForm(display);
    updatePreviewDisplay(display);
  };

  module.updatePreviewOnForm = () => {
    let display = getFormDisplay();
    character_error_text.innerHTML = '';
    isValidCharacterDisplay(name_select.value, display, error => {
      if (error.length == 0) {
        create_button.disabled = false;
        updatePreviewDisplay(display);
      } else {
        create_button.disabled = true;
        character_error_text.innerHTML = error.toString();
        console.log(error);
      }
    });
  };

  module.sortOnFormUpdate = () => {
    let properties = getSortProperties();
    let display_groups = sortList(properties);
    character_list_content.innerHTML = '';
    for (var group in display_groups) {
      if (display_groups[group].length == 0) continue;
      let group_row = document.createElement("div");
      group_row.classList.add("character_row");
      group_row.style.width = `${properties.displays_per_row * 122}px`;
      group_row.setAttribute("group", group);
      display_groups[group].forEach((display) => {
        let character_display = createDisplay(display, true);
        group_row.appendChild(character_display);
      });
      character_list_content.appendChild(group_row);
    }
  };

  module.updateList = (createdName = null) => {
    let listName = module.getListName();
    let character_list = module.getCharacterList();
    let selectedProfile = module.getSelectedProfile();
    if (!listName) return;
    storage_api.updateList(listName, character_list, selectedProfile, createdName);
  }

  module.saveProfile = () => {
    let profileName = new_profile_field.value;
    if (storage_api.profileExists(profileName)) {
      profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
      return;
    }
    new_profile_field.value = "";
    let properties = getSortProperties();
    storage_api.updateProfile(profileName, properties);
    new_profile_row.style.visibility = "collapse"
  };

  module.updateProfile = () => {
    let profileName = module.getSelectedProfile();
    let properties = getSortProperties();
    storage_api.updateProfile(profileName, properties);
    new_profile_row.style.visibility = "collapse"
  };

  module.checkProfile = () => {
    let profileName = new_profile_field.value;
    if (storage_api.profileExists(profileName)) profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
    else profile_error_text.innerHTML = "";
  };

  module.deleteProfile = () => {
    let profileName = module.getSelectedProfile();
    if (profileName !== "Default" && profileName !== "Custom") {
      storage_api.deleteProfile(profileName);
      let listName = module.getSelectedList();
      if (listName) storage_api.updateList(listName, storage_api.lists[listName].characterList, "Default");
    }
  };

  module.setProfile = () => {
    let profileName = profile_select.value;
    storage_api.setProfileFields(storage_api.profiles[profileName]);
  };

  module.getSelectedProfile = () => {
    return profile_select.value;
  };

  module.getSelectedList = () => {
    for (let element of document.querySelectorAll(".character_list_entry")) {
      if (element.classList.contains("selectedList")) return element.innerHTML;
    }
    return null;
  };

  module.getListName = () => {
    return list_name_title.innerText;
  };

  module.getCharacterList = () => {
    let character_list = [];
    document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
      character_list.push(getCharacterDisplay(child));
    });
    return character_list;
  };

  module.changeToCustom = () => {
    profile_select.value = "Custom";
  };

  module.resetProfiles = () => {
    if (window.confirm("Are you sure you want to reset the profiles?")) {
      storage_api.resetSorting();
    }
  };

  module.checkListName = () => {
    let listName = new_list_name_field.value;
    if (storage_api.listExists(listName)) home_error_text.innerHTML = `The list name ${listName} already exists.`;
    else home_error_text.innerHTML = "";
  }

  module.createList = () => {
    let listName = new_list_name_field.value;
    if (storage_api.listExists(listName)) {
      home_error_text.innerHTML = `The list name ${listName} already exists.`;
      return;
    }
    new_list_name_field.value = "";
    new_list_button.classList.replace("minus", "add");
    new_list_table.style.visibility = "collapse"
    list_name_title.innerHTML = listName;
    module.updateList(listName);
  };

  module.selectList = (name, list) => {
    for (let element of document.querySelectorAll(".character_list_entry")) {
      // element already selected.
      if (element.innerHTML === name) {
        if (element.classList.contains("selectedList")) return;
        else element.classList.add("selectedList");
      }
      else if (element.classList.contains("selectedList")) element.classList.remove("selectedList");
    }
    list_name_title.innerHTML = name;
    loadCharacterList(list.characterList);
    profile_select.value = list.selectedProfile;
    character_api.setProfile();
    module.sortOnFormUpdate();
  };

  module.deleteList = (name, list) => {
    console.log("deleting", name, list);
    storage_api.deleteList(name)
  };

  return module;
})();