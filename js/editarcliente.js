(function () {

    let DB;
    let idCliente;
    const formulario = document.querySelector('#formulario');

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');
    const telefonoInput = document.querySelector('#telefono');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        //
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar si el cliente existe
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if (idCliente) {

            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function obtenerCliente(id) {

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');


        var request = objectStore.openCursor();
        request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.id == id) {
                    // pasar el que estamos editando...
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        };
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, empresa, telefono } = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        empresaInput.value = empresa;
        telefonoInput.value = telefono;
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // actualizar...
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        }

        // actualizar...
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado) // Encuentra el id, y actualiza el cliente con la nueva informacion (gracias al keypath)

        transaction.oncomplete = function () {
            imprimirAlerta('Editado correctamente');

            setTimeout(()=>{
                window.location.href = 'index.html'
            }, 3000)
        }
        transaction.onerror = function () {
            console.log('Hubo un error');
        }
    };
})();