document.addEventListener("DOMContentLoaded", () => {
    const helpSearch = document.getElementById("helpSearch");
    const helpTopics = document.querySelectorAll(".help-topic-item");
    const modalElement = document.getElementById("modalGuia");
    const guiaTitle = document.getElementById("guiaTitle");
    const guiaCategory = document.getElementById("guiaCategory");
    const guiaContent = document.getElementById("guiaContent");

    // Inicializar modal con BS5
    const helpModal = new bootstrap.Modal(modalElement);

    // ─── 1. Buscador Inteligente ───
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

    // ─── 2. Renderizar Guía Textual en Modal ───
    function renderGuide(guideKey) {
        const guide = HELP_GUIDES[guideKey];

        if (!guide) {
            guiaTitle.innerText = "Guía no disponible";
            guiaCategory.innerText = "";
            guiaContent.innerHTML = `
                <div class="guide-empty">
                    <i class="fas fa-tools fa-3x mb-3 text-muted"></i>
                    <h5 class="font-weight-bold">Contenido en preparación</h5>
                    <p class="text-muted">Esta guía aún no está disponible. Intente más tarde.</p>
                </div>`;
            return;
        }

        // Título y breadcrumb
        guiaTitle.innerText = guide.title;
        guiaCategory.innerText = guide.category;

        // Construir pasos
        let stepsHTML = '<div class="guide-steps">';
        guide.steps.forEach((step, index) => {
            stepsHTML += `
                <div class="guide-step">
                    <div class="guide-step-number">${index + 1}</div>
                    <div class="guide-step-icon">
                        <i class="fas ${step.icon}"></i>
                    </div>
                    <div class="guide-step-text">${step.text}</div>
                </div>`;
        });
        stepsHTML += '</div>';

        // Construir tip
        let tipHTML = '';
        if (guide.tip) {
            tipHTML = `
                <div class="guide-tip">
                    <i class="fas fa-lightbulb me-2"></i>
                    <span><b>Consejo:</b> ${guide.tip}</span>
                </div>`;
        }

        guiaContent.innerHTML = stepsHTML + tipHTML;
    }

    // ─── 3. Eventos de click en FAQ items ───
    document.querySelectorAll(".open-guide").forEach(item => {
        item.addEventListener("click", function () {
            const guideKey = this.getAttribute("data-guide");
            renderGuide(guideKey);
            helpModal.show();
        });
    });

    // ─── 4. Botón Manual Completo ───
    document.getElementById("btnDescargarManual").addEventListener("click", () => {
        Swal.fire({
            icon: 'info',
            title: 'Manual de Usuario',
            text: 'El manual completo de DIRPOLES 4 se está preparando para su descarga en formato PDF.',
            confirmButtonColor: '#4e73df'
        });
    });
});
