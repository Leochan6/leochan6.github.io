let memoria_api = (function () {

  let module = {};

  module.selectedMemoria = null;

  module.Display = class Display {
    constructor(id, name, type, rank, ascension, level) {
      if (type === undefined) {
        this._id = id;
        this.memoria_id = name.memoria_id;
        this.name = name.name;
        this.type = name.type;
        this.rank = name.rank;
        this.ascension = name.ascension;
        this.level = name.level;
      } else {
        this.memoria_id = id;
        this.name = name;
        this.type = type;
        this.rank = rank;
        this.ascension = ascension;
        this.level = level;
      }
    }
  };

  module.Memoria = class Memoria {
    constructor(id, name, type, rank) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.rank = rank;
    }
  };

  module.getNames = () => {
    let names = memoria_collection.map(memoria => {
      return { id: memoria.id, name: memoria.name };
    });
    names = [...new Set(names)];
    names = names.sort((a, b) => a.name > b.name ? 1 : -1);
    return names;
  };

  /**
     * get the name and rank for the memoria.
     * 
     * @param {String} id 
     * @param {Function} callback 
     */
  const getMemoria = (id) => {
    try {
      let memoria_elem = memoria_collection.find(elem => elem.id === id);
      let name = memoria_elem.name;
      let rank = memoria_elem.rank;
      let type = memoria_elem.type;
      let memoria = new module.Memoria(id, name, type, rank);
      return memoria;
    } catch (e) {
      return null;
    }
  };

  module.minimizeDisplay = () => {
    let memoria_display = module.getMemoriaDisplay(display_preview.children[0]);
    let memoria = memoria_collection.find(elem => elem.id === memoria_display.memoria_id);
    let display = new module.Display(memoria.id, memoria.name, memoria.type, memoria.rank, "0", "1");
    updateForm(display);
    updatePreviewDisplay(display);
  };

  module.maximizeDisplay = () => {
    let memoria_display = module.getMemoriaDisplay(display_preview.children[0]);
    let memoria = memoria_collection.find(elem => elem.id === memoria_display.memoria_id);
    let display = new module.Display(memoria.id, memoria.name, memoria.type, memoria.rank, "4", module.getMaxLevel("4", memoria.rank));
    updateForm(display);
    updatePreviewDisplay(display);
  };

  /**
   * updates the display preview with Display.
   * 
   * @param {HTMLDivElement} display
   */
  const updatePreviewDisplay = (display) => {
    let memoria_display = module.createDisplay(display);
    memoria_display.classList.add("preview");
    display_preview.innerHTML = "";
    display_preview.appendChild(memoria_display);
  };

  /**
   * updates the form with Display.
   * 
   * @param {module.Display} display
   */
  const updateForm = (display) => {
    name_select.value = display.memoria_id;
    type_select.type = display.type;
    rank_select.value = display.rank;
    level_select.value = display.level;
    ascension_select.value = display.ascension;
  };

  /**
   * updates the form with the available options and selects lowest.
   * 
   * @param {module.Memoria} memoria
   */
  const updateFormEnabled = (memoria) => {
    // enable or disable the rank select.
    for (let i = 0; i < 4; i++) {
      rank_select.options[i].disabled = rank_select.options[i].value != memoria.rank;
    }
    rank_select.value = memoria.rank;
    // enable or disable the type select.
    for (let i = 0; i < 2; i++) {
      type_select.options[i].disabled = type_select.options[i].value != memoria.type;
    }
    type_select.value = memoria.type;
  };

  /**
   * gets the standard display given the display.
   * 
   * @param {module.Memoria} memoria 
   * @param {*} display 
   */
  const updateMemoriaWithDisplay = (memoria, display) => {
    // return the default display.
    if (!display) return getBasicMemoriaDisplay(memoria);
    return new module.Display(memoria.id, memoria.name, memoria.type, memoria.rank, display.ascension, display.level);
  };

  /**
   * gets the basic display for the memoria.
   * 
   * @param {module.Memoria} memoria 
   */
  const getBasicMemoriaDisplay = (memoria) => {
    return new module.Display(memoria.id, memoria.name, memoria.type, memoria.rank, "0", "1");
  };

  /**
   * check if display is valid.
   * 
   * @param {String} memoria_id 
   * @param {module.Display} display 
   * @param {Function} callback 
   */
  module.isValidMemoriaDisplay = (memoria_id, display, validName = true) => {
    let memoria = getMemoria(memoria_id);
    if (!memoria) return ["Cannot get memoria."]
    let err = [];
    // check id.
    if (display.memoria_id !== memoria.id) err.push(`Display Id ${display.memoria_id} does not match Memoria ID ${memoria.id}.`);
    // check name.
    if (display.name !== memoria.name && validName) err.push(`Display Name ${display.name} does not match Memoria Name ${memoria.name}.`);
    // check type.
    if (display.type !== memoria.type) err.push(`Display Type ${display.type} does not match Memoria Type ${memoria.type}.`);
    // check rank.
    if (display.rank !== memoria.rank) err.push(`Display Rank ${display.rank} does not match Memoria Rank ${memoria.rank}`);
    // check level.
    let maxLevel = module.getMaxLevel(display.ascension, display.rank);
    if (parseInt(display.level) < 1 || parseInt(display.level) > maxLevel) err.push(`Display Level ${display.level} for Display Rank ${display.rank} and Display Ascension ${display.ascension} must be between 1 and ${maxLevel}.`);
    // check ascension.
    if (display.ascension < 0 || display.ascension > 4) err.push(`Display Magic ${display.ascension} must be between 0 and 4.`);
    return err;
  };

  /**
   * updates the form fields with the selected memoria.
   */
  module.updateFieldsOnName = () => {
    let memoria = getMemoria(name_select.value);
    updateFormEnabled(memoria);
    memoria_preview = updateMemoriaWithDisplay(memoria, getFormDisplay());
    updateForm(memoria_preview);
    updatePreviewDisplay(memoria_preview);
  };

  /**
   * adds a new character display to the list.
   */
  module.createAddDisplay = () => {
    let display = getFormDisplay();
    display._id = generatePushID();
    let memoria_display = module.createDisplay(display, true);
    memoria_list_content.appendChild(memoria_display);
    memoria_list_content.dispatchEvent(new Event("change"));
  };

  /**
   * updates the selected memoria display with the contents of the form.
   */
  module.updateSelectedDisplay = () => {
    let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let _id = memoria_display.getAttribute("_id");
    memoria_display.remove();

    let display = getFormDisplay();
    display._id = _id;
    memoria_display = module.createDisplay(display, true);
    module.selectedMemoria = null;
    memoria_list_content.appendChild(memoria_display);
    memoria_list_content.dispatchEvent(new Event("change"));
    module.enableButtons();
  };

  /**
   * copies the contents of the selected display to the form.
   */
  module.copyDisplay = () => {
    let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
    let display = module.getMemoriaDisplay(memoria_display);
    getMemoria(memoria_display.getAttribute("memoria_id"), memoria => updateFormEnabled(memoria));
    updateForm(display);
    updatePreviewDisplay(display);
  };

  /**
   * updates the preview memoria display with the contents of the form.
   */
  module.updatePreviewOnForm = () => {
    let display = getFormDisplay();
    memoria_error_text.innerHTML = '';
    let error = module.isValidMemoriaDisplay(name_select.value, display);
    if (error.length == 0) {
      create_button.disabled = false;
      updatePreviewDisplay(display);
    } else {
      create_button.disabled = true;
      memoria_error_text.innerHTML = error.toString();
    }
  };

  /**
   * get Display from the form.
   * 
   * @return {module.Display}
   */
  const getFormDisplay = () => {
    let display = new memoria_api.Display(
      name_select.value,
      name_select[name_select.options.selectedIndex].text,
      type_select.value,
      rank_select.value,
      ascension_select.value,
      level_select.value);
    memoria_preview = display;
    return display;
  };

  /**
   * get Display from memoria display.
   * 
   * @param {HTMLDivElement} memoria_display
   * @return {module.Display}
   */
  module.getMemoriaDisplay = (memoria_display) => {
    let display = new memoria_api.Display(
      memoria_display.getAttribute("memoria_id"),
      memoria_display.getAttribute("name"),
      memoria_display.getAttribute("type"),
      memoria_display.getAttribute("rank"),
      memoria_display.getAttribute("ascension"),
      memoria_display.getAttribute("level"));
    display._id = memoria_display.getAttribute("_id");
    return display;
  };

  module.getMaxLevel = (ascension, rank) => {
    if (rank == "1") return (10 + (5 * parseInt(ascension))).toString();
    else if (rank == "2") return (15 + (5 * parseInt(ascension))).toString();
    else if (rank == "3") return (20 + (5 * parseInt(ascension))).toString();
    else if (rank == "4") return (30 + (5 * parseInt(ascension))).toString();
  };

  /**
   * create a memoria display element from Display.
   * 
   * @param {module.Display} display
   * @return {HTMLDivElement}
   */
  module.createDisplay = (display, listener) => {
    let memoria_display = document.createElement("div");
    memoria_display.classList.add("memoria_display");
    memoria_display.setAttribute("_id", display._id);
    memoria_display.setAttribute("memoria_id", display.memoria_id);
    memoria_display.setAttribute("name", display.name);
    memoria_display.setAttribute("type", display.type);
    memoria_display.setAttribute("rank", display.rank);
    memoria_display.setAttribute("ascension", display.ascension);
    memoria_display.setAttribute("level", display.level);
    memoria_display.innerHTML = `
    <img class="memoria_image" src="/magireco/assets/memoria/memoria_${display.memoria_id}_s.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}/${module.getMaxLevel(display.ascension, display.rank)}</div>
    </div>
    <img class="ascension_rank" src="/magireco/assets/ui/ascension/${display.ascension}.png">`;
    if (listener) {
      memoria_display.addEventListener("click", () => {
        // return of already selected.
        if (memoria_display.classList.contains("selected")) return;
        // deselect all other character displays
        document.querySelectorAll(".memoria_display:not(.preview)").forEach(child => {
          if (child.classList.contains("selected")) child.classList.remove("selected");
        });
        memoria_display.classList.add("selected");
        module.selectedMemoria = { memoria_display_element: memoria_display, memoria_display: display };
        module.enableButtons();
      });
      memoria_display.addEventListener("contextmenu", e => {
        e.preventDefault();
        module.openMemoriaDialog(memoria_collection.find(elem => elem.id === display.memoria_id));
      });
    }
    return memoria_display;
  };

  /**
   * Enable and Disable the Memoria Buttons based on the current state.
   */
  module.enableButtons = () => {
    if (memoria_list_api.selectedList && memoria_list_api.selectedList.listId) {
      if (create_button.classList.contains("")) {
        create_button.classList.replace("", "");
        create_button.disabled = false;
      }
      if (min_all_button.classList.contains("")) {
        min_all_button.classList.replace("", "");
        min_all_button.disabled = false;
      }
      if (max_all_button.classList.contains("")) {
        max_all_button.classList.replace("", "");
        max_all_button.disabled = false;
      }
      if (module.selectedMemoria && module.selectedMemoria.memoria_display_element) {
        if (update_button.classList.contains("")) {
          update_button.classList.replace("", "");
          update_button.disabled = false;
        }
        if (copy_button.classList.contains("")) {
          copy_button.classList.replace("", "");
          copy_button.disabled = false;
        }
        if (delete_button.classList.contains("")) {
          delete_button.classList.replace("", "");
          delete_button.disabled = false;
        }
      } else {
        if (update_button.classList.contains("")) {
          update_button.classList.replace("", "");
          update_button.disabled = false;
        }
        if (copy_button.classList.contains("")) {
          copy_button.classList.replace("", "");
          copy_button.disabled = false;
        }
        if (delete_button.classList.contains("")) {
          delete_button.classList.replace("", "");
          delete_button.disabled = false;
        }
      }
    } else {
      if (create_button.classList.contains("")) {
        create_button.classList.replace("", "");
        create_button.disabled = true;
      }
      if (update_button.classList.contains("")) {
        update_button.classList.replace("", "");
        update_button.disabled = true;
      }
      if (copy_button.classList.contains("")) {
        copy_button.classList.replace("", "");
        copy_button.disabled = true;
      }
      if (delete_button.classList.contains("")) {
        delete_button.classList.replace("", "");
        delete_button.disabled = true;
      }
      if (min_all_button.classList.contains("")) {
        min_all_button.classList.replace("", "");
        min_all_button.disabled = true;
      }
      if (max_all_button.classList.contains("")) {
        max_all_button.classList.replace("", "");
        max_all_button.disabled = true;
      }
    }
  };

  module.startUp = () => {
    // initilize name field.
    [...memoria_collection].sort((a, b) => a.name > b.name ? 1 : -1).forEach((memoria) => {
      name_select.options.add(new Option(memoria.name, memoria.id, false));
    });
    name_select.value = 1001;
    name_select.dispatchEvent(new Event("change"));

    let memoria = getMemoria("1001");
    updateFormEnabled(memoria);
    updatePreviewDisplay(getBasicMemoriaDisplay(memoria));
  };

  /**
   * opens the modal dialog for memoria selection user interface.
   */
  module.openMemoriaSelect = () => {
    memoriaSelectModal.style.display = "block";
    memoriaSelectModalList.innerHTML = "";
    memoriaSelectModalSearch.focus();
    memoria_collection.forEach(memoria => {
      let container = document.createElement("div");
      container.classList.add("memoria_image_preview");
      container.setAttribute("id", memoria.id);
      let image = document.createElement("img");
      image.src = `/magireco/assets/memoria/memoria_${memoria.id}_s.png`;
      image.title = memoria.name;
      container.append(image);
      container.addEventListener("click", () => {
        name_select.value = memoria.id;
        name_select.dispatchEvent(new Event("change"));
        memoriaSelectModal.style.display = "none";
        memoriaSelectModalSearch.value = "";
      });
      container.addEventListener("contextmenu", e => {
        e.preventDefault();
        module.openMemoriaDialog(memoria);
      });
      memoriaSelectModalList.append(container);
    });
  };

  module.openMemoriaDialog = (memoria) => {
    messageModal.style.display = "block";
    messageModalText.value = `Type: ${memoria.type}\
      \nEffect: ${memoria.pieceSkill.shortDescription}\
      \nMLB Effect: ${memoria.pieceSkill2.shortDescription}\
      \nUsable: ${memoria.charaList ? memoria.charaList[0].name : "ALL"}\
      \nFandom Wiki Link:\n${memoria.url}`
    messageModalTitle.innerHTML = `${memoria.name} `;
    messageModalList.innerHTML = "";
  };

  module.filterMemoria = (search) => {
    if (!search || search.length == 0) {
      Array.from(memoriaSelectModalList.children).forEach(child => {
        if (child.classList.contains("hidden")) {
          child.classList.remove("hidden");
          child.style.display = "inline-block";
        }
      });
    }
    search = search.toLowerCase();
    Array.from(memoriaSelectModalList.children).forEach(child => {
      let memoria = memoria_collection.find(elem => child.getAttribute("id") === elem.id);
      if (memoria.id.includes(search)
        || memoria.name.toLowerCase().includes(search)
        || memoria.type.toLowerCase().includes(search)
        || memoria.rank.toLowerCase().includes(search)
        || memoria.description.toLowerCase().includes(search)
        || memoria.pieceSkill.name.toLowerCase().includes(search)
        || memoria.pieceSkill.shortDescription.toLowerCase().includes(search)
        || memoria.pieceSkill2.name.toLowerCase().includes(search)
        || memoria.pieceSkill2.shortDescription.toLowerCase().includes(search)
        || (memoria.charaList !== undefined && memoria.charaList[0].name.toLowerCase().includes(search))
      ) {
        child.classList.remove("hidden");
        child.style.display = "inline-block";
      } else {
        child.classList.add("hidden");
        child.style.display = "none";
      }
    });
  };

  return module;

})();