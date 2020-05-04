let character_api = (() => {

  let module = {};

  module.selectedCharacter = null;

  module.Display = class Display {
    constructor(id, name, rank, attribute, level, magic, magia, episode, doppel) {
      if (typeof rank !== undefined) {
        this.character_id = id;
        this.name = name;
        this.rank = rank;
        this.attribute = attribute;
        this.level = level;
        this.magic = magic;
        this.magia = magia;
        this.episode = episode;
        this.doppel = doppel;
      } else {
        this._id = id;
        this.character_id = name.character_id;
        this.name = name.name;
        this.rank = name.rank;
        this.attribute = name.attribute;
        this.level = name.level;
        this.magic = name.magic;
        this.magia = name.magia;
        this.episode = name.episode;
        this.doppel = name.doppel;
      }
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

  /**
   * get the attribute and rank for the character.
   * 
   * @param {String} id 
   * @param {Function} callback 
   */
  const getCharacter = (id) => {
    try {
      let character = character_collection.find(character => character.id === id);
      let name = character.name;
      let attribute = character.attribute.toLowerCase();
      let ranks = character.ranks;
      return new module.Character(id, name, attribute, ranks);
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
    return new module.Display(character.id, character.name, module.getMinRank(character.ranks), character.attribute, "1", "0", "1", "1", "locked");
  };

  /**
   * check if disaply is valid.
   * 
   * @param {String} character_id 
   * @param {module.Display} display 
   * @param {boolean} validName 
   */
  module.isValidCharacterDisplay = (character_id, display, validName = true) => {
    let character = getCharacter(character_id);
    if (!character) return ["Cannot get character."]
    let err = [];
    // check id.
    if (display.character_id !== character.id) err.push(`Display Id ${display.character_id} does not match Character ID ${character.id}.`);
    // check name.
    if (display.name !== character.name && validName) err.push(`Display Name ${display.name} does not match Character Name ${character.name}.`);
    // check rank.
    if (!character.ranks[display.rank]) err.push(`Display Rank ${display.rank} does not match Character Ranks ${JSON.stringify(character.ranks)}`);
    // check level.
    let maxLevel = parseInt(module.getMaxLevel(display.rank));
    if (parseInt(display.level) < 1 || parseInt(display.level) > maxLevel) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and ${maxLevel}.`);
    // check magic.
    if (display.magic < 0 || display.magic > 3) err.push(`Display Magic ${display.magic} must be between 0 and 3.`);
    // check magia.
    if (display.magia < 1 || display.magia > 5) err.push(`Display Magia ${display.magia} must be between 1 and 5.`);
    if (display.magia > display.episode) err.push(`Display Magia ${display.magia} must be less than or equal to Display Episode ${display.episode}.`);
    // check episode.
    if (display.episode < 1 || display.episode > 5) err.push(`Display Episode ${display.episode} must be between 1 and 5.`);
    if (!(display.doppel === "locked" || display.doppel === "unlocked") || (display.doppel === "unlocked" && display.magia < 5)) err.push(`Display Doppel ${display.doppel} can only be unlocked if Magia 5.`);
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
      episode_select.value,
      doppel_select.value);
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
      character_display.getAttribute("episode"),
      character_display.getAttribute("doppel"));
    display._id = character_display.getAttribute("_id");
    return display;
  };

  /**
   * create a character display element from Display.
   * 
   * @param {Display} display
   * @return {HTMLDivElement}
   */
  module.createDisplay = (display, listener = false) => {
    let character_display = document.createElement("div");
    character_display.classList.add("character_display");
    character_display.setAttribute("_id", display._id);
    character_display.setAttribute("character_id", display.character_id || display.id);
    character_display.setAttribute("name", display.name);
    character_display.setAttribute("rank", display.rank);
    character_display.setAttribute("attribute", display.attribute);
    character_display.setAttribute("magic", display.magic);
    character_display.setAttribute("magia", display.magia);
    character_display.setAttribute("episode", display.episode);
    character_display.setAttribute("level", display.level);
    character_display.setAttribute("doppel", display.doppel);
    character_display.innerHTML = `
    <img class="background" src="/magireco/assets/ui/bg/${display.attribute}.png">
    <img class="card_image" src="/magireco/assets/image/card_${display.character_id}${display.rank}_f.png">
    <img class="frame_rank" src="/magireco/assets/ui/frame/${display.rank}.png">
    <img class="star_rank" src="/magireco/assets/ui/star/${display.rank}.png">
    <img class="attribute" src="/magireco/assets/ui/attribute/${display.attribute}.png">
    <img class="magic" src="/magireco/assets/ui/magic/${display.magic}.png">
    <img class="magia" src="/magireco/assets/ui/magia/${display.magia}-${display.episode}.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}</div>
    </div>
    <img class="doppel" src="/magireco/assets/ui/doppel/${display.doppel}.png">`;

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
    character_display.addEventListener("contextmenu", e => {
      e.preventDefault();
      module.openCharacterDialog(character_collection.find(elem => elem.id === display.character_id));
    });
    return character_display;
  };

  module.getMaxLevel = (rank) => {
    if (rank == "1") return "40";
    else if (rank == "2") return "50";
    else if (rank == "3") return "60";
    else if (rank == "4") return "80";
    else if (rank == "5") return "100";
  };

  const RANK_TO_LEVEL = { "1": "40", "2": "50", "3": "60", "4": "80", "5": "100" };

  module.getMinRank = (ranks) => {
    let minRank = "5";
    Object.entries(ranks).reverse().forEach(([rank, value]) => minRank = value ? rank : minRank);
    return minRank;
  };

  module.getMaxRank = (ranks) => {
    let maxRank = "1";
    Object.entries(ranks).forEach(([rank, value]) => maxRank = value ? rank : maxRank);
    return maxRank;
  };

  module.minimizeDisplay = () => {
    let character_display = module.getCharacterDisplay(display_preview.children[0]);
    let character = character_collection.find(char => char.id === character_display.character_id);
    let minRank = module.getMinRank(character.ranks);
    let attribute = character.attribute.toLowerCase();
    let display = new module.Display(character.id, character.name, minRank, attribute, "1", "0", "1", "1", "locked");
    updateForm(display);
    updatePreviewDisplay(display);
  };

  module.maximizeDisplay = () => {
    let character_display = module.getCharacterDisplay(display_preview.children[0]);
    let character = character_collection.find(char => char.id === character_display.character_id);
    let maxRank = module.getMaxRank(character.ranks);
    let level = RANK_TO_LEVEL[maxRank];
    let attribute = character.attribute.toLowerCase();
    let display = new module.Display(character.id, character.name, maxRank, attribute, level, "3", "5", "5", maxRank == "5" ? "unlocked" : "locked");
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
    name_select.value = display.character_id;
    rank_select.value = display.rank;
    attr_select.value = display.attribute;
    level_select.value = display.level;
    magic_select.value = display.magic;
    magia_select.value = display.magia;
    episode_select.value = display.episode;
    doppel_select.value = display.doppel;
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
      rank_select.options[i].disabled = !character.ranks[i + 1];
    }
    // if the currently select rank is disabled, then select minimum available rank.
    if (!character.ranks[rank_select.selectedIndex + 1]) {
      rank_select.selectedIndex = module.getMinRank(character.ranks) - 1;
      // update the level to match max rank.
      level_select.value = RANK_TO_LEVEL[rank_select.value]
    }
    // enable or disable the doppel select.
    if (module.getMaxRank(character.ranks) == "5") {
      doppel_select.options[0].disabled = false;
      doppel_select.options[1].disabled = false;
      doppel_select.value = "locked";
    } else {
      doppel_select.options[0].disabled = false;
      doppel_select.options[1].disabled = true;
    }
  };

  /**
   * gets the standard display given the display.
   * 
   * @param {module.Character} character 
   * @param {module.Display} display 
   */
  const updateCharacterWithDisplay = (character, display) => {
    // return the default display.
    if (!display) return getBasicCharacterDisplay(character);
    return new module.Display(character.id, character.name, display.rank, character.attribute, display.level, display.magic, display.magia, display.episode, display.doppel);
  };

  /**
   * starts up the list.
   */
  module.startUp = () => {
    // initilize name field.
    [...character_collection].sort((a, b) => a.name > b.name ? 1 : -1).forEach((character) => {
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
   * updates the form fields with the selected character's rank.
   */
  module.updateFieldsOnRank = () => {
    let character = getCharacter(name_select.value);
    let form_display = getFormDisplay();
    let maxLevel = RANK_TO_LEVEL[form_display.rank];
    if (parseInt(form_display.level) > parseInt(maxLevel)) form_display.level = maxLevel;
    character_preview = updateCharacterWithDisplay(character, form_display);
    updateForm(character_preview);
    updatePreviewDisplay(character_preview);
  };

  /**
   * updates the form fields with the selected character's magia.
   */
  module.updateFieldsOnMagia = () => {
    let character = getCharacter(name_select.value);
    let form_display = getFormDisplay();
    if (form_display.magia > form_display.episode) form_display.episode = form_display.magia;
    character_preview = updateCharacterWithDisplay(character, form_display);
    updateForm(character_preview);
    updatePreviewDisplay(character_preview);
  };

  /**
   * adds a new character display to the list.
   */
  module.createCharacter = () => {
    let display = getFormDisplay();
    storage_api.addCharacterToList(character_list_api.getListId(), display);
  };

  /**
   * updates the selected character display with the contents of the form.
   */
  module.updateCharacter = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = getFormDisplay();
    module.selectedCharacter = { characterDisplayId: character_display.getAttribute("_id"), character_display: display };
    storage_api.updateCharacterOfList(character_list_api.getListId(), character_display.getAttribute("_id"), display);
  };

  /**
   * copies the contents of the selected display to the form.
   */
  module.copyCharacter = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = module.getCharacterDisplay(character_display);
    getCharacter(character_display.getAttribute("character_id"), character => updateFormEnabled(character));
    updateFormEnabled(getCharacter(display.character_id));
    updateForm(display);
    updatePreviewDisplay(display);
  };

  /**
   * deletes the selected character display.
   */
  module.deleteCharacter = () => {
    let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = module.getCharacterDisplay(character_display);
    character_api.selectedCharacter = null;
    storage_api.deleteCharacterOfList(character_list_api.getListId(), display._id);
  };

  /**
   * updates the preview character display with the contents of the form.
   */
  module.updatePreviewOnForm = () => {
    let display = getFormDisplay();
    character_error_text.innerHTML = '';
    let error = module.isValidCharacterDisplay(name_select.value, display);
    if (error.length == 0) {
      module.enableButtons();
      updatePreviewDisplay(display);
    } else {
      create_button.disabled = true;
      update_button.disabled = true;
      character_error_text.innerHTML = error.toString();
    }
  };

  /**
   * Enable and Disable the Character Buttons based on the current state.
   */
  module.enableButtons = () => {
    if (character_list_api.selectedList && character_list_api.selectedList.listId) {
      if (create_button.disabled) create_button.disabled = false;
      if (min_all_button.disabled) min_all_button.disabled = false;
      if (max_all_button.disabled) max_all_button.disabled = false;
      if (module.selectedCharacter && module.selectedCharacter.character_display_element) {
        if (update_button.disabled) update_button.disabled = false;
        if (copy_button.disabled) copy_button.disabled = false;
        if (delete_button.disabled) delete_button.disabled = false;
      } else {
        if (!update_button.disabled) update_button.disabled = true;
        if (!copy_button.disabled) copy_button.disabled = true;
        if (!delete_button.disabled) delete_button.disabled = true;
      }
    } else {
      if (!create_button.disabled) create_button.disabled = true;
      if (!update_button.disabled) update_button.disabled = true;
      if (!copy_button.disabled) copy_button.disabled = true;
      if (!delete_button.disabled) delete_button.disabled = true;
      if (!min_all_button.disabled) min_all_button.disabled = true;
      if (!max_all_button.disabled) max_all_button.disabled = true;
    }
  };

  /**
   * opens the modal dialog for character selection user interface.
   */
  module.openCharacterSelect = () => {
    characterSelectModal.style.display = "block";
    characterSelectModalList.innerHTML = "";
    characterSelectModalSearch.focus();
    character_collection.forEach(character => {
      let star = 1;
      for (let [key, value] of Object.entries(character.ranks)) {
        if (value) {
          star = key;
          break;
        }
      }
      let container = document.createElement("div");
      container.classList.add("chararacter_image_preview");
      container.setAttribute("character_id", character.id);
      let image = document.createElement("img");
      image.src = `/magireco/assets/image/card_${character.id}${star}_f.png`;
      image.title = character.name;
      container.append(image);
      container.addEventListener("click", () => {
        name_select.value = character.id;
        name_select.dispatchEvent(new Event("change"));
        characterSelectModal.style.display = "none";
        characterSelectModalSearch.value = "";
      });
      container.addEventListener("contextmenu", e => {
        e.preventDefault();
        module.openCharacterDialog(character);
      });
      characterSelectModalList.append(container);
    });
  };

  /**
   * Filters the chararacter_image_preview's based on the search.
   * 
   * @param {String} search
   */
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
      let character = character_collection.find(char => child.getAttribute("character_id") === char.id);
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

  module.openCharacterDialog = (character) => {
    messageModal.style.display = "block";
    messageModalText.value = `Attribute: ${character.attribute}\
      \nRanks: ${Object.keys(character.ranks).filter(key => character.ranks[key])}\
      \nObtainability: ${character.obtainability}\
      \nFandom Wiki Link:\n${character.url}`
    messageModalTitle.innerHTML = `${character.name} `;
    messageModalList.innerHTML = "";
  };

  return module;
})();