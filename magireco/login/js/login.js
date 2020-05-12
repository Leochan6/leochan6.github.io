(function () {
  "use strict";

  const signout_button = document.querySelector("#signout_button");
  const contact_button = document.querySelector("#contact_button");
  const header_buttons = document.querySelector("#header_buttons");
  const enter_button = document.querySelector("#enter_button");
  const header_username = document.querySelector("#header_username");

  const login_content = document.querySelector("#login_content");
  const email_text = document.querySelector("#email_text");
  const password_text = document.querySelector("#password_text");
  const forgot_password_open_label = document.querySelector("#forgot_password_open_label");
  const signin_button = document.querySelector("#signin_button");
  const open_signup_button = document.querySelector("#open_signup_button");
  const login_error = document.querySelector("#login_error");

  const signup_content = document.querySelector("#signup_content");
  const signup_name_text = document.querySelector("#signup_name_text");
  const signup_email_text = document.querySelector("#signup_email_text");
  const signup_password_text = document.querySelector("#signup_password_text");
  const signup_password_confirm_text = document.querySelector("#signup_password_confirm_text");
  const signup_button = document.querySelector("#signup_button");
  const cancel_signup_button = document.querySelector("#cancel_signup_button");
  const signup_error = document.querySelector("#signup_error");

  const anonymous_content = document.querySelector("#anonymous_content");
  const signin_anonymous_button = document.querySelector("#signin_anonymous_button");
  const anonymous_error = document.querySelector("#anonymous_error");

  const forgot_password_content = document.querySelector("#forgot_password_content");
  const forgot_password_email = document.querySelector("#forgot_password_email");
  const forgot_password_send_button = document.querySelector("#forgot_password_send_button");
  const forgot_password_cancel_button = document.querySelector("#forgot_password_cancel_button");

  const messageModal = document.querySelector("#messageModal");
  const messageModalText = document.querySelector("#messageModalText");
  const messageModalTitle = document.querySelector("#messageModalTitle");
  const messageModalContent = document.querySelector("#messageModalContent");
  const messageModalClose = document.querySelector("#messageModalClose");

  let userId = null

  window.onload = () => {

    database.onAuthStateChanged(user => {
      if (user) {
        login_content.classList.add("hidden");
        anonymous_content.classList.add("hidden");
        signout_button.classList.remove("hidden");
        enter_button.classList.remove("hidden");
        header_buttons.classList.remove("hidden");
        header_username.innerHTML = `Welcome ${user.displayName || "Anonymous"}`;
        userId = user.uid;
      } else {
        login_content.classList.remove("hidden");
        anonymous_content.classList.remove("hidden");
        signout_button.classList.add("hidden");
        enter_button.classList.add("hidden");
        header_buttons.classList.add("hidden");
        header_username.innerHTML = "";
        userId = null;
      }
    });

    forgot_password_open_label.addEventListener("click", e => {
      e.preventDefault();
      login_content.classList.add("hidden");
      forgot_password_content.classList.remove("hidden");
      errorHandler("", false);
    });

    signin_button.addEventListener("click", e => {
      e.preventDefault();
      let email = email_text.value;
      let password = password_text.value;
      if (!email) return errorHandler("Email must not be empty.");
      if (!password) return errorHandler("Password must not be empty.");
      database.signin(email, password, loginHandler, errorHandler);
    });

    open_signup_button.addEventListener("click", e => {
      e.preventDefault();
      login_content.classList.add("hidden");
      signup_content.classList.remove("hidden");
      errorHandler("", false);
    });

    cancel_signup_button.addEventListener("click", e => {
      e.preventDefault();
      signup_content.classList.add("hidden");
      login_content.classList.remove("hidden");
      errorSignupHandler("", false);
    });

    signup_button.addEventListener("click", e => {
      e.preventDefault();
      let name = signup_name_text.value;
      let email = signup_email_text.value;
      let password = signup_password_text.value;
      let confirm_password = signup_password_confirm_text.value;
      if (!name) return errorSignupHandler("Name must not be empty.");
      if (!password || !confirm_password) return errorSignupHandler("Password must not be empty.");
      if (password !== confirm_password) return errorSignupHandler("Your Password and Confirmation Password do not match.");
      database.signup(name, email, password, loginHandler, errorSignupHandler);
    });

    forgot_password_send_button.addEventListener("click", e => {
      e.preventDefault();
      let email = forgot_password_email.value;
      if (!email) errorResetHandler("Email must not be empty.");
      database.resetPassword(email, resetHandler, errorResetHandler);
    });

    forgot_password_cancel_button.addEventListener("click", e => {
      e.preventDefault();
      forgot_password_content.classList.add("hidden");
      login_content.classList.remove("hidden");
      errorResetHandler("", false);
    })

    signin_anonymous_button.addEventListener("click", e => {
      e.preventDefault();
      database.signInAnonymously(loginHandler, errorAnonymousHandler);
    });

    signout_button.addEventListener("click", () => {
      let res = confirm("Are you sure you want to Sign Out?");
      if (res) database.signout();
    });

    contact_button.addEventListener("click", () => {
      messageModal.style.display = "block";
      messageModalText.value = `For assistance, support, or feedback, please contact Leo Chan on Discord (Leo_Chan#9150) or Reddit (u/Leochan6). More Information at:\nhttps://github.com/Leochan6/leochan6.github.io/blob/master/magireco/README.md`;
      messageModalTitle.innerHTML = `Contact / Support`;
      messageModalList.innerHTML = "";
    });

    enter_button.addEventListener("click", () => {
      window.location.href = "character";
    });

    // hide modal dialogs
    window.addEventListener("click", (event) => {
      if (event.target == messageModal && messageModal.style.display === "block") closeMessageModal();
    });

    // hide message modal dialog
    messageModalClose.addEventListener("click", () => {
      closeMessageModal();
    });

    const closeMessageModal = () => {
      messageModal.style.display = "none";
      messageModalTitle.innerHTML = "";
      messageModalText.value = "";
      messageModalText.scrollTo(0, 0);
    };
  };

  const loginHandler = (userCred, name) => {
    if (userCred.additionalUserInfo.isNewUser) {
      if (name && name.length > 0) database.sendEmailVerification(() => { }, (errorMsg) => console.error(errorMsg), "Sign Up");
      name = name ? name : "Anonymous";
      userCred.user.updateProfile({ displayName: name });
      database.createUser(userCred.user.uid, name);
    }
    window.location.href = "character";
  };


  const errorHandler = (errorMsg, log = true) => {
    email_text.value = "";
    password_text.value = "";
    login_error.classList.remove("hidden");
    login_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  const errorSignupHandler = (errorMsg, log = true) => {
    signup_name_text.value = "";
    signup_email_text.value = "";
    signup_password_text.value = "";
    signup_password_confirm_text.value = "";
    signup_error.classList.remove("hidden");
    signup_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  const errorAnonymousHandler = (errorMsg, log = true) => {
    anonymous_error.classList.remove("hidden");
    anonymous_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  const resetHandler = () => {
    reset_success.classList.remove("hidden");
    reset_success.innerHTML = "A password reset email has been sent to the given email. If you do not see an email, please check the Junk or Spam folder.";
  };

  const errorResetHandler = (errorMsg, log = true) => {
    forgot_password_email.value = "";
    reset_error.classList.remove("hidden");
    reset_error.innerHTML = errorMsg;
    if (log) console.error(errorMsg);
  };

  utils.detectColorScheme();

})();