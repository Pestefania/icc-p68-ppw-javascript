
'use strict';

/* =====================================
   SELECCIÓN DE ELEMENTOS DEL DOM
===================================== */

const formTarea = document.getElementById('form-tarea');
const inputTarea = document.getElementById('input-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeEstado = document.getElementById('mensaje-estado');
const btnLimpiar = document.getElementById('btn-limpiar');
const themeBtns = document.querySelectorAll('[data-theme]');

/* =====================================
   ESTADO GLOBAL
===================================== */

let tareas = [];

/* =====================================
   MENSAJES
===================================== */

function mostrarMensaje(texto, tipo = 'success') {
  mensajeEstado.textContent = texto;
  mensajeEstado.className = `mensaje mensaje--${tipo}`;
  mensajeEstado.classList.remove('oculto');

  setTimeout(() => {
    mensajeEstado.classList.add('oculto');
  }, 2500);
}

/* =====================================
   CREAR ELEMENTO TAREA
===================================== */

function crearElementoTarea(tarea) {
  const li = document.createElement('li');
  li.className = 'task-item';

  if (tarea.completada) {
    li.classList.add('task-item--completed');
  }

  /* Checkbox */
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = tarea.completada;
  checkbox.className = 'task-item__checkbox';

  checkbox.addEventListener('change', () => {
    toggleTarea(tarea.id);
  });

  /* Texto */
  const texto = document.createElement('span');
  texto.className = 'task-item__text';
  texto.textContent = tarea.texto;

  /* Botón eliminar */
  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn btn--danger btn--small';
  btnEliminar.textContent = '🗑️';

  btnEliminar.addEventListener('click', () => {
    eliminarTarea(tarea.id);
  });

  /* Contenedor */
  const acciones = document.createElement('div');
  acciones.className = 'task-item__actions';
  acciones.appendChild(btnEliminar);

  li.appendChild(checkbox);
  li.appendChild(texto);
  li.appendChild(acciones);

  return li;
}

/* =====================================
   RENDERIZAR LISTA
===================================== */

function renderizarTareas() {
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {
    const vacio = document.createElement('p');
    vacio.className = 'empty-state';
    vacio.textContent = '🎉 No hay tareas. Agrega una nueva.';
    listaTareas.appendChild(vacio);
    return;
  }

  tareas.forEach(tarea => {
    const elemento = crearElementoTarea(tarea);
    listaTareas.appendChild(elemento);
  });
}

/* =====================================
   CARGAR TAREAS
===================================== */

function cargarTareas() {
  tareas = TareaStorage.getAll();
  renderizarTareas();
}

/* =====================================
   CRUD TAREAS
===================================== */

function agregarTarea(texto) {
  if (!texto.trim()) {
    mostrarMensaje('Escribe una tarea válida', 'error');
    return;
  }

  const nueva = TareaStorage.crear(texto);

  tareas = TareaStorage.getAll();

  renderizarTareas();

  mostrarMensaje(`✅ "${nueva.texto}" agregada`);
}

function toggleTarea(id) {
  TareaStorage.toggleCompletada(id);

  tareas = TareaStorage.getAll();

  renderizarTareas();

  const tarea = tareas.find(t => t.id === id);

  if (tarea.completada) {
    mostrarMensaje('✔️ Tarea completada');
  } else {
    mostrarMensaje('↩️ Tarea pendiente');
  }
}

function eliminarTarea(id) {
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) return;

  if (!confirm(`¿Eliminar "${tarea.texto}"?`)) return;

  TareaStorage.eliminar(id);

  tareas = TareaStorage.getAll();

  renderizarTareas();

  mostrarMensaje('🗑️ Tarea eliminada');
}

function limpiarTodo() {
  if (tareas.length === 0) {
    mostrarMensaje('No hay tareas para eliminar', 'error');
    return;
  }

  if (!confirm('¿Eliminar todas las tareas?')) return;

  TareaStorage.limpiarTodo();

  tareas = [];

  renderizarTareas();

  mostrarMensaje('🧹 Todas las tareas eliminadas');
}

/* =====================================
   TEMA
===================================== */

function aplicarTema(nombreTema) {
  const root = document.documentElement;

  if (nombreTema === 'oscuro') {
    root.style.setProperty('--bg-primary', '#121212');
    root.style.setProperty('--card-bg', '#1e1e1e');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--border-color', '#444444');
  } else {
    root.style.setProperty('--bg-primary', '#f5f5f5');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--text-color', '#222222');
    root.style.setProperty('--border-color', '#dddddd');
  }

  themeBtns.forEach(btn => {
    btn.classList.toggle(
      'theme-btn--active',
      btn.dataset.theme === nombreTema
    );
  });

  TemaStorage.setTema(nombreTema);
}

/* =====================================
   EVENTOS
===================================== */

formTarea.addEventListener('submit', (e) => {
  e.preventDefault();

  agregarTarea(inputTarea.value);

  inputTarea.value = '';
  inputTarea.focus();
});

btnLimpiar.addEventListener('click', limpiarTodo);

themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    aplicarTema(btn.dataset.theme);
  });
});

/* =====================================
   INICIALIZACIÓN
===================================== */

aplicarTema(TemaStorage.getTema());

cargarTareas();

if (tareas.length === 0) {
  mostrarMensaje('👋 Bienvenido, agrega tu primera tarea');
}