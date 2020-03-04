(function () {
  "use strict";

  // const collection = {ids: [1001, 1002, 1003]};

  const name_select = document.querySelector("#name_select");
  const rank_select = document.querySelector("#rank_select");
  const attr_select = document.querySelector("#attr_select");
  const level_select = document.querySelector("#level_select");
  const magic_select = document.querySelector("#magic_select");
  const magia_select = document.querySelector("#magia_select");
  const episode_select = document.querySelector("#episode_select");

  const error_text = document.querySelector("#error_text");
  const display_preview = document.querySelector("#display_preview");
  const create_button = document.querySelector("#create_button");
  const update_button = document.querySelector("#update_button");
  const clear_button = document.querySelector("#clear_button");
  
  const character_list = document.querySelector("#character_list");

  // get the display from the form.
  const getDisplay = () => {
    let display = new character_api.Display(
      name_select.value,
      name_select[name_select.options.selectedIndex].text,
      rank_select.value,
      attr_select.value,
      level_select.value,
      magic_select.value,
      magia_select.value,
      episode_select.value);
    character_preview = display;
    return display;
  };

  // create a character display element.
  const createDisplay = (display) => {
    let character_display = document.createElement("div");
    character_display.classList.add("character_display");
    character_display.setAttribute("character_id", display.id);
    character_display.setAttribute("character_name", display.name);
    character_display.innerHTML = `
    <img class="background" src="assets/magireco/ui/bg/${display.attr}.png">
    <img class="card_image" src="assets/magireco/card/image/card_${display.id}${display.rank}_d.png">
    <img class="frame_rank" src="assets/magireco/ui/frame/${display.rank}.png">
    <img class="star_rank" src="assets/magireco/ui/star/${display.rank}.png">
    <img class="att" src="assets/magireco/ui/attr/${display.attr}.png">
    <img class="magic" src="assets/magireco/ui/magic/${display.magic}.png">
    <img class="magia" src="assets/magireco/ui/magia/${display.magia}-${display.episode}.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}</div>
    </div>`;
    return character_display;

  }

  // updates the display preview.
  const updatePreviewDisplay = (display) => {
    let character_display = createDisplay(display);
    display_preview.innerHTML = "";
    display_preview.appendChild(character_display);
  };

  // updates the form.
  const updateForm = (display) => {
    name_select.value = display.id;
    rank_select.value = display.rank;
    attr_select.value = display.attr;
    level_select.value = display.level;
    magic_select.value = display.magic;
    magia_select.value = display.magia;
    episode_select.value = display.episode;
  };

  // updates the form with the available options and selects lowest.
  const updateFormEnabled = (character) => {
    // enable or disable the attribute select.
    for (let i = 0; i < 6; i++) {
      attr_select.options[i].disabled = attr_select.options[i].value != character.attr;
    }
    attr_select.value = character.attr;
    // enable or disable the rank select.
    for (let i = 0; i < 5; i++) {
      rank_select.options[i].disabled = !character.ranks[i];
    }
    // if the currently select rank is disabled, then select minimum available rank.
    if (!character.ranks[rank_select.selectedIndex]) {
      rank_select.selectedIndex = character.ranks.indexOf(true);
    }
  };

  let character_preview = null;

  window.onload = () => {
    // update the available fields on name change and update preview display.
    name_select.addEventListener("change", () => {
      character_api.getCharacter(name_select.value, character => {
        updateFormEnabled(character);
        character_preview = character_api.updateDisplay(character, getDisplay());
        updateForm(character_preview);
        updatePreviewDisplay(character_preview);
      });
    });

    // update the preview display on form change.
    document.querySelectorAll(".form").forEach(element => {
      element.addEventListener("change", () => {
        let display = getDisplay();
        error_text.innerHTML = '';
        character_api.isValidCharacterDisplay(name_select.value, display, error => {
          if (error.length == 0) {
            create_button.disabled = false;
            updatePreviewDisplay(display);
          }
          else {
            create_button.disabled = true;
            error_text.innerHTML = error.toString();
            console.log(error);
          }
        });
      });
    });

    // add new character display to list.
    create_button.addEventListener("click", () => {
      let display = getDisplay();
      let character_display = createDisplay(display);
      character_display.addEventListener("click", () => {
        Array.from(character_list.children).forEach(child => {
          if (child.classList.contains("selected")) child.classList.remove("selected");
        })
        if (character_display.classList.contains("selected")) character_display.classList.remove("selected");
        else character_display.classList.add("selected");
      });
      character_list.appendChild(character_display);
    });

    // remove all chacter displays from list.
    clear_button.addEventListener("click", () => {
      character_list.innerHTML = "";
    });
  };

  // initilize name field.
  character_api.getNames((collection) => {
    let id_select = document.querySelector("#id_select");
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
  character_api.onDisplayUpdate((character, display) => {
    updateFormEnabled(character);
    updatePreviewDisplay(display);
  });

  character_api.onErrorUpdate(error => {
    error_text.innerHTML = error.toString();
  });

  


















}());