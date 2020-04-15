let character_api = (() => {

  let module = {};

  module.Display = class Display {
    constructor(id, name, rank, attribute, level, magic, magia, episode) {
      this.id = id;
      this.name = name;
      this.rank = rank;
      this.attribute = attribute;
      this.level = level;
      this.magic = magic;
      this.magia = magia;
      this.episode = episode;
    }
  }

  module.Character = class Character {
    constructor(id, name, attribute, ranks) {
      this.id = id;
      this.name = name;
      this.attribute = attribute;
      this.ranks = ranks;
    }
  }

  /**
   * get the list of names.
   * 
   * @param {Function} callback
   */
  module.getNames = (callback) => {
    let names = collection.map(character => { return { id: character.id, name: character.name } });
    names = [...new Set(names)];
    names = names.sort((a, b) => a.name > b.name ? 1 : -1);
    callback(names);
  };

  /**
   * get the attribute and rank for the character.
   * 
   * @param {String} id 
   * @param {Function} callback 
   */
  const getCharacter = (id, callback) => {
    let character_list = collection.filter(character => character.id === id);
    let name = character_list[0].name
    let attribute = character_list[0].attribute.toLowerCase();
    let rank_list = character_list.map((character) => character.rank);
    let ranks = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
      if (rank_list.indexOf((i + 1).toString(10)) != -1) ranks[i] = true;
    }
    let character = new module.Character(id, name, attribute, ranks);
    callback(character);
  };

  /**
   * gets the basic display for the character.
   * 
   * @param {module.Character} character 
   */
  const getBasicCharacterDisplay = (character) => {
    return new module.Display(character.id, character.name, character.ranks.indexOf(true) + 1, character.attribute, "1", "0", "1", "1");
  };

  /**
   * check if disaply is valid.
   * 
   * @param {String} character_id 
   * @param {module.Display} display 
   * @param {Function} callback 
   */
  const isValidCharacterDisplay = (character_id, display, callback) => {
    getCharacter(character_id, character => {
      let err = [];
      // check id.
      if (display.id !== character.id) err.push(`Display Id ${display.id} does not match Character ID ${character.id}.`);
      // check name.
      if (display.name !== character.name) err.push(`Display Name ${display.name} does not match Character Name ${character.Name}.`);
      // check rank.
      if (!character.ranks[display.rank - 1]) err.push(`Display Rank ${display.rank} does not match Character Ranks ${character.ranks}`)
      // check level.
      if (display.rank == "1" && (display.level < 1 || display.level > 40)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 40.`);
      else if (display.rank == "2" && (display.level < 1 || display.level > 50)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 50.`);
      else if (display.rank == "3" && (display.level < 1 || display.level > 60)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 60.`);
      else if (display.rank == "4" && (display.level < 1 || display.level > 80)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 80.`);
      else if (display.rank == "5" && (display.level < 1 || display.level > 100)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 100.`);
      // check magic.
      if (display.magic < 0 || display.magic > 3) err.push(`Display Magic ${display.magic} must be between 0 and 3.`);
      // check magia.
      if (display.magia < 1 || display.magia > 5) err.push(`Display Magia ${display.magia} must be between 1 and 5.`);
      if (display.magia > display.episode) err.push(`Display Magia ${display.magia} must be less than or equal to Display Episode ${display.episode}.`);
      // check episode.
      if (display.episode < 1 || display.episode > 5) err.push(`Display Episode ${display.episode} must be between 1 and 5.`);
      callback(err);
    });
  };

  /**
   * get Display from the form.
   * 
   * @return {module.Display}
   */
  const getFormDisplay = () => {
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

  /**
   * get Display from character display.
   * 
   * @param {HTMLDivElement} character_display
   * @return {Display}
   */
  module.getCharacterDisplay = (character_display) => {
    let display = new character_api.Display(
      character_display.getAttribute("character_id"),
      character_display.getAttribute("name"),
      character_display.getAttribute("rank"),
      character_display.getAttribute("attribute"),
      character_display.getAttribute("level"),
      character_display.getAttribute("magic"),
      character_display.getAttribute("magia"),
      character_display.getAttribute("episode"));
    return display;
  };

  /**
   * create a character display element from Display.
   * 
   * @param {Display} display
   * @return {HTMLDivElement}
   */
  module.createDisplay = (display, listener) => {
    let character_display = document.createElement("div");
    character_display.classList.add("character_display");
    character_display.setAttribute("character_id", display.id);
    character_display.setAttribute("name", display.name);
    character_display.setAttribute("rank", display.rank);
    character_display.setAttribute("attribute", display.attribute);
    character_display.setAttribute("magic", display.magic);
    character_display.setAttribute("magia", display.magia);
    character_display.setAttribute("episode", display.episode);
    character_display.setAttribute("level", display.level);
    character_display.innerHTML = `
    <img class="background" src="/magireco/assets/ui/bg/${display.attribute}.png">
    <img class="card_image" src="/magireco/assets/image/card_${display.id}${display.rank}_d.png">
    <img class="frame_rank" src="/magireco/assets/ui/frame/${display.rank}.png">
    <img class="star_rank" src="/magireco/assets/ui/star/${display.rank}.png">
    <img class="attribute" src="/magireco/assets/ui/attribute/${display.attribute}.png">
    <img class="magic" src="/magireco/assets/ui/magic/${display.magic}.png">
    <img class="magia" src="/magireco/assets/ui/magia/${display.magia}-${display.episode}.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}</div>
    </div>`;
    if (listener) {
      character_display.addEventListener("click", () => {
        // return of already selected.
        if (character_display.classList.contains("selected")) return;
        // deselect all other character displays
        document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
          if (child.classList.contains("selected")) child.classList.remove("selected");
        });
        character_display.classList.add("selected");
      });
    }
    return character_display;
  }

  /**
   * updates the display preview with Display.
   * 
   * @param {HTMLDivElement} display
   */
  const updatePreviewDisplay = (display) => {
    let character_display = module.createDisplay(display);
    character_display.classList.add("preview");
    display_preview.innerHTML = "";
    display_preview.appendChild(character_display);
  };

  /**
   * updates the form with Display.
   * 
   * @param {Display} display
   */
  const updateForm = (display) => {
    name_select.value = display.id;
    rank_select.value = display.rank;
    attr_select.value = display.attribute;
    level_select.value = display.level;
    magic_select.value = display.magic;
    magia_select.value = display.magia;
    episode_select.value = display.episode;
  };

  /**
   * updates the form with the available options and selects lowest.
   * 
   * @param {Character} character
   */
  const updateFormEnabled = (character) => {
    // enable or disable the attribute select.
    for (let i = 0; i < 6; i++) {
      attr_select.options[i].disabled = attr_select.options[i].value != character.attribute;
    }
    attr_select.value = character.attribute;
    // enable or disable the rank select.
    for (let i = 0; i < 5; i++) {
      rank_select.options[i].disabled = !character.ranks[i];
    }
    // if the currently select rank is disabled, then select minimum available rank.
    if (!character.ranks[rank_select.selectedIndex]) {
      rank_select.selectedIndex = character.ranks.indexOf(true);
    }
  };

  /**
   * gets the standard display given the display.
   * 
   * @param {Character} character 
   * @param {*} display 
   */
  const updateCharacterWithDisplay = (character, display) => {
    // return the default display.
    if (!display) return getBasicCharacterDisplay(character);
    return new module.Display(character.id, character.name, display.rank, character.attribute, display.level, display.magic, display.magia, display.episode);
  }

  /**
   * starts up the list.
   */
  module.startUp = () => {
    getCharacter("1001", character => {
      updateFormEnabled(character);
      updatePreviewDisplay(getBasicCharacterDisplay(character));
    });
  };

  /**
   * updates the form fields with the selected character.
   */
  module.updateFieldsOnName = () => {
    getCharacter(name_select.value, character => {
      updateFormEnabled(character);
      character_preview = updateCharacterWithDisplay(character, getFormDisplay());
      updateForm(character_preview);
      updatePreviewDisplay(character_preview);
    });
  };

  /**
   * adds a new character display to the list.
   */
  module.createAddDisplay = () => {
    let display = getFormDisplay();
    let character_display = createDisplay(display, true);
    character_list_content.appendChild(character_display);
    character_list_content.dispatchEvent(new Event("change"));
  };

  /**
   * updates the selected character display with the contents of the form.
   */
  module.updateSelectedDisplay = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    character_display.remove()

    let display = getFormDisplay();
    character_display = createDisplay(display, true);
    character_list_content.appendChild(character_display);
    character_list_content.dispatchEvent(new Event("change"));
  };

  /**
   * copies the contents of the selected display to the form.
   */
  module.copyDisplay = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = getCharacterDisplay(character_display);
    getCharacter(character_display.getAttribute("character_id"), character => updateFormEnabled(character));
    updateForm(display);
    updatePreviewDisplay(display);
  };

  /**
   * updates the preview character display with the contents of the form.
   */
  module.updatePreviewOnForm = () => {
    let display = getFormDisplay();
    character_error_text.innerHTML = '';
    isValidCharacterDisplay(name_select.value, display, error => {
      if (error.length == 0) {
        create_button.disabled = false;
        updatePreviewDisplay(display);
      } else {
        create_button.disabled = true;
        character_error_text.innerHTML = error.toString();
        console.log(error);
      }
    });
  };

  return module;
})();