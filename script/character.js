let character = (() => {

  let module = {};

  module.collection = {};

  // sends HTML request to get the collection json.
	module.getCollection = (callback) => {
		var xhr = new XMLHttpRequest();
		xhr.onload = () => callback(JSON.parse(xhr.responseText));
    xhr.open("GET", "/assets/magireco/collection.json", true);
	  xhr.send();
  };

  module.getNames = (callback) => {
    module.getCollection((collection) => {
      let names = collection.map(character => {return {id: character.id, name: character.name}});
      names = [...new Set(names)];
      callback(names);
    })
  };

  module.getAttributeRank = (id, callback) => {
    module.getCollection((collection) => {
      let attribute = collection.filter((character) => character.id === id)[0].attribute.toLowerCase();
      let ranks = collection.filter((character) => character.id === id).map((character) => character.rank);
      let hasRanks = [false, false, false, false, false];
      for (let i = 0; i < 5; i++) {
        if (ranks.indexOf((i+1).toString(10)) != -1) hasRanks[i] = true;
      }
      callback(attribute, hasRanks);
    });
  };
  
  module.showDisplay = ({id, rank, attr, level, magic, magia, episode}) => {
    console.log("show", id, rank, attr, level, magic, magia, episode);
    let display_div = document.querySelector("#display");
    display_div.innerHTML = `
    <div class="character_display" character_id="${id}">
      <img class="background" src="assets/magireco/ui/bg/${attr}.png">
      <img class="card_image" src="assets/magireco/card/image/card_${id}${rank}_d.png">
      <img class="frame_rank" src="assets/magireco/ui/frame/${rank}.png">
      <img class="star_rank" src="assets/magireco/ui/star/${rank}.png">
      <img class="att" src="assets/magireco/ui/attr/${attr}.png">
      <img class="magic" src="assets/magireco/ui/magic/${magic}.png">
      <img class="magia" src="assets/magireco/ui/magia/${magia}-${episode}.png">
      <div class="level">${level}</div>
    </div>`
  };

  return module;
})();