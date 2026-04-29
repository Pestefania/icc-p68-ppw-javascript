'use strict';

let posts = [];
let modoEdicion = false;

// Referencias del DOM
const form = document.querySelector('#form-post');
const inputId = document.querySelector('#post-id');
const inputTitulo = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit = document.querySelector('#btn-submit');
const listaPosts = document.querySelector('#lista-posts');
const contadorElemento = document.querySelector('#contador strong');

// 1. Crear el contenedor de ERROR en tiempo real si no existe en el HTML
const errorContainer = document.createElement('div');
errorContainer.id = 'error-visual';
errorContainer.style.cssText = 'display:none; background:#f8d7da; color:#721c24; padding:10px; border:1px solid #f5c6cb; margin-bottom:10px; border-radius:5px; text-align:center;';
document.body.prepend(errorContainer);

function mostrarError(mensaje) {
  errorContainer.textContent = `⚠️ ERROR: ${mensaje}`;
  errorContainer.style.display = 'block';
  setTimeout(() => errorContainer.style.display = 'none', 5000);
}

// 2. Carga inicial
async function cargarApp() {
  listaPosts.replaceChildren(Spinner());
  try {
    posts = await ApiService.getPosts(20);
    actualizarVista();
  } catch (e) {
    mostrarError("No se pudo cargar la lista de posts.");
  }
}

function actualizarVista() {
  listaPosts.replaceChildren();
  posts.forEach(p => listaPosts.appendChild(PostCard(p)));
  contadorElemento.textContent = posts.length;
}

// 3. Guardar o Editar (ID persistente)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datosPost = {
    title: inputTitulo.value.trim(),
    body: inputContenido.value.trim(),
    userId: 1
  };

  try {
    if (modoEdicion) {
      const idExistente = parseInt(inputId.value);
      await ApiService.updatePost(idExistente, datosPost);
      
      const index = posts.findIndex(p => p.id === idExistente);
      if (index !== -1) {
        posts[index].title = datosPost.title;
        posts[index].body = datosPost.body;
      }
    } else {
      await ApiService.createPost(datosPost);
      
      // Simulación de Base de Datos: ID más alto + 1
      const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
      const nuevoId = maxId + 1; // Aquí sale el 21, 22...
      
      posts.unshift({ ...datosPost, id: nuevoId });
    }
    
    limpiarFormulario();
    actualizarVista();
  } catch (error) {
    mostrarError("Fallo al guardar los datos. Inténtalo de nuevo.");
  }
});

// 4. Delegación de eventos (Editar / Eliminar)
listaPosts.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const id = parseInt(btn.dataset.id);
  const accion = btn.dataset.action;

  if (accion === 'editar') {
    const post = posts.find(p => p.id === id);
    if (post) {
      inputTitulo.value = post.title;
      inputContenido.value = post.body;
      inputId.value = post.id;
      modoEdicion = true;
      btnSubmit.textContent = 'Guardar Cambios';
      btnSubmit.style.backgroundColor = '#007bff';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (accion === 'eliminar') {
    // Única pantalla emergente que pide confirmación
    if (confirm(`¿Seguro que quieres borrar el post #${id}?`)) {
      try {
        await ApiService.deletePost(id);
        posts = posts.filter(p => p.id !== id);
        actualizarVista();
      } catch (e) {
        mostrarError("No se pudo eliminar el post.");
      }
    }
  }
});

function limpiarFormulario() {
  form.reset();
  inputId.value = '';
  modoEdicion = false;
  btnSubmit.textContent = 'Crear Post';
  btnSubmit.style.backgroundColor = ''; 
}

cargarApp();

