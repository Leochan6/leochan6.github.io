import * as character_api from '../../character/js/character_api.js';
import * as functions from '../../shared/js/functions.js';
import * as utils from '../../shared/js/utils.js';
import { ATT_TO_NUM, NUM_TO_ATT } from '../../character/js/character_list_api.js'

/* Elements */
const error_text = document.querySelector("#error_text");
const character_list_content = document.querySelector("#character_list_content");
const loading = document.querySelector("#loading");
const info = document.querySelector("#info");
const playerNameText = document.querySelector("#playerNameText");
const playerIdText = document.querySelector("#playerIdText");

/* Load List on Load */
window.addEventListener("load", () => {
  const playerId = new URLSearchParams(window.location.search).get("playerId");
  if (!playerId) return showError("No Player Id.");
  else if (playerId.length != 8) return showError("Invalid Player Id.");
  else clearError();
  loading.classList.remove("hidden");
  functions.getPlayerList({ playerId: playerId }).then(result => {
    if (result && result.data) {
      loading.classList.add("hidden");
      if (result.data.playerId && result.data.playerName) {
        info.classList.remove("hidden");
        playerIdText.innerHTML = result.data.playerId;
        playerNameText.innerHTML = result.data.playerName;
      }
      if (result.data.message) {
        return showError(result.data.message);
      }
      else if (result.data.list && result.data.list.characterList) {
        character_list_content.innerHTML = "";
        let sorts = [
          { prop: "level", direction: "-1", isString: false },
          { prop: "attribute", direction: "1", isString: false },
          { prop: "character_id", direction: "-1", isString: false }
        ];
        let list = Object.values(result.data.list.characterList);
        list.forEach(element => {
          let character = character_api.getCharacter(element.character_id);
          element.name = character.name;
          element.attribute = character.attribute;
        });
        list.forEach(char => char.attribute = ATT_TO_NUM[char.attribute]);
        list.sort((a, b) => utils.sortArrayBy(a, b, sorts));
        list.forEach(char => char.attribute = NUM_TO_ATT[char.attribute]);
        list.forEach(display => {
          let element = character_api.createDisplay(display);
          element.classList.add("preview");
          element.style.pointerEvents = "none";
          character_list_content.appendChild(element);
        });
      }
      else {
        return showError("some error.");
      }
    }
  }).catch(error => {
    loading.classList.add("hidden");
    return showError(error);
  });
});

const showError = (message) => {
  if (message) {
    error_text.classList.remove("hidden");
    error_text.innerHTML = message;
    console.log(message);
  } else {
    error_text.classList.add("hidden");
    error_text.innerHTML = "";
  }
};

const clearError = () => {
  error_text.classList.add("hidden");
  error_text.innerHTML = "";
};