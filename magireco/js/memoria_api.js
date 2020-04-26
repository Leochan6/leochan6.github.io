let memoria_api = (function () {

  let module = {};

  module.selectedMemoria = null;

  module.Display = class Display {
    constructor(id, name, rank, ascension, level) {
      this.id = id;
      this.name = name;
      this.rank = rank;
      this.ascension = ascension;
      this.level = level;
    }
  };

  module.Memoria = class Memoria {
    constructor(id, name, rank) {
      this.id = id;
      this.name = name;
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
      let memoria = new module.Memoria(id, name, rank);
      return memoria;
    } catch (e) {
      return null;
    }
  };

  /**
   * updates the form fields with the selected memoria.
   */
  module.updateFieldsOnName = () => {
    let memoria = getMemoria(name_select.value);
    updateFormEnabled(character);
    memoria_preview = updateCharacterWithDisplay(memoria, getFormDisplay());
    updateForm(memoria_preview);
    updatePreviewDisplay(memoria_preview);
  };

  /**
   * adds a new character display to the list.
   */
  module.createAddDisplay = () => {
    let display = getFormDisplay();
    let memoria_display = module.createDisplay(display, true);
    memoria_list_content.appendChild(memoria_display);
    memoria_list_content.dispatchEvent(new Event("change"));
  };

  /**
   * updates the selected memoria display with the contents of the form.
   */
  module.updateSelectedDisplay = () => {
    let memoria_display = Array.from(document.querySelectorAll(".memoria_display:not(.preview)")).find(child => child.classList.contains("selected"));
    memoria_display.remove();

    let display = getFormDisplay();
    memoria_display = module.createDisplay(display, true);
    memoria_list_content.appendChild(memoria_display);
    memoria_list_content.dispatchEvent(new Event("change"));
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
      console.log(error);
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
    let display = new character_api.Display(
      memoria_display.getAttribute("character_id"),
      memoria_display.getAttribute("name"),
      memoria_display.getAttribute("rank"),
      memoria_display.getAttribute("ascension"),
      memoria_display.getAttribute("level"));
    return display;
  };

  const getMaxLevel = (ascension, rank) => {
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
    memoria_display.setAttribute("memoria_id", display.id);
    memoria_display.setAttribute("name", display.name);
    memoria_display.getAttribute("rank"),
      memoria_display.setAttribute("ascension", display.ascension);
    memoria_display.setAttribute("level", display.level);
    memoria_display.innerHTML = `
    <img class="memoria_image" src="/magireco/assets/memoria/memoria_${display.id}_s.png">
    <div class="level">
      <div class="level_pre">Lvl.</div>
      <div class="level_num">${display.level}/${getMaxLevel(display.ascension, display.rank)}</div>
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
    }
    return memoria_display;
  };

  /**
   * Enable and Disable the Memoria Buttons based on the current state.
   */
  module.enableButtons = () => {
    if (memoria_list_api.selectedList && memoria_list_api.selectedList.listId) {
      if (create_button.classList.contains("btnDisabled")) {
        create_button.classList.replace("btnDisabled", "btnGray");
        create_button.disabled = false;
      }
      if (min_all_button.classList.contains("btnDisabled")) {
        min_all_button.classList.replace("btnDisabled", "btnGray");
        min_all_button.disabled = false;
      }
      if (max_all_button.classList.contains("btnDisabled")) {
        max_all_button.classList.replace("btnDisabled", "btnGray");
        max_all_button.disabled = false;
      }
      if (module.selectedMemoria && module.selectedMemoria.memoria_display_element) {
        if (update_button.classList.contains("btnDisabled")) {
          update_button.classList.replace("btnDisabled", "btnGray");
          update_button.disabled = false;
        }
        if (copy_button.classList.contains("btnDisabled")) {
          copy_button.classList.replace("btnDisabled", "btnGray");
          copy_button.disabled = false;
        }
        if (delete_button.classList.contains("btnDisabled")) {
          delete_button.classList.replace("btnDisabled", "btnGray");
          delete_button.disabled = false;
        }
      } else {
        if (update_button.classList.contains("btnGray")) {
          update_button.classList.replace("btnGray", "btnDisabled");
          update_button.disabled = false;
        }
        if (copy_button.classList.contains("btnGray")) {
          copy_button.classList.replace("btnGray", "btnDisabled");
          copy_button.disabled = false;
        }
        if (delete_button.classList.contains("btnGray")) {
          delete_button.classList.replace("btnGray", "btnDisabled");
          delete_button.disabled = false;
        }
      }
    } else {
      if (create_button.classList.contains("btnGray")) {
        create_button.classList.replace("btnGray", "btnDisabled");
        create_button.disabled = true;
      }
      if (update_button.classList.contains("btnGray")) {
        update_button.classList.replace("btnGray", "btnDisabled");
        update_button.disabled = true;
      }
      if (copy_button.classList.contains("btnGray")) {
        copy_button.classList.replace("btnGray", "btnDisabled");
        copy_button.disabled = true;
      }
      if (delete_button.classList.contains("btnGray")) {
        delete_button.classList.replace("btnGray", "btnDisabled");
        delete_button.disabled = true;
      }
      if (min_all_button.classList.contains("btnGray")) {
        min_all_button.classList.replace("btnGray", "btnDisabled");
        min_all_button.disabled = true;
      }
      if (max_all_button.classList.contains("btnGray")) {
        max_all_button.classList.replace("btnGray", "btnDisabled");
        max_all_button.disabled = true;
      }
    }
  };

  module.startUp = () => {
    // initilize name field.
    let names = module.getNames();
    let prev_id = null;
    let memorias = [];
    names.forEach((memoria) => {
      if (memoria.id !== prev_id) {
        memorias.push(memoria);
        prev_id = memoria.id;
      }
    });
    memorias.forEach((memoria) => {
      name_select.options.add(new Option(memoria.name, memoria.id, false));
    });
    name_select.value = 1001;
    name_select.dispatchEvent(new Event("change"));

    // let memoria = getMemoria("1001");
    // updateFormEnabled(memoria);
    // updatePreviewDisplay(getBasicMemoriaDisplay(memoria));
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
      memoriaSelectModalList.append(container);
    });
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
        || memoria.pieceSkill.name.toLowerCase().includes(search)
        || memoria.pieceSkill.shortDescription.toLowerCase().includes(search)
        || memoria.pieceSkill2.name.toLowerCase().includes(search)
        || memoria.pieceSkill2.shortDescription.toLowerCase().includes(search)
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