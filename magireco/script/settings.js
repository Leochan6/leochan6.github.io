let settings_api = (() => {

  let module = {};

  module.settings = [];

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
    let replace = false;
    settings.forEach(setting => {
      if (setting.name === name) {
        setting.settings = properties;
        replace = true;
        return;
      }
    });
    if (!replace) settings.splice(settings.length-1, 0, {name: name, settings: properties, isDefault: false});
    window.localStorage.setItem("profiles", JSON.stringify(settings));
    module.loadSettings();
  };

  module.profileExists = (name) => {
    let settings = module.getSettings();
    if (settings.find(setting => setting.name === name)) return true;
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