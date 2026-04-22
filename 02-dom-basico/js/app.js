'use strict';

// ===============================
// INFORMACIÓN DEL ESTUDIANTE
// ===============================
const estudiante = {
  nombre: 'Denisse Paredes',
  carrera: 'Ingeniería de Sistemas',
  semestre: 5
};

// ===============================
// DATOS
// ===============================
const elementos = [
  {
    id: 1,
    titulo: 'Proyecto Web',
    descripcion: 'Terminar práctica JS',
    categoria: 'Estudio',
    prioridad: 'Alta',
    activo: true
  },
  {
    id: 2,
    titulo: 'Comprar comida',
    descripcion: 'Ir al supermercado',
    categoria: 'Personal',
    prioridad: 'Media',
    activo: true
  },
  {
    id: 3,
    titulo: 'Reunión',
    descripcion: 'Equipo de trabajo',
    categoria: 'Trabajo',
    prioridad: 'Alta',
    activo: false
  },
  {
    id: 4,
    titulo: 'Leer libro',
    descripcion: 'Capítulo de JS',
    categoria: 'Estudio',
    prioridad: 'Baja',
    activo: true
  },
  {
    id: 5,
    titulo: 'Ejercicio',
    descripcion: 'Salir a correr',
    categoria: 'Personal',
    prioridad: 'Media',
    activo: false
  },
  {
    id: 6,
    titulo: 'Deploy',
    descripcion: 'Subir proyecto',
    categoria: 'Trabajo',
    prioridad: 'Alta',
    activo: true
  }
];

// ===============================
// MOSTRAR INFO ESTUDIANTE
// ===============================
function mostrarInfoEstudiante() {
  document.getElementById('estudiante-nombre').textContent =
    estudiante.nombre;

  document.getElementById('estudiante-carrera').textContent =
    estudiante.carrera;

  document.getElementById('estudiante-semestre').textContent =
    `${estudiante.semestre}° semestre`;
}

// ===============================
// ACTUALIZAR ESTADÍSTICAS
// ===============================
function actualizarEstadisticas() {
  const total = elementos.length;

  const activos = elementos.filter(
    elemento => elemento.activo
  ).length;

  document.getElementById('total-elementos').textContent = total;
  document.getElementById('elementos-activos').textContent = activos;
}

// ===============================
// ELIMINAR ELEMENTO
// ===============================
function eliminarElemento(id) {
  const index = elementos.findIndex(
    elemento => elemento.id === id
  );

  if (index !== -1) {
    elementos.splice(index, 1);
    renderizarLista(elementos);
  }
}

// ===============================
// RENDERIZAR LISTA
// ===============================
function renderizarLista(datos) {

  const contenedor =
    document.getElementById('contenedor-lista');

  contenedor.innerHTML = '';

  const fragment =
    document.createDocumentFragment();

  datos.forEach(el => {

    // CARD
    const card = document.createElement('div');
    card.classList.add('card');

    // TITULO
    const titulo = document.createElement('h3');
    titulo.textContent = el.titulo;

    // DESCRIPCIÓN
    const descripcion = document.createElement('p');
    descripcion.textContent = el.descripcion;

    // BADGES
    const badges = document.createElement('div');
    badges.classList.add('badges');

    // CATEGORIA
    const categoria = document.createElement('span');
    categoria.textContent = el.categoria;
    categoria.classList.add('badge', 'badge-categoria');

    // PRIORIDAD
    const prioridad = document.createElement('span');
    prioridad.textContent = el.prioridad;
    prioridad.classList.add('badge');

    if (el.prioridad === 'Alta') {
      prioridad.classList.add('prioridad-alta');
    } else if (el.prioridad === 'Media') {
      prioridad.classList.add('prioridad-media');
    } else {
      prioridad.classList.add('prioridad-baja');
    }

    // ESTADO
    const estado = document.createElement('span');
    estado.textContent =
      el.activo ? 'Activo' : 'Inactivo';

    estado.classList.add(
      'badge',
      el.activo
        ? 'estado-activo'
        : 'estado-inactivo'
    );

    // BOTÓN
    const acciones = document.createElement('div');
    acciones.classList.add('card-actions');

    const btnEliminar =
      document.createElement('button');

    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');

    btnEliminar.addEventListener('click', () => {
      eliminarElemento(el.id);
    });

    acciones.appendChild(btnEliminar);

    // ENSAMBLAR
    badges.appendChild(categoria);
    badges.appendChild(prioridad);
    badges.appendChild(estado);

    card.appendChild(titulo);
    card.appendChild(descripcion);
    card.appendChild(badges);
    card.appendChild(acciones);

    fragment.appendChild(card);
  });

  contenedor.appendChild(fragment);

  actualizarEstadisticas();
}

// ===============================
// FILTROS
// ===============================
function inicializarFiltros() {

  const botones =
    document.querySelectorAll('.btn-filtro');

  botones.forEach(btn => {

    btn.addEventListener('click', () => {

      botones.forEach(b =>
        b.classList.remove('btn-filtro-activo')
      );

      btn.classList.add('btn-filtro-activo');

      const categoria =
        btn.dataset.categoria;

      if (categoria === 'todas') {
        renderizarLista(elementos);
      } else {

        const filtrados =
          elementos.filter(
            el => el.categoria === categoria
          );

        renderizarLista(filtrados);
      }

    });

  });

}

// ===============================
// INICIALIZAR APP
// ===============================
mostrarInfoEstudiante();
renderizarLista(elementos);
inicializarFiltros();