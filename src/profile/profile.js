// PAGE LOAD:
//   1. Get account record
//   (On failure, redirect to error page with error message)
//   (Continue on success)
//   2. Add account details to the profile page

// CLICK FORM TEXT FIELD:
//   1. Change text field to editable (add class)

// UNFOCUS FORM INPUT FIELD:
//   1. Change text field to non-editable (remove class)
//   2. Update account record
//   (On failure, display error message)

function start() {
    // Redirect to login page if not logged in
    if (!auth.currentUser) {
        window.location.href = "../login/login.html";
    }

    // Add account name and email to the page
    document.getElementById("name-input-box").value = auth.currentUser.displayName;
    document.getElementById("email-input-box").value = auth.currentUser.email;
}

function updateProfile() {
    // Get the form values
    var name = document.getElementById("name-input-box").value;
    var email = document.getElementById("email-input-box").value;
    var currentPassword = document.getElementById("current-password-input-box").value;
    var newPassword = document.getElementById("new-password-input-box").value;

    // Inorder to update the details, we have to reauthenticate the user using the current password
    var credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

    auth.currentUser.reauthenticateWithCredential(credential).then(() => {
        // Success
        console.log("reauthenticated successfully");

        // Update the name
        auth.currentUser.updateProfile({
            displayName: name
        }).then(() => {
            // Success
            console.log("updated name successfully");
        }).catch((error) => {
            // Error
            console.log(error);
        });

        // Update the email
        auth.currentUser.updateEmail(email).then(() => {
            // Success
            console.log("updated email successfully");
        }).catch((error) => {
            // Error
            console.log(error);
        });

        // Update the password if provided
        if (newPassword != "") {
            auth.currentUser.updatePassword(newPassword).then(() => {
                // Success
                console.log("updated password successfully");
            }).catch((error) => {
                // Error
                console.log(error);
            });
        }
    }).catch((error) => {
        // Error
        console.log(error);
    });
}