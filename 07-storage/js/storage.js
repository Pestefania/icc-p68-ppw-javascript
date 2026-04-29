'use strict';

const TareaStorage = {
  CLAVE: 'tareas_lista',

  getAll() {
    try {
      const datos = localStorage.getItem(this.CLAVE);
      return datos ? JSON.parse(datos) : [];
    } catch (error) {
      return [];
    }
  },

  guardar(tareas) {
    localStorage.setItem(this.CLAVE, JSON.stringify(tareas));
  },

  crear(texto) {
    const tareas = this.getAll();

    const nueva = {
      id: Date.now(),
      texto: texto.trim(),
      completada: false
    };

    tareas.push(nueva);
    this.guardar(tareas);

    return nueva;
  },

  toggleCompletada(id) {
    const tareas = this.getAll();

    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
      tarea.completada = !tarea.completada;
      this.guardar(tareas);
    }
  },

  eliminar(id) {
    const tareas = this.getAll().filter(t => t.id !== id);
    this.guardar(tareas);
  },

  limpiarTodo() {
    localStorage.removeItem(this.CLAVE);
  }
};

const TemaStorage = {
  CLAVE: 'tema_app',

  getTema() {
    return localStorage.getItem(this.CLAVE) || 'claro';
  },

  setTema(tema) {
    localStorage.setItem(this.CLAVE, tema);
  }
};