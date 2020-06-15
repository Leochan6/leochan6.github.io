export const login_elements = {
  signout_button: document.querySelector("#signout_button"),
  contact_button: document.querySelector("#contact_button"),
  header_buttons: document.querySelector("#header_buttons"),
  enter_character_link: document.querySelector("#enter_character_link"),
  enter_memoria_link: document.querySelector("#enter_memoria_link"),
  enter_teams_link: document.querySelector("#enter_teams_link"),
  header_username: document.querySelector("#header_username"),

  login_content: document.querySelector("#login_content"),
  email_text: document.querySelector("#email_text"),
  password_text: document.querySelector("#password_text"),
  forgot_password_open_label: document.querySelector("#forgot_password_open_label"),
  signin_button: document.querySelector("#signin_button"),
  open_signup_button: document.querySelector("#open_signup_button"),
  login_error: document.querySelector("#login_error"),

  signup_content: document.querySelector("#signup_content"),
  signup_name_text: document.querySelector("#signup_name_text"),
  signup_email_text: document.querySelector("#signup_email_text"),
  signup_password_text: document.querySelector("#signup_password_text"),
  signup_password_confirm_text: document.querySelector("#signup_password_confirm_text"),
  signup_button: document.querySelector("#signup_button"),
  cancel_signup_button: document.querySelector("#cancel_signup_button"),
  signup_error: document.querySelector("#signup_error"),

  anonymous_content: document.querySelector("#anonymous_content"),
  signin_anonymous_button: document.querySelector("#signin_anonymous_button"),
  anonymous_error: document.querySelector("#anonymous_error"),

  forgot_password_content: document.querySelector("#forgot_password_content"),
  forgot_password_email: document.querySelector("#forgot_password_email"),
  forgot_password_send_button: document.querySelector("#forgot_password_send_button"),
  forgot_password_cancel_button: document.querySelector("#forgot_password_cancel_button"),
  reset_success: document.querySelector("#reset_success"),
  reset_error: document.querySelector("#reset_error"),

}

export const messageDialog = {
  modal: document.querySelector("#messageModal"),
  content: document.querySelector("#messageModalContent"),
  title: document.querySelector("#messageModalTitle"),
  text: document.querySelector("#messageModalText"),
  list: document.querySelector("#messageModalList"),
  closeButton: document.querySelector("#messageModalClose"),

  open: (title, text="", list="") => {
    messageDialog.modal.style.display = "block";
    messageDialog.title.innerHTML = title;
    messageDialog.text.value = text;
    messageDialog.list.innerHTML = list;
  },
  close: () => {
    messageDialog.modal.style.display = "none";
    messageDialog.title.innerHTML = "";
    messageDialog.text.value = "";
    messageDialog.text.scrollTo(0, 0);
  },
  isOpen: () => {
    return messageDialog.modal.style.display === "block";
  }
}