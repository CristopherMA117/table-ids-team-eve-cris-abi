// Tablero de tareas 

// Referencias al DOM
const taskInput = document.getElementById("taskInput");
const statusSelect = document.getElementById("statusSelect");
     //const taskInput, statusSelect, addTaskBtn, board: Son variables que guardan las referencias a los elementos HTML donde el usuario escribe la tarea, elige su estado,
     //presiona el boton de agregar y el tablero completo.
const addTaskBtn = document.getElementById("addTaskBtn");
const board = document.querySelector(".board");

// Listas y contadores
const lists = {
  todo: document.getElementById("todoList"),
  progress: document.getElementById("progressList"), //Usan getElementById para llamar a los elementos con su respectivos id de el html 
  done: document.getElementById("doneList"),
};
//const lists y const counters Estas constantes guardan las referencias a las listas 
//(columnas del tablero: Por hacer, En progreso, Hecho) y a los elementos que muestran el conteo de tareas en cada una
const counters = {
  todo: document.getElementById("todoCount"),
  progress: document.getElementById("progressCount"),
  done: document.getElementById("doneCount"),
};

// Estado de la aplicacion (se guarda en localStorage)
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; //significa que se está intentando cargar datos desde el navegador, y si no hay nada, se inicializa una lista vacía.
//let tasks: Esta es la variable mas importante Es un arreglo (una lista) que guarda todas las tareas. Cada tarea es un objeto con propiedades 
//este arreglo se inicializa con los datos que se recuperan del localStorage del navegador, lo que permite que tus tareas se 
//guarden incluso si cierras la página.

// Funciones principales


// Guardar en localStorage
function saveTasks() { //saveTasks(): Se encarga de guardar el arreglo tasks en el localStorage del navegador, Es para la persistencia de los datos.
  localStorage.setItem("tasks", JSON.stringify(tasks)); //Esta parte toma el arreglo de tareas (tasks) que se tiene en JavaScript y lo convierte en una cadena de texto string
}// esto solo puede guardar cadenas de textos

// Renderizar todas las tareas en sus columnas
function renderTasks() { //renderTasks(): Esta es la función que dibuja todo en pantalla.
  //Recorre cada una de las columnas (todo, progress, done), filtra las tareas que le corresponden y crea los elementos HTML para mostrarlas. Si una columna no tiene tareas, muestra un mensaje de "no hay tareas"
  Object.keys(lists).forEach(status => {
    //Object.keys(lists): Esta parte toma el objeto lists (que contiene las referencias a las columnas del tablero: todo, progress, done) y devuelve un arreglo con las claves de ese objeto: (todo, progress, done)
    const filtered = tasks.filter(t => t.status === status); // tasks.filter(...): Esta es una función que crea un nuevo arreglo con todos los elementos que cumplan una condición.
    const list = lists[status];
    list.innerHTML = ""; // limpiar lista

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state">No hay tareas ${getStatusText(status)}</div>`;
    } else {
      filtered.forEach(task => list.appendChild(createTaskElement(task)));
    }
  });
  updateCounts(); //Al final, llama a updateCounts() para asegurarse de que los contadores estén correctos
}

// Crear un elemento HTML de tarea
// Crear un elemento HTML de tarea
function createTaskElement(task) { //createTaskElement(task): Recibe un objeto de tarea y crea un div HTML que representa una tarjeta de tarea.
  const div = document.createElement("div"); // Crea un nuevo elemento div en la memoria
  div.className = "task"; // Asigna la clase CSS "task" al nuevo div para darle estilo
  div.dataset.id = task.id; // Almacena el ID de la tarea en el atributo de datos "data-id" del div
  div.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-actions">
      ${task.status !== "todo" ? `<button data-move="todo">← Por hacer</button>` : ""}
      ${task.status !== "progress" ? `<button data-move="progress">En progreso →</button>` : ""}
      ${task.status !== "done" ? `<button data-move="done">Hecho →</button>` : ""}
      <button data-delete>Eliminar</button>
    </div>
  `; // Define el contenido HTML del div, incluyendo el título de la tarea y los botones de acción
  return div; // Devuelve el elemento div ya preparado para ser insertado en la página
}

// Agregar nueva tarea
function addTask(title, status) { //addTask(title, status): Crea un nuevo objeto de tarea y lo agrega al arreglo de tareas.
  tasks.push({ // Agrega un nuevo objeto al final del arreglo 'tasks'
    id: Date.now(), // Genera un ID único para la tarea, usando la marca de tiempo actual
    title, // Asigna el título de la tarea
    status, // Asigna el estado de la tarea (por hacer, en progreso, hecho)
    createdAt: new Date().toISOString(), // Asigna la fecha y hora de creación de la tarea
  });
  saveTasks(); // Guarda el arreglo 'tasks' actualizado en localStorage para la persistencia
  renderTasks(); // Vuelve a dibujar el tablero de tareas para mostrar la nueva tarea
}

// Eliminar tarea
function deleteTask(id) { //deleteTask(id): Filtra el arreglo 'tasks' para quitar la tarea que tenga el ID especificado.
  tasks = tasks.filter(t => t.id !== id); // Crea un nuevo arreglo 'tasks' que excluye la tarea con el ID dado
  saveTasks(); // Guarda el arreglo 'tasks' actualizado en localStorage
  renderTasks(); // Vuelve a dibujar el tablero para reflejar la eliminación
}

// Mover tarea
function moveTask(id, newStatus) { //moveTask(id, newStatus): Busca la tarea con el ID y cambia su propiedad 'status'.
  const task = tasks.find(t => t.id === id); // Busca en el arreglo 'tasks' la tarea con el ID que se le pasó
  if (task) task.status = newStatus; // Si la tarea se encuentra, actualiza su propiedad 'status'
  saveTasks(); // Guarda el arreglo 'tasks' actualizado en localStorage
  renderTasks(); // Vuelve a dibujar el tablero para mostrar la tarea en su nueva columna
}

// Actualizar contadores
function updateCounts() { //updateCounts(): Recorre cada contador y actualiza su contenido con el número total de tareas que tiene ese estado.
  Object.keys(counters).forEach(
    s => (counters[s].textContent = tasks.filter(t => t.status === s).length) // Para cada estado, filtra las tareas y asigna el número de resultados al contador correspondiente
  );
}

// Obtener texto legible del estado
function getStatusText(status) { //getStatusText(status): Función de ayuda para convertir el estado ('"todo"', '"progress"', '"done"') en un texto más legible.
  return status === "todo" ? "por hacer" : status === "progress" ? "en progreso" : "completadas";
}


// Eventos


// Botón agregar tarea
addTaskBtn.addEventListener("click", () => { // addTaskBtn.addEventListener("click", ...): Cuando haces clic en el botón "Agregar tarea", se activa una función
  const title = taskInput.value.trim(); // Obtiene el valor del campo de entrada y elimina los espacios en blanco al principio y al final
  if (!title) return; // Si el título está vacío, la función termina y no se agrega nada
  addTask(title, statusSelect.value); // Llama a la función para agregar la tarea con el título y estado seleccionados
  taskInput.value = ""; // Limpia el campo de entrada después de agregar la tarea
});

// Enter para agregar
taskInput.addEventListener("keypress", e => { //taskInput.addEventListener("keypress", ...): Permite que el usuario presione la tecla "Enter" para agregar una tarea.
  if (e.key === "Enter") addTaskBtn.click(); // Si la tecla presionada es "Enter", simula un clic en el botón de agregar
});

// Delegación de eventos para acciones de tareas
board.addEventListener("click", e => { // board.addEventListener("click", ...): Un ejemplo de delegación de eventos, que maneja los clics en los botones de las tareas.
  const taskDiv = e.target.closest(".task"); // Encuentra el elemento div de la tarea más cercano al elemento en el que se hizo clic
  if (!taskDiv) return; // Si no se hizo clic dentro de un div con la clase 'task', la función termina
  const id = Number(taskDiv.dataset.id); // Obtiene el ID de la tarea a partir del atributo de datos 'data-id'

  if (e.target.dataset.delete !== undefined) { // Si el elemento clicado tiene el atributo 'data-delete'
    deleteTask(id); // Llama a la función para eliminar la tarea
  }
  if (e.target.dataset.move) { // Si el elemento clicado tiene el atributo 'data-move'
    moveTask(id, e.target.dataset.move); // Llama a la función para mover la tarea, pasando el ID y el nuevo estado
  }
});

// Inicialización

renderTasks(); //renderTasks(): Llama a la función una sola vez al inicio para que, cuando la página se cargue, se muestren todas las tareas que se recuperaron del localStorage.