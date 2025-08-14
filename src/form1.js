// Lógica del primer formulario
import { saveData } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('miFormulario');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {
      nombre_apellido: formData.get('nombre_apellido'),
      email: formData.get('email'),
      documento: formData.get('documento'),
      cuadrilla: formData.get('cuadrilla')
    };
    saveData('formulario_parte1', data);
    window.location.href = 'form2.html';
  });
});
