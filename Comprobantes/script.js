function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function formatValor(valor) {
  // Formato: "$ 10.000,00"
  let num = Number(valor).toLocaleString('es-CO', {minimumFractionDigits:2, maximumFractionDigits:2});
  return `$ ${num}`;
}

function formatTelefono(tel) {
  // Formato: 300 100 6000
  tel = tel.replace(/\D/g, '').slice(0,10);
  if (tel.length < 10) return tel;
  return `${tel.substr(0,3)} ${tel.substr(3,3)} ${tel.substr(6,4)}`;
}

function fechaColombia() {
  // Colombia UTC-5
  let now = new Date();
  let utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  let colombia = new Date(utc - (5 * 60 * 60000));
  let meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  let dia = colombia.getDate().toString().padStart(2,'0');
  let mes = meses[colombia.getMonth()];
  let año = colombia.getFullYear();
  let hora = colombia.getHours();
  let minutos = colombia.getMinutes().toString().padStart(2,'0');
  let ampm = hora >= 12 ? 'p. m.' : 'a. m.';
  hora = hora % 12;
  if (hora === 0) hora = 12;
  hora = hora.toString().padStart(2,'0');
  return `${dia} de ${mes} de ${año} a las ${hora}:${minutos} ${ampm}`;
}

function generarReferencia() {
  let num = Math.floor(1000000 + Math.random() * 9000000);
  return `M1${num}`;
}

function generarComprobante() {
  let nombre = document.getElementById('nombre').value.trim();
  let valor = document.getElementById('valor').value.trim();
  let telefono = document.getElementById('telefono').value.trim();

  if (!nombre || !valor || !telefono || telefono.length !== 10 || isNaN(valor)) {
    alert('Por favor, complete todos los campos correctamente.');
    return;
  }

  // Formatear datos
  let nombreFormateado = toTitleCase(nombre);
  let valorFormateado = formatValor(valor);
  let telefonoFormateado = formatTelefono(telefono);
  let fecha = fechaColombia();
  let referencia = generarReferencia();

  // Aquí puedes ajustar la posición y formato de los datos según tu plantilla
  let html = `
    <div style="margin-bottom:10px;"><b>Nombre y Apellido:</b> ${nombreFormateado}</div>
    <div style="margin-bottom:10px;"><b>Valor:</b> ${valorFormateado}</div>
    <div style="margin-bottom:10px;"><b>Teléfono:</b> ${telefonoFormateado}</div>
    <div style="margin-bottom:10px;"><b>Fecha y hora:</b> ${fecha}</div>
    <div style="margin-bottom:10px;"><b>Referencia:</b> ${referencia}</div>
  `;

  document.getElementById('datosComprobante').innerHTML = html;

  // Mostrar comprobante oculto
  let comprobante = document.getElementById('comprobante');
  comprobante.style.display = 'block';

  // Esperar a que se renderice la fuente
  setTimeout(() => {
    html2canvas(comprobante, {backgroundColor: null}).then(canvas => {
      let link = document.getElementById('descargar');
      link.href = canvas.toDataURL('image/png');
      link.download = `comprobante_${referencia}.png`;
      link.textContent = 'Descargar comprobante';
      link.style.display = 'inline-block';
      comprobante.style.display = 'none';
    });
  }, 300);
}
