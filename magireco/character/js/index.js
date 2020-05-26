import * as character_api from './character_api.js';
import * as character_list_api from './character_list_api.js';
import * as background_api from './background_api.js';
import * as profile_api from './profile_api.js';
import * as storage_api from './storage_api.js';
import * as database_api from '../../shared/js/database_api.js';
import * as utils from '../../shared/js/utils.js';
import { character_elements as elements, messageDialog, characterSelectDialog, backgroundSelectDialog, importListDialog } from './character_elements.js';

/**
 * Event Handlers for the Character Page.
 */
(function () {
  "use strict";

  window.onload = () => {

    /* ============================== Content ============================== */

    /* ------------------------------ Header Buttons ------------------------------ */

    // sign out button.
    elements.signout_button.addEventListener("click", () => {
      let res = confirm("Are you sure you want to Sign Out?");
      if (res) database_api.signout();
    });

    // contact button.
    elements.contact_button.addEventListener("click", () => {
      messageDialog.open(`Contact / Support`, `For assistance, support, or feedback, please contact Leo Chan on Discord (Leo_Chan#9150) or Reddit (u/Leochan6). More Information and how to use at:\nhttps://github.com/Leochan6/leochan6.github.io/blob/master/magireco/README.md`);
    });

    // theme toggle button.
    elements.theme_button.addEventListener("click", () => {
      let theme = "light"
      if (elements.theme_button.classList.contains("dark")) theme = "dark";
      else if (elements.theme_button.classList.contains("light")) theme = "light";
      storage_api.updateSettings("theme", theme);
    });

    // verify email button
    elements.verify_email_button.addEventListener("click", () => {
      database_api.sendEmailVerification(() => {
        elements.verify_email_success.classList.remove("hidden");
        elements.verify_email_success.innerHTML = "A email verification email has been sent to your email. If you do not see an email, please check the Junk or Spam folder."
      }, (errorMsg) => {
        elements.verify_email_error.classList.remove("hidden");
        elements.verify_email_error.innerHTML = errorMsg;
      });
    });

    elements.verify_email_close.addEventListener("click", () => {
      elements.verify_email.classList.add("hidden");
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
        [messageDialog, characterSelectDialog, backgroundSelectDialog, importListDialog].forEach(dialog => {
          if (event.target == dialog.modal && dialog.isOpen()) dialog.close();
        });
      }
    });

    window.addEventListener("keyup", e => {
      if (e.key === "Escape") {
        [messageDialog, characterSelectDialog, backgroundSelectDialog, importListDialog].forEach(dialog => {
          if (e.target == dialog.modal && dialog.isOpen()) return dialog.close();
        });
        if (character_api.selectedCharacter) {
          character_api.deselectDisplay();
        }
      }
    });

    /* ------------------------------ Message Modal Dialog ------------------------------ */

    // hide message modal dialog
    messageDialog.closeButton.addEventListener("click", () => {
      messageDialog.close();
    });

    // message modal dialog copy button.
    messageDialog.copy.addEventListener("click", () => {
      navigator.clipboard.writeText(messageDialog.text.value);
    });

    /* ------------------------------ Character Select Modal Dialog ------------------------------ */

    // hide character select modal dialog
    characterSelectDialog.closeButton.addEventListener("click", () => {
      characterSelectDialog.close();
    });

    // search change character select modal dialog.
    ["keyup", "change", "search"].forEach(event => {
      characterSelectDialog.search.addEventListener(event, () => {
        character_api.filterCharacters(characterSelectDialog.search.value);
      });
    });

    characterSelectDialog.added.addEventListener("click", () => {
      character_api.toggleAdded(characterSelectDialog.added.checked);
    })

    /* ------------------------------ Background Select Modal Dialog ------------------------------ */

    // hide background select modal dialog
    backgroundSelectDialog.closeButton.addEventListener("click", () => {
      backgroundSelectDialog.close();
    });

    // search change background select modal dialog.
    ["keyup", "change", "search"].forEach(event => {
      backgroundSelectDialog.search.addEventListener(event, () => {
        background_api.filterBackgrounds(backgroundSelectDialog.search.value);
      });
    });

    /* ------------------------------ Import List Modal Dialog ------------------------------ */

    // hide import list modal dialog
    importListDialog.closeButton.addEventListener("click", () => {
      importListDialog.close();
    });

    // import the text as a new list.
    importListDialog.importButton.addEventListener("click", () => {
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
          storage_api.updateSettings(`expanded_tabs/${tab_name}`, false);
        }
        else if (contents.classList.contains("hidden")) {
          contents.classList.remove("hidden");
          toggle.classList.replace("right", "down");
          storage_api.updateSettings(`expanded_tabs/${tab_name}`, true);
        }
      });
    });

    /* ------------------------------ My Character Lists Tab ------------------------------ */

    // show or hide the create new list form, rename list form, and duplicate list form.
    [elements.new_list_button, elements.rename_list_button, elements.duplicate_list_button].forEach(button => {
      button.addEventListener("click", () => {
        let list_form = document.querySelector(`#list_${button.name}`);
        document.querySelectorAll(".list_form").forEach(element => {
          if (element !== list_form) {
            if (element.style.visibility === "visible") element.style.visibility = "collapse";
            if (element.style.display === "block") element.style.display = "none";
          }
        });
        if (list_form.style.display === "none") {
          list_form.style.visibility = "visible";
          list_form.style.display = "block";
          document.querySelector(`#${button.name}_list_name_field`).focus();
        } else {
          list_form.style.visibility = "collapse";
          list_form.style.display = "none";
        }
      });
    })

    // create a new list.
    elements.create_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      let newName = elements.create_list_name_field.value;
      if (character_list_api.checkListName(newName)) character_list_api.createList(newName);
    });

    // rename the selected list.
    elements.rename_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      let newName = elements.rename_list_name_field.value;
      if (character_list_api.checkListName(newName)) character_list_api.renameList(character_list_api.selectedList.listId, newName);
    });

    // duplicate list.
    elements.duplicate_list_create_button.addEventListener("click", (e) => {
      e.preventDefault();
      let newName = elements.duplicate_list_name_field.value;
      if (character_list_api.checkListName(newName)) character_list_api.duplicateList(character_list_api.selectedList.list, newName);
    });

    // delete the selected list.
    elements.delete_list_button.addEventListener("click", () => {
      if (character_list_api.selectedList.listId) {
        let res = confirm(`Are you sure you want to delete the list ${character_list_api.selectedList.list.name}?`);
        if (res) character_list_api.deleteList(character_list_api.selectedList.listId);
      }
    });

    /* ------------------------------ Create Character Tab ------------------------------ */

    // update the available fields on name change and update preview display.
    elements.name_select.addEventListener("change", () => {
      character_api.updateFieldsOnName();
    });

    // update the available fields on rank change and update preview display.
    elements.rank_select.addEventListener("change", () => {
      character_api.updateFieldsOnRank();
    });

    // update the available fields on magia change and update preview display.
    elements.magia_select.addEventListener("change", () => {
      character_api.updateFieldsOnMagia();
    });

    // open character select modal
    elements.characterSelectModalOpen.addEventListener("click", () => {
      characterSelectDialog.open(character_api.loadCharacterSelectList);
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
    elements.create_button.addEventListener("click", () => {
      if (!elements.create_button.disabled) character_api.createCharacter();
    });

    // updates the character display with the form.
    elements.update_button.addEventListener("click", () => {
      if (!elements.create_button.disabled) character_api.updateCharacter();
    });

    // copies the character display to the form.
    elements.copy_button.addEventListener("click", () => {
      if (!elements.create_button.disabled) character_api.copyCharacter();
    });

    // delete the selected character display from list.
    elements.delete_button.addEventListener("click", () => {
      if (!elements.create_button.disabled) character_api.deleteCharacter();
    });

    // mines all the fields.
    elements.min_all_button.addEventListener("click", () => {
      if (!elements.min_all_button.disabled) {
        character_api.minimizeDisplay();
        character_api.updateCharacter();
      }
    });

    // maxes all the fields.
    elements.max_all_button.addEventListener("click", () => {
      if (!elements.max_all_button.disabled) {
        character_api.maximizeDisplay();
        character_api.updateCharacter();
      }
    });

    /* ------------------------------ Sorting Profile Tab ------------------------------ */

    // check set the profile properties on change.
    elements.profile_select.addEventListener("change", () => {
      let profileId = elements.profile_select.value;
      if (profileId === "0" || profileId === "1") elements.delete_profile_button.disabled = true;
      else elements.delete_profile_button.disabled = false;
      profile_api.setProfile(profileId);
      character_list_api.applyProfileToList(character_list_api.getListId(), profileId);
      character_list_api.updateList();
    });

    // show the save new profile form.
    elements.new_profile_button.addEventListener("click", () => {
      if (elements.new_profile_button.classList.contains("add")) {
        elements.new_profile_button.classList.replace("add", "minus");
        elements.profile_create_block.classList.remove("hidden");
        elements.new_profile_field.focus();
      }
      else {
        elements.new_profile_button.classList.replace("minus", "add");
        elements.profile_create_block.classList.add("hidden");
      }
    });

    // check the profile name on change.
    elements.new_profile_field.addEventListener("change", () => {
      profile_api.checkProfile(elements.new_profile_field.value);
    });

    // create a new profile.
    elements.create_profile_button.addEventListener("click", (e) => {
      e.preventDefault();
      profile_api.saveProfile();
    });

    // delete the selected profile.
    elements.delete_profile_button.addEventListener("click", () => {
      let res = confirm(`Are you sure you want to delete the sorting profile ${profile_api.getSelectedProfileName()}?`);
      if (res) profile_api.deleteProfile();
    });

    /* ------------------------------ Display Settings Tab ------------------------------ */

    // change the number of displays per row.
    ["input", "change"].forEach(event => {
      elements.displays_per_row.addEventListener(event, () => {
        let value = elements.displays_per_row.value;
        character_list_api.changeDisplaysPerRow(value);
        if (event === "change") storage_api.updateSettings("displays_per_row", value);
      });
    });

    // change the alignment of the list.
    elements.display_alignment_select.addEventListener("change", () => {
      character_list_api.changeAlignment(elements.display_alignment_select.value);
    });

    ["input", "change"].forEach(event => {
      // change the padding of the list in the x direction.
      elements.display_padding_x_field.addEventListener(event, () => {
        let value = elements.display_padding_x_field.value;
        character_list_api.changePadding("x", value);
        if (event === "change") storage_api.updateSettings("padding_x", value);
      });

      // change the padding of the list in the y direction.
      elements.display_padding_y_field.addEventListener(event, () => {
        let value = elements.display_padding_y_field.value;
        character_list_api.changePadding("y", value);
        if (event === "change") storage_api.updateSettings("padding_y", value);
      });
    });

    /* ------------------------------ Background Tab ------------------------------ */

    // open background select modal dialog
    elements.backgroundSelectModalOpen.addEventListener("click", () => {
      backgroundSelectDialog.open(background_api.loadBackgroundList);
    });

    // set the background.
    elements.background_select.addEventListener("change", () => {
      background_api.setBackground(elements.background_select.value);
      character_list_api.updateList();
    });

    // remove the background.
    elements.remove_background_button.addEventListener("click", () => {
      background_api.removeBackground();
      character_list_api.updateList();
    });

    // transparency field input.
    ["input", "change"].forEach(event => {
      elements.background_transparency_field.addEventListener(event, () => {
        let value = elements.background_transparency_field.value;
        if (value > 500) value = 500;
        else if (value < 1) value = 1;
        if (value !== elements.background_transparency_field.value) elements.background_transparency_field.value = value;
        elements.background_transparency_range.value = elements.background_transparency_field.value;
        background_api.changeTransparency(elements.background_transparency_range.value);
        if (event === "change") storage_api.updateSettings("background_transparency", background_transparency_field.value);
      });
    });

    // transparency range slider.
    ["input", "change", "wheel"].forEach(event => {
      elements.background_transparency_range.addEventListener(event, (e) => {
        if (event === "wheel") {
          elements.background_transparency_range.value = parseInt(elements.background_transparency_range.value) - (e.deltaY / 100) * (e.shiftKey ? 25 : 1);
        }
        elements.background_transparency_field.value = elements.background_transparency_range.value;
        background_api.changeTransparency(elements.background_transparency_range.value);
        if (event === "change") storage_api.updateSettings("background_transparency", background_transparency_range.value);
      });
    });

    /* ------------------------------ Settings Tab ------------------------------ */

    /* ============================== Main ============================== */

    /* ------------------------------ Export and Import ------------------------------ */

    // export image button.
    elements.export_image_button.addEventListener("click", () => {
      let date = new Date();
      let time = `_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`
      let imageName = `${character_list_api.getListName() ? character_list_api.getListName().replace(" ", "_") : "list"}`
      html2canvas(elements.character_list_content, { backgroundColor: null }).then(canvas => {
        let data = canvas.toDataURL("image/png");
        var a = document.createElement('a');
        a.href = data;
        a.download = imageName + time + ".png";
        a.click();
        a.remove();
      });
    });

    elements.export_open_button.addEventListener("click", () => {
      let date = new Date();
      let time = `_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`
      let imageName = `${character_list_api.getListName() ? character_list_api.getListName().replace(" ", "_") : "list"}`
      html2canvas(elements.character_list_content, { backgroundColor: null }).then(canvas => {
        let data = canvas.toDataURL("image/png");
        let w = window.open();
        let image = new Image();
        image.src = data;
        image.name = imageName + time + ".png";
        image.setAttribute("download", imageName + time + ".png")
        w.document.write(image.outerHTML);
      });
    });

    // export text button.
    elements.export_text_button.addEventListener("click", () => {
      character_list_api.openExportModal();
    });

    // import text button.
    elements.import_text_button.addEventListener("click", () => {
      importListDialog.open();
    });

    /* ------------------------------ Filters ------------------------------ */

    // add new filter.
    elements.add_filter_button.addEventListener("click", () => {
      character_list_api.createFilter();
    });

    // apply the filters.
    elements.apply_filter_button.addEventListener("click", () => {
      character_list_api.applyFilters();
      character_list_api.getStats();
    });

    // reset the filters.
    elements.reset_filter_button.addEventListener("click", () => {
      character_list_api.resetFilters();
      character_list_api.getStats();
    });

    elements.toggle_filter_button.addEventListener("click", () => {
      if (elements.toggle_filter_button.classList.contains("add")) {
        elements.toggle_filter_button.classList.replace("add", "minus");
        if (elements.list_filters.classList.contains("hidden")) elements.list_filters.classList.remove("hidden");
      }
      else if (elements.toggle_filter_button.classList.contains("minus")) {
        elements.toggle_filter_button.classList.replace("minus", "add");
        if (!elements.list_filters.classList.contains("hidden")) elements.list_filters.classList.add("hidden");
      }
    });

    /* ------------------------------ Zoom ------------------------------ */

    // zoom field input.
    ["input", "change"].forEach(event => {
      elements.zoom_field.addEventListener(event, () => {
        let value = zoom_field.value;
        if (value > 500) value = 500;
        else if (value < 1) value = 1;
        if (value !== elements.zoom_field.value) elements.zoom_field.value = value;
        elements.zoom_range.value = elements.zoom_field.value;
        character_list_api.changeZoom(elements.zoom_range.value);
        if (event === "change") storage_api.updateSettings("character_zoom", elements.zoom_field.value);
      });
    });

    // zoom range slider.
    ["input", "change", "wheel"].forEach(event => {
      elements.zoom_range.addEventListener(event, (e) => {
        if (event === "wheel") {
          elements.zoom_range.value = parseInt(zoom_range.value) - (e.deltaY / 100) * (e.shiftKey ? 50 : 1);
        }
        elements.zoom_field.value = elements.zoom_range.value;
        character_list_api.changeZoom(elements.zoom_range.value);
        if (event === "change") storage_api.updateSettings("character_zoom", zoom_range.value);
      });
    });

    /* ------------------------------ Stats ------------------------------ */

    // get more stats button.
    elements.more_stats_button.addEventListener("click", () => {
      character_list_api.openStatsModal();
    });

    /* ------------------------------ Character Display ------------------------------ */

    // deselect currently selected.
    elements.character_list_container.addEventListener("click", (e) => {
      if (character_api.selectedCharacter) {
        try {
          if (e.target.parentElement.className.indexOf("character_display") === -1 && e.target.parentElement.parentElement.className.indexOf("character_display") === -1) {
            character_api.deselectDisplay();
          }
        } catch (error) {
          character_api.deselectDisplay();
        }
      }
    });

    /* ------------------------------ Character List Content ------------------------------ */

    // resort when character list changes.
    elements.character_list_content.addEventListener("change", () => {
      character_list_api.applyProfileToList(character_list_api.getListId(), profile_api.getSelectedProfileId());
      character_list_api.updateList();
    });
  };

  /* ------------------------------ Page Start Up ------------------------------ */

  utils.detectColorScheme();

  // update form and preview display on startup.
  character_api.startUp();

  // update the background form.
  background_api.startUp();

  // load the settings, profiles, and character lists from storage.
  database_api.onAuthStateChanged(user => {
    if (user) {
      elements.header_username.innerHTML = `Welcome ${user.displayName || "Anonymous"}`;
      storage_api.startUp(user);
      if (!user.isAnonymous && !user.emailVerified) elements.verify_email.classList.remove("hidden");
    }
    else {
      elements.header_username.innerHTML = "";
      window.location.href = "../";
    }
  });

})();