export class Dialog {
  constructor() {
    this.dialog = document.createElement("div");
    this.dialog.style.display = "block";

    // hide dialog if not drag
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
      if (!dragging && event.target == this.dialog && this.isOpen()) this.close();
    });
  }

  isOpen = () => {
    return this.dialog.style.display === "block";
  }

  close = () => {
    return;
  }
  
}


export class MessageDialog extends Dialog {

  constructor({ title, text, list, copy, link_name, link_target }) {
    super();
    this.dialog = document.createElement("div");
    this.dialog.className = "message-modal modal";
    this.dialog.innerHTML = `\
    <div class="modal-content modal-fit-width modal-fit-height">\
      <div class="modal-header">\
        <h2 class="modal-title">${title ?? "Message"}</h2>\
        <button class="modal-close">&times;</span>\
      </div>\
      <div class="horizontal-divider"></div>
      <div class="modal-main">\
        <textarea class="modal-text form_input" readonly>${text ?? ""}</textarea>\
        <button class="modal-copy small_btn">Copy</button>\
        <a class="modal-link" target="_blank" href="./">Link</a>\
        <div class="modal-list">${list ?? ""}</div>\
      </div>\
    </div>`;
    document.body.appendChild(this.dialog);
    this.dialog.style.display = "block";

    this.title = this.dialog.querySelector(".modal-title");
    this.closeBtn = this.dialog.querySelector(".modal-close");
    this.text = this.dialog.querySelector(".modal-text");
    this.copyBtn = this.dialog.querySelector(".modal-copy");
    this.link = this.dialog.querySelector(".modal-link");
    this.list = this.dialog.querySelector(".modal-list");
    
    if (!text) this.text.style.display = "none";
    
    if (link_name) {
      this.link.innerHTML = link_name;
      this.link.setAttribute("href", link_target);
    } else this.link.style.display = "none";

    if (!copy) this.copyBtn.style.display = "none";

    this.closeBtn.addEventListener("click", () => {
      this.close();
    });

    this.copyBtn.addEventListener("click", () => {
      this.copy();
    });
  };

  close = () => {
    this.dialog.remove();
  }

  copy = () => {
    navigator.clipboard.writeText(this.text.value);
    alert("Text Copied to Clipboard")
  }
};

export class ContactDialog extends MessageDialog {
  constructor() {
    super({
      title: "Contact / Support",
      text: false,
      link: false,
      copy: false,
    });
    this.list.innerHTML = `
    <p>For assistance, support, or feedback, please contact Leo Chan at</p>
    <li>Discord: Leo_Chan#9150 or <a target="_blank" href="https://discord.gg/magiarecord">PMMM: Magia Record Discord Server</a></li>
    <li>Reddit: <a target="_blank" href="https://www.reddit.com/message/compose/?to=Leochan6">u/Leochan6</a></li>
    <p>For more information and how to use, <a target="_blank" href="https://github.com/Leochan6/leochan6.github.io/blob/master/magireco/README.md">check the README file</a></p>`;
  }
}

export class AlertDialog extends Dialog {
  constructor({title, text, buttons}, callback) {
    super();
    let _this = this;
    this.dialog = document.createElement("div");
    this.dialog.className = "alert-modal modal";
    this.dialog.innerHTML = `\
    <div class="modal-content modal-fit-width modal-fit-height">\
      <div class="modal-header">\
        <h2 class="modal-title">${title ?? "Message"}</h2>\
        <button class="modal-close">&times;</span>\
      </div>\
      <div class="horizontal-divider"></div>
      <div class="modal-main">\
        <textarea class="modal-text form_input" readonly>${text ?? ""}</textarea>\
        <div class="modal-buttons"></div>
      </div>\
    </div>`;
    document.body.appendChild(this.dialog);
    this.dialog.style.display = "block";
    
    this.title = this.dialog.querySelector(".modal-title");
    this.closeBtn = this.dialog.querySelector(".modal-close");
    this.text = this.dialog.querySelector(".modal-text");
    this.buttons = this.dialog.querySelector(".modal-buttons");

    if (!text) this.text.style.display = "none";

    if (buttons) {
      Object.values(buttons).forEach(({text, res}) => {
        let button = document.createElement("button");
        button.innerHTML = text;
        button.className = "small_btn"
        button.addEventListener("click", () => {
          _this.close();
          callback(res);
        });
        this.buttons.appendChild(button);
      });
    }

    this.closeBtn.addEventListener("click", () => {
      _this.close();
      callback(false);
    });
    
    this.close = () => {
      this.dialog.remove();
    }
  }
}

export class SignOutDialog extends AlertDialog {
  constructor(callback) {
    super({
      title: 'Are you sure you want to Sign Out?', 
      buttons: { true: { text: 'OK', res: true}, false: { text: 'Cancel', res: false} } 
    }, callback);
  }
}

export class CharacterSelectDialog extends Dialog {
  constructor() {
    super();
    this.dialog.className = "character-select-modal modal";
    this.dialog.innerHTML = `\
    <div class="modal-content modal-large-width modal-large-height">\
      <div>\
        <div class="modal-header>\
          <h2 class="modal-title">Character Select</h2>\
          <span class="modal-close">&times;</span>\
        </div>\
        <input type="search" class="modal-search form_input" placeholder="Search">\
        <label id="added_label" for="added">Hide Added:</label>\
          <input type="checkbox" id="added">\
      </div>\
      <div class="modal-body">\
        <div class="modal-list"></div>\
      </div>\
    </div>`;
    document.body.appendChild(this.dialog);
    this.dialog.style.display = "block";
    
    this.title = this.dialog.querySelector(".modal-title");
    this.closeBtn = this.dialog.querySelector(".modal-close");
    this.search = this.dialog.querySelector(".modal-search");
    this.added = this.dialog.querySelector("#added");
    this.list = this.dialog.querySelector(".modal-list");
    
    this.search.focus();
  }
}
export class BackgroundSelectDialog extends Dialog {
  constructor(loadPreviews) {
    super();
    this.dialog.className = "background-select-modal modal";
    this.dialog.innerHTML = `\
    <div class="modal-content modal-large-width modal-large-height">\
      <div>\
        <div class="modal-header">\
        <h2 class="modal-title">Background Select</h2>\
        <span class="modal-close">&times;</span>\
        </div>\
        <input type="search" class="modal-search form_input" placeholder="Search">\
      </div>\
      <div class="modal-body">\
      <div class"modal-list"></div>\
      </div>\
    </div>`;
    document.body.appendChild(this.dialog);
    this.dialog.style.display = "block";

    this.title = this.dialog.querySelector(".modal-title");
    this.closeBtn = this.dialog.querySelector(".modal-close");
    this.search = this.dialog.querySelector(".modal-search");
    this.added_checkbox = this.dialog.querySelector("#added_checkbox");
    this.list = this.dialog.querySelector(".modal-list");

    this.search.focus();
    loadPreviews();
  }
}
export class ImportListDialog extends Dialog {
  constructor() {
    super();
    this.dialog.className = "import-list-modal modal";
    this.dialog.innerHTML = `\
    <div class="modal-content modal-medium-width modal-large-height">\
      <div class="modal-header">\
        <h2 class="modal-title">Import List</h2>\
        <span class="modal-close">&times;</span>\
      </div>\
      <input type="text" class="modal-name form_input" placeholder="List Name"></textarea>\
      <textarea class="modal-text form_input" placeholder="JSON"></textarea>\
      <button class="modal-import small_btn">Import</button>\
      <div class"modal-list"></div>\
      <p class="error_text"></p>\
    </div>`;
    document.body.appendChild(this.dialog);
    this.dialog.style.display = "block";
    
    this.title = this.dialog.querySelector(".modal-title");
    this.closeBtn = this.dialog.querySelector(".modal-close");
    this.name = this.dialog.querySelector(".modal-name");
    this.text = this.dialog.querySelector("#modal-text");
    this.importBtn = this.dialog.querySelector(".modal-import");
    this.list = this.dialog.querySelector(".modal-list");
    this.error = this.dialog.querySelector(".error_text");

  }
}