// dist/js/core/AlertManager.js
class AlertManager {
    static config = {
        timer: 3000,
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
            popup: 'custom-swal-popup'
        }
    };

    static success(title, text = '', redirectUrl = null) {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            ...this.config
        }).then((result) => {
            if (redirectUrl && (result.isConfirmed || result.isDismissed)) {
                window.location.href = redirectUrl;
            }
            return result;
        });
    }

    static error(title, text = '') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            customClass: this.config.customClass
        });
    }

    static warning(title, text = '') {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            showConfirmButton: true,
            confirmButtonText: 'Entendido',
            customClass: this.config.customClass
        });
    }

    static info(title, text = '') {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
            ...this.config,
            showConfirmButton: true
        });
    }

    static confirm(title, text = '', confirmText = 'Sí', cancelText = 'No') {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true,
            customClass: this.config.customClass
        });
    }

    static loading(title = 'Procesando...', text = 'Espere un momento por favor') {
        return Swal.fire({
            title: title,
            text: text,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
    }

    static close() {
        Swal.close();
    }
}