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
    document.querySelectorAll(".tab_heading").forEach(element => {
      element.addEventListener("click", () => {
        let contents = element.parentElement.parentElement.querySelector(".tab_contents");
        let tab_name = element.getAttribute("tab_name");
        if (!contents.classList.contains("hidden")) {
          contents.classList.add("hidden");
          storage_api.settings.expanded_tabs[tab_name] = false;
          storage_api.updateSettings(`expanded_tabs/${tab_name}`, false);
        }
        else if (contents.classList.contains("hidden")) {
          contents.classList.remove("hidden");
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
      character_api.selectedCharacter = null;
      character_api.enableButtons();
      character_list_content.dispatchEvent(new Event("change"));
    });

    // mines all the fields.
    min_all_button.addEventListener("click", () => {
      character_api.minimizeDisplay();
    });

    // maxes all the fields.
    max_all_button.addEventListener("click", () => {
      character_api.maximizeDisplay();
    });

    /* ------------------------------ Sorting Profile Tab ------------------------------ */

    // update the list on sort form change.
    document.querySelectorAll(".sort_form").forEach(element => {
      element.addEventListener("change", () => {
        character_list_api.sortOnFormUpdate();
        if (profile_api.getSelectedProfileName() === "Default") profile_api.changeToCustom();
        character_list_api.updateList();
        profile_api.updateProfile();
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
        character_list_api.sortOnFormUpdate();
        if (profile_api.getSelectedProfileName() === "Default") profile_api.changeToCustom();
        character_list_api.updateList();
        profile_api.updateProfile();
      });
    });

    // check set the profile properties on change.
    profile_select.addEventListener("change", () => {
      profile_api.setProfile();
      character_list_api.sortOnFormUpdate();
      character_list_api.updateList();
    });

    // show the save new profile form.
    new_profile_button.addEventListener("click", () => {
      new_profile_row.style.visibility = "visible";
      new_profile_field.focus();
    });

    // hide the save new profile form.
    close_new_profile_button.addEventListener("click", () => {
      new_profile_row.style.visibility = "collapse";
    });

    // save the new sorting profile.
    create_profile_button.addEventListener("click", (e) => {
      e.preventDefault();
      profile_api.saveProfile();
    });

    // check the profile name on change.
    new_profile_field.addEventListener("change", () => {
      profile_api.checkProfile();
    });

    // delete the selected profile.
    delete_profile_button.addEventListener("click", () => {
      profile_api.deleteProfile();
    });

    /* ------------------------------ Display Settings Tab ------------------------------ */

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

    /* ------------------------------ Settings Tab ------------------------------ */

    /* ============================== Main ============================== */

    /* ------------------------------ Export and Import ------------------------------ */

    // export image button.
    export_image_button.addEventListener("click", () => {
      html2canvas(character_list_content).then(canvas => {
        Canvas2Image.saveAsImage(canvas, "list");
      });
    });

    // export text button.
    export_text_button.addEventListener("click", () => {

      navigator.mediaDevices.getDisplayMedia()
        .then(mediaStream => {
          const video = document.querySelector('#character_list_content');
          video.srcObject = mediaStream;
          video.onloadedmetadata = e => {
            video.play();
            video.pause();
          };
        })
        .catch(err => console.log(`${err.name}: ${err.message}`));

      // character_list_api.openExportModal();
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
    ["input", "change"].forEach(event => {
      zoom_range.addEventListener(event, () => {
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
    main.addEventListener("click", (e) => {
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
      character_list_api.sortOnFormUpdate();
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