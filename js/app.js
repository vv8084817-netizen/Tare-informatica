const form = document.getElementById("form-registro");
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");
const inputCodigo = document.getElementById("codigo");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tabla-estudiantes");

// Lista de códigos ya registrados
const codigosRegistrados = [];

// Genera el QR dentro de un contenedor
function generarQR(contenedor, texto) {
    contenedor.innerHTML = "";
    new QRCode(contenedor, {
        text: texto,
        width: 80,
        height: 80
    });
}

// Verifica si el código ya existe (sin importar mayúsculas ni espacios)
function codigoExiste(codigo) {
    return codigosRegistrados.includes(codigo.trim().toLowerCase());
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo; // "error" o "ok"
}

// Al cargar: leer los estudiantes que ya están en la tabla y generarles su QR
function cargarEstudiantesExistentes() {
    const filas = tabla.querySelectorAll("tr");
    for (let i = 1; i < filas.length; i++) { // i = 1 salta el encabezado
        const celdas = filas[i].querySelectorAll("td");
        const codigo = celdas[0].textContent.trim();
        codigosRegistrados.push(codigo.toLowerCase());
        generarQR(celdas[3], codigo);
    }
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const apellido = inputApellido.value.trim();
    const codigo = inputCodigo.value.trim();

    if (nombre === "" || apellido === "" || codigo === "") {
        mostrarMensaje("Completa todos los campos.", "error");
        return;
    }

    if (codigoExiste(codigo)) {
        mostrarMensaje("El código " + codigo + " ya está registrado.", "error");
        return;
    }

    // Agregar fila a la tabla con sus datos y su QR
    const fila = tabla.insertRow();
    fila.insertCell().textContent = codigo;
    fila.insertCell().textContent = nombre;
    fila.insertCell().textContent = apellido;
    generarQR(fila.insertCell(), codigo);

    codigosRegistrados.push(codigo.toLowerCase());

    mostrarMensaje("Estudiante registrado correctamente.", "ok");
    form.reset();
});

cargarEstudiantesExistentes();