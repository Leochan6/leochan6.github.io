/**
 * Event Handlers for the Character Page.
 */

(function () {
  "use strict";

  window.onload = () => {

    /* ============================== Content ============================== */

    /* ------------------------------ Header Buttons ------------------------------ */

    // sign out button.
    signout_button.addEventListener("click", () => {
      let res = confirm("Are you sure you want to Sign Out?");
      if (res) database.signout();
    });

    // contact button.
    contact_button.addEventListener("click", () => {
      messageModal.style.display = "block";
      messageModalText.value = `For assistance, support, or feedback, please contact Leo Chan on Discord (Leo_Chan#9150) or Reddit (u/Leochan6).`;
      messageModalTitle.innerHTML = `Contact / Support`;
      messageModalList.innerHTML = "";
    });

    // theme toggle button.
    theme_button.addEventListener("click", () => {
      let theme = "light"
      if (theme_button.classList.contains("dark")) theme = "dark";
      else if (theme_button.classList.contains("light")) theme = "light";
      storage_api.updateSettings("theme", theme);
    });

    /* ------------------------------ General Modal Dialogs ------------------------------ */

    // hide modal dialogs if not drag
    let dragging = false;
    window.addEventListener("mousedown", (event) => {
      let x = event.x;
      let y = event.y;
      dragging = false;
      window.addEventListener("mousemove", (event) => {
        if (Math.abs(x - event.screenX) > 5 || Math.abs(y - event.screenY) > 5) {
          dragging = true;
        }
      });
    });

    window.addEventListener("mouseup", (event) => {
      if (!dragging) {
        if (event.target == messageModal && messageModal.style.display === "block") closeMessageModal()
        else if (event.target == characterSelectModal && characterSelectModal.style.display === "block") closeCharacterSelectModal();
        else if (event.target == backgroundSelectModal && backgroundSelectModal.style.display === "block") closeBackgroundSelectModal();
        else if (event.target == importListModal && importListModal.style.display === "block") closeImportListModal();
      }
    });

    /* ------------------------------ Message Modal Dialog ------------------------------ */

    // hide message modal dialog
    messageModalClose.addEventListener("click", () => {
      closeMessageModal();
    });

    // message modal dialog copy button.
    messageModalCopy.addEventListener("click", () => {
      navigator.clipboard.writeText(messageModalText.value);
    });

    /* ------------------------------ Character Select Modal Dialog ------------------------------ */

    // hide character select modal dialog
    characterSelectModalClose.addEventListener("click", () => {
      closeCharacterSelectModal();
    });

    // search change character select modal dialog.
    ["keyup", "change", "search"].forEach(event => {
      characterSelectModalSearch.addEventListener(event, () => {
        character_api.filterCharacters(characterSelectModalSearch.value);
      });
    });

    characterSelectModalAdded.addEventListener("click", () => {
      character_api.toggleAdded(characterSelectModalAdded.checked);
    })

    /* ------------------------------ Background Select Modal Dialog ------------------------------ */

    // open background select modal dialog
    backgroundSelectModalOpen.addEventListener("click", () => {
      background_api.openBackgroundSelect();
    });

    // hide background select modal dialog
    backgroundSelectModalClose.addEventListener("click", () => {
      closeBackgroundSelectModal();
    });

    // search change background select modal dialog.
    ["keyup", "change", "search"].forEach(event => {
      backgroundSelectModalSearch.addEventListener(event, () => {
        background_api.filterBackgrounds(backgroundSelectModalSearch.value);
      });
    });

    /* ------------------------------ Import List Modal Dialog ------------------------------ */

    // hide import list modal dialog
    importListModalClose.addEventListener("click", () => {
      closeImportListModal();
    });

    // import the text as a new list.
    importListModalImport.addEventListener("click", () => {
      character_list_api.importList();
    });

    /* ============================== Menu Bar ============================== */

    /* ------------------------------ Tabs ------------------------------ */

    // toggle visibility of the tab when heading clicked.
    document.querySelectorAll(".tab_header").forEach(element => {
      element.addEventListener("click", () => {
        let contents = element.parentElement.querySelector(".tab_contents");
        let toggle = element.querySelector(".tab_toggle");
        let tab_name = element.querySelector(".tab_heading").getAttribute("tab_name");
        if (!contents.classList.contains("hidden")) {
          contents.classList.add("hidden");
          toggle.classList.replace("down", "right");
          storage_api.settings.expanded_tabs[tab_name] = false;
          storage_api.updateSettings(`expanded_tabs/${tab_name}`, false);
        }
        else if (contents.classList.contains("hidden")) {
          contents.classList.remove("hidden");
          toggle.classList.replace("right", "down");
          storage_api.settings.expanded_tabs[tab_name] = true;
          storage_api.updateSettings(`expanded_tabs/${tab_name}`, true);
        }
      });
    });

    /* ------------------------------ My Character Lists Tab ------------------------------ */

    // show or hide the create new list form.
    new_list_button.addEventListener("click", () => {
      if (new_list_button.classList.contains("add")) {
        list_create.style.visibility = "visible";
        list_create.style.display = "block";
        new_list_button.classList.replace("add", "minus");
        new_list_name_field.focus();
      } else {
        list_create.style.visibility = "collapse";
        list_create.style.display = "none";
        new_list_button.classList.replace("minus", "add");
      }
    });

    duplicate_list_button.addEventListener("click", () => {
      if (list_duplicate.style.display === "none") {
        list_duplicate.style.visibility = "visible";
        list_duplicate.style.display = "block";
        duplicate_list_name_field.focus();
      } else {
        list_duplicate.style.visibility = "collapse";
        list_duplicate.style.display = "none";
        duplicate_list_name_field.value = "";
      }
    });

    // delete the selected list.
    delete_list_button.addEventListener("click", () => {
      if (character_list_api.selectedList.listId) {
        let res = confirm(`Are you sure you want to delete the list ${character_list_api.selectedList.list.name}?`);
        if (res) character_list_api.deleteList(character_list_api.selectedList.listId);
      }
    });

    // create a new list.
    new_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      character_list_api.createList();
    });

    // duplicate list.
    duplicate_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      let newName = duplicate_list_name_field.value;
      duplicate_list_name_field.value = "";
      if (newName && character_list_api.selectedList.listId) character_list_api.duplicateList(character_list_api.selectedList.list, newName);
      list_duplicate.style.visibility = "collapse";
      list_duplicate.style.display = "none";
    });

    // check the list name on change.
    new_list_name_field.addEventListener("change", () => {
      character_list_api.checkListName();
    });

    /* ------------------------------ Create Character Tab ------------------------------ */

    // update the available fields on name change and update preview display.
    name_select.addEventListener("change", () => {
      character_api.updateFieldsOnName();
    });

    // update the available fields on rank change and update preview display.
    rank_select.addEventListener("change", () => {
      character_api.updateFieldsOnRank();
    });

    // update the available fields on magia change and update preview display.
    magia_select.addEventListener("change", () => {
      character_api.updateFieldsOnMagia();
    });

    // open character select modal
    characterSelectModalOpen.addEventListener("click", () => {
      character_api.openCharacterSelect();
    });

    // update the preview display on form change.
    document.querySelectorAll(".form").forEach(element => {
      ["change", "keyup", "input"].forEach(event => {
        element.addEventListener(event, () => {
          character_api.updatePreviewOnForm();
        });
      });
    });

    // add new character display to list.
    create_button.addEventListener("click", () => {
      if (!create_button.disabled) character_api.createCharacter();
    });

    // updates the character display with the form.
    update_button.addEventListener("click", () => {
      if (!create_button.disabled) character_api.updateCharacter();
    });

    // copies the character display to the form.
    copy_button.addEventListener("click", () => {
      if (!create_button.disabled) character_api.copyCharacter();
    });

    // delete the selected character display from list.
    delete_button.addEventListener("click", () => {
      if (!create_button.disabled) character_api.deleteCharacter();
    });

    // mines all the fields.
    min_all_button.addEventListener("click", () => {
      if (!min_all_button.disabled) character_api.minimizeDisplay();
    });

    // maxes all the fields.
    max_all_button.addEventListener("click", () => {
      if (!max_all_button.disabled) character_api.maximizeDisplay();
    });

    /* ------------------------------ Sorting Profile Tab ------------------------------ */

    // check set the profile properties on change.
    profile_select.addEventListener("change", () => {
      let profileId = profile_select.value;
      if (profileId === "0" || profileId === "1") delete_profile_button.disabled = true;
      else delete_profile_button.disabled = false;
      profile_api.setProfile(profileId);
      character_list_api.applyProfileToList(character_list_api.getListId(), profileId);
      character_list_api.updateList();
    });

    // show the save new profile form.
    new_profile_button.addEventListener("click", () => {
      if (new_profile_button.classList.contains("add")) {
        new_profile_button.classList.replace("add", "minus");
        profile_create_block.classList.remove("hidden");
        new_profile_field.focus();
      }
      else {
        new_profile_button.classList.replace("minus", "add");
        profile_create_block.classList.add("hidden");
      }
    });

    // check the profile name on change.
    new_profile_field.addEventListener("change", () => {
      profile_api.checkProfile(new_profile_field.value);
    });

    // create a new profile.
    create_profile_button.addEventListener("click", (e) => {
      e.preventDefault();
      profile_api.saveProfile();
    });

    // delete the selected profile.
    delete_profile_button.addEventListener("click", () => {
      profile_api.deleteProfile();
    });

    /* ------------------------------ Display Settings Tab ------------------------------ */

    // change the number of displays per row.
    ["input", "change"].forEach(event => {
      displays_per_row.addEventListener(event, () => {
        character_list_api.changeDisplaysPerRow(displays_per_row.value);
        if (event === "change") storage_api.updateSettings("displays_per_row", displays_per_row.value);
      });
    });

    // change the alignment of the list.
    display_alignment_select.addEventListener("change", () => {
      character_list_api.changeAlignment(display_alignment_select.value);
    });

    ["input", "change"].forEach(event => {
      // change the padding of the list in the x direction.
      display_padding_x_field.addEventListener(event, () => {
        character_list_api.changePadding("x", display_padding_x_field.value);
        if (event === "change") storage_api.updateSettings("padding_x", display_padding_x_field.value);
      });

      // change the padding of the list in the y direction.
      display_padding_y_field.addEventListener(event, () => {
        character_list_api.changePadding("y", display_padding_y_field.value);
        if (event === "change") storage_api.updateSettings("padding_y", display_padding_y_field.value);
      });
    });

    /* ------------------------------ Background Tab ------------------------------ */

    // set the background.
    background_select.addEventListener("change", () => {
      background_api.setBackground(background_select.value);
      character_list_api.updateList();
    });

    // remove the background.
    remove_background_button.addEventListener("click", () => {
      background_api.removeBackground();
      character_list_api.updateList();
    });

    // transparency field input.
    ["input", "change"].forEach(event => {
      background_transparency_field.addEventListener(event, () => {
        let value = background_transparency_field.value;
        if (value > 500) value = 500;
        else if (value < 1) value = 1;
        if (value !== background_transparency_field.value) background_transparency_field.value = value;
        background_transparency_range.value = background_transparency_field.value;
        background_api.changetransparency(background_transparency_range.value);
        // if (event === "change") storage_api.updateSettings("background_transparency", background_transparency_field.value);
      });
    });

    // transparency range slider.
    ["input", "change", "wheel"].forEach(event => {
      background_transparency_range.addEventListener(event, (e) => {
        if (event === "wheel") {
          background_transparency_range.value = parseInt(background_transparency_range.value) - (e.deltaY / 100) * (e.shiftKey ? 25 : 1);
        }
        background_transparency_field.value = background_transparency_range.value;
        background_api.changetransparency(background_transparency_range.value);
        // if (event === "change") storage_api.updateSettings("background_transparency", background_transparency_range.value);
      });
    });

    /* ------------------------------ Settings Tab ------------------------------ */

    /* ============================== Main ============================== */

    /* ------------------------------ Export and Import ------------------------------ */

    // export image button.
    export_image_button.addEventListener("click", (e) => {
      let date = new Date();
      let time = `_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`
      let imageName = `${character_list_api.getListName() ? character_list_api.getListName().replace(" ", "_") : "list"}`
      html2canvas(character_list_content, { backgroundColor: null }).then(canvas => {
        if (e.ctrlKey) {
          let w = window.open('about:blank');
          let image = new Image();
          image.src = canvas.toDataURL();
          setTimeout(function () {
            w.document.write(image.outerHTML);
          }, 0);
        }
        else Canvas2Image.saveAsImage(canvas, imageName + time);
      });
    });

    // export text button.
    export_text_button.addEventListener("click", () => {
      character_list_api.openExportModal();
    });

    // import text button.
    import_text_button.addEventListener("click", () => {
      character_list_api.openImportModal();
    });

    /* ------------------------------ Filters ------------------------------ */

    // add new filter.
    add_filter_button.addEventListener("click", () => {
      character_list_api.createFilter();
    });

    // apply the filters.
    apply_filter_button.addEventListener("click", () => {
      character_list_api.applyFilters();
      character_list_api.getStats();
    });

    // reset the filters.
    reset_filter_button.addEventListener("click", () => {
      character_list_api.resetFilters();
    });

    toggle_filter_button.addEventListener("click", () => {
      if (toggle_filter_button.classList.contains("add")) {
        toggle_filter_button.classList.replace("add", "minus");
        if (list_filters.classList.contains("hidden")) list_filters.classList.remove("hidden");
      }
      else if (toggle_filter_button.classList.contains("minus")) {
        toggle_filter_button.classList.replace("minus", "add");
        if (!list_filters.classList.contains("hidden")) list_filters.classList.add("hidden");
      }
    });


    /* ------------------------------ Zoom ------------------------------ */

    // zoom field input.
    ["input", "change"].forEach(event => {
      zoom_field.addEventListener(event, () => {
        let value = zoom_field.value;
        if (value > 500) value = 500;
        else if (value < 1) value = 1;
        if (value !== zoom_field.value) zoom_field.value = value;
        zoom_range.value = zoom_field.value;
        character_list_api.changeZoom(zoom_range.value);
        if (event === "change") storage_api.updateSettings("character_zoom", zoom_field.value);
      });
    });

    // zoom range slider.
    ["input", "change", "wheel"].forEach(event => {
      zoom_range.addEventListener(event, (e) => {
        if (event === "wheel") {
          zoom_range.value = parseInt(zoom_range.value) - (e.deltaY / 100) * (e.shiftKey ? 50 : 1);
        }
        zoom_field.value = zoom_range.value;
        character_list_api.changeZoom(zoom_range.value);
        if (event === "change") storage_api.updateSettings("character_zoom", zoom_range.value);
      });
    });

    /* ------------------------------ Stats ------------------------------ */

    // get more stats button.
    more_stats_button.addEventListener("click", () => {
      character_list_api.openStatsModal();
    });

    /* ------------------------------ Character Display ------------------------------ */

    // deselect currently selected.
    character_list_container.addEventListener("click", (e) => {
      try {
        if (e.target.parentElement.className.indexOf("character_display") === -1 && e.target.parentElement.parentElement.className.indexOf("character_display") === -1) {
          document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
            if (child.classList.contains("selected")) {
              child.classList.remove("selected");
              character_api.selectedCharacter = null;
              character_api.enableButtons();
            }
          });
        }
      } catch (error) {
        character_api.selectedCharacter = null;
        character_api.enableButtons();
      }
    });

    /* ------------------------------ Character List Content ------------------------------ */

    // resort when character list changes.
    character_list_content.addEventListener("change", () => {
      character_list_api.applyProfileToList(character_list_api.getListId(), profile_api.getSelectedProfileId());
      character_list_api.updateList();
    });

  };

  /* ------------------------------ Close Modal Dialogs ------------------------------ */

  const closeMessageModal = () => {
    messageModal.style.display = "none";
    messageModalTitle.innerHTML = "";
    messageModalText.value = "";
    messageModalText.readonly = true;
    messageModalText.scrollTo(0, 0);
  };

  const closeCharacterSelectModal = () => {
    characterSelectModal.style.display = "none";
    characterSelectModalSearch.value = "";
    characterSelectModalList.scrollTo(0, 0);
  };

  const closeBackgroundSelectModal = () => {
    backgroundSelectModal.style.display = "none";
    backgroundSelectModalSearch.value = "";
    backgroundSelectModalList.innerHTML = "";
    backgroundSelectModalList.scrollTo(0, 0);
  };

  const closeImportListModal = () => {
    importListModal.style.display = "none";
    importListModalName.value = "";
    importListModalText.value = "";
    importListModalError.innerHTML = "";
    importListModalText.scrollTo(0, 0);
  };

  /* ------------------------------ Page Start Up ------------------------------ */

  utils.detectColorScheme();

  // update form and preview display on startup.
  character_api.startUp();

  // update the background form.
  background_api.startUp();

  // load the settings, profiles, and character lists from storage.
  database.onAuthStateChanged(user => {
    if (user) {
      header_username.innerHTML = `Welcome ${user.displayName || "Anonymous"}`;
      storage_api.startUp(user.uid);
    }
    else {
      header_username.innerHTML = "";
      window.location.href = "../";
    }
  });

})();