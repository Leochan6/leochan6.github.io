export const sortArrayBy = (a, b, sortBy) => {
  let i = 0, result = 0;
  while (i < sortBy.length && result === 0) {
    if (sortBy[i].isString) result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
    else result = sortBy[i].direction * (parseInt((a[sortBy[i].prop]).toString()) < parseInt((b[sortBy[i].prop]).toString()) ? -1 : (parseInt((a[sortBy[i].prop]).toString()) > parseInt((b[sortBy[i].prop]).toString()) ? 1 : 0));
    i++;
  }
  return result;
};

// https://stackoverflow.com/a/56550819/7627317
export const detectColorScheme = () => {
  var theme = "light";    //default to light

  // local storage is used to override OS theme settings
  if (window.localStorage.getItem("theme")) {
    if (window.localStorage.getItem("theme") == "dark") {
      theme = "dark";
    }
  } else if (!window.matchMedia) {
    // matchMedia method not supported
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // OS theme setting detected as dark
    theme = "dark";
  }
  setTheme(theme);
};

export const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  let theme_button = document.querySelector("#theme_button");
  if (theme === "light") {
    if (theme_button) {
      if (theme_button.classList.contains("light")) theme_button.classList.replace("light", "dark");
      else if (!theme_button.classList.contains("dark")) theme_button.classList.add("dark");
    }
    window.localStorage.setItem("theme", "light");
  } else if (theme === "dark") {
    if (theme_button) {
      if (theme_button.classList.contains("dark")) theme_button.classList.replace("dark", "light");
      else if (!theme_button.classList.contains("light")) theme_button.classList.add("light");
    }
    window.localStorage.setItem("theme", "dark");
  }
};
