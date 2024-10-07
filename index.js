const addedTask = document.getElementById("input-task");
const taskContainer = document.getElementById("task-container");
const tasksLeft = document.getElementById("item-left");
const statusButtons = document.querySelectorAll(".statusBtn");
const removeAllBtn = document.getElementById("removeAll");
const toggleBtn = document.getElementById("toggleBtn");
const toggleImg = document.getElementById("toggleImg");

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let prefferedTheme = localStorage.getItem("theme") || "dark-mode";

const renderTask = (id, text, isCompleted) => {
   taskContainer.innerHTML += ` <div class="task ${
      isCompleted ? "checked" : ""
   }" id=${id} draggable="true">
                  <label>
                     <input type="checkbox" />
                     <img src="images/icon-check.svg" />
                  </label>
                  <p>${text}</p>
                  <button class="remove-btn"><img src="images/icon-cross.svg" alt="delete-btn" class="remove"></button>
               </div>`;
};
const darkLightModeToggle = () => {
   if (toggleImg.getAttribute("src") === "images/icon-sun.svg") {
      toggleImg.setAttribute("src", "images/icon-moon.svg");
      document.body.classList.toggle("light-mode");
      document.querySelector("header").classList.toggle("header-light-mode");
      localStorage.setItem("theme", "light-mode");
   } else {
      toggleImg.setAttribute("src", "images/icon-sun.svg");
      document.body.classList.toggle("light-mode");
      document.querySelector("header").classList.toggle("header-light-mode");
      localStorage.setItem("theme", "dark-mode");
   }
};

const countActiveTasks = () => {
   let count = 0;
   taskList.forEach((el) => {
      if (!el.isCompleted) count++;
   });
   return count;
};
const addTasks = () => {
   renderTask(taskList.length, addedTask.value, false);
   allowDragAndDrop();
   taskList.push({ task: addedTask.value, isCompleted: false });
   localStorage.setItem("tasks", JSON.stringify(taskList));
   tasksLeft.innerText = countActiveTasks();
   addedTask.value = "";
};
addedTask.addEventListener("keydown", (e) => {
   if (e.key === "Enter") addTasks();
});

taskContainer.addEventListener("change", (e) => {
   if (e.target.checked) {
      const label = e.target.parentElement;
      const taskEl = label.parentElement;
      taskEl.classList.add("checked");
      const id = taskEl.id;
      taskList[id].isCompleted = true;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      tasksLeft.innerText = countActiveTasks();
   } else {
      const label = e.target.parentElement;
      const taskEl = label.parentElement;
      taskEl.classList.remove("checked");
      const id = taskEl.id;
      taskList[id].isCompleted = false;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      tasksLeft.innerText = countActiveTasks();
   }
});
taskContainer.addEventListener("click", (e) => {
   if (e.target.classList.contains("remove")) {
      const id = e.target.parentElement.parentElement.id;
      taskList.splice(id, 1);
      localStorage.setItem("tasks", JSON.stringify(taskList));
      getTasks("All");
      allowDragAndDrop();
      tasksLeft.innerText = countActiveTasks();
   }
});
const getTasks = (status) => {
   taskContainer.innerHTML = "";
   if (status === "All") {
      taskList.forEach((el, index) => {
         if (el.isCompleted) renderTask(index, el.task, true);
         else renderTask(index, el.task, false);
      });
   }
   if (status === "Completed") {
      taskList.forEach((el, index) => {
         if (el.isCompleted) renderTask(index, el.task, true);
      });
   }
   if (status === "Active") {
      taskList.forEach((el, index) => {
         if (!el.isCompleted) renderTask(index, el.task, false);
      });
   }
};
removeAllBtn.addEventListener("click", () => {
   taskList = taskList.filter((el) => el.isCompleted === false);
   localStorage.setItem("tasks", JSON.stringify(taskList));
   getTasks("All");
   allowDragAndDrop();
});
statusButtons.forEach((statusBtn) => {
   statusBtn.addEventListener("click", () => {
      statusButtons.forEach((btn) => btn.classList.remove("activeBtn"));
      statusBtn.classList.add("activeBtn");
      getTasks(statusBtn.textContent);
      allowDragAndDrop();
   });
});

if (prefferedTheme === "light-mode") darkLightModeToggle();

function allowDragAndDrop() {
   setTimeout(() => {
      let draggedItem = null;
      taskContainer.querySelectorAll(".task").forEach((task) => {
         task.addEventListener("dragstart", function (e) {
            draggedItem = this;
            setTimeout(() => this.classList.add("dragging"), 0);
         });
         task.addEventListener("dragend", function () {
            setTimeout(() => {
               this.classList.remove("dragging");
               draggedItem = null;
            }, 0);
         });
         task.addEventListener("dragover", function (e) {
            e.preventDefault();
            const afterElement = getDragAfterElement(taskContainer, e.clientY);
            if (afterElement == null) {
               taskContainer.appendChild(draggedItem);
            } else {
               taskContainer.insertBefore(draggedItem, afterElement);
            }
         });
      });

      function getDragAfterElement(container, y) {
         const draggableElements = [
            ...container.querySelectorAll(".task:not(.dragging)"),
         ];

         return draggableElements.reduce(
            (closest, child) => {
               const box = child.getBoundingClientRect();
               const offset = y - box.top - box.height / 2;
               if (offset < 0 && offset > closest.offset) {
                  return { offset: offset, element: child };
               } else {
                  return closest;
               }
            },
            { offset: Number.NEGATIVE_INFINITY }
         ).element;
      }
   }, 100);
}

allowDragAndDrop();
toggleBtn.addEventListener("click", () => {
   darkLightModeToggle();
});
getTasks("All");
tasksLeft.innerText = countActiveTasks();
