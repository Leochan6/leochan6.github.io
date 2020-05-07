let profile_api = (function () {

  let module = {};

  module.selectedProfile = null;

  // loads, sets, and selects the profiles
  module.setProfiles = (profiles, previous) => {
    profile_select.innerHTML = "";
    Object.entries(profiles).forEach(([id, profile]) => {
      profile_select.options.add(new Option(profile.name, id, false));
    });
    if (module.selectedProfile !== null && module.selectedProfile.name !== null) {
      let profileId = module.getProfileId(module.selectedProfile.name)
      profile_select.value = profileId;
      let listId = character_list_api.getListId();
      if (listId) storage_api.updateListProfile(listId, profileId);
    }
    else if (previous && Array.from(profile_select.options).some(option => option.value === previous)) {
      profile_select.value = previous;
      let listId = character_list_api.getListId();
      if (listId) storage_api.updateListProfile(listId, previous);
    }
    else {
      profile_select.value = "0";
      let listId = character_list_api.getListId();
      if (listId) storage_api.updateListProfile(listId, "0");
    }
    module.loadsRules(profile_select.value);
  };

  module.getSortSettings = () => {
    let settings = {};
    Array.from(profile_rules.children).forEach(child => {
      let childRuleId = child.getAttribute("ruleId")
      let ruleId = childRuleId && childRuleId.length > 3 ? childRuleId : generatePushID();
      settings[ruleId] = {
        state: child.querySelector(".state_select").value,
        type: child.querySelector(".type_select").value,
        direction: child.querySelector(".sort_dir").classList.contains("up") ? 1 : -1,
      }
    });
    return settings;
  };

  module.saveProfile = () => {
    let profileName = new_profile_field.value;
    if (Object.values(storage_api.profiles).some(profile => profile.name === profileName)) {
      profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
      return;
    }
    if (profileName.length === 0) {
      profile_error_text.innerHTML = `The sorting profile name must not be empty.`;
      return;
    }
    new_profile_field.value = "";
    let properties = module.getSortSettings();
    module.selectedProfile = { name: profileName, id: null };
    storage_api.createProfile(profileName, properties);
    if (!profile_create_block.classList.add("hidden")) profile_create_block.classList.add("hidden");
  };

  module.updateProfile = () => {
    let profileId = module.getSelectedProfileId();
    let properties = module.getSortSettings();
    storage_api.updateProfile(profileId, properties);
    if (!profile_create_block.classList.add("hidden")) profile_create_block.classList.add("hidden");
  };

  module.checkProfile = (profileName) => {
    if (Object.values(storage_api.profiles).some(profile => profile.name === profileName)) profile_error_text.innerHTML = `The sorting profile ${profileName} already exists.`;
    else profile_error_text.innerHTML = "";
  };

  module.deleteProfile = () => {
    let profileId = module.getSelectedProfileId();
    if (storage_api.profiles[profileId].name !== "Default" && storage_api.profiles[profileId].name !== "Custom") {
      storage_api.deleteProfile(profileId);
      module.selectedProfile = { name: "Default", id: "0" };
      profile_select.value = "0";
      let listId = character_list_api.getListId();
      if (listId) storage_api.updateList(listId, character_list_api.getListName(), storage_api.lists[listId].characterList, "0", background_api.getSelectedBackground() || "");
    }
  };

  module.setProfile = (profileId) => {
    profile_select.value = profileId;
    if (storage_api.profiles[profileId].rules) module.loadsRules(profileId);
  };

  module.getSelectedProfileId = () => {
    if (profile_select.selectedIndex > -1)
      return profile_select.value;
    else return "0";
  };

  module.getSelectedProfileName = () => {
    if (profile_select.options[profile_select.selectedIndex])
      return profile_select.options[profile_select.selectedIndex].text;
    else return "Default";
  };

  module.getProfileId = (profileName) => {
    let profile = Object.entries(storage_api.profiles).find(([id, profile]) => profile.name === profileName);
    return profile[0];
  };

  module.changeToCustom = () => {
    profile_select.value = "1";
  };

  module.createProfileRule = (next = null) => {
    let new_rule = document.createElement("div");
    new_rule.classList.add("profile_rule");
    new_rule.innerHTML = `
      <select class="state_select form_input">
        <option value="sort">Sort By</option>
        <option value="group">Group By</option>
      </select>
      <select class="type_select form_input">
        <option value="attribute">Attribute</option>
        <option value="rank">Rank</option>
        <option value="level">Level</option>
        <option value="magic">Magic</option>
        <option value="magia">Magia</option>
        <option value="episode">Episode</option>
        <option value="doppel">Doppel</option>
        <option value="obtainability">Obtainability</option>
        <option value="character_id">Character ID</option>
      </select>
      <button class="sort_dir down small_btn"></button>
      <button class="create add small_btn" title="Add New Filter Below"></button>
      <button class="delete small_btn" title="Delete Filter"></button>`;

    let state_select = new_rule.querySelector(".state_select")
    let type_select = new_rule.querySelector(".type_select")
    let sort_dir = new_rule.querySelector(".sort_dir");
    state_select.selectedIndex = -1;
    type_select.selectedIndex = -1;

    new_rule.querySelector(".create").addEventListener("click", () => {
      module.createProfileRule(new_rule);
    });
    new_rule.querySelector(".delete").addEventListener("click", () => {
      new_rule.remove();
      let first_rule = profile_rules.children[0].querySelector(".delete");
      if (profile_rules.children.length === 1 && !first_rule.disabled) first_rule.disabled = true;

      if (module.getSelectedProfileName() === "Default") module.changeToCustom();
      character_list_api.updateList();
      module.updateProfile();
      character_list_api.applyProfileToList(character_list_api.getListId(), module.getSelectedProfileId());
    });

    sort_dir.addEventListener("click", () => {
      if (sort_dir.classList.contains("up")) {
        sort_dir.classList.replace("up", "down");
      }
      else if (sort_dir.classList.contains("down")) {
        sort_dir.classList.replace("down", "up");
      }
      if (module.getSelectedProfileName() === "Default") module.changeToCustom();
      character_list_api.updateList();
      profile_api.updateProfile();
      character_list_api.applyProfileToList(character_list_api.getListId(), module.getSelectedProfileId());
    });

    // update the list on sort form change.
    [state_select, type_select].forEach(element => {
      element.addEventListener("change", () => {
        if (module.getSelectedProfileName() === "Default") profile_api.changeToCustom();
        if (state_select.value && type_select.value) {
          character_list_api.updateList();
          profile_api.updateProfile();
          character_list_api.applyProfileToList(character_list_api.getListId(), module.getSelectedProfileId());
        }
      });
    });

    // disable group or id level.
    state_select.addEventListener("change", () => {
      if (state_select.value === "group") {
        if (type_select.value === "character_id" || type_select.value === "level") {
          type_select.selectedIndex = -1;
        }
        type_select.options[2].disabled = true;
        type_select.options[8].disabled = true;
      } else {
        type_select.options[2].disabled = false;
        type_select.options[8].disabled = false;
      }
    });

    type_select.addEventListener("change", () => {
      if (type_select.value === "character_id" || type_select.value === "level") {
        if (state_select.value === "group") {
          state_select.selectedIndex = -1;
        }
        state_select.options[1].disabled = true;
      } else state_select.options[1].disabled = false;
    });

    if (next !== null) next.after(new_rule);
    else profile_rules.append(new_rule);
    return new_rule;
  };

  module.loadRule = (ruleId, settings) => {
    let rule = module.createProfileRule();
    let state_select = rule.querySelector(".state_select");
    let type_select = rule.querySelector(".type_select");
    let sort_dir = rule.querySelector(".sort_dir");
    rule.setAttribute("ruleId", ruleId)
    state_select.value = settings.state;
    type_select.value = settings.type;
    if (settings.direction == 1 && sort_dir.classList.contains("down")) sort_dir.classList.replace("down", "up");
    else if (settings.direction == -1 && sort_dir.classList.contains("up")) sort_dir.classList.replace("up", "down");

    if (state_select.value === "group") {
      if (type_select.value === "character_id" || type_select.value === "level") {
        type_select.selectedIndex = -1;
      }
      type_select.options[2].disabled = true;
      type_select.options[8].disabled = true;
    } else {
      type_select.options[2].disabled = false;
      type_select.options[8].disabled = false;
    }

    if (type_select.value === "character_id" || type_select.value === "level") {
      if (state_select.value === "group") {
        state_select.selectedIndex = -1;
      }
      state_select.options[1].disabled = true;
    } else state_select.options[1].disabled = false;
  };

  module.loadsRules = (profileId) => {
    if (!storage_api.profiles[profileId].rules) return;
    profile_rules.innerHTML = "";
    Object.entries(storage_api.profiles[profileId].rules).forEach(([ruleId, settings]) => {
      module.loadRule(ruleId, settings);
    });
    if (profile_rules.children.length > 0) {
      let first_rule = profile_rules.children[0].querySelector(".delete");
      if (profile_rules.children.length === 1 && !first_rule.disabled) first_rule.disabled = true;
    }
  };

  return module;
})();