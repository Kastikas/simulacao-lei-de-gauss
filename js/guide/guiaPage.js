/**
 * js/guide/guiaPage.js - Controlador de navegação, scrollspy e barra de progresso da página dedicada do Guia.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Barra de progresso de leitura
    const progressBar = document.getElementById('read-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0 && progressBar) {
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // 2. Scrollspy para os links da sidebar
    const navLinks = document.querySelectorAll('.guide-sidebar a[href^="#"]');
    const sections = [];

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            sections.push({ id: targetId, link, el: targetEl });
        }
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120; // offset do header fixo
        let currentSectionId = null;

        for (let i = sections.length - 1; i >= 0; i--) {
            const sec = sections[i];
            const top = sec.el.offsetTop;
            if (scrollPos >= top) {
                currentSectionId = sec.id;
                break;
            }
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                link.classList.add('active');
                // Garante que o item ativo seja visível dentro da sidebar rolável
                const sidebar = document.querySelector('.guide-sidebar');
                if (sidebar) {
                    const linkRect = link.getBoundingClientRect();
                    const sidebarRect = sidebar.getBoundingClientRect();
                    if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
                        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    }
                }
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // 3. Rolagem suave para cliques no índice
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = 80; // Compensação do topbar
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetEl.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Atualiza a hash na URL sem pular bruscamente
                history.pushState(null, '', `#${targetId}`);

                // Se em mobile, fecha a sidebar
                closeMobileSidebar();
            }
        });
    });

    // 4. Menu responsivo para telas pequenas
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
    const closeSidebarBtn = document.getElementById('btn-close-sidebar');
    const sidebar = document.querySelector('.guide-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    function openMobileSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (backdrop) backdrop.classList.add('active');
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
    }

    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', openMobileSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);
});
