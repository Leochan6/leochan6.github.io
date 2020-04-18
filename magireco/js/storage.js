let storage_api = (() => {

  let module = {};

  module.profiles = {};
  module.lists = {};
  module.settings = {};

  let userId = null;

  module.startUp = (_userId) => {
    userId = _userId;
    loadUserName();
    database.onSettingUpdate(userId, loadSettings);
    database.onProfileUpdate(userId, loadProfiles);
    database.onListUpdate(userId, loadLists);
  };

  module.listExists = (name) => {
    if (Object.entries(module.lists).some((key, list) => list.name === name)) return true;
    return false;
  };

  module.createList = (name) => {
    database.createList(userId, { name: name, characterList: true, selectedProfile: "Default", selectedBackground: "" });
  };

  module.updateList = (listId, name, characterList, selectedProfile, selectedBackground) => {
    if (characterList.length == 0) characterList = true;
    database.updateList(userId, listId, { name: name, characterList: characterList, selectedProfile: selectedProfile, selectedBackground: selectedBackground });
  };

  module.deleteList = (listId) => {
    database.deleteList(userId, listId);
  };

  module.updateProfile = (name, profile) => {
    database.updateProfile(userId, name, profile);
  };

  module.profileExists = (name) => {
    if (module.profiles[name]) return true;
    return false;
  };

  module.deleteProfile = (name) => {
    database.deleteProfile(userId, name);
  };

  module.updateSettings = (newSettings) => {
    database.updateSettings(userId, newSettings);
  };

  const loadUserName = () => {
    database.onAuthStateChanged(user => {
      let name = user && user.displayName ? user.displayName : "Anonymous";
      name_heading.innerHTML = "Welcome " + name;
    });
  };

  const loadSettings = (snapshot) => {
    module.settings = snapshot.val() ? snapshot.val() : {};
    show_all_menus_checkbox.checked = module.settings.show_all_menus;
  };

  const loadProfiles = (snapshot) => {
    // get the previous profile.
    let previous = profile_api.getSelectedProfile();
    // get the settings.
    module.profiles = snapshot.val();
    // update the profile select.
    profile_select.innerHTML = "";
    for (let [name, profile] of Object.entries(module.profiles)) {
      profile_select.options.add(new Option(name, name, false));
    }
    if (previous !== "Default") profile_select.value = previous;
    else {
      // set sort settings with default if no list selected.
      profile_select.value = "Default";
      profile_api.setProfileFields(module.profiles.Default);
    }
  };

  const loadLists = (snapshot) => {
    module.lists = snapshot.val() ? snapshot.val() : {};
    list_api.setLists(module.lists);
  };

  return module;
})();