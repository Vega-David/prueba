// app.js

// ---- EDITAR: pega aquí la URL de tu Web App desplegada ----
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxLIwgM64wGpmDYoEPRX9rUuo1lhYFf6NUFosZVX3T7Ln2WuAD51EtivQ8xzu-Ow8Sl/exec"; // <- reemplaza
// ---- EDITAR: debe coincidir con el SECRET en tu Apps Script ----
const SECRET = "proyectoPrueba"; // <- reemplaza

const form = document.getElementById('orderForm');
const msg = document.getElementById('msg');

function showMessage(text, ok = true) {
  msg.style.color = ok ? 'green' : 'red';
  msg.textContent = text;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  showMessage('Enviando...', true);

  // Obtener valores del form
  const data = Object.fromEntries(new FormData(form).entries());
  // Agregamos el secreto al payload (Apps Script lo leerá)
  data._secret = SECRET;

  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'cors', // permitir cross-origin (Apps Script debe estar desplegado como "Anyone")
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // si la respuesta no es 2xx
    if (!res.ok) {
      const text = await res.text();
      showMessage('Error del servidor: ' + res.status + ' — ' + text, false);
      return;
    }

    const j = await res.json();
    if (j && j.success) {
      showMessage('Pedido enviado ✅', true);
      form.reset();
    } else {
      showMessage('Error: ' + (j && j.error ? j.error : 'Respuesta inválida'), false);
    }
  } catch (err) {
    showMessage('Error de red: ' + err.message, false);
  }
});
