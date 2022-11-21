// PAGE LOAD:
//   1. Check if the user is logged in
//   (Redirect to dashboard if logged in)
//   (Continue on not logged in)
//   2. Check cookie for whether the user has an account
//   (Show login page if they do)
//   (Show signup page if they don't)

// CLICK "SIGN UP" BUTTON:
//   1. Check if the email has been taken
//   (If it has then show error message and option to login with that email)
//   (Continue on not taken)
//   2. Check if the passwords match
//   (If they don't then show error message)
//   (Continue on match)
//   3. Add user to database (with hashed password)
//   (On failure, show error message)
//   (Continue on success)
//   4. Redirect to dashboard using the account

// CLICK "LOGIN" BUTTON:
//   1. Check if the email exists
//   (If it doesn't then show error message and option to sign up with that email)
//   (Continue on exists)
//   2. Check if the hash of the password matches the hash in the database
//   (If it doesn't then show error message)
//   (Continue on match)
//   3. Redirect to dashboard using the account

// SWITCH TO SIGN UP PAGE:
//   1. Hide form elements not needed for sign up
//   2. Toggle active class for form switch buttons

// SWITCH TO LOGIN PAGE:
//   1. Hide form elements not needed for login
//   2. Toggle active class for form switch buttons

function sign_up(first = false) {
    var x = document.getElementById("login");
    var y = document.getElementById("sign_up");
    var z = document.getElementById("btn");

    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "110px";
    
    // Copy over any values from the login form to the sign up form
    document.getElementById("sign-up-em").value = document.getElementById("login-em").value;
    document.getElementById("sign-up-pw").value = document.getElementById("login-pw").value;

    if (first) {
        x.style.transition = "0s";
        y.style.transition = "0s";
        z.style.transition = "0s";

        // Run function after 0.1 seconds
        setTimeout(function() {
            x.style.transition = "0.5s";
            y.style.transition = "0.5s";
            z.style.transition = "0.5s";

            x.style.opacity = 1;
            y.style.opacity = 1;
            z.style.opacity = 1;
        }, 10);
    }
}

function login(first = false) {
    var x = document.getElementById("login");
    var y = document.getElementById("sign_up");
    var z = document.getElementById("btn");

    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0px";

    // Copy over any values from the sign up form to the login form
    document.getElementById("login-em").value = document.getElementById("sign-up-em").value;
    document.getElementById("login-pw").value = document.getElementById("sign-up-pw").value;

    if (first) {
        x.style.transition = "0s";
        y.style.transition = "0s";
        z.style.transition = "0s";

        // Run function after 0.1 seconds
        setTimeout(function() {
            x.style.transition = "0.5s";
            y.style.transition = "0.5s";
            z.style.transition = "0.5s";

            x.style.opacity = 1;
            y.style.opacity = 1;
            z.style.opacity = 1;
        }, 10);
    }
}

function try_login() {
    console.log('login');
    // Get the email and hash of the password from the form
    var email = document.getElementById("login-em").value;
    var pw = document.getElementById("login-pw").value;

    console.log("email: " + email);
    console.log("pw: " + pw);

    auth.signInWithEmailAndPassword(email, pw).then((userCredential) => {
        // Success
        console.log("success, logged in as " + userCredential.user.email);
        // Redirect to dashboard
        window.location.href = "/dash";
    }).catch((error) => {
        // Error
        console.log(error);
    });
}

function try_sign_up() {
    var name = document.getElementById("sign-up-nm").value;
    var email = document.getElementById("sign-up-em").value;
    var password = document.getElementById("sign-up-pw").value;
    var password_confirm = document.getElementById("sign-up-cpw").value;

    // Check if the passwords match
    if (password != password_confirm) {
        console.log("passwords don't match");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        // Success
        console.log("success, signed up as " + userCredential.user.email);
    
        // Get date ten years from now (for cookie expiry)
        var now = new Date();
        var expires = new Date(now.getTime() + 3153600000000);

        document.cookie = "account=new; expires=" + expires.toUTCString() + "; path=/";

        // Set the username of the user
        userCredential.user.updateProfile({
            displayName: name
        }).then(() => {
            // Update successful
            console.log("updated username to " + name);

            // Redirect to dashboard
            window.location.href = "/dash";
        }).catch((error) => {
            // An error occurred
            console.log(error);
        });
    }).catch((error) => {
        // Error
        console.log(error);
    });
}

window.onload = function() {
    // Check cookie for whether the user has an account
    if (document.cookie.includes('account')) {
        // Show login page
        login(true);
    }
    else {
        // Show signup page
        sign_up(true)
    }
}

// Run when the page loads
function start() {
    // Log out any users who choose to log out
    if (window.location.hash == "#log-out" && auth.currentUser) {
        // Log out
        auth.signOut().then(() => {
            // Sign-out successful
            console.log("logged out");
            // Redirect to login page
            window.location.hash = "";
        }).catch((error) => {
            // An error happened
            console.log(error);
        });
    }
    // Redirect any logged in users to the dashboard
    else if (user) {
        // Redirect to dashboard
        window.location.href = "/dash";
    }
};