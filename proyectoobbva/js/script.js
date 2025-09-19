document.addEventListener('DOMContentLoaded', function() {
    // Gestión del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuario = document.getElementById('usuario').value;
            const contrasena = document.getElementById('contrasena').value;
            
            fetch('php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasena)}`
            })
            .then(response => response.json())
            .then(data => {
                const mensaje = document.getElementById('mensaje');
                if (data.exito) {
                    sessionStorage.setItem('usuario', usuario);
                    mensaje.textContent = data.mensaje;
                    mensaje.className = 'mensaje exito';
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    mensaje.textContent = data.mensaje;
                    mensaje.className = 'mensaje error';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('mensaje').textContent = 'Error de conexión';
                document.getElementById('mensaje').className = 'mensaje error';
            });
        });
    }
    
    // Cargar información del usuario en el dashboard
    if (window.location.pathname.endsWith('dashboard.html')) {
        const nombreUsuario = sessionStorage.getItem('usuario') || 'Usuario';
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
        
        // Obtener saldo y mostrar tarjetas apropiadas
        fetch('php/saldo.php')
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const saldo = data.saldo;
                    mostrarTarjetas(saldo);
                } else {
                    window.location.href = 'index.html';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                window.location.href = 'index.html';
            });
    }
    
    // Cargar saldo en la página de saldo
    if (window.location.pathname.endsWith('saldo.html')) {
    const usuario = sessionStorage.getItem('usuario');
    fetch('php/saldo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `usuario=${encodeURIComponent(usuario)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.exito) {
            document.getElementById('saldo').textContent = `$${parseFloat(data.saldo).toFixed(2)}`;
            document.getElementById('nombreUsuario').textContent = usuario;
        } else {
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        window.location.href = 'index.html';
    });
}

    // Cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
    
    // Verificar autenticación en páginas protegidas
    if (window.location.pathname.endsWith('dashboard.html') || 
        window.location.pathname.endsWith('saldo.html')) {
        if (!sessionStorage.getItem('usuario')) {
            window.location.href = 'index.html';
        }
    }
});

function mostrarTarjetas(saldo) {
    const tarjetasContainer = document.getElementById('tarjetas');
    tarjetasContainer.innerHTML = '';
    
    if (saldo <= 4000) {
        tarjetasContainer.innerHTML = `
            <div class="tarjeta plata">
                <h3>Tarjeta Plata</h3>
                <p>Ideal para tu nivel de ingresos</p>
                <p>Límite de crédito: $${(saldo * 0.5).toFixed(2)}</p>
                <p>Tasa preferencial: 25% anual</p>
                <button>Solicitar</button>
            </div>
        `;
    } else if (saldo <= 100000) {
        tarjetasContainer.innerHTML = `
            <div class="tarjeta oro">
                <h3>Tarjeta Oro</h3>
                <p>Para clientes preferentes</p>
                <p>Límite de crédito: $${(saldo * 0.8).toFixed(2)}</p>
                <p>Tasa preferencial: 18% anual</p>
                <button>Solicitar</button>
            </div>
        `;
    } else {
        tarjetasContainer.innerHTML = `
            <div class="tarjeta black">
                <h3>Tarjeta Black</h3>
                <p>Exclusiva para clientes premium</p>
                <p>Límite de crédito: $${(saldo * 1.2).toFixed(2)}</p>
                <p>Tasa preferencial: 12% anual</p>
                <button>Solicitar</button>
            </div>
        `;
    }
}