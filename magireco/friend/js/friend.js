import * as character_api from '../../character/js/character_api.js';
import * as functions from '../../shared/js/functions.js';

/* Elements */
const error_text = document.querySelector("#error_text");
const character_list_content = document.querySelector("#character_list_content");
const info = document.querySelector("#info");
const playerNameText = document.querySelector("#playerNameText");
const playerIdText = document.querySelector("#playerIdText");

/* Load List on Load */
window.addEventListener("load", () => {
  const playerId = new URLSearchParams(window.location.search).get("playerId");
  if (!playerId) return showError("No Player Id.");
  else if (playerId.length != 8) return showError("Invalid Player Id.");
  else clearError();
  functions.getPlayerList({ playerId: playerId }).then(result => {
    if (result && result.data) {
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
        Object.entries(result.data.list.characterList).forEach(([id, display]) => {
          display._id = id;
          let character = character_api.getCharacter(display.character_id);
          display.name = character.name;
          display.attribute = character.attribute;
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