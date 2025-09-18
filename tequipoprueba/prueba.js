const taskInput = document.getElementById("taskInput");
const statusSelect = document.getElementById("statusSelect");
const addTaskBtn = document.getElementById("addTaskBtn");

const lists = {
  todo: document.getElementById("todoList"),
  progress: document.getElementById("progressList"),
  done: document.getElementById("doneList"),
};

const counters = {
  todo: document.getElementById("todoCount"),
  progress: document.getElementById("progressCount"),
  done: document.getElementById("doneCount"),
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  Object.keys(lists).forEach(status => {
    const filtered = tasks.filter(t => t.status === status);
    const list = lists[status];
    list.innerHTML = "";

    filtered.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.title + " ";

      // Botón eliminar
      const delBtn = document.createElement("button");
      delBtn.textContent = "Eliminar";
      delBtn.onclick = () => { deleteTask(task.id); };
      li.appendChild(delBtn);

      // Botones mover
      ["todo", "progress", "done"].forEach(s => {
        if (s !== status) {
          const moveBtn = document.createElement("button");
          moveBtn.textContent = "→ " + s;
          moveBtn.onclick = () => { moveTask(task.id, s); };
          li.appendChild(moveBtn);
        }
      });

      list.appendChild(li);
    });

    counters[status].textContent = filtered.length;
  });
}

function addTask(title, status) {
  tasks.push({ id: Date.now(), title, status });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function moveTask(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) task.status = newStatus;
  saveTasks();
  renderTasks();
}

addTaskBtn.onclick = () => {
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(title, statusSelect.value);
  taskInput.value = "";
};

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTaskBtn.click();
});

renderTasks();
