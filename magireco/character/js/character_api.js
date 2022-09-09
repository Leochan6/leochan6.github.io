import { character_collection } from '../../collection/character_collection.js';
import { character_elements as elements, characterSelectDialog, messageDialog } from './character_elements.js';
import * as character_list_api from './character_list_api.js';
import * as storage_api from './storage_api.js';

export let selectedCharacter = null;

export class Display {
  constructor(id, name, rank, post_awaken, attribute, level, magic, magia, episode, doppel, se) {
    if (typeof rank !== undefined) {
      this.character_id = id;
      this.name = name;
      this.rank = rank;
      this.post_awaken = post_awaken;
      this.attribute = attribute;
      this.level = level;
      this.magic = magic;
      this.magia = magia;
      this.episode = episode;
      this.doppel = doppel;
      this.se = se;
    } else {
      this._id = id;
      this.character_id = name.character_id;
      this.name = name.name;
      this.rank = name.rank;
      this.post_awaken = name.post_awaken;
      this.attribute = name.attribute;
      this.level = name.level;
      this.magic = name.magic;
      this.magia = name.magia;
      this.episode = name.episode;
      this.doppel = name.doppel;
      this.se = name.se;
    }
  }
};

export class Character {
  constructor(id, name, attribute, ranks) {
    this.id = id;
    this.name = name;
    this.attribute = attribute;
    this.ranks = ranks;
  }
};

/**
 * starts up the list.
 */
export const startUp = () => {
  // initialize name field.
  [...character_collection].sort((a, b) => a.name > b.name ? 1 : -1).forEach((character) => {
    elements.name_select.options.add(new Option(character.name, character.id, false));
  });
  elements.name_select.value = 1001;
  elements.name_select.dispatchEvent(new Event("change"));

  let character = getCharacter("1001");
  updateFormEnabled(character);
  updatePreviewDisplay(getBasicCharacterDisplay(character));
};

/**
 * get the attribute and rank for the character.
 * 
 * @param {String} id 
 */
export const getCharacter = (id) => {
  try {
    let character = character_collection.find(character => character.id === id);
    let name = character.name;
    let attribute = character.attribute.toLowerCase();
    let ranks = character.ranks;
    return new Character(id, name, attribute, ranks);
  } catch (e) {
    return null;
  }
};

/**
 * removes the extra properties of the character.
 * 
 * @param {Character} character 
 */
export const sanitizeCharacter = (character, removeId = true) => {
  let newCharacter = { ...character };
  if (removeId && newCharacter._id) delete newCharacter._id;
  if (newCharacter.name) delete newCharacter.name;
  if (newCharacter.attribute) delete newCharacter.attribute;
  if (newCharacter.obtainability) delete newCharacter.obtainability;
  if (newCharacter.release_date) delete newCharacter.release_date;
  return newCharacter;
};

/**
 * gets the basic display for the character.
 * 
 * @param {Character} character 
 */
export const getBasicCharacterDisplay = (character) => {
  return new Display(character.id, character.name, getMinRank(character.ranks), false, character.attribute, "1", "0", "1", "1", false, "0");
};

/**
 * check if display is valid.
 * 
 * @param {String} character_id 
 * @param {Display} display 
 * @param {boolean} validName 
 */
export const isValidCharacterDisplay = (character_id, display, validName = true) => {
  let character = getCharacter(character_id);
  if (!character) return ["Cannot get character."]
  let err = [];
  // check id.
  if (display.character_id !== character.id) err.push(`Character ID ${display.character_id} does not match Character ID ${character.id}.`);
  // check name.
  if (display.name !== character.name && validName) err.push(`Name ${display.name} does not match Character Name ${character.name}.`);
  // check rank.
  if (!character.ranks[display.rank]) err.push(`Rank: ${display.rank} does not match Character Ranks ${JSON.stringify(character.ranks)}`);
  // check level.
  let maxLevel = parseInt(getMaxLevel(display.rank));
  if (parseInt(display.level) < 1 || parseInt(display.level) > maxLevel || !display.level) err.push(`Level ${display.level} for Rank ${display.rank} must be between 1 and ${maxLevel}.`);
  // check magic.
  if (display.magic < 0 || display.magic > 3) err.push(`Magic ${display.magic} must be between 0 and 3.`);
  // check magia.
  if (display.magia < 1 || display.magia > 5) err.push(`Magia ${display.magia} must be between 1 and 5.`);
  if (display.magia > display.episode) err.push(`Magia ${display.magia} must be less than or equal to Episode ${display.episode}.`);
  // check episode.
  if (display.episode < 1 || display.episode > 5) err.push(`Episode ${display.episode} must be between 1 and 5.`);
  // check doppel.
  if (!(display.doppel === true || display.doppel === false) || (display.doppel === true && (display.magia < 5 || display.rank < 5))) err.push(`Doppel ${display.doppel} can only be true if Magia 5 and Rank 5.`);
  // check se.
  if ((display.se < 0 || display.se > 100)) err.push(`Spirit Enhancement ${display.se} must be between 0 and 100.`)
  return err;
};

/**
 * get Display from the form.
 * 
 * @return {Display}
 */
const getFormDisplay = () => {
  let display = new Display(
    elements.name_select.value,
    elements.name_select[name_select.options.selectedIndex].text,
    elements.rank_select.value,
    elements.post_awaken_checkbox.checked,
    character_collection.find(char => char.id === elements.name_select.value).attribute.toLowerCase() || null,
    elements.level_select.value,
    elements.magic_select.value,
    elements.magia_select.value,
    elements.episode_select.value,
    elements.doppel_checkbox.checked,
    elements.se_select.value);
  return display;
};

/**
 * get Display from character display.
 * 
 * @param {HTMLDivElement} character_display
 * @return {Display}
 */
export const getCharacterDisplay = (character_display) => {
  let display = new Display(
    character_display.getAttribute("character_id"),
    character_display.getAttribute("name"),
    character_display.getAttribute("rank"),
    character_display.getAttribute("post_awaken"),
    character_display.getAttribute("attribute"),
    character_display.getAttribute("level"),
    character_display.getAttribute("magic"),
    character_display.getAttribute("magia"),
    character_display.getAttribute("episode"),
    character_display.getAttribute("doppel"),
    character_display.getAttribute("se"));
  display._id = character_display.getAttribute("_id");
  return display;
};

/**
 * create a character display element from Display.
 * 
 * @param {Display} display
 * @return {HTMLDivElement}
 */
export const createDisplay = (display, listener = false) => {
  let character_display = document.createElement("div");
  character_display.classList.add("character_display");
  character_display.setAttribute("_id", display._id);
  character_display.setAttribute("character_id", display.character_id || display.id);
  character_display.setAttribute("name", display.name);
  character_display.setAttribute("rank", display.rank);
  character_display.setAttribute("post_awaken", display.post_awaken);
  character_display.setAttribute("attribute", display.attribute);
  character_display.setAttribute("magic", display.magic);
  character_display.setAttribute("magia", display.magia);
  character_display.setAttribute("episode", display.episode);
  character_display.setAttribute("level", display.level);
  character_display.setAttribute("doppel", display.doppel);
  character_display.setAttribute("se", display.se);
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
  <div class="se">${display.se}/100</div>
  <img class="doppel" src="/magireco/assets/ui/doppel/${display.doppel}.png">
  <img class="post_awaken" src="/magireco/assets/ui/gift/gift_${display.post_awaken}.png">`;

  if (listener) {
    character_display.addEventListener("click", () => {
      selectDisplay(character_display);
    });
  }
  character_display.addEventListener("contextmenu", e => {
    e.preventDefault();
    openCharacterDialog(character_collection.find(elem => elem.id === display.character_id), [display]);
  });
  return character_display;
};

/**
 * Gets the maximum level for the rank
 * 
 * @param {String} rank 
 */
export const getMaxLevel = (rank) => {
  if (rank == "1") return "40";
  else if (rank == "2") return "50";
  else if (rank == "3") return "60";
  else if (rank == "4") return "80";
  else if (rank == "5") return "100";
};

const RANK_TO_LEVEL = { "1": "40", "2": "50", "3": "60", "4": "80", "5": "100" };

/**
 * Gets the minimum (natural) rank from the character ranks object.
 * 
 * @param {Object} ranks 
 */
export const getMinRank = (ranks) => {
  let minRank = "5";
  Object.entries(ranks).reverse().forEach(([rank, value]) => minRank = value ? rank : minRank);
  return minRank;
};

/**
 * Gets the maximum rank from the character ranks object.
 * 
 * @param {Object} ranks 
 */
export const getMaxRank = (ranks) => {
  let maxRank = "1";
  Object.entries(ranks).forEach(([rank, value]) => maxRank = value ? rank : maxRank);
  return maxRank;
};

/**
 * Minimizes all the fields of the preview Character Display.
 */
export const minimizeDisplay = () => {
  let character_display = getCharacterDisplay(display_preview.children[0]);
  let character = character_collection.find(char => char.id === character_display.character_id);
  let minRank = getMinRank(character.ranks);
  let attribute = character.attribute.toLowerCase();
  let display = new Display(character.id, character.name, minRank, false, attribute, "1", "0", "1", "1", false, "0");
  updateForm(display);
  updatePreviewDisplay(display);
};

/**
 * Maximizes all the fields of the preview Character Display.
 */
export const maximizeDisplay = () => {
  let character_display = getCharacterDisplay(display_preview.children[0]);
  let character = character_collection.find(char => char.id === character_display.character_id);
  let maxRank = getMaxRank(character.ranks);
  let level = RANK_TO_LEVEL[maxRank];
  let attribute = character.attribute.toLowerCase();
  let display = new Display(character.id, character.name, maxRank, true, attribute, level, "3", "5", "5", maxRank == "5" ? true : false, "100");
  updateForm(display);
  updatePreviewDisplay(display);
};

/**
 * updates the display preview with Display.
 * 
 * @param {HTMLDivElement} display
 */
const updatePreviewDisplay = (display) => {
  let character_display = createDisplay(display);
  character_display.classList.add("preview");
  elements.display_preview.innerHTML = "";
  elements.display_preview.appendChild(character_display);
};

/**
 * updates the form with Display.
 * 
 * @param {Display} display
 */
const updateForm = (display) => {
  elements.name_select.value = display.character_id;
  elements.rank_select.value = display.rank;
  elements.post_awaken_checkbox.checked = display.post_awaken === "true" || display.post_awaken === true ? true : false;
  elements.level_select.value = display.level;
  elements.magic_select.value = display.magic;
  elements.magia_select.value = display.magia;
  elements.episode_select.value = display.episode;
  elements.doppel_checkbox.checked = display.doppel === "true" || display.doppel === true ? true : false;
  elements.se_select.value = display.se;
};

/**
 * updates the form with the available options and selects lowest.
 * 
 * @param {Character} character
 */
const updateFormEnabled = (character) => {
  // enable or disable the rank select.
  for (let i = 0; i < 5; i++) {
    elements.rank_select.options[i].disabled = !character.ranks[i + 1];
  }
  // if the currently select rank is disabled, then select minimum available rank.
  if (!character.ranks[rank_select.selectedIndex + 1]) {
    elements.rank_select.selectedIndex = getMinRank(character.ranks) - 1;
    // update the level to match max rank.
    elements.level_select.value = RANK_TO_LEVEL[elements.rank_select.value]
  }
  // enable or disable the doppel select.
  if (getMaxRank(character.ranks) == "5") {
    elements.doppel_checkbox.disabled = false;
  } else {
    elements.doppel_checkbox.disabled = true;
    elements.doppel_checkbox.checked = false;
  }
};

/**
 * gets the standard display given the display.
 * 
 * @param {Character} character 
 * @param {Display} display 
 */
const updateCharacterWithDisplay = (character, display) => {
  // return the default display.
  if (!display) return getBasicCharacterDisplay(character);
  return new Display(character.id, character.name, display.rank, display.post_awaken, character.attribute, display.level, display.magic, display.magia, display.episode, display.doppel, display.se);
};

/**
 * updates the form fields with the selected character.
 */
export const updateFieldsOnName = () => {
  let character = getCharacter(name_select.value);
  updateFormEnabled(character);
  let character_preview = updateCharacterWithDisplay(character, getFormDisplay());
  updateForm(character_preview);
  updatePreviewDisplay(character_preview);
};

/**
 * updates the form fields with the selected character's rank.
 */
export const updateFieldsOnRank = () => {
  let character = getCharacter(name_select.value);
  let form_display = getFormDisplay();
  let maxLevel = RANK_TO_LEVEL[form_display.rank];
  if (parseInt(form_display.level) > parseInt(maxLevel)) form_display.level = maxLevel;
  let character_preview = updateCharacterWithDisplay(character, form_display);
  updateForm(character_preview);
  updatePreviewDisplay(character_preview);
};

/**
 * updates the form fields with the selected character's magia.
 */
export const updateFieldsOnMagia = () => {
  let character = getCharacter(name_select.value);
  let form_display = getFormDisplay();
  if (form_display.magia > form_display.episode) form_display.episode = form_display.magia;
  let character_preview = updateCharacterWithDisplay(character, form_display);
  updateForm(character_preview);
  updatePreviewDisplay(character_preview);
};

/**
 * adds a new character display to the list.
 */
export const createCharacter = () => {
  let display = getFormDisplay();
  let listId = character_list_api.getListId();
  display._id = generatePushID();
  storage_api.addCharacterToList(listId, display);
};

/**
 * updates the selected character display with the contents of the form.
 */
export const updateCharacter = () => {
  let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
  if (!character_display) return;
  let display = getFormDisplay();
  display._id = character_display.getAttribute("_id");
  selectedCharacter = { characterDisplayId: display._id };
  storage_api.updateCharacterOfList(character_list_api.getListId(), display._id, display);
};

/**
 * copies the contents of the selected display to the form.
 */
export const copyCharacter = () => {
  let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
  if (!character_display) return;
  let display = getCharacterDisplay(character_display);
  getCharacter(character_display.getAttribute("character_id"), character => updateFormEnabled(character));
  updateFormEnabled(getCharacter(display.character_id));
  updateForm(display);
  updatePreviewDisplay(display);
  elements.character_error_text.innerHTML = "";
};

/**
 * deletes the selected character display and finds the next display to be selected.
 */
export const deleteCharacter = () => {
  let character_display = Array.from(document.querySelectorAll(".character_display:not(.preview)")).find(child => child.classList.contains("selected"));
  if (!character_display) return;
  let display = getCharacterDisplay(character_display);
  if (character_display.nextElementSibling) {
    selectedCharacter = { characterDisplayId: character_display.nextElementSibling.getAttribute("_id") };
  } else if (character_display.previousElementSibling) {
    selectedCharacter = { characterDisplayId: character_display.previousElementSibling.getAttribute("_id") };
  } else {
    selectedCharacter = null;
  }
  let characterListId = character_list_api.getListId()
  if (Object.keys(storage_api.lists[characterListId].characterList).length === 1) {
    storage_api.updateListList(characterListId, false);
  } else {
    storage_api.deleteCharacterOfList(characterListId, display._id);
  }
};

/**
 * selects the display element.
 */
export const selectDisplay = (character_display) => {
  // return of already selected.
  if (character_display.classList.contains("selected")) return;
  // deselect all other character displays
  document.querySelectorAll(".character_display:not(.preview)").forEach(child => {
    if (child.classList.contains("selected")) child.classList.remove("selected");
  });
  character_display.classList.add("selected");
  selectedCharacter = { characterDisplayId: character_display.getAttribute("_id") };
  enableButtons();
  // update the form.
  copyCharacter();
};

/**
 * deselects the select character display.
 */
export const deselectDisplay = (deselect = false) => {
  if (deselect) selectedCharacter = null;
  if (selectedCharacter && selectedCharacter.characterDisplayId) {
    let character_display = document.querySelector(`.character_display:not(.preview)[_id="${selectedCharacter.characterDisplayId}"]`);
    if (character_display) character_display.classList.remove("selected");
    selectedCharacter = null;
    enableButtons();
  }
};

/**
 * finds and select the display element.
 */
export const findAndSelectDisplay = () => {
  if (selectedCharacter && selectedCharacter.characterDisplayId) {
    let character_display = document.querySelector(`.character_display:not(.preview)[_id="${selectedCharacter.characterDisplayId}"]`);
    if (character_display) selectDisplay(character_display);
  }
};

/**
 * updates the preview character display with the contents of the form.
 */
export const updatePreviewOnForm = () => {
  let display = getFormDisplay();
  character_error_text.innerHTML = '';
  let error = isValidCharacterDisplay(name_select.value, display);
  if (error.length == 0) {
    enableButtons();
    updatePreviewDisplay(display);
    updateCharacter();
    elements.character_error_text.innerHTML = "";
  } else {
    create_button.disabled = true;
    update_button.disabled = true;
    elements.character_error_text.innerHTML = error.toString();
  }
};

/**
 * Enable and Disable the Character Buttons based on the current state.
 */
export const enableButtons = () => {
  if (character_list_api.selectedList && character_list_api.selectedList.listId) {
    if (elements.create_button.disabled) elements.create_button.disabled = false;
    if (elements.min_all_button.disabled) elements.min_all_button.disabled = false;
    if (elements.max_all_button.disabled) elements.max_all_button.disabled = false;
    if (selectedCharacter && selectedCharacter.characterDisplayId) {
      if (elements.update_button.disabled) elements.update_button.disabled = false;
      if (elements.copy_button.disabled) elements.copy_button.disabled = false;
      if (elements.delete_button.disabled) elements.delete_button.disabled = false;
      if (elements.selected_text.classList.contains("hidden")) elements.selected_text.classList.remove("hidden");
    } else {
      if (!elements.update_button.disabled) elements.update_button.disabled = true;
      if (!elements.copy_button.disabled) elements.copy_button.disabled = true;
      if (!elements.delete_button.disabled) elements.delete_button.disabled = true;
      if (!elements.selected_text.classList.contains("hidden")) elements.selected_text.classList.add("hidden");
    }
  } else {
    if (!elements.create_button.disabled) elements.create_button.disabled = true;
    if (!elements.update_button.disabled) elements.update_button.disabled = true;
    if (!elements.copy_button.disabled) elements.copy_button.disabled = true;
    if (!elements.delete_button.disabled) elements.delete_button.disabled = true;
    if (!elements.min_all_button.disabled) elements.min_all_button.disabled = true;
    if (!elements.max_all_button.disabled) elements.max_all_button.disabled = true;
  }
};

/**
 * opens the modal dialog for character selection user interface.
 */
export const loadCharacterSelectList = () => {
  characterSelectDialog.list.innerHTML = "";
  character_collection.forEach(character => {
    let star = Object.entries(character.ranks).find(([, val]) => val === true)[0][0];
    let added = Object.values(storage_api.lists[character_list_api.getListId()].characterList).filter(char => char.character_id === character.id);
    let container = document.createElement("div");
    container.classList.add("character_image_preview");
    container.setAttribute("character_id", character.id);
    let image = document.createElement("img");
    image.src = `/magireco/assets/image/card_${character.id}${star}_f.png`;
    image.title = character.name;
    container.append(image);
    if (added.length > 0) {
      let text = document.createElement("label");
      text.classList.add("character_label");
      text.innerHTML = "✓";
      container.append(text);
    }
    container.addEventListener("click", () => {
      name_select.value = character.id;
      name_select.dispatchEvent(new Event("change"));
      characterSelectDialog.close();
    });
    container.addEventListener("contextmenu", e => {
      e.preventDefault();
      openCharacterDialog(character, added);
    });
    characterSelectDialog.list.append(container);
  });
  toggleAdded(characterSelectDialog.added.checked);
};

/**
 * Filters the character_image_preview's based on the search.
 * 
 * @param {String} search
 */
export const filterCharacters = (search) => {
  if (!search || search.length == 0) {
    Array.from(characterSelectDialog.list.children).forEach(child => {
      if (child.classList.contains("hidden")) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      }
    });
  }
  search = search.toLowerCase();
  Array.from(characterSelectDialog.list.children).forEach(child => {
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
  toggleAdded(characterSelectDialog.added.checked);
};

/**
 * Toggles the visibility of the character previews of added.
 * 
 * @param {boolean} value 
 */
export const toggleAdded = (value) => {
  if (value) {
    Array.from(characterSelectDialog.list.children).forEach(child => {
      if (child.querySelector(".character_label")) child.classList.add("hidden");
    });
  } else {
    Array.from(characterSelectDialog.list.children).forEach(child => {
      if (child.classList.contains("hidden")) child.classList.remove("hidden");
    });
  }
};

/**
 * Opens the Message Dialog with the Character Info.
 * 
 * @param {Character} character 
 * @param {Display} displays 
 */
export const openCharacterDialog = (character, displays) => {
  let text = `ID: ${character.id}\
  \nAttribute: ${character.attribute}\
  \nRanks: ${Object.keys(character.ranks).filter(key => character.ranks[key])}\
  \nObtainability: ${character.obtainability}\
  \nFandom Wiki Link:\n${character.url}`;

  if (displays.length > 0) text += `\n\nYour Character${displays.length > 1 ? "s" : ""}:`;
  displays.forEach(display => {
    text += `\nRank: ${display.rank}\
    \nPost Awaken: ${display.post_awaken}\
    \nLevel: ${display.level}\
    \nMagic: ${display.magic}\
    \nMagia: ${display.magia}\
    \nEpisode: ${display.episode}\
    \nDoppel: ${display.doppel}\
    \nSpirit Enhancement: ${display.se}\n`;
  });

  messageDialog.open(`${character.name} Details`, text);
};