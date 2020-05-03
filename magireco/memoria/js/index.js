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
        else if (event.target == memoriaSelectModal && memoriaSelectModal.style.display === "block") closeMemoriaSelectModal();
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

    /* ------------------------------ Memoria Select Modal Dialog ------------------------------ */

    // hide memoria select modal dialog
    memoriaSelectModalClose.addEventListener("click", () => {
      closeMemoriaSelectModal();
    });

    // search change memoria select modal dialog.
    ["keyup", "change", "search"].forEach(event => {
      memoriaSelectModalSearch.addEventListener(event, () => {
        memoria_api.filterMemoria(memoriaSelectModalSearch.value);
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
      memoria_list_api.importList();
    });

    /* ============================== Menu Bar ============================== */

    /* ------------------------------ Tabs ------------------------------ */

    // toggle visibility of the tab.
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

    /* ------------------------------ My Memoria Lists Tab ------------------------------ */

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
      if (memoria_list_api.selectedList.listId) {
        let res = confirm(`Are you sure you want to delete the list ${memoria_list_api.selectedList.list.name}?`);
        if (res) memoria_list_api.deleteList(memoria_list_api.selectedList.listId);
      }
    });

    // create a new list.
    new_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      memoria_list_api.createList();
    });

    // duplicate list.
    duplicate_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      let newName = duplicate_list_name_field.value;
      duplicate_list_name_field.value = "";
      if (newName && memoria_list_api.selectedList.listId) memoria_list_api.duplicateList(memoria_list_api.selectedList.list, newName);
      list_duplicate.style.visibility = "collapse";
      list_duplicate.style.display = "none";
    });

    // check the list name on change.
    new_list_name_field.addEventListener("change", () => {
      memoria_list_api.checkListName();
    });

    /* ------------------------------ Create Memoria Tab ------------------------------ */

    // update the available fields on name change and update preview display.
    name_select.addEventListener("change", () => {
      memoria_api.updateFieldsOnName();
    });

    // open memoria select modal
    memoriaSelectModalOpen.addEventListener("click", () => {
      memoria_api.openMemoriaSelect();
    });

    // update the preview display on form change.
    document.querySelectorAll(".form").forEach(element => {
      ["change", "keyup", "input"].forEach(event => {
        element.addEventListener(event, () => {
          memoria_api.updatePreviewOnForm();
        });
      });
    });

    // add new memoria display to list.
    create_button.addEventListener("click", () => {
      memoria_api.createAddDisplay();
    });

    // updates the memoria display with the form.
    update_button.addEventListener("click", () => {
      memoria_api.updateSelectedDisplay();
    });

    // copies the memoria display to the form.
    copy_button.addEventListener("click", () => {
      memoria_api.copyDisplay();
    });

    // delete the selected character display from list.
    delete_button.addEventListener("click", () => {
      let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
      memoria_display.remove();
      memoria_api.selectedMemoria = null;
      memoria_api.enableButtons();
      memoria_list_content.dispatchEvent(new Event("change"));
    });

    // mines all the fields.
    min_all_button.addEventListener("click", () => {
      memoria_api.minimizeDisplay();
    });

    // maxes all the fields.
    max_all_button.addEventListener("click", () => {
      memoria_api.maximizeDisplay();
    });

    /* ------------------------------ Sorting Profile Tab ------------------------------ */

    // update the list on sort form change.
    document.querySelectorAll(".sort_form").forEach(element => {
      element.addEventListener("change", () => {
        memoria_list_api.sortOnFormUpdate();
        if (profile_api.getSelectedProfileName() === "Default") profile_api.changeToCustom();
        memoria_list_api.updateList();
        profile_api.updateProfile();
      });
    });

    // update the list on sort dir click.
    document.querySelectorAll(".sort_dir").forEach(element => {
      element.addEventListener("click", () => {
        if (element.classList.contains("up")) {
          element.classList.replace("up", "down");
        }
        else if (element.classList.contains("down")) {
          element.classList.replace("down", "up");
        }
        memoria_list_api.sortOnFormUpdate();
        if (profile_api.getSelectedProfileName() === "Default") profile_api.changeToCustom();
        memoria_list_api.updateList();
        profile_api.updateProfile();
      });
    });

    // check set the profile properties on change.
    profile_select.addEventListener("change", () => {
      profile_api.setProfile(profile_select.value);
      memoria_list_api.sortOnFormUpdate();
      memoria_list_api.updateList();
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
      profile_api.checkProfile(new_profile_field.value);
    });

    // delete the selected profile.
    delete_profile_button.addEventListener("click", () => {
      profile_api.deleteProfile();
    });

    /* ------------------------------ Background Tab ------------------------------ */

    // set the background.
    background_select.addEventListener("change", () => {
      background_api.setBackground(background_select.value);
      memoria_list_api.updateList();
    });

    // remove the background.
    remove_background_button.addEventListener("click", () => {
      background_api.removeBackground();
      memoria_list_api.updateList();
    });

    /* ============================== Main ============================== */

    /* ------------------------------ Export and Import ------------------------------ */

    // export image button.
    export_image_button.addEventListener("click", () => {
      html2canvas(memoria_list_content).then(canvas => {
        Canvas2Image.saveAsImage(canvas, "list");
      });
    });

    // export text button.
    export_text_button.addEventListener("click", () => {
      memoria_list_api.openExportModal();
    });

    // import text button.
    import_text_button.addEventListener("click", () => {
      memoria_list_api.openImportModal();
    });

    /* ------------------------------ Filters ------------------------------ */

    // add new filter.
    add_filter_button.addEventListener("click", () => {
      memoria_list_api.createFilter();
    });

    // apply the filters.
    apply_filter_button.addEventListener("click", () => {
      memoria_list_api.applyFilters();
      memoria_list_api.getStats();
    });

    // reset the filters.
    reset_filter_button.addEventListener("click", () => {
      memoria_list_api.resetFilters();
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
        memoria_list_api.changeZoom(zoom_range.value);
      });
    });

    // zoom range slider.
    ["input", "change", "wheel"].forEach(event => {
      zoom_range.addEventListener(event, (e) => {
        if (event === "wheel") {
          zoom_range.value = parseInt(zoom_range.value) - (e.deltaY / 100) * (e.shiftKey ? 50 : 1);
        }
        zoom_field.value = zoom_range.value;
        memoria_list_api.changeZoom(zoom_range.value);
      });
    });

    /* ------------------------------ Stats ------------------------------ */

    // get more stats button.
    more_stats_button.addEventListener("click", () => {
      memoria_list_api.openStatsModal();
    });

    /* ------------------------------ Memoria Display ------------------------------ */

    // deselect currently selected.
    main.addEventListener("click", (e) => {
      try {
        if (e.target.parentElement.className.indexOf("memoria_display") === -1 && e.target.parentElement.parentElement.className.indexOf("memoria_display") === -1) {
          document.querySelectorAll(".memoria_display:not(.preview)").forEach(child => {
            if (child.classList.contains("selected")) {
              child.classList.remove("selected");
              memoria_api.selectedCharacter = null;
              memoria_api.enableButtons();
            }
          });
        }
      } catch (error) {
        memoria_api.selectedCharacter = null;
        memoria_api.enableButtons();
      }
    });

    /* ------------------------------ Memoria List Content ------------------------------ */

    // resort when memoria list changes.
    memoria_list_content.addEventListener("change", () => {
      memoria_list_api.sortOnFormUpdate();
      memoria_list_api.updateList();
    });
    // resort when memoria list changes.
    memoria_list_content.addEventListener("change", () => {
      // memoria_list_api.sortOnFormUpdate();
      memoria_list_api.updateList();
    });
  }

  const closeMessageModal = () => {
    messageModal.style.display = "none";
    messageModalTitle.innerHTML = "";
    messageModalText.value = "";
    messageModalText.readonly = true;
    messageModalText.scrollTo(0, 0);
  };

  const closeMemoriaSelectModal = () => {
    memoriaSelectModal.style.display = "none";
    memoriaSelectModalSearch.value = "";
    memoriaSelectModalList.scrollTo(0, 0);
  };

  const closeBackgroundSelectModal = () => {
    backgroundSelectModal.style.display = "none";
    backgroundSelectModalSearch.value = "";
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
  memoria_api.startUp();

  // update the background form.
  background_api.startUp();

  // load the settings, profiles, and memoria lists from storage.
  database.onAuthStateChanged(user => {
    if (user) {
      header_username.innerHTML = `Welcome ${user.displayName || "Anonymous"}`;
      storage_api.startUp(user.uid);
    }
    else {
      header_username.innerHTML = "";
      window.location.href = "index.html";
    }
  });
})();