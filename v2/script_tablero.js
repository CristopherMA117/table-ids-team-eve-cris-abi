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