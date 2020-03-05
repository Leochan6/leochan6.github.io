(function () {
  "use strict";

  window.onload = () => {

    // Open the Home Tab.
    document.getElementById('home_btn').addEventListener("click", event => utils.openTab(event,'home_tab'));

    // Open the Sorting Tab.
    document.getElementById('sorting_btn').addEventListener("click", event => utils.openTab(event,'sorting_tab'));
  
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
      });
    });

    // resort when character list changes.
    character_list.addEventListener("change", () => {
      character_api.sortOnFormUpdate();
    })

    // deselect currently selected.
    main.addEventListener("click", (e) => {
      if (e.target.parentElement.className.indexOf("character_display") === -1 && e.target.parentElement.parentElement.className.indexOf("character_display") === -1) {
        document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
          if (child.classList.contains("selected")) child.classList.remove("selected");
        });
      }
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

  character_api.onErrorUpdate(error => {
    error_text.innerHTML = error.toString();
  });

  


















}());