let settings_api = (() => {

  let module = {};

  module.settings = [];

  module.loadSettings = () => {
    // get the settings.
    module.settings = module.getSettings();
    console.log("settings loaded");
    console.log(module.settings);

    // update the profile select.
    module.settings.forEach((setting, i) => {
      profile_select.options.add(new Option(setting.name, i, false));
    });

    // set sort settings with default.
    profile_select.selectedIndex = 0;
    setSelectedText(group_by_select, module.settings[0].settings.group_by_select);
    setSelectedText(group_dir_select, module.settings[0].settings.group_dir_select);
    setSelectedText(sort_by_1_select, module.settings[0].settings.sort_by_1_select);
    setSelectedText(sort_dir_1_select, module.settings[0].settings.sort_dir_1_select);
    setSelectedText(sort_by_2_select, module.settings[0].settings.sort_by_2_select);
    setSelectedText(sort_dir_2_select, module.settings[0].settings.sort_dir_2_select);
    setSelectedText(sort_id_dir_select, module.settings[0].settings.sort_id_dir_select);
    displays_per_row.value = module.settings[0].settings.displays_per_row;

  };

  module.getSettings = () => {
    let settings = JSON.parse(window.localStorage.getItem("settings"));
    if (settings === null) {
      initSettings();
      settings = JSON.parse(window.localStorage.getItem("settings"));
    }
    return settings
  };

  module.updateSettings = () => {

  };

  const initSettings = () => {
    let profile = { name: "Default", settings: { group_by: "attribute", group_by_dir: 1, sort_by_1: "level", sort_dir_1: -1, sort_by_2: "none", sort_dir_2: -1, sort_id_dir: -1, displays_per_row: 8 } };
    let custom = { name: "Custom", settings: {} };
    let sortProfiles = [profile, custom];
    window.localStorage.setItem("settings", JSON.stringify(sortProfiles));
  };

  const setSelectedText = (element, text) => {
    for (let i = 0; i < element.options.length; i++) {
      if (element.options[i].text === text) {
        element.selectedIndex = i;
        break;
      }
    }

  };




  return module;
})();