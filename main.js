let todoListCont = document.querySelector("#todo-list-cont");
let addBtn = document.querySelector("#add-btn");
let resetBtn = document.querySelector("#reset-btn");
let deleteBtn = document.querySelector("#delete-btn");
let todoArray = []; // container for all todo objects
/*
todo array will looks like this:
todoArray = [
    {text: "item 1", checked: true},
    {text: "item 2", checked: false},
    {text: "item 3", checked: true}
]
*/

// get todo array from local storage and convert back to javascript array/object
function readFromStorage() {
    let fromStorage = localStorage.getItem("todoList");
    if (fromStorage !== null) {
        fromStorage = JSON.parse(fromStorage);
        todoArray.push(...fromStorage);
        displayTodoList(todoArray); // calling the display function
    } else {
        basicMessage();
    }
}

readFromStorage();

// display todo list from local storage & from new entry
/* This function will redisplay the todo list if:
    - the application started
    - new entry created
    */
function displayTodoList(listArr) {
    todoListCont.innerHTML = "";
    if (listArr.length !== 0) {
        listArr.forEach(function (item, index) {
            // create a div as a todo item container
            let newDiv = document.createElement("div");
            newDiv.setAttribute("id", index);
            newDiv.classList.add("item-cont");
            // create an input element (checkbox)
            let newChkBox = document.createElement("input");
            newChkBox.setAttribute("type", "checkbox");
            newChkBox.setAttribute("onclick", "checking(this)");
            newChkBox.checked = item.checked;
            // set tooltip
            newChkBox.setAttribute("title", "check/uncheck this entry");

            // create a list item with a todo item text
            let newLi = document.createElement("li");
            newLi.textContent = item.text;
            newLi.setAttribute("onclick", "renameItem(this)");
            // get info from the todoArray if the todo item was checked earlier
            if (item.checked === true) {
                newLi.classList.add("checked");
            }
            // set tooltip
            newLi.setAttribute("title", "rename this entry");

            // create a delete button
            let newDelBtn = document.createElement("i");
            newDelBtn.classList.add("fas", "fa-backspace");
            newDelBtn.setAttribute("onclick", "deleteItem(this)");
            // set tooltip
            newDelBtn.setAttribute("title", "delete this entry");
            // construct the new todo item and add to the list container
            newDiv.appendChild(newChkBox);
            newDiv.appendChild(newLi);
            newDiv.appendChild(newDelBtn);
            todoListCont.appendChild(newDiv);
        });
    } else {
        basicMessage();
    }
}

// save the todo list to the local storage as a string
function writeToStorage() {
    let toStorage = JSON.stringify(todoArray);
    localStorage.setItem("todoList", toStorage);
}

// call back when a checkbox is checked
function checking(box) {
    todoArray[parseInt(box.parentElement.id)].checked = box.checked; // update checked state
    let todoTextItem = box.nextElementSibling;
    todoTextItem.classList.toggle("checked"); // update css class
    writeToStorage(); // calling the write storage function
}

// delete individual todo list item
function deleteItem(delBtn) {
    let itemId = parseInt(delBtn.parentElement.id);
    todoArray.splice(itemId, 1);
    displayTodoList(todoArray); // calling the display function
    writeToStorage(); // calling the write storage function
}

// add new entry to the todo list
addBtn.addEventListener("click", function () {
    let newItemText = prompt("To Do:"); // ask for new entry
    if (newItemText !== "" && newItemText !== null) {
        todoArray.push({ text: newItemText, checked: false }); // update the todoArray
        displayTodoList(todoArray); // calling the display function
        writeToStorage(); // calling the write storage function
    }
    addBtn.blur();
});

// reset the full todo list
resetBtn.addEventListener("click", function () {
    todoArray.forEach(function (item) {
        item.checked = false;
    });
    displayTodoList(todoArray); // calling the display function
    writeToStorage(); // calling the write storage function
    resetBtn.blur();
});

// delete the full todo list
deleteBtn.addEventListener("click", function () {
    if (todoArray.length === 0) {
        alert("There is nothing on the todo list to delete.");
    } else {
        let confValue = confirm("Are you sure you want to permanently delete all item on the todo list?");
        if (confValue === true) {
            todoArray = []; // empty the todoArray
            basicMessage(); // empty the todo list container & display the basic message
            localStorage.removeItem("todoList"); // empty the local storage
        }
    }
    deleteBtn.blur();
});

// edit a todo item's text (rename)
function renameItem(liItem) {
    let id = liItem.parentElement.id;
    let newText = prompt("Enter the new text:", todoArray[id].text);
    if (newText !== "" && newText !== null) {
        todoArray[id].text = newText;
        displayTodoList(todoArray); // calling the display function
        writeToStorage(); // calling the write storage function
    }
}

// display a basic message if the todo list is empty
function basicMessage() {
    todoListCont.innerHTML = "";
    let title = document.createElement("h2");
    title.textContent = "Nothing to do for now...";
    todoListCont.appendChild(title);
}
