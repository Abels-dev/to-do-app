const addedTask = document.getElementById("input-task");
const taskContainer = document.getElementById("task-container");

const taskList = [];

const addTasks = () => {
   taskContainer.innerHTML += ` <div class="task" id=${taskList.length}>
                  <label>
                     <input type="checkbox" />
                     <img src="images/icon-check.svg" />
                  </label>
                  <p>${addedTask.value}</p>
                  <button class="remove-btn"><img src="images/icon-cross.svg" alt="delete-btn"></button>
               </div>`;
   taskList.push({ task: addedTask.value, isCompleted: false });
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
   } else {
      const label = e.target.parentElement;
      const taskEl = label.parentElement;
      taskEl.classList.remove("checked");
      const id = taskEl.id;
      taskList[id].isCompleted = false;
   }
});
