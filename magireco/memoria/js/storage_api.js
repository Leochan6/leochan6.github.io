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
    database.createList(userId, { name: name, memoriaList: true, selectedProfile: "10", selectedBackground: true });
  };

  module.updateList = (listId, name, memoriaList, selectedProfile, selectedBackground) => {
    if (memoriaList.length == 0) memoriaList = true;
    if (!selectedBackground) selectedBackground = true;
    database.updateList(userId, listId, { name: name, memoriaList: memoriaList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  };

  module.deleteList = (listId) => {
    database.deleteList(userId, listId);
  };

  module.duplicateList = (list, newName) => {
    let selectedProfile = profile_api.getSelectedProfileId() || "10";
    let selectedBackground = background_api.getSelectedBackground() || true;
    database.createList(userId, { name: newName, memoriaList: list.memoriaList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  };

  module.manualCreateList = (name, memoriaList, selectedProfile, selectedBackground) => {
    database.createList(userId, { name: name, memoriaList: memoriaList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  }

  module.createProfile = (name, settings) => {
    database.createProfile(userId, { name: name, type: "memoria", settings: settings });
  };

  module.updateProfile = (profileId, settings) => {
    database.updateProfile(userId, profileId, { name: module.profiles[profileId].name, type: "memoria", settings: settings });
  };

  module.profileExists = (name) => {
    if (module.profiles[name]) return true;
    return false;
  };

  module.deleteProfile = (id) => {
    database.deleteProfile(userId, id);
    Object.entries(module.lists).forEach(([id, list]) => {
      if (list.selectedProfile === id) database.updateListProfile(id, "10");
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
        if (expanded && tab_contents.classList.contains("hidden")) tab_contents.classList.remove("hidden");
        else if (!expanded && !tab_contents.classList.contains("hidden")) tab_contents.classList.add("hidden");
      }
    });
    // display settings
    memoria_list_content.style.zoom = module.settings.memoria_zoom / 100;
    zoom_range.value = module.settings.memoria_zoom;
    zoom_field.value = module.settings.memoria_zoom;
  };

  const loadProfiles = (snapshot) => {
    // get the previous profile.
    let previous = profile_api.getSelectedProfileId();
    // get the settings.
    let profiles = snapshot.val();
    let filtered = Object.keys(profiles)
      .filter(key => profiles[key].type == "memoria")
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
    let filtered = Object.keys(lists)
      .filter(key => typeof lists[key].memoriaList !== "undefined")
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: lists[key]
        };
      }, {});
    module.memoria_lists = filtered;
    memoria_list_api.setLists(module.memoria_lists);
  };

  return module;
})();