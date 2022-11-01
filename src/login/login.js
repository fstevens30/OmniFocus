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