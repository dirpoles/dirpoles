document.addEventListener("DOMContentLoaded", function () {
    $('.select2').select2({
        theme: 'bootstrap-5',
        placeholder: function () {
            return $(this).attr('data-placeholder') || "Seleccione una opción";
        },
        allowClear: true,
        width: '100%'
    });
});