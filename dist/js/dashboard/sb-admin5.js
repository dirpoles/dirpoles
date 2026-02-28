/* sb-admin5.js
   Vanilla JS to replace sb-admin-2 behaviors for Bootstrap 5
*/

document.addEventListener('DOMContentLoaded', function () {
    const SIDEBAR_TOGGLED_KEY = 'sb_sidebar_toggled';
    const body = document.body;
    const sidebar = document.getElementById('accordionSidebar') || document.getElementById('app-sidebar') || document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');       // bottom toggler
    const sidebarToggleTop = document.getElementById('sidebarToggleTop'); // topbar toggler (mobile)
    const COLLAPSE_SEL = '.collapse';

    // Restore persisted state
    try {
        if (localStorage.getItem(SIDEBAR_TOGGLED_KEY) === '1') {
            body.classList.add('sidebar-toggled');
            if (sidebar) sidebar.classList.add('toggled');
        }
    } catch (e) { /* ignore */ }

    function toggleSidebarPersist() {
        body.classList.toggle('sidebar-toggled');
        if (sidebar) sidebar.classList.toggle('toggled');
        try {
            localStorage.setItem(SIDEBAR_TOGGLED_KEY, sidebar && sidebar.classList.contains('toggled') ? '1' : '0');
        } catch (e) { }
        // If toggled, collapse any open bootstrap collapse inside sidebar (optional)
        if (sidebar && sidebar.classList.contains('toggled')) {
            closeAllSidebarCollapses();
        }
    }

    function closeAllSidebarCollapses() {
        if (!sidebar) return;
        const opens = sidebar.querySelectorAll(COLLAPSE_SEL + '.show');
        opens.forEach(el => {
            // use Bootstrap Collapse API
            const inst = bootstrap.Collapse.getInstance(el) || new bootstrap.Collapse(el, { toggle: false });
            inst.hide();
        });
    }

    // Toggle handlers
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function (e) {
            e.preventDefault();
            toggleSidebarPersist();
        });
    }

    if (sidebarToggleTop) {
        sidebarToggleTop.addEventListener('click', function (e) {
            e.preventDefault();
            // On small screens we want to toggle the sidebar visibility (not the collapsed state)
            if (!sidebar) return;
            sidebar.classList.toggle('show'); // in CSS set .sidebar.show { left:0 } for off-canvas
            // optionally add overlay or close on click outside
        });
    }

    // Close sidebar collapses on window resize if necessary
    window.addEventListener('resize', function () {
        // if width < 768 close all
        if (window.innerWidth < 768) {
            closeAllSidebarCollapses();
        }
    });

    // Smooth scroll to top if you have anchor .scroll-to-top
    document.querySelectorAll('a.scroll-to-top').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Initialize Bootstrap tooltips/popovers if present
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
        new bootstrap.Tooltip(el);
    });
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
        new bootstrap.Popover(el);
    });

});
