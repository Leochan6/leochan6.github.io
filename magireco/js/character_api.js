let character_api = (() => {

  let module = {};

  module.selectedCharacter = null;

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
  };

  module.Character = class Character {
    constructor(id, name, attribute, ranks) {
      this.id = id;
      this.name = name;
      this.attribute = attribute;
      this.ranks = ranks;
    }
  };

  // get the collection.
  module.collection = [];
  var curr_id = "1001";
  var curr_char = [];
  collection.forEach((next) => {
    if (next.id == curr_id) {
      curr_char.push(next);
    }
    else {
      module.collection.push(curr_char);
      curr_char = [next];
      curr_id = next.id;
    }
    console.log();
  });
  if (curr_char.length > 0) module.collection.push(curr_char);

  // get the characters.
  module.characters = module.collection.map((char) => {
    return {
      id: char[0].id,
      name: char[0].name,
      attribute: char[0].attribute,
      ranks: {
        "1": char.filter(e => e.rank == "1").length > 0,
        "2": char.filter(e => e.rank == "2").length > 0,
        "3": char.filter(e => e.rank == "3").length > 0,
        "4": char.filter(e => e.rank == "4").length > 0,
        "5": char.filter(e => e.rank == "5").length > 0,
      },
      obtainability: char[0].obtainability
    };
  });

  /**
   * get the list of names.
   * 
   * @param {Function} callback
   */
  module.getNames = () => {
    let names = collection.map(character => {
      return { id: character.id, name: character.name };
    });
    names = [...new Set(names)];
    names = names.sort((a, b) => a.name > b.name ? 1 : -1);
    return names;
  };

  /**
   * get the attribute and rank for the character.
   * 
   * @param {String} id 
   * @param {Function} callback 
   */
  const getCharacter = (id) => {
    try {
      let character_list = collection.filter(character => character.id === id);
      let name = character_list[0].name;
      let attribute = character_list[0].attribute.toLowerCase();
      let rank_list = character_list.map((character) => character.rank);
      let ranks = Array(5).fill(false);
      for (let i = 0; i < 5; i++) {
        if (rank_list.indexOf((i + 1).toString(10)) != -1) ranks[i] = true;
      }
      let character = new module.Character(id, name, attribute, ranks);
      return character;
    } catch (e) {
      return null;
    }
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
  module.isValidCharacterDisplay = (character_id, display, validName = true) => {
    let character = getCharacter(character_id);
    if (!character) return ["Cannot get character."]
    let err = [];
    // check id.
    if (display.id !== character.id) err.push(`Display Id ${display.id} does not match Character ID ${character.id}.`);
    // check name.
    if (display.name !== character.name && validName) err.push(`Display Name ${display.name} does not match Character Name ${character.name}.`);
    // check rank.
    if (!character.ranks[display.rank - 1]) err.push(`Display Rank ${display.rank} does not match Character Ranks ${character.ranks}`);
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
    if (err.length > 0) console.log(character, display);
    return err;
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
   * @return {module.Display}
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
        module.selectedCharacter = { character_display_element: character_display, character_display: display };
        module.enableButtons();
      });
    }
    return character_display;
  };

  const RANK_TO_LEVEL = { "1": "40", "2": "50", "3": "60", "4": "80", "5": "100" };

  module.minimizeDisplay = () => {
    let character_display = module.getCharacterDisplay(display_preview.children[0]);
    let character = module.characters.find(char => char.id === character_display.id);
    let minRank = "5";
    Object.entries(character.ranks).reverse().forEach(([rank, value]) => minRank = value ? rank : minRank);
    let attribute = character.attribute.toLowerCase();
    let display = new module.Display(character.id, character.name, minRank, attribute, "1", "0", "1", "1");
    updateForm(display);
    updatePreviewDisplay(display);
  };

  module.maximizeDisplay = () => {
    let character_display = module.getCharacterDisplay(display_preview.children[0]);
    let character = module.characters.find(char => char.id === character_display.id);
    let maxRank = "1";
    Object.entries(character.ranks).forEach(([rank, value]) => maxRank = value ? rank : maxRank);
    let level = RANK_TO_LEVEL[maxRank];
    let attribute = character.attribute.toLowerCase();
    let display = new module.Display(character.id, character.name, maxRank, attribute, level, "3", "5", "5");
    updateForm(display);
    updatePreviewDisplay(display);
  };

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
      // update the level to match max rank.
      level_select.value = RANK_TO_LEVEL[rank_select.value]
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
  };

  /**
   * starts up the list.
   */
  module.startUp = () => {
    // initilize name field.
    let names = module.getNames();
    let prev_id = null;
    let characters = [];
    names.forEach((character) => {
      if (character.id !== prev_id) {
        characters.push(character);
        prev_id = character.id;
      }
    });
    characters.forEach((character) => {
      name_select.options.add(new Option(character.name, character.id, false));
    });
    // name_select.selectedIndex = 0;
    name_select.value = 1001;
    name_select.dispatchEvent(new Event("change"));

    let character = getCharacter("1001");
    updateFormEnabled(character);
    updatePreviewDisplay(getBasicCharacterDisplay(character));
  };

  /**
   * updates the form fields with the selected character.
   */
  module.updateFieldsOnName = () => {
    let character = getCharacter(name_select.value);
    updateFormEnabled(character);
    character_preview = updateCharacterWithDisplay(character, getFormDisplay());
    updateForm(character_preview);
    updatePreviewDisplay(character_preview);
  };

  /**
   * adds a new character display to the list.
   */
  module.createAddDisplay = () => {
    let display = getFormDisplay();
    let character_display = module.createDisplay(display, true);
    character_list_content.appendChild(character_display);
    character_list_content.dispatchEvent(new Event("change"));
  };

  /**
   * updates the selected character display with the contents of the form.
   */
  module.updateSelectedDisplay = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    character_display.remove();

    let display = getFormDisplay();
    character_display = module.createDisplay(display, true);
    character_list_content.appendChild(character_display);
    character_list_content.dispatchEvent(new Event("change"));
  };

  /**
   * copies the contents of the selected display to the form.
   */
  module.copyDisplay = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = module.getCharacterDisplay(character_display);
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
    let error = module.isValidCharacterDisplay(name_select.value, display);
    if (error.length == 0) {
      create_button.disabled = false;
      updatePreviewDisplay(display);
    } else {
      create_button.disabled = true;
      character_error_text.innerHTML = error.toString();
      console.log(error);
    }
  };

  /**
   * Enable and Disable the Character Buttons based on the current state.
   */
  module.enableButtons = () => {
    if (character_list_api.selectedList && character_list_api.selectedList.listId) {
      if (create_button.classList.contains("btnDisabled")) {
        create_button.classList.replace("btnDisabled", "btnGray");
        create_button.disabled = false;
      }
      if (min_all_button.classList.contains("btnDisabled")) {
        min_all_button.classList.replace("btnDisabled", "btnGray");
        min_all_button.disabled = false;
      }
      if (max_all_button.classList.contains("btnDisabled")) {
        max_all_button.classList.replace("btnDisabled", "btnGray");
        max_all_button.disabled = false;
      }
      if (module.selectedCharacter && module.selectedCharacter.character_display_element) {
        if (update_button.classList.contains("btnDisabled")) {
          update_button.classList.replace("btnDisabled", "btnGray");
          update_button.disabled = false;
        }
        if (copy_button.classList.contains("btnDisabled")) {
          copy_button.classList.replace("btnDisabled", "btnGray");
          copy_button.disabled = false;
        }
        if (delete_button.classList.contains("btnDisabled")) {
          delete_button.classList.replace("btnDisabled", "btnGray");
          delete_button.disabled = false;
        }
      } else {
        if (update_button.classList.contains("btnGray")) {
          update_button.classList.replace("btnGray", "btnDisabled");
          update_button.disabled = false;
        }
        if (copy_button.classList.contains("btnGray")) {
          copy_button.classList.replace("btnGray", "btnDisabled");
          copy_button.disabled = false;
        }
        if (delete_button.classList.contains("btnGray")) {
          delete_button.classList.replace("btnGray", "btnDisabled");
          delete_button.disabled = false;
        }
      }
    } else {
      if (create_button.classList.contains("btnGray")) {
        create_button.classList.replace("btnGray", "btnDisabled");
        create_button.disabled = true;
      }
      if (update_button.classList.contains("btnGray")) {
        update_button.classList.replace("btnGray", "btnDisabled");
        update_button.disabled = true;
      }
      if (copy_button.classList.contains("btnGray")) {
        copy_button.classList.replace("btnGray", "btnDisabled");
        copy_button.disabled = true;
      }
      if (delete_button.classList.contains("btnGray")) {
        delete_button.classList.replace("btnGray", "btnDisabled");
        delete_button.disabled = true;
      }
      if (min_all_button.classList.contains("btnGray")) {
        min_all_button.classList.replace("btnGray", "btnDisabled");
        min_all_button.disabled = true;
      }
      if (max_all_button.classList.contains("btnGray")) {
        max_all_button.classList.replace("btnGray", "btnDisabled");
        max_all_button.disabled = true;
      }
    }
  };

  /**
   * opens the modal dialog for character selection user interface.
   */
  module.openCharacterSelect = () => {
    characterSelectModal.style.display = "block";
    characterSelectModalList.innerHTML = "";
    characterSelectModalSearch.focus();
    module.characters.forEach(character => {
      let star = 1;
      for (let [key, value] of Object.entries(character.ranks)) {
        if (value) {
          star = key;
          break;
        }
      }
      let container = document.createElement("div");
      container.classList.add("chararacter_image_preview");
      container.setAttribute("id", character.id);
      let image = document.createElement("img");
      image.src = `/magireco/assets/image/card_${character.id}${star}_d.png`;
      image.title = character.name;
      container.append(image);
      container.addEventListener("click", () => {
        name_select.value = character.id;
        name_select.dispatchEvent(new Event("change"));
        characterSelectModal.style.display = "none";
        characterSelectModalSearch.value = "";
      });
      characterSelectModalList.append(container);
    });
  };

  module.filterCharacters = (search) => {
    if (!search || search.length == 0) {
      Array.from(characterSelectModalList.children).forEach(child => {
        if (child.classList.contains("hidden")) {
          child.classList.remove("hidden");
          child.style.display = "inline-block";
        }
      });
    }
    search = search.toLowerCase();
    Array.from(characterSelectModalList.children).forEach(child => {
      let character = module.characters.find(char => child.getAttribute("id") === char.id);
      if (character.id.includes(search)
        || character.name.toLowerCase().includes(search)
        || character.attribute.toLowerCase().includes(search)
        || Object.entries(character.ranks).some(([rank, value]) => value && rank.includes(search))
      ) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      } else {
        child.classList.add("hidden");
        child.style.display = "none";
      }
    });
  };

  return module;
})();