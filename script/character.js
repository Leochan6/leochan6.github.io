let character_api = (() => {

  let module = {};

  module.Display = class Display {
    constructor(id, name, rank, attr, level, magic, magia, episode) {
      this.id = id;
      this.name = name;
      this.rank = rank;
      this.attr = attr;
      this.level = level;
      this.magic = magic;
      this.magia = magia;
      this.episode = episode;
    }
  }

  module.Character = class Character {
    constructor(id, name, attr, ranks) {
      this.id = id;
      this.name = name;
      this.attr = attr;
      this.ranks = ranks;
    }
  }
  
  // sends HTML request to get the collection json.
	module.getCollection = (callback) => {
		var xhr = new XMLHttpRequest();
		xhr.onload = () => callback(JSON.parse(xhr.responseText));
    xhr.open("GET", "/assets/magireco/collection.json", true);
    xhr.send();
  };

  // get the list of names.
  module.getNames = (callback) => {
    module.getCollection((collection) => {
      let names = collection.map(character => {return {id: character.id, name: character.name}});
      names = [...new Set(names)];
      callback(names);
    })
  };

  // get the attribute and rank for the character.
  module.getCharacter = (id, callback) => {
    module.getCollection((collection) => {
      let character_list = collection.filter(character => character.id === id);
      let name = character_list[0].name
      let attribute = character_list[0].attribute.toLowerCase();
      let rank_list = character_list.map((character) => character.rank);
      let ranks = Array(5).fill(false);
      for (let i = 0; i < 5; i++) {
        if (rank_list.indexOf((i+1).toString(10)) != -1) ranks[i] = true;
      }
      let character = new module.Character(id, name, attribute, ranks);
      callback(character);
    });
  };

  module.getCharacterDisplay = (character) => {
    return new module.Display(character.id, character.name, character.ranks.indexOf(true) + 1, character.attr, "1", "0", "1", "1");
  };

  // check if disaply is valid.
  module.isValidCharacterDisplay = (display, character) => {
    let err = [];
    // check id.
    if (display.id !== character.id) err.push(`Display Id ${display.id} does not match Character ID ${character.id}.`);
    // check name.
    if (display.name !== character.name) err.push(`Display Name ${display.name} does not match Character Name ${character.Name}.`);
    // check rank.
    if (!character.ranks[display.rank - 1]) err.push(`Display Rank ${display.rank} does not match Character Ranks ${character.ranks}`)
    // check level.
    if      (display.rank == "1" && (display.level < 1 || display.level > 40)) err.push(`Display Level ${display.level} for Display Rank ${display.rank} must be between 1 and 40.`);
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

    return err;
  };

  module.updateDisplay = (character, display) => {
    // return the default display.
    if (!display) return module.getCharacterDisplay(character);
    return new module.Display(character.id, character.name, display.rank, character.attr, display.level, display.magic, display.magia, display.episode);
  }

  let displayListeners = [];

  module.onDisplayUpdate = (listener) => {
    displayListeners.push(listener);
    module.getCharacter("1001", character => {
      listener(character, module.getCharacterDisplay(character));
    });
  }

  // let notifyDisplayListeners = (display) => {
  //   displayListeners.forEach(listener => listener(display));
  // }

  return module;
})();