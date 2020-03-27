const utils = (() => {

  let module = {};

  module.sortArrayBy = (a, b, sortBy) => {
    let i = 0,
      result = 0;
    while (i < sortBy.length && result === 0) {
      if (sortBy[i].isString) result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
      else result = sortBy[i].direction * (parseInt((a[sortBy[i].prop]).toString()) < parseInt((b[sortBy[i].prop]).toString()) ? -1 : (parseInt((a[sortBy[i].prop]).toString()) > parseInt((b[sortBy[i].prop]).toString()) ? 1 : 0));
      i++;
    }
    return result;
  }

  // Open the tab tabName and change event's button colour.
  module.openTab = (event, tabName) => {
    // document.querySelectorAll(".tab").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tab").forEach(tab => tab.classList.add("tab_hidden"));
    document.querySelectorAll(".tablink").forEach(link => link.classList.replace("btnBlue", "btnGray"))
    // document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.remove("tab_hidden");
    event.target.className = event.target.className.replace("btnGray", "btnBlue");
  }

  return module;
})()