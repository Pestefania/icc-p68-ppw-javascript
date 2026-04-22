'use strict';

/* =====================================================
   SELECCIÓN DE ELEMENTOS
===================================================== */
const formulario = document.querySelector('#formulario');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const selectAsunto = document.querySelector('#asunto');
const textMensaje = document.querySelector('#mensaje');
const charCount = document.querySelector('#chars');
const resultado = document.querySelector('#resultado');

const inputNuevaTarea = document.querySelector('#nueva-tarea');
const btnAgregar = document.querySelector('#btn-agregar');
const listaTareas = document.querySelector('#lista-tareas');
const contadorTareas = document.querySelector('#contador-tareas');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =====================================================
   FORMULARIO
===================================================== */
function validarCampo(input, valido, errorId) {
  const error = document.getElementById(errorId);

  if (valido) {
    input.classList.remove('error');
    error.classList.remove('visible');
  } else {
    input.classList.add('error');
    error.classList.add('visible');
  }

  return valido;
}

function validarNombre() {
  return validarCampo(
    inputNombre,
    inputNombre.value.trim().length >= 3,
    'error-nombre'
  );
}

function validarEmail() {
  return validarCampo(
    inputEmail,
    EMAIL_REGEX.test(inputEmail.value.trim()),
    'error-email'
  );
}

function validarAsunto() {
  return validarCampo(
    selectAsunto,
    selectAsunto.value !== '',
    'error-asunto'
  );
}

function validarMensaje() {
  return validarCampo(
    textMensaje,
    textMensaje.value.trim().length >= 10,
    'error-mensaje'
  );
}

/* contador */
textMensaje.addEventListener('input', (e) => {
  const total = e.target.value.length;
  charCount.textContent = total;
  charCount.style.color =
    total > 270 ? '#e74c3c' : '#999';
});

/* blur */
inputNombre.addEventListener('blur', validarNombre);
inputEmail.addEventListener('blur', validarEmail);
selectAsunto.addEventListener('blur', validarAsunto);
textMensaje.addEventListener('blur', validarMensaje);

/* submit */
formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const ok =
    validarNombre() &&
    validarEmail() &&
    validarAsunto() &&
    validarMensaje();

  if (!ok) return;

  resultado.classList.add('visible');

  resultado.innerHTML = `
    <strong>Formulario enviado correctamente</strong>
    <p><b>Nombre:</b> ${inputNombre.value}</p>
    <p><b>Email:</b> ${inputEmail.value}</p>
    <p><b>Asunto:</b> ${selectAsunto.options[selectAsunto.selectedIndex].text}</p>
    <p><b>Mensaje:</b> ${textMensaje.value}</p>
  `;

  formulario.reset();
  charCount.textContent = '0';
});

/* Ctrl + Enter */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    formulario.requestSubmit();
  }
});

/* =====================================================
   TAREAS
===================================================== */
let tareas = [
  {
    id: 1,
    texto: 'Estudiar JavaScript',
    completada: false
  },
  {
    id: 2,
    texto: 'Hacer la práctica',
    completada: false
  },
  {
    id: 3,
    texto: 'Subir al repositorio',
    completada: true
  }
];

/* contador */
function actualizarContadorTareas() {
  const pendientes =
    tareas.filter(t => !t.completada).length;

  contadorTareas.textContent =
    `${pendientes} pendiente(s)`;
}

/* =====================================================
   RENDER COMO LA IMAGEN
===================================================== */
function renderizarTareas() {
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {
    listaTareas.innerHTML = `
      <li class="estado-vacio">
        No hay tareas registradas
      </li>
    `;
    contadorTareas.textContent =
      '0 pendiente(s)';
    return;
  }

  tareas.forEach((tarea) => {
    const li = document.createElement('li');

    li.className = 'tarea-item';
    li.dataset.id = tarea.id;

    if (tarea.completada) {
      li.classList.add('completada');
    }

    li.innerHTML = `
      <span
        class="tarea-texto"
        data-action="toggle">
        ${tarea.texto}
      </span>

      <button
        class="btn-eliminar"
        data-action="eliminar">
        Eliminar
      </button>
    `;

    listaTareas.appendChild(li);
  });

  actualizarContadorTareas();
}

/* agregar */
function agregarTarea() {
  const texto =
    inputNuevaTarea.value.trim();

  if (texto === '') {
    inputNuevaTarea.focus();
    return;
  }

  tareas.push({
    id: Date.now(),
    texto,
    completada: false
  });

  inputNuevaTarea.value = '';
  inputNuevaTarea.focus();

  renderizarTareas();
}

/* botón */
btnAgregar.addEventListener(
  'click',
  agregarTarea
);

/* enter */
inputNuevaTarea.addEventListener(
  'keydown',
  (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarTarea();
    }
  }
);

/* =====================================================
   EVENT DELEGATION
===================================================== */
listaTareas.addEventListener(
  'click',
  (e) => {
    const accion =
      e.target.dataset.action;

    if (!accion) return;

    const item =
      e.target.closest('.tarea-item');

    const id = Number(item.dataset.id);

    /* eliminar */
    if (accion === 'eliminar') {
      tareas = tareas.filter(
        tarea => tarea.id !== id
      );

      renderizarTareas();
      return;
    }

    /* completar */
    if (accion === 'toggle') {
      const tarea =
        tareas.find(
          t => t.id === id
        );

      if (tarea) {
        tarea.completada =
          !tarea.completada;
      }

      renderizarTareas();
    }
  }
);

/* iniciar */
renderizarTareas();