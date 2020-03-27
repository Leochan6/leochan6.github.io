let storage_api = (() => {

  let module = {};

  module.profiles = {};
  module.lists = {};
  module.settings = {};
  module.customIndex = 1;

  let userId = null;

  module.startUp = (_userId) => {
    userId = _userId;
    loadUserName();
    loadSettings();
    loadProfiles();
    loadLists();
  };

  module.listExists = (name) => {
    if (module.lists.find(list => list.name === name)) return true;
    return false
  };

  module.updateList = (name, character_list) => {
    console.log("update", name, character_list);
    let lists = module.lists;
    let listIndex = -1
    let listKey = "";
    for (const [key, list] of Object.entries(lists)) {
      if (list.name === name) {
        list.character_list = character_list;
        listIndex = key;
        listKey = key;
        break;
      }
    }
    if (listIndex == -1) lists.push({ name: name, character_list: character_list ? character_list : [], selectedProfile: character_api.getSelectedProfile() });
    else lists[listIndex].selectedProfile = character_api.getSelectedProfile();
    console.log("updateList", userId, listKey, lists);
    database.updateList(userId, listKey, lists);
    loadLists();
  };

  module.updateProfile = (name, properties) => {
    let profiles = module.profiles;
    let profileIndex = -1;
    let profileKey = "";
    for (const [key, profile] of Object.entries(profiles)) {
      if (profile.name === name) {
        console.log(key, profile);
        profile.settings = properties;
        profileIndex = key;
        break;
      }
    }
    if (profileIndex == -1) profiles.splice(profiles.length - 1, 0, { name: name, settings: properties, isDefault: false });
    database.updateProfile(userId, profiles);
    loadProfiles();
  };

  module.profileExists = (name) => {
    if (module.sorting.find(setting => setting.name === name)) return true;
    return false;
  };

  module.setProfileFields = (profile) => {
    setSelectedText(group_by_select, profile.settings.group_by);
    setSelectedDirection(group_dir_select, profile.settings.group_dir);
    setSelectedText(sort_by_1_select, profile.settings.sort_by_1);
    setSelectedDirection(sort_dir_1_select, profile.settings.sort_dir_1);
    setSelectedText(sort_by_2_select, profile.settings.sort_by_2);
    setSelectedDirection(sort_dir_2_select, profile.settings.sort_dir_2);
    setSelectedDirection(sort_id_dir_select, profile.settings.sort_id_dir);
    displays_per_row.value = profile.settings.displays_per_row;
  };

  module.updateSettings = (name, newSettings) => {
    database.updateSettings(userId, newSettings);
    loadSettings();
  };

  const loadUserName = () => {
    database.getUser(userId).then(snap => {
      name_heading.innerHTML = "Welcome " + snap.val().name;
    })
  };

  const loadSettings = () => {
    database.getSettings(userId).then(snap => {
      module.settings = snap.val() ? snap.val() : [];
      show_all_menus_checkbox.checked = module.settings.show_all_menus;
    });
  }

  const loadProfiles = () => {
    // get the settings.
    database.getProfile(userId).then(snapshot => {
      module.profiles = snapshot.val()[Object.keys(snapshot.val())[0]].profiles;
      // update the profile select.
      let defaultIndex = 0;
      profile_select.innerHTML = "";
      module.profiles.forEach((profile, i) => {
        if (profile.isDefault) defaultIndex = i;
        if (profile.name === "Custom") module.customIndex = i;
        profile_select.options.add(new Option(profile.name, i, false));
      });
      // set sort settings with default.
      profile_select.selectedIndex = defaultIndex;
      module.setProfileFields(module.profiles[defaultIndex]);
    });
  };

  const loadLists = () => {
    database.getList(userId).then(snapshot => {
      module.lists = snapshot.val()[Object.keys(snapshot.val())[0]].lists ? snapshot.val()[Object.keys(snapshot.val())[0]].lists : [];
      // initilize as empty list if empty.
      module.lists.forEach(list => {
        if (!list.character_list) list.character_list = [];
      });
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
    });
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