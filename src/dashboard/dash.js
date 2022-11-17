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
        // Loop through each task in the user's list
        querySnapshot.forEach(function(doc) {
            // Run the addTask function to add the task to the dashboard page
            addTask(doc.id, doc.data());
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    }
)}

function trash(id) {
    // Get the task element and remove it from the task list
    document.getElementById(id).remove();
    
    // Get the task from the database and delete it
    db.collection("tasks").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function newTask() {
    var task = {
        title: "New Task",
        description: "",
        active: true,
        user: auth.currentUser.uid,
        lastMod: new Date()
    };

    // Create a new task in the database
    db.collection("tasks").add(task).then(function(docRef) {
        // Success, add the task to the dashboard page
        addTask(docRef.id, task);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function addTask(id, data) {
    // Create the task element and add it to the task list
    var task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("id", id);
    task.setAttribute("data-active", data.active);
    document.getElementById("task-list").appendChild(task);

    // Create the taskbox element and add it to the task element
    var taskbox = document.createElement("div");
    taskbox.classList.add("task-box");
    task.appendChild(taskbox);

    // Create the task title element and add it to the taskbox element
    var h1 = document.createElement("h1");
    h1.setAttribute("contenteditable", "true");
    h1.innerHTML = data.title;
    taskbox.appendChild(h1);

    // Create the task date element and add it to the taskbox element
    var h2 = document.createElement("h2");
    h2.innerHTML = dateParser(data.lastMod);
    taskbox.appendChild(h2);

    // Create the trash button element and add it to the taskbox element
    var trashicon = document.createElement("i");
    trashicon.classList.add("fa");
    trashicon.classList.add("fa-trash-o");
    trashicon.setAttribute("aria-hidden", "true");
    trashicon.setAttribute("onclick", "trash(\"" + id + "\")");
    taskbox.appendChild(trashicon);

    // Create the task text element and add it to the task element
    var tasktext = document.createElement("div");
    tasktext.classList.add("task-text");
    task.appendChild(tasktext);

    // Create the task description element and add it to the task text element
    var textarea = document.createElement("textarea");
    textarea.placeholder = "Description";
    textarea.innerHTML = data.description;
    tasktext.appendChild(textarea);
}

function dateParser(date) {
    // Get the current date in seconds
    var now = new Date().getTime() / 1000;
    var diff = now - date.seconds;
    
    // Will use the highest unit of time possible for the difference
    // e.g 1 minute ago instead of 100 seconds ago or 3 years ago instead of the days and months

    var message = 0;

    // Check if the difference is none or n/a
    if (diff == 0 || isNaN(diff)) {
        return "Last modified just now";
    }

    // Check if the difference is less than a minute
    if (diff < 60) {
        message = Math.floor(diff)
        return "Last modified " + message + ` second${message == 1 ? "" : "s"} ago`;
    }

    // Check if the difference is less than an hour
    if (diff < 3600) {
        message = Math.floor(diff / 60);
        return "Last modified " + message + ` minute${message == 1 ? "" : "s"} ago`;
    }

    // Check if the difference is less than a day
    if (diff < 86400) {
        message = Math.floor(diff / 3600);
        return "Last modified " + message + ` hour${message == 1 ? "" : "s"} ago`;
    }

    // Check if the difference is less than a week
    if (diff < 604800) {
        message = Math.floor(diff / 86400);
        return "Last modified " + message + ` day${message == 1 ? "" : "s"} ago`;
    }

    // Check if the difference is less than a month
    if (diff < 2629746) {
        message = Math.floor(diff / 604800);
        return "Last modified " + message + ` week${message == 1 ? "" : "s"} ago`;
    }

    // Check if the difference is less than a year
    if (diff < 31556952) {
        message = Math.floor(diff / 2629746);
        return "Last modified " + message + ` month${message == 1 ? "" : "s"} ago`;
    }
    
    // The difference is more than a year, return the difference in years
    message = Math.floor(diff / 31556952);
    return "Last modified " + message + ` year${message == 1 ? "" : "s"} ago`;
}
