(function () {
  "use strict";

  // const collection = {ids: [1001, 1002, 1003]};

  class Display {
    constructor(id, rank, attr, level, magic, magia, episode) {
      this.id = id;
      this.rank = rank;
      this.attr = attr;
      this.level = level;
      this.magic = magic;
      this.magia = magia;
      this.episode = episode;
    }
  }

  window.onload = () => {
    // update attribute and rank fields on name change.
    document.querySelector("#id_select").addEventListener("change", () => {
      character.getAttributeRank(document.querySelector("#id_select").value, (attribute, ranks) => {
        document.querySelector("#attr_select").value = attribute;
        // disable if rank not available and set value equal to lowest rank.
        for (var i = 4; i >= 0; i--) {
          document.querySelector("#rank_select").options[i].disabled = !ranks[i];
          if (ranks[i]) {
            document.querySelector("#rank_select").value = (i+1).toString(10);
          }
        }
        // disable if not attribute
        for (var i = 0; i < 6; i++) {
          document.querySelector("#attr_select").options[i].disabled = document.querySelector("#attr_select").options[i].value != attribute;
        }
        getAndShow();
      });
    });
    document.querySelector("#rank_select").addEventListener("change", getAndShow);
    document.querySelector("#attr_select").addEventListener("change", getAndShow);
    document.querySelector("#level_select").addEventListener("change", getAndShow);
    document.querySelector("#magic_select").addEventListener("change", getAndShow);
    document.querySelector("#magia_select").addEventListener("change", getAndShow);
    document.querySelector("#episode_select").addEventListener("change", getAndShow);
  };

  // initilize name field.
  character.getNames((collection) => {
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
      id_select.options.add(new Option(character.name, character.id, false));
    });
    document.querySelector("#id_select").value = "1001";
    document.querySelector("#id_select").dispatchEvent(new Event("change"));
  });

  let getAndShow = () => {
    let display = new Display(
      document.querySelector("#id_select").value,
      document.querySelector("#rank_select").value,
      document.querySelector("#attr_select").value,
      document.querySelector("#level_select").value,
      document.querySelector("#magic_select").value,
      document.querySelector("#magia_select").value,
      document.querySelector("#episode_select").value);
    character.showDisplay(display);
  }


















}());