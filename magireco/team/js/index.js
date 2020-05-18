import { team_elements as elements, messageDialog } from "./team_elements.js";

/* ------------------------------ General Modal Dialogs ------------------------------ */

// hide modal dialogs if not drag
let dragging = false;
window.addEventListener("mousedown", (event) => {
  let x = event.x;
  let y = event.y;
  dragging = false;
  window.addEventListener("mousemove", (event) => {
    if (Math.abs(x - event.screenX) > 5 || Math.abs(y - event.screenY) > 5) {
      dragging = true;
    }
  });
});

window.addEventListener("mouseup", (event) => {
  if (!dragging) {
    // [messageDialog, characterSelectDialog, backgroundSelectDialog, importListDialog].forEach(dialog => {
    [messageDialog].forEach(dialog => {
      if (event.target == dialog.modal && dialog.isOpen()) dialog.close();
    });
  }
});

window.addEventListener("keyup", e => {
  if (e.key === "Escape") {
    [messageDialog].forEach(dialog => {
      if (e.target == dialog.modal && dialog.isOpen()) return dialog.close();
    });
    if (character_api.selectedCharacter) {
      character_api.deselectDisplay();
    }
  }
});

/* ------------------------------ Message Modal Dialog ------------------------------ */

// hide message modal dialog
messageDialog.closeButton.addEventListener("click", () => {
  messageDialog.close();
});

// message modal dialog copy button.
messageDialog.copy.addEventListener("click", () => {
  navigator.clipboard.writeText(messageDialog.text.value);
});