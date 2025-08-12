<script>
const WEB_APP_URL = "https://docs.google.com/spreadsheets/d/1Yyiw2r9ZK4SDayaSuEjoyFPR4fg9HgGnxW4A3lU0hPM/edit?gid=0#gid=0"; // tu URL
const SECRET = "proyectoPrueba";

async function enviarPedido(data) {
  // añadimos el secreto al payload (GAS puede leerlo)
  data._secret = SECRET;

  const res = await fetch(WEB_APP_URL, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const r = await enviarPedido(data);
  if (r.success) {
    alert('Pedido enviado ✅');
    e.target.reset();
  } else {
    alert('Error: ' + r.error);
  }
});
</script>
