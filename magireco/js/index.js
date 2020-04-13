(function () {
  "use strict";

  window.onload = () => {

    signout_button.addEventListener("click", () => {
      database.signout();
    });

    // open the tab.
    document.querySelectorAll(".tablink").forEach(element => {
      element.addEventListener("click", event => {
        // if (element.classList.contains("btnGray") && !storage_api.settings["show_all_menus"])
        if (element.classList.contains("btnGray"))
          utils.openTab(event, element.getAttribute("tab_name"));
      });
    });

    // update the available fields on name change and update preview display.
    name_select.addEventListener("change", () => {
      character_api.updateFieldsOnName();
    });

    // update the preview display on form change.
    document.querySelectorAll(".form").forEach(element => {
      element.addEventListener("change", () => {
        character_api.updatePreviewOnForm();
      });
      element.addEventListener("keyup", () => {
        character_api.updatePreviewOnForm();
      });
    });

    // add new character display to list.
    create_button.addEventListener("click", () => {
      character_api.createAddDisplay();
    });

    // updates the character display with the form.
    update_button.addEventListener("click", () => {
      character_api.updateSelectedDisplay();
    });

    // copies the character display to the form.
    copy_button.addEventListener("click", () => {
      character_api.copyDisplay();
    });

    // delete the selected character display from list.
    delete_button.addEventListener("click", () => {
      let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
      character_display.remove();
      character_list_content.dispatchEvent(new Event("change"));
    });

    // update the list on sort form change.
    document.querySelectorAll(".sort_form").forEach(element => {
      element.addEventListener("change", () => {
        character_api.sortOnFormUpdate();
        if (character_api.getSelectedProfile() === "Default") character_api.changeToCustom();
        character_api.updateList();
        character_api.updateProfile();
      });
    });

    // update the list on sort dir click.
    document.querySelectorAll(".sort_dir").forEach(element => {
      element.addEventListener("click", () => {
        if (element.classList.contains("ascend")) {
          element.classList.replace("ascend", "descend");
        }
        else if (element.classList.contains("descend")) {
          element.classList.replace("descend", "ascend");
        }
        character_api.sortOnFormUpdate();
        if (character_api.getSelectedProfile() === "Default") character_api.changeToCustom();
        character_api.updateList();
        character_api.updateProfile();

      });
    });

    // resort when character list changes.
    character_list_content.addEventListener("change", () => {
      character_api.sortOnFormUpdate();
      character_api.updateList();
    });

    // deselect currently selected.
    main.addEventListener("click", (e) => {
      try {
        if (e.target.parentElement.className.indexOf("character_display") === -1 && e.target.parentElement.parentElement.className.indexOf("character_display") === -1) {
          document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
            if (child.classList.contains("selected")) child.classList.remove("selected");
          });
        }
      } catch (error) {
        // type error
      }
    });

    // show the save new profile form.
    new_profile_button.addEventListener("click", () => {
      new_profile_row.style.visibility = "visible";
    });

    // hide the save new profile form.
    close_new_profile_button.addEventListener("click", () => {
      new_profile_row.style.visibility = "collapse";
    });

    // save the new sorting profile.
    save_profile_button.addEventListener("click", () => {
      character_api.saveProfile();
    });

    // check the profile name on change.
    new_profile_field.addEventListener("change", () => {
      character_api.checkProfile();
    });

    // delete the selected profile.
    delete_profile_button.addEventListener("click", () => {
      character_api.deleteProfile();
    });

    // check set the profile properties on change.
    profile_select.addEventListener("change", () => {
      if (profile_select.value == "Custom") return;
      character_api.setProfile();
      character_api.sortOnFormUpdate();
      character_api.updateList();
    });

    // reset the profiles to default.
    reset_profiles_button.addEventListener("click", () => {
      character_api.resetProfiles();
    });

    // show or hidthe create new list form.
    new_list_button.addEventListener("click", () => {
      if (new_list_button.classList.contains("add")) {
        new_list_table.style.visibility = "visible";
        new_list_button.classList.replace("add", "minus");
      }
      else {
        new_list_table.style.visibility = "collapse";
        new_list_button.classList.replace("minus", "add");
      }
    });

    // create a new list.
    new_list_create_button.addEventListener("click", () => {
      character_api.createList();
    });

    // check the list name on change.
    new_list_name_field.addEventListener("change", () => {
      character_api.checkListName();
    });

    // show all menus checkbox.
    show_all_menus_checkbox.addEventListener("click", () => {
      if (show_all_menus_checkbox.checked) {
        tab_bar.classList.add("tab_hidden");
        document.querySelectorAll(".tab").forEach(element => {
          element.classList.remove("tab_hidden");
        });
      }
      else {
        tab_bar.classList.remove("tab_hidden");
        document.querySelectorAll(".tab").forEach(element => {
          if (element.id !== "setting_tab")
            element.classList.add("tab_hidden");
        });
      }
    });

    // export button.
    export_button.addEventListener("click", () => {
      html2canvas(character_list_content).then(canvas => {
        Canvas2Image.saveAsImage(canvas);
      });
    });

    // zoom range slider.
    zoom_field.addEventListener("change", () => {
      let value = zoom_field.value;
      if (value > 500) value = 500;
      else if (value < 1) value = 1;
      if (value !== zoom_field.value) zoom_field.value = value;
      zoom_range.value = zoom_field.value;
      character_api.changeZoom(zoom_range.value);
    });
    zoom_field.addEventListener("input", () => {
      zoom_range.value = zoom_field.value;
      character_api.changeZoom(zoom_range.value);
    });
    zoom_range.addEventListener("change", () => {
      zoom_field.value = zoom_range.value;
      character_api.changeZoom(zoom_range.value);
    });
    zoom_range.addEventListener("input", () => {
      zoom_field.value = zoom_range.value;
      character_api.changeZoom(zoom_range.value);
    });

    // check auto zoom.
    zoom_checkbox.addEventListener("change", () => {
      if (zoom_checkbox.checked) character_api.zoom_fit();
    });

    // zoom to fix if window size changes.
    window.addEventListener("resize", () => {
      if (zoom_checkbox.checked) character_api.zoom_fit();
    });

  };

  // initilize name field.
  character_api.getNames((collection) => {
    let prev_id = null;
    let characters = [];
    collection.forEach((character) => {
      if (character.id !== prev_id) {
        characters.push(character);
        prev_id = character.id;
      }
    })
    characters.forEach((character) => {
      name_select.options.add(new Option(character.name, character.id, false));
    });
    // name_select.selectedIndex = 0;
    name_select.value = 1001;
    name_select.dispatchEvent(new Event("change"));
  });

  // update form and preview display on startup.
  character_api.startUp();

  // load the settings, profiles, and character lists from storage.
  database.onAuthStateChanged(user => {
    if (user) storage_api.startUp(user.uid);
    else window.location.href = "index.html";
  });

}());
