const addedTask = document.getElementById("input-task");
const taskContainer = document.getElementById("task-container");
const tasksLeft = document.getElementById("item-left");
const statusButtons = document.querySelectorAll(".statusBtn");
const removeAllBtn=document.getElementById("removeAll")
let taskList = [];

const renderTask = (id, text, isCompleted) => {
   taskContainer.innerHTML += ` <div class="task ${
      isCompleted ? "checked" : ""
   }" id=${id}>
                  <label>
                     <input type="checkbox" />
                     <img src="images/icon-check.svg" />
                  </label>
                  <p>${text}</p>
                  <button class="remove-btn"><img src="images/icon-cross.svg" alt="delete-btn" class="remove"></button>
               </div>`;
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
   taskList.push({ task: addedTask.value, isCompleted: false });
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
      tasksLeft.innerText = countActiveTasks();
   } else {
      const label = e.target.parentElement;
      const taskEl = label.parentElement;
      taskEl.classList.remove("checked");
      const id = taskEl.id;
      taskList[id].isCompleted = false;
      tasksLeft.innerText = countActiveTasks();
   }
});
taskContainer.addEventListener("click",(e)=>{
       if(e.target.classList.contains("remove")){
            const id=e.target.parentElement.parentElement.id
            taskList.splice(id,1)
            getTasks("All")
            tasksLeft.innerText = countActiveTasks();
       }
})
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
removeAllBtn.addEventListener("click",()=>{
    taskList=taskList.filter(el=>el.isCompleted===false)
    getTasks("All");
})
statusButtons.forEach((statusBtn) => {
   statusBtn.addEventListener("click", () => {
      statusButtons.forEach((btn) => btn.classList.remove("activeBtn"));
      statusBtn.classList.add("activeBtn");
      getTasks(statusBtn.textContent);
   });
});
