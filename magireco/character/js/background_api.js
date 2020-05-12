import { character_elements as elements, backgroundSelectDialog } from './character_elements.js';
import { background_collection } from '../../collection/background_collection.js'
import * as storage_api from './storage_api.js';

export const getBackgrounds = () => {
  let backgrounds = background_collection["home screen"];
  return backgrounds;
};

export const setBackground = (background_id) => {
  if (background_id) {
    background_select.value = background_id;
    elements.character_list_content.style.backgroundImage = `url("/magireco/assets/bg/${background_id}.jpg")`;
    changeTransparency(storage_api.settings.background_transparency);
  } else {
    elements.character_list_content.style.backgroundImage = "";
    changeTransparency(storage_api.settings.background_transparency);
    background_select.selectedIndex = -1;
  }
};

export const changeTransparency = (transparency) => {
  elements.character_list_content.style.backgroundColor = `rgba(255,255,255,${transparency / 100})`;
};

export const removeBackground = () => {
  elements.character_list_content.style.backgroundImage = "";
  background_select.selectedIndex = -1;
};

export const getSelectedBackground = () => {
  return background_select.value;
};

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
    if (background.id.includes(search) || background.name.toLowerCase().includes(search)) {
      child.classList.remove("hidden");
      child.style.display = "inline-block";
    } else {
      child.classList.add("hidden");
      child.style.display = "none";
    }
  });
};

export const startUp = () => {
  let backgrounds = getBackgrounds();
  backgrounds.forEach(background => {
    background_select.options.add(new Option(background.name ? background.name : background.id, background.id, false));
  });
  background_select.selectedIndex = -1;
};
