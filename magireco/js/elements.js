let elements = (() => {
  let module = {};


  // Error Text
  module.home_error_text = document.querySelector("#home_error_text");
  module.character_error_text = document.querySelector("#character_error_text");
  module.profile_error_text = document.querySelector("#profile_error_text");

  // User Heading
  module.name_heading = document.querySelector("#name_heading");

  // Tab Buttons
  module.tab_bar = document.querySelector("#tab_bar");
  module.home_tab_button = document.querySelector("#home_btn");
  module.char_tab_button = document.querySelector("#char_btn");
  module.sort_tab_button = document.querySelector("#sort_btn");
  module.setting_tab_button = document.querySelector("#setting_btn");

  // Home Buttons
  module.new_list_button = document.querySelector("#new_list_button");
  module.new_list_name_field = document.querySelector("#new_list_name_field");
  module.new_list_create_button = document.querySelector("#new_list_create_button");
  module.saved_character_lists = document.querySelector("#saved_character_lists");

  // Character Fields
  module.name_select = document.querySelector("#name_select");
  module.rank_select = document.querySelector("#rank_select");
  module.attr_select = document.querySelector("#attr_select");
  module.level_select = document.querySelector("#level_select");
  module.magic_select = document.querySelector("#magic_select");
  module.magia_select = document.querySelector("#magia_select");
  module.episode_select = document.querySelector("#episode_select");

  // Character Buttons
  module.create_button = document.querySelector("#create_button");
  module.update_button = document.querySelector("#update_button");
  module.copy_button = document.querySelector("#copy_button");
  module.delete_button = document.querySelector("#delete_button");
  module.clear_button = document.querySelector("#clear_button");

  // Character Preview
  module.display_preview = document.querySelector("#display_preview");

  // Sorting Profiles
  module.profile_select = document.querySelector("#profile_select");
  module.new_profile_button = document.querySelector("#new_profile_button");
  module.new_profile_row = document.querySelector("#new_profile_row");
  module.new_profile_field = document.querySelector("#new_profile_field");
  module.new_name_field = document.querySelector("#new_name_field");
  module.save_profile_button = document.querySelector("#save_profile_button");
  module.close_new_profile_button = document.querySelector("#close_new_profile_button");

  // Sorting Fields
  module.group_by_select = document.querySelector("#group_by_select");
  module.group_dir_select = document.querySelector("#group_dir_select");
  module.sort_by_1_select = document.querySelector("#sort_by_1_select");
  module.sort_dir_1_select = document.querySelector("#sort_dir_1_select");
  module.sort_by_2_select = document.querySelector("#sort_by_2_select");
  module.sort_dir_2_select = document.querySelector("#sort_dir_2_select");
  module.sort_id_dir_select = document.querySelector("#sort_id_dir_select");
  module.displays_per_row = document.querySelector("#displays_per_row");

  // Settings
  module.reset_profiles_button = document.querySelector("#reset_profiles_button");
  module.show_all_menus_checkbox = document.querySelector("#show_all_menus_checkbox");

  // Body
  module.list_name_title = document.querySelector("#list_name_title");
  module.character_list_content = document.querySelector("#character_list_content");
  module.main = document.querySelector("#main");
  module.left_bar = document.querySelector("#left_bar");


  return module;
});