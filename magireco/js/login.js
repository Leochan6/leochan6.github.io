(function () {
  "use strict";

  window.onload = () => {

    database.onAuthStateChanged(user => {
      if (user) {
        document.querySelector("#login_content").classList.add("hidden");
        document.querySelector("#signout_button").classList.remove("hidden");
      } else {
        document.querySelector("#login_content").classList.remove("hidden");
        document.querySelector("#signout_button").classList.add("hidden");
      }
    });

    document.querySelector("#signin_button").addEventListener("click", e => {
      e.preventDefault();
      let email = document.querySelector("#email_text").value;
      let password = document.querySelector("#password_text").value;
      database.signin(email, password, loginHandler, errorHandler);
    });

    document.querySelector("#open_signup_button").addEventListener("click", e => {
      e.preventDefault();
      document.querySelector("#login_content").classList.add("hidden");
      document.querySelector("#signup_content").classList.remove("hidden");
    });

    document.querySelector("#cancel_signup_button").addEventListener("click", e => {
      e.preventDefault();
      document.querySelector("#signup_content").classList.add("hidden");
      document.querySelector("#login_content").classList.remove("hidden");
    });

    document.querySelector("#signup_button").addEventListener("click", e => {
      e.preventDefault();
      let name = document.querySelector("#signup_name_text").value;
      let email = document.querySelector("#signup_email_text").value;
      let password = document.querySelector("#signup_password_text").value;
      let confirm_password = document.querySelector("#signup_password_confirm_text").value;
      if (password !== confirm_password) return errorSignupHandler("Your Password and Confirmation Password do not match.");
      database.signup(name, email, password, loginHandler, errorSignupHandler);
    });

    document.querySelector("#signin_anonymous_button").addEventListener("click", e => {
      e.preventDefault();
      database.signInAnonymously(loginHandler, errorAnonymousHandler);
    });

    document.querySelector("#signout_button").addEventListener("click", () => {
      database.signout();
    });

  };

  const loginHandler = (userCred, name) => {
    if (userCred.additionalUserInfo.isNewUser) {
      name = name ? name : "Anonymous";
      userCred.user.updateProfile({ displayName: name });
      database.createUser(userCred.user.uid, name);
    }
    window.location.href = "list.html";
  };


  const errorHandler = (errorMsg) => {
    document.querySelector("#email_text").value = "";
    document.querySelector("#password_text").value = "";
    document.querySelector("#login_error").classList.remove("hidden");
    document.querySelector("#login_error").innerHTML = "";
    document.querySelector("#login_error").innerHTML = errorMsg;
    console.log(errorMsg);
  };

  const errorSignupHandler = (errorMsg) => {
    document.querySelector("#signup_email_text").value = "";
    document.querySelector("#signup_password_text").value = "";
    document.querySelector("#signup_password_confirm_text").value = "";
    document.querySelector("#signup_error").classList.remove("hidden");
    document.querySelector("#signup_error").innerHTML = "";
    document.querySelector("#signup_error").innerHTML = errorMsg;
    console.log(errorMsg);
  };

  const errorAnonymousHandler = (errorMsg) => {
    document.querySelector("#anonymous_error").classList.remove("hidden");
    document.querySelector("#anonymous_error").innerHTML = "";
    document.querySelector("#anonymous_error").innerHTML = errorMsg;
    console.log(errorMsg);
  };

})();