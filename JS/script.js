// 1. Cargamos lo que haya guardado o empezamos de cero
let carrito = JSON.parse(localStorage.getItem('pharma-ticket')) || [];

// 2. Función que actualiza el número del menú
function actualizarMenu() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.innerText = carrito.length;
    }
}

// 3. Función para añadir el producto
function añadirProducto(evento) {
    const boton = evento.target;
    const tarjeta = boton.closest('.product-card');
    
    const info = {
        nombre: tarjeta.querySelector('h3').innerText,
        precio: tarjeta.querySelector('.product-price').innerText
    };

    carrito.push(info);
    localStorage.setItem('pharma-ticket', JSON.stringify(carrito));
    
    actualizarMenu(); // Refleja el cambio en el momento
    alert("Añadido: " + info.nombre); 
}

// Activar botones al cargar la web
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenu();
    const botones = document.querySelectorAll('.btn-add');
    botones.forEach(b => b.addEventListener('click', añadirProducto));
});
