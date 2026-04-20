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

//DIBUJA LA LISTA DE LA PAGINA DEL CARRITO
function renderizarTicket() {
    const div = document.getElementById('cart-items'); 
    const suma = document.getElementById('cart-total');
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
            <div style="display: flex; justify-content: space-between; width:100%; padding: 12px; border-bottom: 1px solid #eee;">
                <span style="text-align: keft;"><strong>${item.cantidad}x</strong> ${nombre}</span>
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
    const total = document.getElementById('cart-total').innerText;
    
    if (carrito.length === 0) return alert("El carrito está vacío.");

    //RELLENAR LOS PRODUCTOS EN EL TICKET 
    let contenidoHTML = "";
    let agrupados = {};
    carrito.forEach(p => {
        agrupados[p.nombre] = (agrupados[p.nombre] || 0) + 1;
    });

    for (let nombre in agrupados) {
        contenidoHTML += `<p style="display:flex; justify-content:space-between; margin: 5px 0;">
                            <span>${agrupados[nombre]}x ${nombre}</span>
                          </p>`;
    }

    //PONER LOS DATOS EN EL TICKET FINAL - RECUADRITO FINAL
    document.getElementById('contenido-ticket-final').innerHTML = contenidoHTML;
    document.getElementById('total-ticket-final').innerText = total;
    document.getElementById('codigo-ticket').innerText = "CÓDIGO: PH-" + Math.floor(Math.random()*9000+1000);

    //AVISA SI LA RECETA ESTÁ MARCADA
    if(checkReceta && checkReceta.checked) {
        document.getElementById('aviso-receta-ticket').style.display = "block";
    } else {
        document.getElementById('aviso-receta-ticket').style.display = "none";
    }

    //MOSTRAMOS EL TICKET FINAL - RECUADRITO FINAL
    document.getElementById('modal-ticket').style.display = "flex";
}

//LIMPIA TODO Y HACE VOLVER AL INICIO
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

//ESTA FUNCION HACE QUE EL CHECK DE LA RECETA REACCIONE
function avisarReceta() {
    const check = document.getElementById('check-receta');
    const suma = document.getElementById('cart-total');
    
    if (check.checked) {
        alert("📝 Receta anotada. El descuento de la Seguridad Social se aplicará al pagar en la farmacia.");
    } else {
        suma.style.color = "#2a9d8f";
    }
}

function buscarProducto() {
    //CAPTURA LO QUE SE ESCRIBE
    let filtro = document.getElementById('buscador').value.toLowerCase();
    //let filtro = input.value.toLowerCase();
    
    //SELECCIONA TODAS LAS TARJETAS
    let tarjetas = document.querySelectorAll('.product-card');

    //FILTRA SI ESTÁ LA PALABRA BUSCADA 
    tarjetas.forEach(tarjeta => {
        //BUSCA EL H3 ESPECIFICO 
        let nombre = tarjeta.querySelector('h3').innerText.toLowerCase();

        if (nombre.includes(filtro)) {
            tarjeta.style.display = ""; //MUESTRA LA TARJETA
        } else {
            tarjeta.style.display = "none"; //LAS ESCONDE
        }
    });
}


