'use strict';

const form = document.querySelector('#form-registro');
const telefono = document.querySelector('#telefono');
const password = document.querySelector('#password');
const confirmar = document.querySelector('#confirmar_password');
const strength = document.querySelector('#password-strength');
const mensaje = document.querySelector('#mensaje-estado');
const resultado = document.querySelector('#resultado-registro');
const btnEnviar = document.querySelector('#btn-enviar');

// ===== BOTÓN ACTIVAR/DESACTIVAR =====
function actualizarBoton(){
  const campos = form.querySelectorAll('[required]');
  btnEnviar.disabled = ![...campos].every(c=>{
    return c.type === 'checkbox' ? c.checked : c.value.trim() !== '';
  });
}

// ===== VALIDACIÓN EN TIEMPO REAL =====
form.addEventListener('input', e=>{
  if(e.target.matches('input, select')){
    const r = ValidacionService.validarCampo(e.target);

    if(r.valido){
      limpiarError(e.target);   // 🟢
    } else {
      mostrarError(e.target, r.error); // 🔴
    }
  }

  actualizarBoton();
});

// ===== VALIDAR AL SALIR =====
form.addEventListener('focusout', e=>{
  if(e.target.matches('input, select')){
    const r = ValidacionService.validarCampo(e.target);

    if(r.valido){
      limpiarError(e.target);
    } else {
      mostrarError(e.target, r.error);
    }
  }
});

// ===== FUERZA DE PASSWORD =====
password.addEventListener('input', e=>{
  const f = ValidacionService.evaluarFuerzaPassword(e.target.value);
  strength.textContent = f.nivel;
});

// ===== CONFIRMAR PASSWORD =====
password.addEventListener('input', ()=>{
  if(confirmar.value){
    const r = ValidacionService.validarCampo(confirmar);
    if(!r.valido){
      mostrarError(confirmar, r.error);
    } else {
      limpiarError(confirmar);
    }
  }
});

// ===== TELÉFONO =====
telefono.addEventListener('input', e=>{
  aplicarMascaraTelefono(e.target);
});

// ===== SUBMIT =====
form.addEventListener('submit', e=>{
  e.preventDefault();

  if(!ValidacionService.validarFormulario(form)){
    mensaje.classList.remove('oculto');
    mensaje.innerHTML='';
    mensaje.appendChild(MensajeError('Corrige los errores'));
    return;
  }

  const datos = Object.fromEntries(new FormData(form));
  datos.terminos = document.querySelector('#terminos').checked;

  // 🔥 CONSOLA
  console.log('Enviado');
  console.log('Datos:', datos);
  console.table(datos);

  // MENSAJE EN PANTALLA
  mensaje.classList.remove('oculto');
  mensaje.innerHTML='';
  mensaje.appendChild(MensajeExito('Registro exitoso'));

  // MOSTRAR DATOS
  renderizarResultado(datos, resultado);

  // RESET
  form.reset();
  actualizarBoton();

  // LIMPIAR COLORES
  form.querySelectorAll('input, select').forEach(c=>{
    c.classList.remove('error','campo--valido');
  });

  strength.textContent = '';
});

// ===== LIMPIAR =====
document.querySelector('#btn-limpiar').addEventListener('click', ()=>{
  form.reset();
  limpiarResultado(resultado);
  mensaje.classList.add('oculto');

  form.querySelectorAll('input, select').forEach(c=>{
    c.classList.remove('error','campo--valido');
  });

  strength.textContent = '';
  actualizarBoton();
});

// ===== INICIO =====
actualizarBoton();