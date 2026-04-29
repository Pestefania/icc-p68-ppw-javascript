function MensajeExito(msg){
  let d = document.createElement('div');
  d.style.color='green';
  d.textContent = msg;
  return d;
}

function MensajeError(msg){
  let d = document.createElement('div');
  d.style.color='red';
  d.textContent = msg;
  return d;
}

function renderizarResultado(datos, contenedor){
  contenedor.innerHTML='';
  Object.entries(datos).forEach(([k,v])=>{
    let p = document.createElement('p');
    p.textContent = k+': '+v;
    contenedor.appendChild(p);
  });
}

function limpiarResultado(c){
  c.innerHTML='';
}