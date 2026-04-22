'use strict';

/* =========================
   ELEMENTOS DOM
========================= */

// Simulador
const log = document.getElementById('log');
const resultados = document.getElementById('resultados');

// Temporizador
const inputTiempo = document.getElementById('input-tiempo');
const display = document.getElementById('display');
const barraProgreso = document.getElementById('barra-progreso');

const btnIniciar = document.getElementById('btn-iniciar');
const btnDetener = document.getElementById('btn-detener');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Errores
const logErrores = document.getElementById('log-errores');

/* =========================
   VARIABLES GLOBALES
========================= */

let tiempoSecuencial = 0;
let tiempoParalelo = 0;

let intervaloId = null;
let tiempoRestante = 0;
let tiempoInicial = 0;

/* =========================
   SIMULACIÓN DE PETICIONES
========================= */

function simularPeticion(nombre, min = 500, max = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const tiempo = Math.floor(Math.random() * (max - min)) + min;

    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({ nombre, tiempo });
      }
    }, tiempo);
  });
}

/* =========================
   LOG GENERAL
========================= */

function mostrarLog(mensaje, tipo = 'info') {
  const div = document.createElement('div');
  div.className = `log-item log-${tipo}`;
  div.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function limpiarLog() {
  log.innerHTML = '';
  resultados.classList.remove('visible');
  tiempoSecuencial = 0;
  tiempoParalelo = 0;
}

/* =========================
   CARGA SECUENCIAL
========================= */

async function cargarSecuencial() {
  mostrarLog('🔄 Iniciando carga secuencial...', 'info');

  const inicio = performance.now();

  const usuario = await simularPeticion('Usuario', 500, 1000);
  mostrarLog(`✓ ${usuario.nombre} cargado`, 'success');

  const posts = await simularPeticion('Posts', 700, 1500);
  mostrarLog(`✓ ${posts.nombre} cargado`, 'success');

  const comentarios = await simularPeticion('Comentarios', 600, 1200);
  mostrarLog(`✓ ${comentarios.nombre} cargado`, 'success');

  const fin = performance.now();
  tiempoSecuencial = fin - inicio;

  mostrarLog(`⏱ Secuencial: ${tiempoSecuencial.toFixed(2)} ms`, 'warning');

  mostrarComparativa();
}

/* =========================
   CARGA PARALELA
========================= */

async function cargarParalelo() {
  mostrarLog('⚡ Iniciando carga paralela...', 'info');

  const inicio = performance.now();

  const promesas = [
    simularPeticion('Usuario', 500, 1000),
    simularPeticion('Posts', 700, 1500),
    simularPeticion('Comentarios', 600, 1200)
  ];

  const resultadosPromesas = await Promise.all(promesas);

  resultadosPromesas.forEach(r => {
    mostrarLog(`✓ ${r.nombre} cargado`, 'success');
  });

  const fin = performance.now();
  tiempoParalelo = fin - inicio;

  mostrarLog(`⚡ Paralelo: ${tiempoParalelo.toFixed(2)} ms`, 'warning');

  mostrarComparativa();
}

/* =========================
   COMPARATIVA
========================= */

function mostrarComparativa() {
  if (tiempoSecuencial === 0 || tiempoParalelo === 0) return;

  const diferencia = tiempoSecuencial - tiempoParalelo;
  const porcentaje = ((diferencia / tiempoSecuencial) * 100).toFixed(1);

  resultados.innerHTML = `
    <h3>📊 Comparativa de rendimiento</h3>
    <p><b>Secuencial:</b> ${tiempoSecuencial.toFixed(2)} ms</p>
    <p><b>Paralelo:</b> ${tiempoParalelo.toFixed(2)} ms</p>
    <p><b>Mejora:</b> ${porcentaje}% más rápido</p>
  `;

  resultados.classList.add('visible');
}

/* =========================
   TEMPORIZADOR
========================= */

function formatear(seg) {
  const m = Math.floor(seg / 60).toString().padStart(2, '0');
  const s = (seg % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function actualizarDisplay() {
  display.textContent = formatear(tiempoRestante);

  if (tiempoInicial > 0) {
    const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
    barraProgreso.style.width = `${porcentaje}%`;

    if (tiempoRestante <= 10 && tiempoRestante > 0) {
      display.classList.add('alerta');
      barraProgreso.classList.add('alerta');
    } else {
      display.classList.remove('alerta');
      barraProgreso.classList.remove('alerta');
    }
  }
}

function iniciar() {
  if (intervaloId) return;

  const tiempo = parseInt(inputTiempo.value);

  if (isNaN(tiempo) || tiempo <= 0) {
    alert('Ingresa un tiempo válido');
    return;
  }

  tiempoRestante = tiempo;
  tiempoInicial = tiempo;

  btnIniciar.disabled = true;
  btnDetener.disabled = false;
  inputTiempo.disabled = true;

  actualizarDisplay();

  intervaloId = setInterval(() => {
    tiempoRestante--;
    actualizarDisplay();

    if (tiempoRestante <= 0) {
      detener();
      alert(' Tiempo terminado');
    }
  }, 1000);
}

function detener() {
  clearInterval(intervaloId);
  intervaloId = null;

  btnIniciar.disabled = false;
  btnDetener.disabled = true;
  inputTiempo.disabled = false;
}

function reiniciar() {
  detener();

  tiempoRestante = 0;
  tiempoInicial = 0;

  display.textContent = '00:00';
  barraProgreso.style.width = '0%';

  display.classList.remove('alerta');
  barraProgreso.classList.remove('alerta');
}

/* =========================
   ERRORES
========================= */

function mostrarLogError(msg, tipo = 'info') {
  const div = document.createElement('div');
  div.className = `log-item log-${tipo}`;
  div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logErrores.appendChild(div);
}

async function simularError() {
  mostrarLogError(' Ejecutando operación...', 'info');

  try {
    await simularPeticion('API', 500, 1000, true);
  } catch (e) {
    mostrarLogError(` ${e.message}`, 'error');
    mostrarLogError('✔ Error controlado correctamente', 'success');
  }
}

async function fetchConReintentos(nombre, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await simularPeticion(nombre, 500, 1000, Math.random() > 0.5);
      mostrarLogError(`✔ Éxito en intento ${i + 1}`, 'success');
      return r;
    } catch (e) {
      mostrarLogError(`Falló intento ${i + 1}`, 'error');

      if (i < intentos - 1) {
        const espera = Math.pow(2, i) * 500;
        await new Promise(res => setTimeout(res, espera));
      }
    }
  }

  mostrarLogError(' Todos los intentos fallaron', 'error');
}

/* =========================
   EVENTOS
========================= */

document.getElementById('btn-secuencial').addEventListener('click', cargarSecuencial);
document.getElementById('btn-paralelo').addEventListener('click', cargarParalelo);
document.getElementById('btn-limpiar').addEventListener('click', limpiarLog);

btnIniciar.addEventListener('click', iniciar);
btnDetener.addEventListener('click', detener);
btnReiniciar.addEventListener('click', reiniciar);

document.getElementById('btn-error').addEventListener('click', simularError);

document.getElementById('btn-reintentos').addEventListener('click', () => {
  fetchConReintentos('Recurso', 3);
});

btnDetener.disabled = true;