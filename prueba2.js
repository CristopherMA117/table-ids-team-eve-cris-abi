


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

// Cargamos las tareas guardadas o inicializamos vacío
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Guardar tareas en localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks() {
  Object.keys(lists).forEach(status => {
    const list = lists[status];
    list.innerHTML = ""; 



    const filteredTasks = tasks.filter(task => task.status === status);

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.title + " ";
      li.draggable = true; //para arrastrar     
      li.dataset.id = task.id;  

      // Evento dragstart para arrastrar la tarea
      li.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", task.id);
      });

      // Botón para eliminar tarea
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.onclick = () => deleteTask(task.id);
      li.appendChild(deleteBtn);

      // Botones para mover a otras columnas
      ["todo", "progress", "done"].forEach(s => {
        if (s !== status) {
          const moveBtn = document.createElement("button");
          moveBtn.textContent = "→ " + s;
          moveBtn.onclick = () => moveTask(task.id, s);
          li.appendChild(moveBtn);
        }
      });

      list.appendChild(li);
    });

    // Actualiza el contador
    counters[status].textContent = filteredTasks.length;

    // Hacemos que la lista pueda recibir drops
    list.addEventListener("dragover", e => e.preventDefault());
    list.addEventListener("drop", e => {
      e.preventDefault();
      const id = Number(e.dataTransfer.getData("text/plain"));
      moveTask(id, status);
    });
  });
}

// Agregar una nueva tarea
function addTask(title, status) {
  tasks.push({ id: Date.now(), title, status });
  saveTasks();
  renderTasks();
}

// Eliminar tarea
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Mover tarea a otra columna
function moveTask(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) task.status = newStatus;
  saveTasks();
  renderTasks();
}

// Eventos para el formulario
addTaskBtn.onclick = () => {
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(title, statusSelect.value);
  taskInput.value = "";
};


// agregar tarea presionando Enter
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTaskBtn.click();
});

// Render inicial
renderTasks();
