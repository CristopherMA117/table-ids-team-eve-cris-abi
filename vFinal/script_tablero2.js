// Referencias al DOM

const taskInput = document.getElementById("taskInput");      // Donde escribimos el título de la tarea
const statusSelect = document.getElementById("statusSelect"); // Menú desplegable para elegir el estado inicial
const addTaskBtn = document.getElementById("addTaskBtn");    // Botón para agregar tareas
const board = document.querySelector(".board");              // Contenedor general del tablero

// Columnas del tablero (listas) y sus contadores
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


// Estado de la aplicación

// Cargamos las tareas guardadas o arrancamos con una lista vacía
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Funciones principales


// Guardar en localStorage (para no perder las tareas al cerrar la página)
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Dibujar todas las tareas en sus columnas
function renderTasks() {
  Object.keys(lists).forEach(status => {
    const filtered = tasks.filter(t => t.status === status); // Filtramos solo las tareas de esa columna
    const list = lists[status];
    list.innerHTML = ""; // Limpiamos lo que haya dentro antes de volver a dibujar

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state">No hay tareas ${getStatusText(status)}</div>`;
    } else {
      filtered.forEach(task => list.appendChild(createTaskElement(task)));
    }
  });
  updateCounts(); // Actualizamos los numeritos de cada columna
}

// Crear un elemento visual (tarjeta) para cada tarea
function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.dataset.id = task.id;

  div.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-actions">
      ${task.status !== "todo" ? `<button data-move="todo">← Por hacer</button>` : ""}
      ${task.status !== "progress" ? `<button data-move="progress">En progreso →</button>` : ""}
      ${task.status !== "done" ? `<button data-move="done">Hecho →</button>` : ""}
      <button data-delete>Eliminar</button>
    </div>
  `;

  return div;
}

// Agregar una nueva tarea
function addTask(title, status) {
  tasks.push({
    id: Date.now(), // Un ID único usando el tiempo actual
    title,
    status,
    createdAt: new Date().toISOString(),
  });
  saveTasks();
  renderTasks();
}

// Eliminar una tarea por ID
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Mover una tarea a otra columna
function moveTask(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) task.status = newStatus;
  saveTasks();
  renderTasks();
}

// Actualizar contadores de cada columna
function updateCounts() {
  Object.keys(counters).forEach(
    s => (counters[s].textContent = tasks.filter(t => t.status === s).length)
  );
}

// Texto “bonito” para mostrar debajo de cada columna vacía
function getStatusText(status) {
  return status === "todo" ? "por hacer" : status === "progress" ? "en progreso" : "completadas";
}


// Eventos

// Botón agregar tarea
addTaskBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  if (!title) return; // Si está vacío, no agregamos nada
  addTask(title, statusSelect.value);
  taskInput.value = ""; // Limpiamos el input
});

// Enter para agregar directamente sin hacer clic
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTaskBtn.click();
});

// repartir eventos en el tablero
board.addEventListener("click", e => {
  const taskDiv = e.target.closest(".task");
  if (!taskDiv) return;
  const id = Number(taskDiv.dataset.id);

  if (e.target.dataset.delete !== undefined) {
    deleteTask(id);
  }
  if (e.target.dataset.move) {
    moveTask(id, e.target.dataset.move);
  }
});


// Drag & Drop

function enableDragAndDrop() {
  const taskElements = document.querySelectorAll(".task");
  const columns = document.querySelectorAll(".task-list");

  // --- Hacer arrastrables las tareas ---
  taskElements.forEach(task => {
    task.setAttribute("draggable", "true");

    task.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", task.dataset.id); // Guardamos el id en el “maletín” invisible del navegador
      task.classList.add("dragging"); // Marcamos la tarjeta visualmente
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("dragging"); // Quitamos la marca visual cuando soltamos
    });
  });

  // --- Permitir soltar en cada columna ---
  columns.forEach(col => {
    col.addEventListener("dragover", e => {
      e.preventDefault(); // Necesario para que funcione el drop
      col.classList.add("over"); // Indicamos que se puede soltar aquí
    });

    col.addEventListener("dragleave", () => {
      col.classList.remove("over"); // Si salimos de la columna, quitamos la marca
    });

    col.addEventListener("drop", e => {
      e.preventDefault();
      col.classList.remove("over");

      const taskId = Number(e.dataTransfer.getData("text/plain"));
      const newStatus = col.dataset.status;

      moveTask(taskId, newStatus); // Reutilizamos la función que ya mueve y guarda
    });
  });
}


// Inicialización

// Guardamos la versión original de renderTasks
const originalRender = renderTasks;

// Sobrescribimos renderTasks para que siempre reactive el drag & drop
renderTasks = function () {
  originalRender();
  enableDragAndDrop();
};

// Render inicial
renderTasks();
