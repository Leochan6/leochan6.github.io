(function () {
  "use strict";

  window.onload = () => {
    document.querySelector("#login_button").addEventListener("click", e => {
      e.preventDefault();
      const userId = document.querySelector("#login_id_field").value;
      document.querySelector("#login_error").innerHTML = "";
      if (!userId) return document.querySelector("#login_error").innerHTML = `User ID must not be empty.`
      database.getUser(userId).then(snap => {
        if (snap.val()) window.location.href = `list.html?user=${userId}`;
        else {
          document.querySelector("#login_error").innerHTML = `User ID ${userId} does not exist.`
        }
      });
    });

    document.querySelector("#signup_button").addEventListener("click", e => {
      e.preventDefault();
      const userName = document.querySelector("#signup_name_field").value;
      document.querySelector("#signup_error").innerHTML = "";
      if (!userName) return document.querySelector("#signup_error").innerHTML = `User Name must not be empty.`
      const userId = database.createUser(userName);
      console.log(`Created User ${userName} with User ID ${userId}`);
      document.querySelector("#user_id_result").innerHTML = userId;
      document.querySelector("#signup_result").classList.remove("tab_hidden");

      document.querySelector("#copy_id_button").addEventListener("click", () => {
        navigator.clipboard.writeText(userId);
      });
    });


  };

})();