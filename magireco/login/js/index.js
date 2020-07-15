import { login_elements as elements } from './login_elements.js';
import * as database from '../../shared/js/database_api.js';
import * as utils from '../../shared/js/utils.js';
import { SignOutDialog, ContactDialog } from '../../shared/js/dialog.js';

(function () {
  "use strict";

  let userId = null
  let userName = null;

  window.onload = () => {

    database.onAuthStateChanged(user => {
      if (user) {
        elements.login_content.classList.add("hidden");
        elements.anonymous_content.classList.add("hidden");
        elements.signout_button.classList.remove("hidden");
        elements.header_buttons.classList.remove("hidden");
        elements.header_username.innerHTML = `Welcome ${user.displayName || userName || "Anonymous"}`;
        userId = user.uid;
      } else {
        elements.login_content.classList.remove("hidden");
        elements.anonymous_content.classList.remove("hidden");
        elements.signout_button.classList.add("hidden");
        elements.header_buttons.classList.add("hidden");
        elements.header_username.innerHTML = "";
        userId = null;
      }
    });

    elements.forgot_password_open_label.addEventListener("click", e => {
      e.preventDefault();
      elements.login_content.classList.add("hidden");
      elements.forgot_password_content.classList.remove("hidden");
      errorHandler("", false);
    });

    elements.signin_button.addEventListener("click", e => {
      e.preventDefault();
      let email = elements.email_text.value;
      let password = elements.password_text.value;
      if (!email) return errorHandler("Email must not be empty.");
      if (!password) return errorHandler("Password must not be empty.");
      database.signin(email, password, loginHandler, errorHandler);
    });

    elements.open_signup_button.addEventListener("click", e => {
      e.preventDefault();
      elements.login_content.classList.add("hidden");
      elements.signup_content.classList.remove("hidden");
      errorHandler("", false);
    });

    elements.cancel_signup_button.addEventListener("click", e => {
      e.preventDefault();
      elements.signup_content.classList.add("hidden");
      elements.login_content.classList.remove("hidden");
      errorSignupHandler("", false);
    });

    signup_button.addEventListener("click", e => {
      e.preventDefault();
      let name = elements.signup_name_text.value;
      let email = elements.signup_email_text.value;
      let password = elements.signup_password_text.value;
      let confirm_password = elements.signup_password_confirm_text.value;
      if (!name) return errorSignupHandler("Name must not be empty.");
      if (!password || !confirm_password) return errorSignupHandler("Password must not be empty.");
      if (password !== confirm_password) return errorSignupHandler("Your Password and Confirmation Password do not match.");
      userName = name;
      database.signup(name, email, password, loginHandler, errorSignupHandler);
    });

    elements.forgot_password_send_button.addEventListener("click", e => {
      e.preventDefault();
      let email = elements.forgot_password_email.value;
      if (!email) errorResetHandler("Email must not be empty.");
      database.resetPassword(email, resetHandler, errorResetHandler);
    });

    elements.forgot_password_cancel_button.addEventListener("click", e => {
      e.preventDefault();
      elements.forgot_password_content.classList.add("hidden");
      elements.login_content.classList.remove("hidden");
      errorResetHandler("", false);
      elements.reset_error.classList.add("hidden");
      elements.reset_success.innerHTML = "";
      elements.reset_success.classList.add("hidden");
    })

    elements.signin_anonymous_button.addEventListener("click", e => {
      e.preventDefault();
      database.signInAnonymously(loginHandler, errorAnonymousHandler);
    });

    elements.signout_button.addEventListener("click", () => {
      // new SignOutDialog((res) => {
      //   if (res) database.signout();
      // })
      let res = confirm("Are you sure you want to Sign Out?");
      if (res) database.signout();
    });

    elements.contact_button.addEventListener("click", () => {
      new ContactDialog();
    });
  }

  const loginHandler = (userCred, name) => {
    if (userCred.additionalUserInfo.isNewUser) {
      if (name && name.length > 0) database.sendEmailVerification(() => { }, (errorMsg) => console.error(errorMsg), "Sign Up");
      name = name ? name : "Anonymous";
      userCred.user.updateProfile({ displayName: name });
      database.createUser(userCred.user.uid, name);
      elements.header_username.innerHTML = `Welcome ${name}`;
      elements.signup_content.classList.add("hidden");
      elements.login_content.classList.remove("hidden");
      errorSignupHandler("", false);
    }
  };

  const errorHandler = (errorMsg, log = true) => {
    elements.email_text.value = "";
    elements.password_text.value = "";
    elements.login_error.classList.remove("hidden");
    elements.login_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  const errorSignupHandler = (errorMsg, log = true) => {
    elements.signup_name_text.value = "";
    elements.signup_email_text.value = "";
    elements.signup_password_text.value = "";
    elements.signup_password_confirm_text.value = "";
    elements.signup_error.classList.remove("hidden");
    elements.signup_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  const errorAnonymousHandler = (errorMsg, log = true) => {
    elements.anonymous_error.classList.remove("hidden");
    elements.anonymous_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  const resetHandler = () => {
    elements.reset_success.classList.remove("hidden");
    elements.reset_success.innerHTML = "A password reset email has been sent to the given email. If you do not see an email, please check the Junk or Spam folder.";
  };

  const errorResetHandler = (errorMsg, log = true) => {
    elements.forgot_password_email.value = "";
    elements.reset_error.classList.remove("hidden");
    elements.reset_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  utils.detectColorScheme();

})();