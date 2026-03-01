document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', async function(e) {
        const boton = e.target.closest('.btn-eliminar');
        if (!boton) return;
        e.preventDefault();

        const tipo   = boton.dataset.tipo;
        const id     = boton.dataset.id;
        const nombre = boton.dataset.nombre || 'este registro';

        // Construye la URL y los datos POST
        let url = `index.php?action=${tipo}_eliminar`;
        const body = new URLSearchParams({ [`id_${tipo}`]: id });

        try {
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: `¿Deseas eliminar a ${nombre}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
            if (!confirmacion.isConfirmed) return;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: data.message
                });

                const fila = boton.closest('tr');
                if (fila) fila.remove();
            } else {
                throw new Error(data.message || 'Error desconocido');
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error desconocido'
            });
        }
    });
});
