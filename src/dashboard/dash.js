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

// Start by getting the user's list of tasks and adding the user's name to the page
function start() {
    // Redirect the user if they are not logged in
    if (!auth.currentUser) {
        window.location.href = "../login/login.html";
    }
    // Add the user's name before the wave class
    document.getElementById("username").innerHTML = ", " + auth.currentUser.displayName;
    document.getElementById("user-name").innerHTML = auth.currentUser.displayName;
    db.collection("tasks").where("user", "==", auth.currentUser.uid).get().then(function(querySnapshot) {
        // Loop through each task in the user's list
        querySnapshot.forEach(function(doc) {
            // Run the addTask function to add the task to the dashboard page
            addTask(doc.id, doc.data());
        });
        // Update the progress bar
        updateProgress();
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

    // Update the progress bar
    updateProgress();

    // If there are no tasks left, display the empty message
    if (document.getElementById("task-list").childElementCount == 0) {
        document.getElementById("task-list").innerHTML = "<p id='empty-message'>You have no tasks.<br>Click the 'Add New Task' button to add a task.</p>";
    }
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

        // Update the progress bar
        updateProgress();
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function addTask(id, data) {
    // Remove the empty message if it exists
    if (document.getElementById("empty-message")) {
        document.getElementById("empty-message").remove();
    }

    // Create the task element and add it to the task list
    var task = document.createElement("div");
    task.classList.add("task");
    task.classList.add((data.active ? "active" : "complete"));
    task.setAttribute("id", id);
    document.getElementById("task-list").appendChild(task);

    // Create the taskbox element and add it to the task element
    var taskbox = document.createElement("div");
    taskbox.classList.add("task-box");
    task.appendChild(taskbox);

    // Create the checkbox element and add it to the taskbox element
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", id + "-checkbox");
    checkbox.setAttribute("onclick", "toggleActive('" + id + "')");
    checkbox.checked = !data.active;
    taskbox.appendChild(checkbox);

    // Create the task title element and add it to the taskbox element
    var h1 = document.createElement("h1");
    h1.setAttribute("contenteditable", "true");
    h1.innerHTML = data.title;
    h1.setAttribute("id", id + "-title");
    h1.addEventListener("focusout", function() {
        updateTask(id);
    });
    taskbox.appendChild(h1);

    // Create the task date element and add it to the taskbox element
    var h2 = document.createElement("h2");
    h2.innerHTML = dateParser(data.lastMod);
    h2.setAttribute("id", id + "-date");
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
    textarea.setAttribute("id", id + "-description");
    textarea.addEventListener("focusout", function() {
        updateTask(id);
    });
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

function updateTask(id) {
    // Update the task in the database
    db.collection("tasks").doc(id).update({
        title: document.getElementById(id + "-title").innerHTML,
        description: document.getElementById(id + "-description").value,
        lastMod: new Date()
    }).then(function() {
        console.log("Document successfully updated!");
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

    // Update the task date
    document.getElementById(id + "-date").innerHTML = "Last modified just now";
}

function toggleActive(id) {
    // Toggle the active state of the task in the database
    db.collection("tasks").doc(id).update({
        active: !document.getElementById(id + "-checkbox").checked,
        lastMod: new Date()

    }).then(function() {
        console.log("Document successfully updated!");
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

    // Toggle the active state of the task on the dashboard
    document.getElementById(id).classList.toggle("active");
    document.getElementById(id).classList.toggle("complete");

    // Update the task date
    document.getElementById(id + "-date").innerHTML = "Last modified just now";

    // Update the progress bar
    updateProgress();
}

function updateProgress() {
    // Get the number of all tasks
    var all = document.getElementsByClassName("task").length;

    // Get the number of complete tasks
    var complete = document.getElementsByClassName("complete").length;

    // Update the ratio of complete tasks to all tasks
    document.getElementById("progress-ratio").innerHTML = complete + "/" + all;

    // Calculate the progress
    var progress = (complete / all) * 100;

    // Update the progress bar width
    document.getElementsByClassName("progress-bar-fill")[0].style.width = progress + "%";

    // Update the progress bar background color
    document.getElementsByClassName("progress-bar-fill")[0].style.backgroundColor = progressColor(progress / 100);
}

function progressColor(decimal) {

    console.log(decimal);
    // Colors will be mixed depending on the percent of completion
    // 1 (100%) = green (#008A0E)
    // 0.8 (80%) = lime (#7EAC11)
    // 0.6 (60%) = yellow (#FCCE14)
    // 0.4 (40%) = orange (#CC4E00)
    // 0.2 (20%) = red (#E81313)
    // 0 (0%) = red (#E81313) but 0% opacity

    // E.G progressColor(1) = #008A0E (100% green)
    // E.G progressColor(0.9) =    #3f9b10 (50% green + 50% lime)
    // E.G progressColor(0.8) = #7EAC11 (100% lime)

    var ceilColor = "" // The first color to be mixed
    var ratio = 0 // How much of the first color to mix with the second color (Second will be 1 - ratio)
    var floorColor = "" // The second color to be mixed

    if (decimal == 1) { // If the progress is 100% (all tasks are complete)
        ceilColor = "#008A0E";
        floorColor = "#008A0E";
        ratio = 0.5; // Will mix black with itself, so it will just be black
    }
    else if (decimal >= 0.8) { // If the progress is between 80% and 100%
        ceilColor = "#008A0E";
        floorColor = "#7EAC11";
        ratio = (decimal - 0.8) / 0.2; // Will mix so that the color transitions from green to lime as the progress goes from 100% to 80%
    }
    else if (decimal >= 0.6) { // If the progress is between 60% and 80%
        ceilColor = "#7EAC11";
        floorColor = "#FCCE14";
        ratio = (decimal - 0.6) / 0.2; // Will mix so that the color transitions from lime to yellow as the progress goes from 80% to 60%
    }
    else if (decimal >= 0.4) {
        ceilColor = "#FCCE14";
        floorColor = "#CC4E00";
        ratio = (decimal - 0.4) / 0.2; // Will mix so that the color transitions from yellow to orange as the progress goes from 60% to 40%
    }
    else if (decimal >= 0.2) { // If the progress is between 20% and 40%
        ceilColor = "#CC4E00";
        floorColor = "#E81313";
        ratio = (decimal - 0.2) / 0.2; // Will mix so that the color transitions from orange to red as the progress goes from 40% to 20%
    }
    else if (decimal >= 0) { // If the progress is between 0% and 20%
        color = "#E81313";
        opacity = decimal / 0.2; // Will make the color more transparent as the progress goes from 20% to 0%
        return "rgba(232, 19, 19, " + opacity + ")"; // Return the color with the opacity
    }
    else { // If the progress is 0% (no tasks are complete)
        return "transparent"; // Will be transparent
    }

    // Mix the colors using the ratio provided

    // Converts each hex value to an integer, adds them together using the ratio
    var red = parseInt(ceilColor.substring(1, 3), 16) * ratio + parseInt(floorColor.substring(1, 3), 16) * (1 - ratio);
    var green = parseInt(ceilColor.substring(3, 5), 16) * ratio + parseInt(floorColor.substring(3, 5), 16) * (1 - ratio);
    var blue = parseInt(ceilColor.substring(5, 7), 16) * ratio + parseInt(floorColor.substring(5, 7), 16) * (1 - ratio);

    // Converts the integers back to hex values (capatilized)
    red = Math.round(red).toString(16).toUpperCase();
    green = Math.round(green).toString(16).toUpperCase();
    blue = Math.round(blue).toString(16).toUpperCase();

    // Fixes the hex values that are only one character long (e.g. 0 instead of 00 or 9 instead of 09)
    // Adds the RGB values together with the # in front to make a hex color
    return "#" + (red.length == 1 ? "0" + red : red) + (green.length == 1 ? "0" + green : green) + (blue.length == 1 ? "0" + blue : blue);
}