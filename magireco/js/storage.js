let storage_api = (() => {

  let module = {};

  module.profiles = {};
  module.lists = {};
  module.settings = {};

  let userId = null;

  module.startUp = (_userId) => {
    userId = _userId;
    loadUserName();
    loadSettings();
    loadProfiles();
    loadLists();
  };

  module.listExists = (name) => {
    if (module.lists[name]) return true;
    return false
  };

  module.updateList = (name, characterList, selectedProfile, created = null) => {
    if (characterList.length == 0) characterList = true;
    console.log(characterList);
    database.updateList(userId, name, { characterList: characterList, selectedProfile: selectedProfile });
    loadLists(true, created);
  };

  module.deleteList = (name) => {
    database.deleteList(userId, name);
    loadLists(true);
  }

  module.updateProfile = (name, profile) => {
    database.updateProfile(userId, name, profile);
    loadProfiles(true);
  };

  module.profileExists = (name) => {
    if (module.profiles[name]) return true;
    return false;
  };

  module.deleteProfile = (name) => {
    database.deleteProfile(userId, name);
    loadProfiles();
  }

  module.setProfileFields = (profile) => {
    setSelectedText(group_by_select, profile.group_by);
    setSelectedDirection(group_dir_select, profile.group_dir);
    setSelectedText(sort_by_1_select, profile.sort_by_1);
    setSelectedDirection(sort_dir_1_select, profile.sort_dir_1);
    setSelectedText(sort_by_2_select, profile.sort_by_2);
    setSelectedDirection(sort_dir_2_select, profile.sort_dir_2);
    setSelectedDirection(sort_id_dir_select, profile.sort_id_dir);
    displays_per_row.value = profile.displays_per_row;
  };

  module.updateSettings = (newSettings) => {
    database.updateSettings(userId, newSettings);
    loadSettings();
  };

  const loadUserName = () => {
    database.onAuthStateChanged(user => {
      let name = user.displayName ? user.displayName : "User";
      name_heading.innerHTML = "Welcome " + name;
    });
  };

  const loadSettings = () => {
    database.getSettings(userId).then(snap => {
      module.settings = snap.val() ? snap.val() : {};
      show_all_menus_checkbox.checked = module.settings.show_all_menus;
    });
  }

  const loadProfiles = (reload = false) => {
    // get the previous profile.
    let previous = character_api.getSelectedProfile();
    // get the settings.
    database.getProfiles(userId).then(snapshot => {
      module.profiles = snapshot.val();
      // update the profile select.
      profile_select.innerHTML = "";
      for (let [name, profile] of Object.entries(module.profiles)) {
        profile_select.options.add(new Option(name, name, false));
      }
      if (reload) profile_select.value = previous;
      else {
        // set sort settings with default if no list selected.
        profile_select.value = "Default";
        module.setProfileFields(module.profiles["Default"]);
      }
    });
  };

  const loadLists = (reload = false, created = null) => {
    database.getLists(userId).then(snapshot => {
      module.lists = snapshot.val() ? snapshot.val() : {};
      // get the previously selected list.
      let previous = character_api.getSelectedList();
      saved_character_lists.innerHTML = "";
      for (let [name, list] of Object.entries(module.lists)) {
        let div = document.createElement("div");
        div.classList.add("character_list_row");
        let entry = document.createElement("div");
        entry.classList.add("character_list_entry");
        entry.innerHTML = name;
        entry.addEventListener("click", () => {
          character_api.selectList(name, list);
        });
        let deleteButton = document.createElement("button");
        deleteButton.className = "small_btn delete";
        deleteButton.addEventListener("click", () => {
          character_api.deleteList(name, list);
        })
        div.append(entry);
        div.append(deleteButton);
        saved_character_lists.append(div);
      }
      if (created) {
        if (module.lists[created]) return character_api.selectList(created, module.lists[created]);
      }
      if (reload) {
        if (module.lists[previous]) return character_api.selectList(previous, module.lists[previous]);
        else {
          character_list_content.innerHTML = "";
          list_name_title.innerHTML = "";
        }
      }
      if (Object.entries(module.lists).length > 0) {
        let first = Object.entries(module.lists)[0][0];
        return character_api.selectList(first, module.lists[first]);
      }
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