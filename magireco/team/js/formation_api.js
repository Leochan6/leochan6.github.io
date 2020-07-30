import { formation_collection } from "../../collection/formation_collection.js";
import * as character_api from "../../character/js/character_api.js";
import * as memoria_api from "../../memoria/js/memoria_api.js";
import * as storage_api from "./storage_api.js";

let formation = formation_collection[10];
let characters = ["1001", "1002", "1003", "0", "1005"].map(id => id === "0" ? false : character_api.getBasicCharacterDisplay(character_api.getCharacter(id)));
characters[0].magic = 2;
characters[1].episode = 5
characters[1].magia = 5
characters[1].magic = 3
characters[1].rank = "5"
characters[1].level = "100"
characters[1].doppel = "true"

let memorias = [
  ["1070", "1122", "9002", "1151"],
  ["1070", "1122", "9002", "1151"],
  ["1070", "1122", "9002", "1151"],
  ["1070", "1122", "9002", "1151"],
  ["1070", "1122", "9002", "1151"]
].map(row => row.map(id => memoria_api.getBasicMemoriaDisplay(memoria_api.getMemoria(id))));
memorias[0][0].ascension = 4;
memorias[0][0].level = 50;
const deckFormation = document.querySelector("#DeckFormation");

let charaIndex = 0;
for (let myPos = 1; myPos <= 9; myPos++) {

  if (!formation.places[myPos]) continue;

  let deckFormationPart = document.createElement("div")
  deckFormationPart.classList.add("deckFormationPart");
  deckFormationPart.innerHTML = `
    <div class="formationHead">
      <div class="head">
        <div class="formationMiniMap"></div>
        <div class="formationEffect"></div>
      </div>
    </div>
    <div class="deckPartsWrap">
      <div class="character"></div>
      <table class="charaStatus">
        <tr>
          <td class="statusName">HP</td>
          <td class="statusValue statusHP">1</td>
        </tr>
        <tr>
          <td class="statusName">ATK</td>
          <td class="statusValue statusATK">2</td>
        </tr>
        <tr>
          <td class="statusName">DEF</td>
          <td class="statusValue statusDEF">3</td>
        </tr>
      </table>
      <div class="memoriaList"></div>
    </div>
  `
  if (characters[charaIndex]) {
    const character_display = character_api.createDisplay(characters[charaIndex], false);
    deckFormationPart.querySelector(".character").appendChild(character_display);
  } else {
    const character_missing = document.createElement("div");
    character_missing.classList.add("noCharacter");
    deckFormationPart.querySelector(".character").appendChild(character_missing);
  }

  const formationMiniMap = deckFormationPart.querySelector(".formationMiniMap");
  for (let i = 1; i <= 9; i++) {
    if (formation.places[i] !== undefined) {
      const pos = document.createElement("span");
      pos.classList.add(`pos_${i}`);
      if (i === myPos) pos.classList.add("on");
      formationMiniMap.appendChild(pos);
    }
  }

  const formationEffect = deckFormationPart.querySelector(".formationEffect");
  if (formation.places[myPos].att1 !== "none") {
    const attIcon = document.createElement("img")
    attIcon.classList.add("attIcon");
    attIcon.src = `http://android.magica-us.com/magica/resource/image_web/common/chara/att_${formation.places[myPos].att1}.png`
    formationEffect.appendChild(attIcon);
    const effText1 = document.createElement("img")
    effText1.classList.add("effText");
    effText1.src = `http://android.magica-us.com/magica/resource/image_web/icon/formation/${formation.places[myPos].eff1}.png`
    formationEffect.appendChild(effText1);
    if (formation.places[myPos].eff2) {
      const effText2 = document.createElement("img")
      effText2.classList.add("effText");
      effText2.src = `http://android.magica-us.com/magica/resource/image_web/icon/formation/${formation.places[myPos].eff2}.png`
      formationEffect.appendChild(effText2);
    }
  }

  const memoriaList = deckFormationPart.querySelector(".memoriaList");
  
  for (let memoriaIndex = 0; memoriaIndex < 4; memoriaIndex++) {
    if (memorias[charaIndex].length >= memoriaIndex) {
      const memoria_display = memoria_api.createDisplay(memorias[charaIndex][memoriaIndex], false);
      memoriaList.appendChild(memoria_display);
      if (!characters[charaIndex] || characters[charaIndex].magic < memoriaIndex) {
        memoria_display.classList.add("noSlot")
      }
    }
  }

  deckFormation.appendChild(deckFormationPart);
  charaIndex++;
}