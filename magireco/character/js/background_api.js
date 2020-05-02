let background_api = (function () {

  let module = {};

  module.getBackgrounds = () => {
    let backgrounds = background_collections["home screen"];
    return backgrounds;
  };

  module.setBackground = (background_id) => {
    if (background_id && background_id !== true) {
      background_select.value = background_id;
      character_list_content.style.backgroundImage = `url("/magireco/assets/bg/${background_id}.jpg")`;
    } else {
      character_list_content.style.backgroundImage = "";
      background_select.selectedIndex = -1;
    }
  };

  module.removeBackground = () => {
    character_list_content.style.backgroundImage = "";
    background_select.selectedIndex = -1;
  };

  module.getSelectedBackground = () => {
    return background_select.value;
  };

  module.openBackgroundSelect = () => {
    let backgrounds = module.getBackgrounds();
    backgroundSelectModal.style.display = "block";
    backgroundSelectModalList.innerHTML = "";
    backgroundSelectModalSearch.focus();
    backgrounds.forEach(background => {
      let container = document.createElement("div");
      container.classList.add("background_image_preview");
      container.setAttribute("id", background.id);
      let image = document.createElement("img");
      image.src = `/magireco/assets/bg_min/${background.id}.jpg`;
      image.title = background.name;
      container.append(image);
      container.addEventListener("click", () => {
        background_select.value = background.id;
        background_select.dispatchEvent(new Event("change"));
        backgroundSelectModal.style.display = "none";
      });
      backgroundSelectModalList.append(container);
    });
  };

  module.filterBackgrounds = (search) => {
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
      let background = module.getBackgrounds().find(back => child.getAttribute("id") === back.id);
      if (background.id.includes(search) || background.name.toLowerCase().includes(search)) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      } else {
        child.classList.add("hidden");
        child.style.display = "none";
      }
    });
  };

  module.startUp = () => {
    let backgrounds = module.getBackgrounds();
    backgrounds.forEach(background => {
      background_select.options.add(new Option(background.name, background.id, false));
    });
    background_select.selectedIndex = -1;
  };

  return module;
})();