let elements = (() => {
  let module = {};

  // Header
  module.theme_button = document.querySelector("#theme_button");
  module.signout_button = document.querySelector("#signout_button");
  module.header_username = document.querySelector("#header_username");

  // Error Text
  module.home_error_text = document.querySelector("#home_error_text");
  module.character_error_text = document.querySelector("#character_error_text");
  module.profile_error_text = document.querySelector("#profile_error_text");

  // Home Buttons
  module.list_create = document.querySelector("#list_create");
  module.list_duplicate = document.querySelector("#list_duplicate");
  module.new_list_button = document.querySelector("#new_list_button");
  module.duplicate_list_button = document.querySelector("#duplicate_list_button");
  module.delete_list_button = document.querySelector("#delete_list_button");
  module.duplicate_list_form = document.querySelector("#duplicate_list_form");
  module.duplicate_list_name_field = document.querySelector("#duplicate_list_name_field");
  module.duplicate_list_create_button = document.querySelector("#duplicate_list_create_button");
  module.new_list_form = document.querySelector("#new_list_form");
  module.new_list_name_field = document.querySelector("#new_list_name_field");
  module.new_list_create_button = document.querySelector("#new_list_create_button");
  module.saved_character_lists = document.querySelector("#saved_character_lists");

  // Create Character Fields
  module.name_select = document.querySelector("#name_select");
  module.rank_select = document.querySelector("#rank_select");
  module.level_select = document.querySelector("#level_select");
  module.magic_select = document.querySelector("#magic_select");
  module.magia_select = document.querySelector("#magia_select");
  module.episode_select = document.querySelector("#episode_select");
  module.doppel_select = document.querySelector("#doppel_select");

  // Create Character Buttons
  module.create_button = document.querySelector("#create_button");
  module.update_button = document.querySelector("#update_button");
  module.copy_button = document.querySelector("#copy_button");
  module.delete_button = document.querySelector("#delete_button");
  module.min_all_button = document.querySelector("#min_all_button");
  module.max_all_button = document.querySelector("#max_all_button");

  // Character Preview
  module.display_preview = document.querySelector("#display_preview");

  // Sorting Profiles
  module.profile_select = document.querySelector("#profile_select");
  module.new_profile_button = document.querySelector("#new_profile_button");
  module.profile_create_block = document.querySelector("#profile_create_block");
  module.new_profile_field = document.querySelector("#new_profile_field");
  module.new_name_field = document.querySelector("#new_name_field");
  module.create_profile_button = document.querySelector("#create_profile_button");
  module.close_new_profile_button = document.querySelector("#close_new_profile_button");
  module.delete_profile_button = document.querySelector("#delete_profile_button");
  module.profile_rules = document.querySelector("#profile_rules");

  // Display Settings
  module.displays_per_row = document.querySelector("#displays_per_row");
  module.display_alignment_select = document.querySelector("#display_alignment_select");
  module.display_padding_x_field = document.querySelector("#display_padding_x_field");
  module.display_padding_y_field = document.querySelector("#display_padding_y_field");

  // Background
  module.background_select = document.querySelector("#background_select");
  module.remove_background_button = document.querySelector("#remove_background_button");
  module.background_transparency_field = document.querySelector("#background_transparency_field");
  module.background_transparency_range = document.querySelector("#background_transparency_range");

  // Settings
  module.reset_profiles_button = document.querySelector("#reset_profiles_button");
  module.show_all_menus_checkbox = document.querySelector("#show_all_menus_checkbox");

  // Body
  module.list_name_title = document.querySelector("#list_name_title");
  module.character_list_content = document.querySelector("#character_list_content");
  module.header_content_divider = document.querySelector("#header_content_divider");
  module.content = document.querySelector("#content");
  module.main = document.querySelector("#main");
  module.menu_bar = document.querySelector("#menu_bar");
  module.left_main_divider = document.querySelector("#left_main_divider");
  module.main_header = document.querySelector("#main_header");

  // Export
  module.export_image_button = document.querySelector("#export_image_button");
  module.export_text_button = document.querySelector("#export_text_button");

  // Filters
  module.zoom_field = document.querySelector("#zoom_label");
  module.zoom_range = document.querySelector("#zoom_range");

  module.list_filters = document.querySelector("#list_filters");
  module.add_filter_button = document.querySelector("#add_filter_button");
  module.apply_filter_button = document.querySelector("#apply_filter_button");
  module.reset_filter_button = document.querySelector("#reset_filter_button");
  module.toggle_filter_button = document.querySelector("#toggle_filter_button");

  // Stats
  module.list_stats_list = document.querySelector("#list_stats_list");
  module.more_stats_button = document.querySelector("#more_stats_button");

  // Message Modal
  module.messageModal = document.querySelector("#messageModal");
  module.messageModalTitle = document.querySelector("#messageModalTitle");
  module.messageModalText = document.querySelector("#messageModalText");
  module.messageModalCopy = document.querySelector("#messageModalCopy");
  module.messageModalClose = document.querySelector("#messageModalClose");
  module.messageModalList = document.querySelector("#messageModalList");

  // Character Select Modal
  module.characterSelectModalOpen = document.querySelector("#characterSelectModalOpen");
  module.characterSelectModal = document.querySelector("#characterSelectModal");
  module.characterSelectModalClose = document.querySelector("#name_modal_close_button");
  module.characterSelectModalSearch = document.querySelector("#characterSelectModalSearch");
  module.characterSelectModalAdded = document.querySelector("#characterSelectModalAdded");
  module.characterSelectModalList = document.querySelector("#characterSelectModalList");

  // Background Select Modal
  module.backgroundSelectModalOpen = document.querySelector("#backgroundSelectModalOpen");
  module.backgroundSelectModal = document.querySelector("#backgroundSelectModal");
  module.backgroundSelectModalClose = document.querySelector("#backgroundSelectModalClose");
  module.backgroundSelectModalName = document.querySelector("#backgroundSelectModalName");
  module.backgroundSelectModalList = document.querySelector("#backgroundSelectModalList");

  // Message Modal
  module.importListModal = document.querySelector("#importListModal");
  module.importListModalTitle = document.querySelector("#importListModalTitle");
  module.importListModalName = document.querySelector("#importListModalName");
  module.importListModalText = document.querySelector("#importListModalText");
  module.importListModalImport = document.querySelector("#importListModalImport");
  module.importListModalClose = document.querySelector("#importListModalClose");
  module.importListModalList = document.querySelector("#importListModalList");
  module.importListModalError = document.querySelector("#importListModalError");


  return module;
});