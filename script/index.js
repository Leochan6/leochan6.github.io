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

  const display_preview = document.querySelector("#display_preview");

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

  const updateDisplay = (display) => {
    console.log("update display", display);
    display_preview.innerHTML = `
    <div class="character_display" character_id="${display.id}" character_name="${display.name}">
      <img class="background" src="assets/magireco/ui/bg/${display.attr}.png">
      <img class="card_image" src="assets/magireco/card/image/card_${display.id}${display.rank}_d.png">
      <img class="frame_rank" src="assets/magireco/ui/frame/${display.rank}.png">
      <img class="star_rank" src="assets/magireco/ui/star/${display.rank}.png">
      <img class="att" src="assets/magireco/ui/attr/${display.attr}.png">
      <img class="magic" src="assets/magireco/ui/magic/${display.magic}.png">
      <img class="magia" src="assets/magireco/ui/magia/${display.magia}-${display.episode}.png">
      <div class="level">${display.level}</div>
    </div>`
  };

  const updateForm = (display) => {
    console.log("update form", display);
    name_select.value = display.id;
    rank_select.value = display.rank;
    attr_select.value = display.attr;
    level_select.value = display.level;
    magic_select.value = display.magic;
    magia_select.value = display.magia;
    episode_select.value = display.episode;
  };

  const updateFormEnabled = (character) => {
    console.log("disabling", character);
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
    // update attribute and rank fields on name change.
    name_select.addEventListener("change", () => {
      character_api.getCharacter(name_select.value, character => {
        updateFormEnabled(character);
        character_preview = character_api.updateDisplay(character, getDisplay());
        updateForm(character_preview);
        updateDisplay(character_preview);
      });
    });

    document.querySelectorAll(".form").forEach(element => {
      element.addEventListener("change", () => {
        character_api.getCharacter(name_select.value, character => {
          let display = getDisplay();
          let err = character_api.isValidCharacterDisplay(display, character);
          if (err.length == 0) {
            updateDisplay(display);
          }
          else {
            console.log(err);
          }
        });
      });
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

  character_api.onDisplayUpdate((character, display) => {
    updateFormEnabled(character);
    // updateForm(display);
    updateDisplay(display);
  });

  


















}());