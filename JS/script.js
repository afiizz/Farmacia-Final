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
    
    if (carrito.length === 0) return alert("Añade algún producto primero.");

    let msg = "--- PHARMACLICK TICKET ---\n\n";
    if(checkReceta && checkReceta.checked) {
        msg += "⚠️ AVISO: EL CLIENTE TIENE RECETA\n\n";
    }
    msg += "Total estimado: " + total + "€\n";
    msg += "Código de recogida: PH-" + Math.floor(Math.random()*9000+1000);
    
    alert(msg);
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


