import { memoria_collection } from '../../collection/memoria_collection.js';
import { memoria_elements as elements, memoriaSelectDialog, messageDialog } from './memoria_elements.js';
import * as memoria_list_api from './memoria_list_api.js';
import * as storage_api from './storage_api.js';

/**
 * Memoria API for the Memoria Page.
 */

export let selectedMemoria = null;

export class Display {
  constructor(id, name, type, rank, ascension, level, archive, protect) {
    if (typeof type !== undefined) {
      this.memoria_id = id;
      this.name = name;
      this.type = type;
      this.rank = rank;
      this.ascension = ascension;
      this.level = level;
      this.archive = archive;
      this.protect = protect;
    } else {
      this._id = id;
      this.memoria_id = name.memoria_id;
      this.name = name.name;
      this.type = name.type;
      this.rank = name.rank;
      this.ascension = name.ascension;
      this.level = name.level;
      this.archive = name.archive;
      this.protect = name.protect;
    }
  }
};

export class Memoria {
  constructor(id, name, type, rank) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.rank = rank;
  }
};

export const startUp = () => {
  // initialize name field.
  [...memoria_collection].sort((a, b) => a.name > b.name ? 1 : -1).forEach((memoria) => {
    elements.name_select.options.add(new Option(memoria.name, memoria.id, false));
  });
  elements.name_select.value = 1001;
  elements.name_select.dispatchEvent(new Event("change"));

  let memoria = getMemoria("1001");
  updateFormEnabled(memoria);
  updatePreviewDisplay(getBasicMemoriaDisplay(memoria));
};

/**
   * get the name and rank for the memoria.
   * 
   * @param {String} id 
   * @param {Function} callback 
   */
export const getMemoria = (id) => {
  try {
    let memoria = memoria_collection.find(elem => elem.id === id);
    let name = memoria.name;
    let rank = memoria.rank;
    let type = memoria.type;
    return new Memoria(id, name, type, rank);
  } catch (e) {
    return null;
  }
};

/**
 * removes the extra properties of the memoria.
 * 
 * @param {Display} memoria 
 */
export const sanitizeMemoria = (memoria, removeId = true) => {
  let newMemoria = { ...memoria };
  if (removeId && newMemoria._id) delete newMemoria._id;
  if (newMemoria.name) delete newMemoria.name;
  if (newMemoria.type) delete newMemoria.type;
  if (newMemoria.rank) delete newMemoria.rank;
  if (newMemoria.obtainability) delete newMemoria.obtainability;
  return newMemoria;
};

/**
 * gets the basic display for the memoria.
 * 
 * @param {Memoria} memoria 
 */
export const getBasicMemoriaDisplay = (memoria) => {
  return new Display(memoria.id, memoria.name, memoria.type, memoria.rank, "0", "1", false, false);
};

/**
 * check if display is valid.
 * 
 * @param {String} memoria_id 
 * @param {Display} display 
 * @param {Function} callback 
 */
export const isValidMemoriaDisplay = (memoria_id, display, validName = true) => {
  let memoria = getMemoria(memoria_id);
  if (!memoria) return ["Cannot get memoria."]
  let err = [];
  // check id.
  if (display.memoria_id !== memoria.id) err.push(`Display Id ${display.memoria_id} does not match Memoria ID ${memoria.id}.`);
  // check level.
  let maxLevel = getMaxLevel(display.ascension, display.rank);
  if (parseInt(display.level) < 1 || parseInt(display.level) > maxLevel || !display.level) err.push(`Display Level ${display.level} for Display Rank ${display.rank} and Display Ascension ${display.ascension} must be between 1 and ${maxLevel}.`);
  // check ascension.
  if (display.ascension < 0 || display.ascension > 4) err.push(`Display Magic ${display.ascension} must be between 0 and 4.`);
  return err;
};

/**
 * get Display from the form.
 * 
 * @return {Display}
 */
const getFormDisplay = () => {
  let memoria = memoria_collection.find(mem => mem.id === elements.name_select.value);
  let display = new Display(
    elements.name_select.value,
    elements.name_select[elements.name_select.options.selectedIndex].text,
    memoria.type.toLowerCase(),
    memoria.rank,
    elements.ascension_select.value,
    elements.level_select.value,
    elements.archive_checkbox.checked,
    elements.protect_checkbox.checked);
  return display;
};

/**
 * get Display from memoria display.
 * 
 * @param {HTMLDivElement} memoria_display
 * @return {Display}
 */
export const getMemoriaDisplay = (memoria_display) => {
  let display = new Display(
    memoria_display.getAttribute("memoria_id"),
    memoria_display.getAttribute("name"),
    memoria_display.getAttribute("type"),
    memoria_display.getAttribute("rank"),
    memoria_display.getAttribute("ascension"),
    memoria_display.getAttribute("level"),
    memoria_display.getAttribute("archive"),
    memoria_display.getAttribute("protect"));
  display._id = memoria_display.getAttribute("_id");
  return display;
};

/**
 * create a memoria display element from Display.
 * 
 * @param {Display} display
 * @return {HTMLDivElement}
 */
export const createDisplay = (display, listener) => {
  let memoria_display = document.createElement("div");
  memoria_display.classList.add("memoria_display");
  memoria_display.setAttribute("_id", display._id);
  memoria_display.setAttribute("memoria_id", display.memoria_id);
  memoria_display.setAttribute("name", display.name);
  memoria_display.setAttribute("type", display.type);
  memoria_display.setAttribute("rank", display.rank);
  memoria_display.setAttribute("ascension", display.ascension);
  memoria_display.setAttribute("level", display.level);
  memoria_display.setAttribute("archive", display.archive);
  memoria_display.setAttribute("protect", display.protect);
  memoria_display.innerHTML = `
    <img class="memoria_image" src="/magireco/assets/memoria/memoria_${display.memoria_id}_s.png">
    <img class="archive" src="/magireco/assets/ui/archive/${display.archive}.png">
    <img class="protect" src="/magireco/assets/ui/protect/${display.protect}.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}/${getMaxLevel(display.ascension, display.rank)}</div>
    </div>
    <img class="ascension_rank" src="/magireco/assets/ui/ascension/${display.ascension}.png">`;
  if (listener) {
    memoria_display.addEventListener("click", () => {
      selectDisplay(memoria_display);
    });
  }
  memoria_display.addEventListener("contextmenu", e => {
    e.preventDefault();
    openMemoriaDialog(memoria_collection.find(elem => elem.id === display.memoria_id), [display]);
  });
  return memoria_display;
};

/**
 * Gets the maximum level for the rank
 * 
 * @param {String} rank 
 */
export const getMaxLevel = (ascension, rank) => {
  if (rank == "1") return (10 + (5 * parseInt(ascension))).toString();
  else if (rank == "2") return (15 + (5 * parseInt(ascension))).toString();
  else if (rank == "3") return (20 + (5 * parseInt(ascension))).toString();
  else if (rank == "4") return (30 + (5 * parseInt(ascension))).toString();
};

/**
 * Minimizes all the fields of the preview Memoria Display.
 */
export const minimizeDisplay = () => {
  let memoria_display = getMemoriaDisplay(display_preview.children[0]);
  let memoria = memoria_collection.find(elem => elem.id === memoria_display.memoria_id);
  let display = new Display(memoria.id, memoria.name, memoria.type, memoria.rank, "0", "1", elements.archive_checkbox.checked, elements.protect_checkbox.checked);
  updateForm(display);
  updatePreviewDisplay(display);
};

/**
 * Maximizes all the fields of the preview Memoria Display.
 */
export const maximizeDisplay = () => {
  let memoria_display = getMemoriaDisplay(display_preview.children[0]);
  let memoria = memoria_collection.find(elem => elem.id === memoria_display.memoria_id);
  let display = new Display(memoria.id, memoria.name, memoria.type, memoria.rank, "4", getMaxLevel("4", memoria.rank), elements.archive_checkbox.checked, elements.protect_checkbox.checked);
  updateForm(display);
  updatePreviewDisplay(display);
};

/**
 * updates the display preview with Display.
 * 
 * @param {HTMLDivElement} display
 */
const updatePreviewDisplay = (display) => {
  let memoria_display = createDisplay(display);
  memoria_display.classList.add("preview");
  elements.display_preview.innerHTML = "";
  elements.display_preview.appendChild(memoria_display);
};

/**
 * updates the form with Display.
 * 
 * @param {Display} display
 */
const updateForm = (display) => {
  elements.name_select.value = display.memoria_id;
  elements.level_select.value = display.level;
  elements.ascension_select.value = display.ascension;
};

/**
 * updates the form with the available options and selects lowest.
 * 
 * @param {Memoria} memoria
 */
const updateFormEnabled = (memoria) => {
};

/**
 * gets the standard display given the display.
 * 
 * @param {Memoria} memoria 
 * @param {*} display 
 */
const updateMemoriaWithDisplay = (memoria, display) => {
  // return the default display.
  if (!display) return getBasicMemoriaDisplay(memoria);
  return new Display(memoria.id, memoria.name, memoria.type, memoria.rank, display.ascension, display.level, display.archive, display.protect);
};

/**
 * updates the form fields with the selected memoria.
 */
export const updateFieldsOnName = () => {
  let memoria = getMemoria(name_select.value);
  updateFormEnabled(memoria);
  let memoria_preview = updateMemoriaWithDisplay(memoria, getFormDisplay());
  updateForm(memoria_preview);
  updatePreviewDisplay(memoria_preview);
};


/**
 * adds a new memoria display to the list.
 */
export const createMemoria = () => {
  let display = getFormDisplay();
  let listId = memoria_list_api.getListId();
  display._id = generatePushID();
  storage_api.addMemoriaToList(listId, display);
};

/**
 * updates the selected memoria display with the contents of the form.
 */
export const updateMemoria = () => {
  let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
  if (!memoria_display) return;
  let display = getFormDisplay();
  display._id = memoria_display.getAttribute("_id");
  selectedMemoria = { memoriaDisplayId: display._id };
  storage_api.updateMemoriaOfList(memoria_list_api.getListId(), display._id, display);
};

/**
 * copies the contents of the selected display to the form.
 */
export const copyMemoria = () => {
  let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
  if (!memoria_display) return;
  let display = getMemoriaDisplay(memoria_display);
  getMemoria(memoria_display.getAttribute("memoria_id"), memoria => updateFormEnabled(memoria));
  updateFormEnabled(getMemoria(display.memoria_id));
  updateForm(display);
  updatePreviewDisplay(display);
};

/**
 * deletes the selected memoria display and finds the next display to be selected.
 */
export const deleteMemoria = () => {
  let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
  if (!memoria_display) return;
  let display = getMemoriaDisplay(memoria_display);
  if (memoria_display.nextElementSibling) {
    selectedMemoria = { memoriaDisplayId: memoria_display.nextElementSibling.getAttribute("_id") };
  } else if (memoria_display.previousElementSibling) {
    selectedMemoria = { memoriaDisplayId: memoria_display.previousElementSibling.getAttribute("_id") };
  } else {
    selectedMemoria = null;
  }
  let memoriaListId = memoria_list_api.getListId();
  if (Object.keys(storage_api.lists[memoriaListId].memoriaList).length === 1) {
    storage_api.updateListList(memoriaListId, false);
  } else {
    storage_api.deleteMemoriaOfList(memoriaListId, display._id);
  }
};

/**
 * selects the display element.
 */
export const selectDisplay = (memoria_display) => {
  // return of already selected.
  if (memoria_display.classList.contains("selected")) return;
  // deselect all other memoria displays
  document.querySelectorAll(".memoria_display:not(.preview)").forEach(child => {
    if (child.classList.contains("selected")) child.classList.remove("selected");
  });
  memoria_display.classList.add("selected");
  selectedMemoria = { memoriaDisplayId: memoria_display.getAttribute("_id") };
  enableButtons();
  // update the form.
  copyMemoria();
};

/**
 * deselects the select memoria display.
 */
export const deselectDisplay = () => {
  if (selectedMemoria && selectedMemoria.memoriaDisplayId) {
    let memoria_display = document.querySelector(`.memoria_display:not(.preview)[_id="${selectedMemoria.memoriaDisplayId}"]`);
    if (memoria_display) memoria_display.classList.remove("selected");
    selectedMemoria = null;
    enableButtons();
  }
};

/**
 * finds and select the display element.
 */
export const findAndSelectDisplay = () => {
  if (selectedMemoria && selectedMemoria.memoriaDisplayId) {
    let memoria_display = document.querySelector(`.memoria_display:not(.preview)[_id="${selectedMemoria.memoriaDisplayId}"]`);
    if (memoria_display) selectDisplay(memoria_display);
  }
};

/**
 * updates the preview memoria display with the contents of the form.
 */
export const updatePreviewOnForm = () => {
  let display = getFormDisplay();
  memoria_error_text.innerHTML = '';
  let error = isValidMemoriaDisplay(name_select.value, display);
  if (error.length == 0) {
    enableButtons();
    updatePreviewDisplay(display);
    updateMemoria();
  } else {
    create_button.disabled = true;
    update_button.disabled = true;
    memoria_error_text.innerHTML = error.toString();
  }
};

/**
 * Enable and Disable the Memoria Buttons based on the current state.
 */
export const enableButtons = () => {
  if (memoria_list_api.selectedList && memoria_list_api.selectedList.listId) {
    if (elements.create_button.disabled) elements.create_button.disabled = false;
    if (elements.min_all_button.disabled) elements.min_all_button.disabled = false;
    if (elements.max_all_button.disabled) elements.max_all_button.disabled = false;
    if (selectedMemoria && selectedMemoria.memoriaDisplayId) {
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
 * opens the modal dialog for memoria selection user interface.
 */
export const loadMemoriaSelectList = () => {
  memoriaSelectDialog.list.innerHTML = "";
  memoria_collection.forEach(memoria => {
    let added = Object.values(storage_api.lists[memoria_list_api.getListId()].memoriaList).filter(char => char.memoria_id === memoria.id);
    let container = document.createElement("div");
    container.classList.add("memoria_image_preview");
    container.setAttribute("id", memoria.id);
    let image = document.createElement("img");
    image.src = `/magireco/assets/memoria/memoria_${memoria.id}_s.png`;
    image.title = memoria.name;
    container.append(image);
    if (added.length > 0) {
      let text = document.createElement("label");
      text.classList.add("memoria_label");
      text.innerHTML = added.length;
      container.append(text);
    }
    container.addEventListener("click", () => {
      name_select.value = memoria.id;
      name_select.dispatchEvent(new Event("change"));
      memoriaSelectDialog.close();
    });
    container.addEventListener("contextmenu", e => {
      e.preventDefault();
      openMemoriaDialog(memoria, added);
    });
    memoriaSelectDialog.list.append(container);
  });
  toggleAdded(memoriaSelectDialog.added.checked);
};

/**
 * Filters the memoria_image_preview's based on the search.
 * 
 * @param {String} search
 */
export const filterMemoria = (search) => {
  if (!search || search.length == 0) {
    Array.from(memoriaSelectModalList.children).forEach(child => {
      if (child.classList.contains("hidden")) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      }
    });
  }
  search = search.toLowerCase();
  Array.from(memoriaSelectModalList.children).forEach(child => {
    let memoria = memoria_collection.find(elem => child.getAttribute("id") === elem.id);
    if (memoria.id.includes(search)
      || memoria.name.toLowerCase().includes(search)
      || memoria.name_na.toLowerCase().includes(search)
      || memoria.name_jp.toLowerCase().includes(search)
      || memoria.type.toLowerCase().includes(search)
      || memoria.rank.toLowerCase().includes(search)
      || (memoria.chara && memoria.chara.toLowerCase().includes(search))
      || (memoria.effect1 && memoria.effect1.toLowerCase().includes(search))
      || (memoria.effect2 && memoria.effect2.toLowerCase().includes(search))
      || memoria.obtainability.includes(search)
    ) {
      child.classList.remove("hidden");
      child.style.display = "inline-block";
    } else {
      child.classList.add("hidden");
      child.style.display = "none";
    }
  });
  toggleAdded(memoriaSelectDialog.added.checked);
};

/**
 * Toggles the visibility of the memoria previews of added.
 * 
 * @param {boolean} value 
 */
export const toggleAdded = (value) => {
  if (value) {
    Array.from(memoriaSelectDialog.list.children).forEach(child => {
      if (child.querySelector(".memoria_label")) child.classList.add("hidden");
    });
  } else {
    Array.from(memoriaSelectDialog.list.children).forEach(child => {
      if (child.classList.contains("hidden")) child.classList.remove("hidden");
    });
  }
};

/**
 * Opens the Message Dialog with the Memoria Info.
 * 
 * @param {Memoria} memoria 
 * @param {Display} displays 
 */
export const openMemoriaDialog = (memoria, displays) => {
  let text = `ID: ${memoria.id}\
  \nType: ${memoria.type}\
  \nEffect: ${memoria.effect1}\
  \nMLB Effect: ${memoria.effect2}\
  \nUsable: ${memoria.charaList ? memoria.charaList[0].name : "ALL"}\
  \nFandom Wiki Link:\n${memoria.url}`

  if (displays.length > 0) text += `\n\nYour Memoria${displays.length > 1 ? "s" : ""}:`;
  displays.forEach(display => {
    text += `\nAscension: ${display.ascension}\
    \nLevel: ${display.level}\
    \nArchive: ${display.archive}\
    \nLocked: ${display.protect}\n`;
  });

  messageDialog.open(`${memoria.name} Details`, text);
};