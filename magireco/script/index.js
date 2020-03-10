(function () {
  "use strict";

  window.onload = () => {

    // Open the Home Tab.
    document.getElementById('home_btn').addEventListener("click", event => utils.openTab(event, 'home_tab'));

    // Open the Sorting Tab.
    document.getElementById('sorting_btn').addEventListener("click", event => utils.openTab(event, 'sorting_tab'));

    // update the available fields on name change and update preview display.
    name_select.addEventListener("change", () => {
      character_api.updateFieldsOnName();
    });

    // update the preview display on form change.
    document.querySelectorAll(".form").forEach(element => {
      element.addEventListener("change", () => {
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
    });

    // clears all character displays from list.
    clear_button.addEventListener("click", () => {
      character_list.innerHTML = "";
    });

    // update the list on sort form change.
    document.querySelectorAll(".sort_form").forEach(element => {
      element.addEventListener("change", () => {
        character_api.sortOnFormUpdate();
        character_api.changeToCustom();
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
      });
      element.addEventListener("change", () => {
        character_api.changeToCustom();
      });
    });

    // resort when character list changes.
    character_list.addEventListener("change", () => {
      character_api.sortOnFormUpdate();
    })

    // deselect currently selected.
    document.addEventListener("click", (e) => {
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
      new_profile_row.style.visibility = "visible"
    });

    // hide the save new profile form.
    close_new_profile_button.addEventListener("click", () => {
      new_profile_row.style.visibility = "collapse"
    });

    // save the new sorting profile.
    save_profile_button.addEventListener("click", () => {
      character_api.saveProfile();
    });

    // check the profile name on change.
    new_profile_field.addEventListener("change", () => {
      character_api.checkProfile();
    });

    // check set the profile properties on change.
    profile_select.addEventListener("change", () => {
      if (profile_select.selectedIndex == settings_api.customIndex) return;
      character_api.setProfile();
      character_api.sortOnFormUpdate();
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
    name_select.selectedIndex = 0;
    name_select.dispatchEvent(new Event("change"));
  });

  // update form and preview display on startup.
  character_api.startUp();

  // laod the settings from the storage.
  settings_api.loadSettings();


}());