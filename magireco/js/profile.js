let profile_api = (function () {

  let module = {};

  module.getSortProperties = () => {
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

  module.saveProfile = () => {
    let profileName = new_profile_field.value;
    if (storage_api.profileExists(profileName)) {
      profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
      return;
    }
    new_profile_field.value = "";
    let properties = module.getSortProperties();
    storage_api.updateProfile(profileName, properties);
    new_profile_row.style.visibility = "collapse"
  };

  module.updateProfile = () => {
    let profileName = module.getSelectedProfile();
    let properties = module.getSortProperties();
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

  module.changeToCustom = () => {
    profile_select.value = "Custom";
  };

  module.resetProfiles = () => {
    if (window.confirm("Are you sure you want to reset the profiles?")) {
      storage_api.resetSorting();
    }
  };

  return module;
})();