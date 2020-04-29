let memoria_list_api = (function () {

  let module = {};

  /**
   * loads the memoria displays of the memoria_list.
   * 
   * @param {memoria_api.Display[]} memoria_list 
   */
  const loadMemoriaList = (memoria_list) => {
    memoria_list_content.innerHTML = "";
    memoria_list = memoria_list !== true ? memoria_list : {};
    Object.entries(memoria_list).forEach(([key, value]) => {
      memoria_list_content.append(memoria_api.createDisplay(new memoria_api.Display(key, value), true));
    });
  };

  /**
   * creates a new list.
   */
  module.createList = () => {
    let listName = new_list_name_field.value;
    if (!listName) {
      home_error_text.innerHTML = `The list name must not be empty.`;
      return;
    }
    if (storage_api.listExists(listName)) {
      home_error_text.innerHTML = `The list name ${listName} already exists.`;
      return;
    }
    new_list_name_field.value = "";
    new_list_button.classList.replace("minus", "add");
    list_create.style.visibility = "collapse";
    list_create.style.display = "none";
    list_name_title.innerHTML = listName;
    // profile_select.value = "Default";
    memoria_list_content.innerHTML = "";
    storage_api.createMemoriaList(listName);
  };

  /**
   * checks if the list name exists.
   */
  module.checkListName = () => {
    let listName = new_list_name_field.value;
    // if (storage_api.listExists(listName)) home_error_text.innerHTML = `The list name ${listName} already exists.`;
    if (false) return;
    else home_error_text.innerHTML = "";
  };

  /**
   * updates the list in the database with the list name, characters, and profile.
   */
  module.updateList = () => {
    let listId = module.getListId();
    let listName = module.getListName();
    let memoriaList = module.getMemoriaList();
    let selectedProfile = "Default";
    let selectedBackground = true;
    // let selectedProfile = profile_api.getSelectedProfile();
    // let selectedBackground = background_api.getSelectedBackground();
    if (!listName) return;
    storage_api.updateMemoriaList(listId, listName, memoriaList, selectedProfile, selectedBackground);
  };

  /**
   * returns the list name.
   */
  module.getListName = () => {
    return list_name_title.innerText;
  };

  /**
   * returns the list id.
   */
  module.getListId = () => {
    return list_name_title.getAttribute("listId");
  };

  /**
   * returns all the memoria displays in a list.
   */
  module.getMemoriaList = () => {
    let memoriaList = {};
    document.querySelectorAll(".memoria_display:not(.preview)").forEach(child => {
      memoriaList[child.getAttribute("_id")] = memoria_api.getMemoriaDisplay(child);
    });
    if (Object.keys(memoriaList).length == 0) memoriaList = true;
    return memoriaList;
  };


  module.setLists = (lists) => {
    module.selectedList = { listId: list_name_title.getAttribute("listId"), list: null };
    saved_memoria_lists.innerHTML = "";
    list_name_title.innerHTML = "";
    list_stats_list.innerHTML = "";
    for (let [listId, list] of Object.entries(lists)) {
      let div = document.createElement("div");
      div.classList.add("memoria_list_row");
      let entry = document.createElement("div");
      entry.classList.add("memoria_list_entry");
      entry.setAttribute("listId", listId);
      entry.innerHTML = list.name;
      entry.addEventListener("click", () => {
        memoria_list_api.selectList(listId, list);
      });
      div.append(entry);
      saved_memoria_lists.append(div);
    }
    if (Object.entries(lists).length > 0) {
      if (module.selectedList && module.selectedList.listId && lists[module.selectedList.listId]) {
        module.selectList(module.selectedList.listId, lists[module.selectedList.listId]);
      } else {
        let first = Object.entries(lists)[0][0];
        module.selectList(first, lists[first]);
      }
      // enable list duplicate and delete buttons
      delete_list_button.disabled = false;
      duplicate_list_form.disabled = false;
    }
    // disable list duplicate and delete buttons if no list
    else {
      delete_list_button.disabled = true;
      duplicate_list_form.disabled = true;
    }
  }

  /**
   * select the list of name and loads the character list list
   */
  module.selectList = (listId, list) => {
    for (let element of document.querySelectorAll(".memoria_list_entry")) {
      // element already selected.
      if (element.getAttribute("listId") === listId) {
        if (element.classList.contains("selectedList")) return;
        else element.classList.add("selectedList");
      }
      else if (element.classList.contains("selectedList")) element.classList.remove("selectedList");
    }
    module.selectedList = { listId: listId, list: list };
    list_name_title.innerHTML = list.name;
    list_name_title.setAttribute("listId", listId);
    loadMemoriaList(list.memoriaList);
    // profile_select.value = list.selectedProfile;
    // profile_api.setProfile();
    // module.sortOnFormUpdate();
    // background_select.value = list.selectedBackground
    // background_api.setBackground(list.selectedBackground);
    // memoria_list_api.getStats();
    memoria_api.enableButtons();
  };

  /**
   * deletes the list.
   */
  module.deleteList = (listId) => {
    module.selectedList = null;
    storage_api.deleteList(listId);
  };

  /**
   * duplicate the list.
   */
  module.duplicateList = (list, newName) => {
    if (list && newName && newName.length > 0) {
      let newMemoriaList = {};
      Object.entries(list.memoriaList).forEach(([key, value]) => {
        newMemoriaList[generatePushID()] = value;
      });
      list.memoriaList = newMemoriaList;
      storage_api.duplicateMemoriaList(list, newName);
    }
  };


  return module;
})();