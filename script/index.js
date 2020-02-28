(function () {
  "use strict";

  const collection = {ids: [1001, 1002, 1003]};

  class Display {
    constructor(id, rank, attr) {
      this.id = id;
      this.rank = rank;
      this.attr = attr;
    }
  }

  window.onload = () => {
    document.querySelector("#id_select").addEventListener("change", getAndShow);
    document.querySelector("#rank_select").addEventListener("change", getAndShow);
    document.querySelector("#attr_select").addEventListener("change", getAndShow);
    getIds();
    document.querySelector("#id_select").dispatchEvent(new Event("change"));
  };

  let getIds = () => {
    let id_select = document.querySelector("#id_select");
    collection.ids.forEach(id => {
      id_select.options.add(new Option(id, id, false));
    });
  }

  let getAndShow = () => {
    let display = new Display(
      document.querySelector("#id_select").value,
      document.querySelector("#rank_select").value,
      document.querySelector("#attr_select").value);
    show(display);
  }

  let show = ({id, rank, attr}) => {
    console.log("show", id, rank, attr);
    let display_div = document.querySelector("#display");
    display_div.innerHTML = `
    <img class="background" src="assets/magireco/ui/bg/${attr}.png">
    <img class="card_image" src="assets/magireco/card/image/card_${id}${rank}_d.png">
    <img class="frame_rank" src="assets/magireco/ui/frame/${rank}.png">
    <img class="star_rank" src="assets/magireco/ui/star/${rank}.png">
    <img class="att" src="assets/magireco/ui/attr/${attr}.png">`
  };

















}());