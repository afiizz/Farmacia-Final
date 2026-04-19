//MEMORIA TEMPORAL: AL CERRAR LA WEB SE BORRA TODO
let carrito = JSON.parse(sessionStorage.getItem('pharma-ticket')) || [];

//ACTUALIZA EL NUMERO DEL CARRITO DEL MENU
function actualizarMenu() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.innerText = carrito.length;
    }
}

//LIMPIAMOS EL PRECIO PQ ES TEXTO Y TENEMOS QUE PASARLO A NUMEROS PARA HACER LOS CALCULOS
function añadirProducto(evento) {
    const boton = evento.target;
    const tarjeta = boton.closest('.product-card');
    const nombre = tarjeta.querySelector('h3').innerText;
    
    //QUITAMOS LETRAS, PUNTOS, COMAS...
    let precioTexto = tarjeta.querySelector('.product-price').innerText;
    let precioLimpio = precioTexto.replace(/[^\d,]/g, '').replace(',', '.');
    let precioNumerico = parseFloat(precioLimpio);

    const info = { nombre: nombre, precio: precioNumerico };

    carrito.push(info);
    sessionStorage.setItem('pharma-ticket', JSON.stringify(carrito));
    
    actualizarMenu();
    
    boton.innerText = "¡Añadido! ✅";
    setTimeout(() => boton.innerText = "Añadir", 800);
}

//DIBUJA LA LISTA
function renderizarTicket() {
    const div = document.getElementById('contenedor-carrito');
    const suma = document.getElementById('suma-total');
    if (!div) return; 

    let html = "";
    let total = 0;
    let agrupados = {};

    carrito.forEach(p => {
        if(agrupados[p.nombre]) {
            agrupados[p.nombre].cantidad++;
        } else {
            agrupados[p.nombre] = { precio: p.precio, cantidad: 1 };
        }
    });

    for (let nombre in agrupados) {
        let item = agrupados[nombre];
        let subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee;">
                <span><strong>${item.cantidad}x</strong> ${nombre}</span>
                <span style="font-weight: bold; color: #2a9d8f;">${subtotal.toFixed(2)}€</span>
            </div>`;
    }

    div.innerHTML = html || "<p style='text-align:center'>El carrito está vacío</p>";
    suma.innerText = total.toFixed(2);
}

//FUNCIONES DE LOS BOTONES QUE SE LLAMAN DEL HTML
function vaciarCarrito() {
    if(confirm("¿Seguro que quieres vaciar el carrito?")) {
        sessionStorage.removeItem('pharma-ticket');
        window.location.reload();
    }
}

function generarTicketFinal() {
    const checkReceta = document.getElementById('check-receta');
    const total = document.getElementById('suma-total').innerText;
    
    if (carrito.length === 0) return alert("El carrito está vacío.");

    // 1. Rellenar los productos en el ticket visual
    let contenidoHTML = "";
    let agrupados = {};
    carrito.forEach(p => {
        agrupados[p.nombre] = (agrupados[p.nombre] || 0) + 1;
    });

    for (let nombre in agrupados) {
        contenidoHTML += `<p style="display:flex; justify-content:space-between;">
                            <span>${agrupados[nombre]}x ${nombre}</span>
                          </p>`;
    }

    // 2. Meter los datos en el Modal
    document.getElementById('contenido-ticket-final').innerHTML = contenidoHTML;
    document.getElementById('total-ticket-final').innerText = total;
    document.getElementById('codigo-ticket').innerText = "CÓDIGO: PH-" + Math.floor(Math.random()*9000+1000);

    // 3. Mostrar aviso de receta si está marcado
    if(checkReceta && checkReceta.checked) {
        document.getElementById('aviso-receta-ticket').style.display = "block";
    } else {
        document.getElementById('aviso-receta-ticket').style.display = "none";
    }

    // 4. Mostrar el modal (cambiamos el display de none a flex)
    document.getElementById('modal-ticket').style.display = "flex";
}

// Esta función limpia todo y te echa a la página de inicio
function cerrarYFinalizar() {
    sessionStorage.removeItem('pharma-ticket');
    window.location.href = "index.html";
}

//AL CARGAR LA PAGINA
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenu();
    
    const botones = document.querySelectorAll('.btn-add');
    botones.forEach(b => b.addEventListener('click', añadirProducto));

    if (window.location.pathname.includes('ticket.html')) {
        renderizarTicket();
    }
});

// ESTA FUNCIÓN HACE QUE EL CHECK DE LA RECETA "REACCIONE"
function avisarReceta() {
    const check = document.getElementById('check-receta');
    const suma = document.getElementById('suma-total');
    
    if (check.checked) {
        // Si quieres que pase algo visual, podemos cambiar el color del total o sacar un mensaje
        suma.style.color = "#e67e22"; // Color naranja para indicar que el precio cambiará con receta
        alert("📝 Receta anotada. El descuento de la Seguridad Social se aplicará al pagar en la farmacia.");
    } else {
        suma.style.color = "#2a9d8f"; // Vuelve al color original (verde)
    }
}

function buscarProducto() {
    // 1. Capturamos lo que se escribe
    let input = document.getElementById('buscador').value.toLowerCase();
    //let filtro = input.value.toLowerCase();
    
    // 2. Seleccionamos todas las tarjetas de productos
    let tarjetas = document.querySelectorAll('.product-card');

    // 3. Filtramos
    tarjetas.forEach(tarjeta => {
        // Buscamos el h3 dentro de esa tarjeta específica
        let nombre = tarjeta.querySelector('h3').innerText.toLowerCase();

        if (nombre.includes(filtro)) {
            tarjeta.style.display = ""; // Muestra la tarjeta (usa el estilo por defecto)
        } else {
            tarjeta.style.display = "none"; // La esconde
        }
    });
}


