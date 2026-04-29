'use strict';

const ValidacionService = {

  validarCampo(campo){
    const valor = campo.value.trim();
    const nombre = campo.name;
    let error = '';

    if(campo.hasAttribute('required')){
      if(campo.type === 'checkbox'){
        if(!campo.checked) error = 'Debes aceptar';
      } else if(!valor){
        error = 'Campo obligatorio';
      }
    }

    if(!error && valor){
      switch(nombre){
        case 'nombre':
          if(valor.length < 3) error = 'Mínimo 3 caracteres';
          break;

        case 'email':
          if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)){
            error = 'Email inválido';
          }
          break;

        case 'telefono':
          if(!/^\d{10}$/.test(valor.replace(/\D/g,''))){
            error = '10 dígitos';
          }
          break;

        case 'fecha_nacimiento':
          const edad = new Date().getFullYear() - new Date(valor).getFullYear();
          if(edad < 18) error = 'Debes ser mayor de edad';
          break;

        case 'password':
          if(valor.length < 8) error = 'Mínimo 8 caracteres';
          break;

        case 'confirmar_password':
          const pass = document.querySelector('[name="password"]').value;
          if(valor !== pass) error = 'No coinciden';
          break;
      }
    }

    return { valido: error === '', error };
  },

  validarFormulario(form){
    let valido = true;

    form.querySelectorAll('input, select').forEach(campo=>{
      const r = this.validarCampo(campo);

      if(!r.valido){
        mostrarError(campo, r.error);
        valido = false;
      } else {
        limpiarError(campo);
      }
    });

    return valido;
  },

  evaluarFuerzaPassword(pass){
    let fuerza = 0;
    if(pass.length >= 8) fuerza++;
    if(/[A-Z]/.test(pass)) fuerza++;
    if(/[0-9]/.test(pass)) fuerza++;

    const niveles = ['','Débil','Media','Fuerte'];

    return {
      nivel: niveles[fuerza],
      clase: niveles[fuerza]
    };
  }
};

function mostrarError(campo, mensaje){
  // 🔴 quitar verde y poner rojo
  campo.classList.remove('campo--valido');
  campo.classList.add('error');

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if(errorDiv) errorDiv.textContent = mensaje;
}

function limpiarError(campo){
  // 🟢 quitar rojo y poner verde
  campo.classList.remove('error');
  campo.classList.add('campo--valido');

  const errorDiv = campo.parentElement.querySelector('.error-mensaje');
  if(errorDiv) errorDiv.textContent = '';
}

function aplicarMascaraTelefono(input){
  let v = input.value.replace(/\D/g,'');
  if(v.length > 10) v = v.slice(0,10);
  input.value = v;
}