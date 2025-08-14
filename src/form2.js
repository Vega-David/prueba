// --- PDF GENERATION ---
function generarPDF(data) {
  // Usar jsPDF desde el CDN global
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const fecha = new Date().toLocaleDateString();
  const cuadrilla = data.cuadrilla || '';
  doc.setFontSize(16);
  // Centrar el título
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = `Registro de ${cuadrilla}`;
  const textWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - textWidth) / 2, 18);

  // Tabla de elementos
  const elementos = data.elementos || [];
  const tableData = elementos.map(el => [
    el.nombre_elemento,
    el.caracteristica,
    el.codigo_unico,
    el.estado_elemento
  ]);
  doc.autoTable({
    head: [['Nombre', 'Característica', 'Código Único', 'Estado']],
    body: tableData,
    startY: 28,
    styles: { halign: 'center' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Info de la persona, bloque alineado a la izquierda, separado de la tabla
  const infoY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  const infoLines = [
    `Nombre y Apellido: ${data.nombre_apellido || ''}`,
    `Documento: ${data.documento || ''}`,
    `Email: ${data.email || ''}`,
    `Fecha: ${fecha}`
  ];
  let y = infoY;
  infoLines.forEach(line => {
    doc.text(line, 14, y);
    y += 8;
  });

  doc.save(`reporte_cuadrilla_${cuadrilla}.pdf`);
}
  // Botón para generar PDF
  const btnPDF = document.getElementById('btnPDF');
  btnPDF.addEventListener('click', function() {
    const data1 = getData('formulario_parte1') || {};
    if (!data1.elementos || data1.elementos.length === 0) {
      alert('No hay elementos para exportar.');
      return;
    }
    generarPDF(data1);
  });
// Lógica del segundo formulario
import { getData, saveData } from './storage.js';
import { sendDataToAPI } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('miFormulario2');
  if (!form) return;
  const tabla = document.createElement('table');
  tabla.innerHTML = `<thead><tr><th>Nombre</th><th>Característica</th><th>Código Único</th><th>Estado</th><th>Acciones</th></tr></thead><tbody></tbody>`;
  form.parentNode.insertBefore(tabla, form.nextSibling);

  function renderTabla() {
    const data1 = getData('formulario_parte1') || {};
    const elementos = data1.elementos || [];
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';
    elementos.forEach((el, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${el.nombre_elemento}</td>
        <td>${el.caracteristica}</td>
        <td>${el.codigo_unico}</td>
        <td>${el.estado_elemento}</td>
        <td>
          <button type="button" class="editar" data-idx="${idx}">Editar</button>
          <button type="button" class="eliminar" data-idx="${idx}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Acciones editar
    tbody.querySelectorAll('.editar').forEach(btn => {
      btn.onclick = function() {
        const idx = this.getAttribute('data-idx');
        editarElemento(idx);
      };
    });
    // Acciones eliminar
    tbody.querySelectorAll('.eliminar').forEach(btn => {
      btn.onclick = function() {
        const idx = this.getAttribute('data-idx');
        eliminarElemento(idx);
      };
    });
  }

  let editando = false;
  let idxEditando = null;
  const btnSubmit = document.getElementById('btnSubmit');

  function editarElemento(idx) {
    const data1 = getData('formulario_parte1') || {};
    const el = (data1.elementos || [])[idx];
    if (!el) return;
    // Rellenar el formulario con los datos del elemento
    form.elements['nombre_elemento'].value = el.nombre_elemento;
    form.elements['caracteristica'].value = el.caracteristica;
    form.elements['codigo_unico'].value = el.codigo_unico;
    if (el.estado_elemento === 'Correcto estado') {
      form.elements['estado_elemento'][0].checked = true;
    } else {
      form.elements['estado_elemento'][1].checked = true;
    }
    editando = true;
    idxEditando = Number(idx);
    btnSubmit.textContent = 'Guardar';
  }

  function eliminarElemento(idx, rerender = true) {
    if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;
    const data1 = getData('formulario_parte1') || {};
    if (!data1.elementos) return;
    data1.elementos.splice(idx, 1);
    saveData('formulario_parte1', data1);
    if (rerender) renderTabla();
  }

  renderTabla();

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const elemento = {
      nombre_elemento: formData.get('nombre_elemento'),
      caracteristica: formData.get('caracteristica'),
      codigo_unico: formData.get('codigo_unico'),
      estado_elemento: formData.get('estado_elemento')
    };
    const data1 = getData('formulario_parte1') || {};
    if (!data1.elementos) data1.elementos = [];
    if (editando && idxEditando !== null) {
      data1.elementos[idxEditando] = elemento;
      editando = false;
      idxEditando = null;
      btnSubmit.textContent = 'Enviar';
    } else {
      data1.elementos.push(elemento);
    }
    saveData('formulario_parte1', data1);
    this.reset();
    renderTabla();
  });

  // Botón para enviar todos los elementos
  const btnEnviar = document.createElement('button');
  btnEnviar.textContent = 'Enviar todos los elementos';
  btnEnviar.type = 'button';
  form.parentNode.appendChild(btnEnviar);

  btnEnviar.addEventListener('click', function() {
    const data1 = getData('formulario_parte1') || {};
    if (!data1.elementos || data1.elementos.length === 0) {
      alert('No hay elementos para enviar.');
      return;
    }
    // Enviar a la API
    sendDataToAPI(data1)
      .then(res => {
        if(res.status === 'ok') {
          alert('Datos enviados correctamente');
          localStorage.removeItem('formulario_parte1');
          renderTabla();
        } else {
          alert('Error al enviar los datos');
        }
      })
      .catch(err => {
        alert('Error de red o servidor');
        console.error(err);
      });
  });
});
