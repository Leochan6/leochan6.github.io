(function () {
  "use strict";

  window.onload = () => {

    if (database.onAuthStateChanged(user => {
      if (user) window.location.href = "list.html";
    }));


    document.querySelector("#login_button").addEventListener("click", e => {
      e.preventDefault();
      let email = document.querySelector("#email_text").value;
      let password = document.querySelector("#password_text").value;
      database.login(email, password, loginHandler, errorHandler);
    });

    document.querySelector("#signup_button").addEventListener("click", e => {
      e.preventDefault();
      let email = document.querySelector("#email_text").value;
      let password = document.querySelector("#password_text").value;
      database.signup(email, password, loginHandler, errorHandler);
    });


  };

  const loginHandler = (userCred) => {
    if (userCred.additionalUserInfo.isNewUser) database.createUser(userCred.user.uid);
    window.location.href = "list.html";
  };


  const errorHandler = (errorMsg) => {
    document.querySelector("#email_text").value = ""
    document.querySelector("#password_text").value = ""
    document.querySelector("#login_error").innerHTML = errorMsg;
  };

})();