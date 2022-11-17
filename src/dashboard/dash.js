// PAGE LOAD:
//   1. Get records from user's list
//   (On failure, redirect to error page with error message)
//   (Continue on success)
//   2. Add records to the dashboard page
//   3. Check cookies if the user has logged in before
//   (If they haven't then continue)
//   4. Display welcome message and simple instructions
//   5. Update the cookie to show that the user has logged in before

// TRASH BUTTON:
//   1. Display confirmation popup
//   (On cancel, close popup)
//   (Continue on confirm)
//   2. Delete record from user's list
//   3. Update progress bar and task count

// CLICK TITLE/DESCRIPTION TEXT FIELD:
//   1. Change text field to editable (add class)

// UNFOCUS TITLE/DESCRIPTION INPUT FIELD:
//   1. Change text field to non-editable (remove class)
//   2. Update record in user's list
//   (On failure, display error message)
//   3. Update Last Modified date

// CLICK "ADD NEW TASK" BUTTON:
//   1. Add a default record to the dashboard page
//   2. Add a default record to user's list

// CLICK ACTIVE/COMPLETE CHECKBOX:
//   1. Toogle active status of record
//   2. Update record in user's list
//   3. Update progress bar

// Start by getting the user's list of tasks
function start() {
    db.collection("tasks").where("user", "==", auth.currentUser.uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            var task = document.createElement("div");
            task.classList.add("task");
            task.setAttribute("id", doc.id);
            document.getElementById("task-list").appendChild(task);

            var taskbox = document.createElement("div");
            taskbox.classList.add("task-box");
            task.appendChild(taskbox);

            var h1 = document.createElement("h1");
            h1.setAttribute("contenteditable", "true");
            h1.innerHTML = doc.data().title;
            taskbox.appendChild(h1);

            var h2 = document.createElement("h2");
            h2.innerHTML = "Coming Soon";
            taskbox.appendChild(h2);

            var trashicon = document.createElement("i");
            trashicon.classList.add("fa");
            trashicon.classList.add("fa-trash-o");
            trashicon.setAttribute("aria-hidden", "true");
            taskbox.appendChild(trashicon);

            var tasktext = document.createElement("div");
            tasktext.classList.add("task-text");
            task.appendChild(tasktext);

            var textarea = document.createElement("textarea");
            textarea.placeholder = "Description";
            textarea.innerHTML = doc.data().description;
            tasktext.appendChild(textarea);
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    }
)}