'use strict';

function PostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';
  article.style.border = '1px solid #ccc';
  article.style.padding = '15px';
  article.style.marginBottom = '10px';
  article.style.borderRadius = '8px';

  const title = document.createElement('h3');
  title.textContent = `${post.title} (ID: ${post.id})`;

  const body = document.createElement('p');
  body.textContent = post.body;

  const footer = document.createElement('div');
  footer.className = 'post-actions';

  // Botón Editar - AZUL
  const btnEdit = document.createElement('button');
  btnEdit.textContent = 'Editar';
  btnEdit.style.backgroundColor = '#007bff'; 
  btnEdit.style.color = 'white';
  btnEdit.style.border = 'none';
  btnEdit.style.padding = '5px 10px';
  btnEdit.style.marginRight = '10px';
  btnEdit.style.cursor = 'pointer';
  btnEdit.dataset.action = 'editar';
  btnEdit.dataset.id = post.id;

  // Botón Eliminar - ROJO
  const btnDelete = document.createElement('button');
  btnDelete.textContent = 'Eliminar';
  btnDelete.style.backgroundColor = '#dc3545'; 
  btnDelete.style.color = 'white';
  btnDelete.style.border = 'none';
  btnDelete.style.padding = '5px 10px';
  btnDelete.style.cursor = 'pointer';
  btnDelete.dataset.action = 'eliminar';
  btnDelete.dataset.id = post.id;

  footer.append(btnEdit, btnDelete);
  article.append(title, body, footer);
  return article;
}

function Spinner() {
  const div = document.createElement('div');
  div.textContent = 'Cargando posts...';
  div.style.textAlign = 'center';
  return div;
}