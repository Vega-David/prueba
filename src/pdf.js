// Módulo para generar PDF del registro
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generarPDF(data) {
  const doc = new jsPDF();
  const fecha = new Date().toLocaleDateString();
  const cuadrilla = data.cuadrilla || '';
  doc.setFontSize(16);
  doc.text(`Registro de ${cuadrilla}`, 14, 18);

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
    startY: 28
  });

  // Info de la persona
  const infoY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Nombre y Apellido: ${data.nombre_apellido || ''}`, 120, infoY);
  doc.text(`Documento: ${data.documento || ''}`, 120, infoY + 8);
  doc.text(`Email: ${data.email || ''}`, 120, infoY + 16);
  doc.text(`Fecha: ${fecha}`, 120, infoY + 24);

  doc.save(`reporte_cuadrilla_${cuadrilla}.pdf`);
}
