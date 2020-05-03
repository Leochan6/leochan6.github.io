let storage_api = (() => {

  let module = {};

  module.profiles = {};
  module.lists = {};
  module.settings = {};

  let userId = null;

  module.startUp = (_userId) => {
    userId = _userId;
    loadUserName();
    database.onMessageUpdate(userId, message => {
      if (message) {
        messageModal.style.display = "block";
        messageModalText.value = message;
        messageModalTitle.innerHTML = `Message`;
        messageModalList.innerHTML = "";
      } else {
        database.onSettingUpdate(userId, loadSettings);
        database.onProfileUpdate(userId, loadProfiles);
        database.onListUpdate(userId, loadLists);
      }
    });
  };

  module.listExists = (name) => {
    if (Object.entries(module.lists).some((key, list) => list.name === name)) return true;
    return false;
  };

  module.createList = (name) => {
    database.createList(userId, { name: name, characterList: true, selectedProfile: "0", selectedBackground: true });
  };

  module.updateList = (listId, name, characterList, selectedProfile, selectedBackground) => {
    if (characterList.length == 0) characterList = true;
    if (!selectedBackground) selectedBackground = true;
    database.updateList(userId, listId, { name: name, characterList: characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  };

  module.deleteList = (listId) => {
    database.deleteList(userId, listId);
  };

  module.duplicateList = (list, newName) => {
    let selectedProfile = profile_api.getSelectedProfileId() || "0";
    let selectedBackground = background_api.getSelectedBackground() || true;
    database.createList(userId, { name: newName, characterList: list.characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  };

  module.manualCreateList = (name, characterList, selectedProfile, selectedBackground) => {
    database.createList(userId, { name: name, characterList: characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  }

  module.createProfile = (name, settings) => {
    database.createProfile(userId, { name: name, type: "character", settings: settings });
  };

  module.updateProfile = (profileId, settings) => {
    database.updateProfile(userId, profileId, { name: module.profiles[profileId].name, type: "character", settings: settings });
  };

  module.deleteProfile = (profileId) => {
    database.deleteProfile(userId, profileId);
    Object.entries(module.lists).forEach(([id, list]) => {
      console.log("update list", id, "with profile", list.selectedProfile, "on delete profile", profileId);
      if (list.selectedProfile === profileId) database.updateListProfile(id, "0");
    });
  };

  module.updateSettings = (settingName, newSettings) => {
    database.updateSettings(userId, settingName, newSettings);
  };

  const loadUserName = () => {
    database.onAuthStateChanged(user => {
      let name = user && user.displayName ? user.displayName : "Anonymous";
      header_username.innerHTML = "Welcome " + name;
    });
  };

  const loadSettings = (snapshot) => {
    module.settings = snapshot.val() ? snapshot.val() : {};
    // init expanded tabs
    if (!module.settings.expanded_tabs) database.initSettings(userId);
    // expand tabs
    Object.entries(module.settings.expanded_tabs).forEach(([tab_id, expanded]) => {
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
    // display settings
    character_list_content.style.zoom = module.settings.character_zoom / 100;
    zoom_range.value = module.settings.character_zoom;
    zoom_field.value = module.settings.character_zoom;
    document.querySelectorAll(".character_row").forEach(character_row => character_row.style.justifyContent = character_list_api.DIR_TO_FLEX[module.settings.display_alignment]);
    character_list_content.style.padding = `${module.settings.padding_y}px ${module.settings.padding_x}px`;
    display_alignment_select.value = module.settings.display_alignment;
    display_padding_x_field.value = module.settings.padding_x;
    display_padding_y_field.value = module.settings.padding_y;
  };

  const loadProfiles = (snapshot) => {
    // get the previous profile.
    let previous = profile_api.getSelectedProfileId();
    // get the settings.
    let profiles = snapshot.val();
    let filtered = Object.keys(profiles)
      .filter(key => profiles[key].type == "character")
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: profiles[key]
        };
      }, {});
    module.profiles = filtered;
    // update the profile select.
    profile_api.setProfiles(module.profiles, previous);
  };

  const loadLists = (snapshot) => {
    let lists = snapshot.val() ? snapshot.val() : {};
    const filtered = Object.keys(lists)
      .filter(key => lists[key].characterList)
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: lists[key]
        };
      }, {});
    module.lists = filtered;
    character_list_api.setLists(module.lists);
  };

  return module;
})();