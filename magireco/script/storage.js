let storage_api = (() => {

  let module = {};

  module.settings = [];

  module.lists = [];

  module.customIndex = 1;

  module.loadSettings = () => {
    // get the settings.
    module.settings = module.getSettings();
    // update the profile select.
    let defaultIndex = 0;
    profile_select.innerHTML = "";
    module.settings.forEach((setting, i) => {
      if (setting.isDefault) defaultIndex = i;
      if (setting.name === "Custom") module.customIndex = i;
      profile_select.options.add(new Option(setting.name, i, false));
    });
    // set sort settings with default.
    profile_select.selectedIndex = defaultIndex;
    module.setSortingFields(module.settings[defaultIndex]);
  };

  module.getSettings = () => {
    let settings = JSON.parse(window.localStorage.getItem("profiles"));
    if (settings === null) {
      initSettings();
      settings = JSON.parse(window.localStorage.getItem("profiles"));
    }
    return settings
  };

  module.updateSettings = (name, properties) => {
    let settings = module.getSettings();
    let settingIndex = -1;
    settings.forEach((setting, i) => {
      if (setting.name === name) {
        setting.settings = properties;
        return;
      }
    });
    if (settingIndex == -1) settings.splice(settings.length-1, 0, {name: name, settings: properties, isDefault: false});
    window.localStorage.setItem("profiles", JSON.stringify(settings));
    module.loadSettings();
  };

  module.profileExists = (name) => {
    if (module.settings.find(setting => setting.name === name)) return true;
    return false;
  };

  module.setSortingFields = (profile) => {
    setSelectedText(group_by_select, profile.settings.group_by);
    setSelectedDirection(group_dir_select, profile.settings.group_dir);
    setSelectedText(sort_by_1_select, profile.settings.sort_by_1);
    setSelectedDirection(sort_dir_1_select, profile.settings.sort_dir_1);
    setSelectedText(sort_by_2_select, profile.settings.sort_by_2);
    setSelectedDirection(sort_dir_2_select, profile.settings.sort_dir_2);
    setSelectedDirection(sort_id_dir_select, profile.settings.sort_id_dir);
    displays_per_row.value = profile.settings.displays_per_row;
  }

  module.resetSettings = () => {
    initSettings();
    module.loadSettings();
  };

  module.loadLists = () => {
    module.lists = module.getLists();
    saved_character_lists.innerHTML = "";
    module.lists.forEach(list => {
      let div = document.createElement("div");
      div.classList.add("character_list_row");
      let entry = document.createElement("div");
      entry.classList.add("character_list_entry");
      // entry.className = "large_btn character_list_entry";
      entry.innerHTML = list.name;
      entry.addEventListener("click", () => {
        character_api.selectList(list);
      });
      let deleteButton = document.createElement("button");
      deleteButton.className = "small_btn delete";
      deleteButton.addEventListener("click", () => {
        character_api.deleteList(list);
      })
      div.append(entry);
      div.append(deleteButton);
      saved_character_lists.append(div);
    });

  };

  module.getLists = () => {
    let lists = JSON.parse(window.localStorage.getItem("lists"));
    if (!lists) {
      window.localStorage.setItem("lists", JSON.stringify([]));
      lists = JSON.parse(window.localStorage.getItem("lists"));
    }
    return lists;
  };

  module.listExists = (name) => {
    if (module.lists.find(list => list.name === name)) return true;
    return false
  };

  module.updateList = (name, character_list) => {
    let lists = module.getLists();
    let listIndex = -1
    lists.forEach((list, i) => {
      if (list.name === name) {
        list.character_list = character_list;
        listIndex = i;
        return;
      }
    });
    if (listIndex == -1) lists.push({name: name, character_list: character_list ? character_list : [], selectedProfile: character_api.getSelectedProfile()});
    lists = window.localStorage.setItem("lists", JSON.stringify(lists));
    module.loadLists();
  };

  const initSettings = () => {
    let defaultProfile = { name: "Default", settings: { group_by: "attribute", group_by_dir: 1, sort_by_1: "level", sort_dir_1: -1, sort_by_2: "none", sort_dir_2: -1, sort_id_dir: -1, displays_per_row: 8 }, isDefault: true };
    let customProfile = { name: "Custom", settings: {}, isDefault: false };
    let profiles = [defaultProfile, customProfile];
    window.localStorage.setItem("profiles", JSON.stringify(profiles));
  };

  const setSelectedText = (element, text) => {
    for (let i = 0; i < element.options.length; i++) {
      if (element.options[i].value === text) {
        element.selectedIndex = i;
        break;
      }
    }
  };

  const setSelectedDirection = (element, direction) => {
    if (element.classList.contains("ascend") && direction === -1) {
      element.classList.replace("ascend", "descend");
    }
    else if (element.classList.contains("descend") && direction === 1) {
      element.classList.replace("descend", "ascend");
    }
  };



  return module;
})();