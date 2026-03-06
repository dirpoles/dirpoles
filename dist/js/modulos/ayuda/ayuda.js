document.addEventListener("DOMContentLoaded", () => {
    const helpSearch = document.getElementById("helpSearch");
    const helpTopics = document.querySelectorAll(".help-topic-item");
    const modalElement = document.getElementById("modalGuia");
    const guiaImg = document.getElementById("guiaImg");
    const guiaTitle = document.getElementById("guiaTitle");
    const guiaLoader = document.getElementById("guiaLoader");
    const guiaMantenimiento = document.getElementById("guiaMantenimiento");

    // Inicializar modal con instancia de BS5
    const helpModal = new bootstrap.Modal(modalElement);

    // 1. Buscador Inteligente
    helpSearch.addEventListener("input", function (e) {
        const term = e.target.value.toLowerCase();

        helpTopics.forEach(card => {
            const keywords = card.getAttribute("data-keywords").toLowerCase();
            const text = card.innerText.toLowerCase();

            if (term === "" || keywords.includes(term) || text.includes(term)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });

    // 2. Manejo de Guías Visuales
    document.querySelectorAll(".open-guide").forEach(item => {
        item.addEventListener("click", function () {
            const title = this.getAttribute("data-title");
            const imgSrc = this.getAttribute("data-img");

            guiaTitle.innerText = title;
            guiaImg.style.display = "none";
            guiaMantenimiento.style.display = "none";
            guiaLoader.style.display = "block";

            // Ruta real de la imagen
            const fullPath = BASE_URL + "dist/img/ayuda/" + imgSrc;

            // Probar si la imagen existe
            const tester = new Image();
            tester.onload = () => {
                guiaImg.src = fullPath;
                guiaLoader.style.display = "none";
                guiaImg.style.display = "block";
            };

            tester.onerror = () => {
                guiaLoader.style.display = "none";
                guiaMantenimiento.style.display = "block";
            };

            tester.src = fullPath;
            helpModal.show();
        });
    });

    // 3. Botón Manual
    document.getElementById("btnDescargarManual").addEventListener("click", () => {
        Swal.fire({
            icon: 'info',
            title: 'Manual de Usuario',
            text: 'El manual completo de DIRPOLES 4 se está preparando para su descarga en formato PDF.',
            confirmButtonColor: '#4e73df'
        });
    });
});
