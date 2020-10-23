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
            /*
            LIST ITEM TEMPLATE:
            
                <li class="list-item">
                    <div class="chkbox-cont">
                        <label class="chkbox-lbl" for="chk-1"></label>
                        <input class="chkbox" id="chk-1" type="checkbox" />
                        <i class="icon-unchecked far fa-circle"></i>
                        <i class="icon-checked fas fa-check-circle"></i>
                    </div>
                    <p class="item-text">Item gyaj One</p>
                    <i class="icon-delete fas fa-minus-circle"></i>
                </li>

            */
            // create a li item as a todo item container
            let newLi = document.createElement("li");
            newLi.setAttribute("id", index);
            newLi.classList.add("list-item");
            // create a conteiner for checkbox
            let newChkBoxCont = document.createElement("div");
            newChkBoxCont.classList.add("chkbox-cont");
            // set tooltip
            newChkBoxCont.setAttribute("title", "check/uncheck this entry");
            // create a label element for (checkbox)
            let newLbl = document.createElement("label");
            newLbl.classList.add("chkbox-lbl");
            newLbl.setAttribute("for", `chk-${index}`);
            // create an input element (checkbox)
            let newChkBox = document.createElement("input");
            newChkBox.classList.add("chkbox");
            newChkBox.setAttribute("id", `chk-${index}`);
            newChkBox.setAttribute("type", "checkbox");
            newChkBox.setAttribute("onclick", "checking(this)");
            newChkBox.checked = item.checked;
            // create an i element for unchecked icon
            let newIconUnchecked = document.createElement("i");
            newIconUnchecked.classList.add("icon-unchecked", "far", "fa-circle");
            // create an i element for checked icon
            let newIconChecked = document.createElement("i");
            newIconChecked.classList.add("icon-checked", "fas", "fa-check-circle");
            // create a p item with a todo item text
            let newListText = document.createElement("p");
            newListText.textContent = item.text;
            newListText.classList.add("item-text");
            newListText.setAttribute("onclick", "renameItem(this)");
            /* give states for items based on the todo array checked attribue*/
            if (item.checked === true) {
                newIconUnchecked.classList.add("hide");
                newListText.classList.add("checked");
            } else {
                newIconChecked.classList.add("hide");
            }
            // set tooltip
            newListText.setAttribute("title", "rename this entry");
            // create a delete button
            let newDelBtn = document.createElement("i");
            newDelBtn.classList.add("icon-delete", "fas", "fa-minus-circle");
            newDelBtn.setAttribute("onclick", "deleteItem(this)");
            // set tooltip
            newDelBtn.setAttribute("title", "delete this entry");
            // construct the new todo item and add to the list container
            newChkBoxCont.appendChild(newLbl);
            newChkBoxCont.appendChild(newChkBox);
            newChkBoxCont.appendChild(newIconUnchecked);
            newChkBoxCont.appendChild(newIconChecked);
            newLi.appendChild(newChkBoxCont);
            newLi.appendChild(newListText);
            newLi.appendChild(newDelBtn);
            todoListCont.appendChild(newLi);
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

// cross through an item
function checking(box) {
    let listItemId = parseInt(box.parentElement.parentElement.id);
    todoArray[listItemId].checked = box.checked; // update checked state in the todo array
    let todoTextItem = box.parentElement.parentElement.childNodes[1]; // get the actual text item
    let iconUnchecked = box.parentElement.childNodes[2]; // get the actual unchecked icon
    let iconChecked = box.parentElement.childNodes[3]; // get the actual checked icon
    // update css classes based on states
    iconUnchecked.classList.toggle("hide"); // update css class on icon unchecked
    iconChecked.classList.toggle("hide"); // update css class on icon checked
    todoTextItem.classList.toggle("checked"); // update css class on list text
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
