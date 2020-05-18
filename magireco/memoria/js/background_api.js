import { memoria_elements as elements, backgroundSelectDialog } from './memoria_elements.js';
import { background_collection } from '../../collection/background_collection.js'
import * as storage_api from './storage_api.js';

/**
 * Background API for the Memoria Page.
 */

/**
 * Gets all the Home Screen Backgrounds.
 */
export const getBackgrounds = () => {
  let backgrounds = background_collection["home screen"];
  return backgrounds;
};

/**
 * Sets the background of the list with the background_id.
 * 
 * @param {String} background_id 
 */
export const setBackground = (background_id) => {
  if (background_id) {
    background_select.value = background_id;
    elements.memoria_list_content.style.backgroundImage = `url("/magireco/assets/bg/${background_id}.jpg")`;
    changeTransparency(storage_api.settings.background_transparency);
  } else {
    elements.memoria_list_content.style.backgroundImage = "";
    changeTransparency(storage_api.settings.background_transparency);
    background_select.selectedIndex = -1;
  }
};

/**
 * Changes the transparency of the list to transparency / 100.
 * 
 * @param {Number} transparency 
 */
export const changeTransparency = (transparency) => {
  elements.memoria_list_content.style.backgroundColor = `rgba(255,255,255,${transparency / 100})`;
};

/**
 * Removes the background from the list.
 */
export const removeBackground = () => {
  elements.memoria_list_content.style.backgroundImage = "";
  background_select.selectedIndex = -1;
};

/**
 * Gets the background_id of the selected background.
 */
export const getSelectedBackground = () => {
  return background_select.value;
};

/**
 * Loads the background image previews into the Background Select Dialog.
 */
export const loadBackgroundList = () => {
  let backgrounds = getBackgrounds();
  backgrounds.forEach(background => {
    let container = document.createElement("div");
    container.classList.add("background_image_preview");
    container.setAttribute("id", background.id);
    let image = document.createElement("img");
    image.src = `/magireco/assets/bg_min/${background.id}.jpg`;
    image.title = background.name ? background.name : background.id;
    container.append(image);
    container.addEventListener("click", () => {
      background_select.value = background.id;
      background_select.dispatchEvent(new Event("change"));
      backgroundSelectModal.style.display = "none";
    });
    backgroundSelectDialog.list.append(container);
  });
};

/**
 * Filters the backgrounds based on the search term.
 * @param {String} search 
 */
export const filterBackgrounds = (search) => {
  if (!search || search.length == 0) {
    Array.from(backgroundSelectModalList.children).forEach(child => {
      if (child.classList.contains("hidden")) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      }
    });
  }
  search = search.toLowerCase();
  Array.from(backgroundSelectModalList.children).forEach(child => {
    let background = getBackgrounds().find(back => child.getAttribute("id") === back.id);
    if (background.id.includes(search) || background.name.toLowerCase().includes(search) || background.id.toLowerCase().split("_").includes(search)) {
      child.classList.remove("hidden");
      child.style.display = "inline-block";
    } else {
      child.classList.add("hidden");
      child.style.display = "none";
    }
  });
};

/**
 * Load the background_select with background names.
 */
export const startUp = () => {
  let backgrounds = getBackgrounds();
  backgrounds.forEach(background => {
    background_select.options.add(new Option(background.name ? background.name : background.id, background.id, false));
  });
  background_select.selectedIndex = -1;
};
