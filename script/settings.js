let settings = (() => {

    let module = {};

    module.loadSettings = () => {
        let storage = module.getSettings();

        // set sort settings.

    };

    module.getSettings = () => {
        let settings = JSON.parse(window.localStorage.getItem("settings"));
        if (settings === null) {
            initSettings();
            settings = window.localStorage.getItem("settings");
        }
        return settings
    };

    module.updateSettings = () => {

    };

    const initSettings = () => {
        let sortProfiles = [];
        sortProfiles.push({group_by: "attribute", group_by_dir: 1, sort_by_1: "level", sort_dir_1: -1, sort_by_2: "none", sort_dir_2: -1, sort_id_dir: -1})
        window.localStorage.setItem("settings", JSON.stringify(sortProfiles));
    };






    return module;
})();