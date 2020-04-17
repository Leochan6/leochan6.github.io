let background_api = (function () {

  let module = {};

  module.getBackgrounds = () => {
    let backgrounds = background_collections["home screen"];
    return backgrounds;
  }

  module.setBackground = (background_id) => {
    character_list_content.style.backgroundImage = `url("/magireco/assets/bg/${background_id}.jpg")`;
  };

  module.removeBackground = () => {
    character_list_content.style.backgroundImage = "";
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