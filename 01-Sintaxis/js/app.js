'use strict';

const nombre = 'Cristina'; 
const apellido = 'Loja';
let ciclo = 5;
const activo = true;

const direccion = {
    ciudad : 'Cuenca',
    provincia : 'Azuay',
}
console.table({ nombre, apellido, ciclo, activo, direccion });

// const calcularPromedio = (notas) =>  // Promedio; notas.reduce

const esMayorEdad = (edad) => edad >= 18;

const getSaludo = (nombre, hora) => {
    if (hora < 12)
        return 'Buenos dias, ${nombre}';
    if (hora < 10)
        return 'Buenas tardes, ${nombre}';
}

const getSaludo2 = (nombre, hora) => hora < 12
    ? `Buenos dias, ${nombre}`
    : hora < 18
        ? `Buenas tardes, ${nombre}`
        : `Buenas noches, ${no}`;



// Mostrar en HTML
document.getElementById('nombre').textContent = `${nombre}`;
document.getElementById('apellido').textContent = `${apellido}`;
document.getElementById('ciclo').textContent = `${ciclo}`;