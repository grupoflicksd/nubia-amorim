document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Elementos do Menu Mobile
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle Menu Mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            
            // Alterar ícone entre menu e X
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    // Fechar menu mobile ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });

    // 3. Efeito de Scroll no Header (Header Fixo Transparente -> Sólido)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Highlight do Menu Ativo durante o Scroll
    const sections = document.querySelectorAll('section[id]');
    
    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-list a[href*=${sectionId}]`);

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollActive);

    // 6. Controle de Navegação do Carrossel do Instagram (Modelo Dr. Inácio com Dots)
    const igWrapper = document.getElementById('ig-carousel-wrapper');
    const igPrevBtn = document.getElementById('ig-prev-btn');
    const igNextBtn = document.getElementById('ig-next-btn');
    const igCards = document.querySelectorAll('.reel-card');
    const igDotsContainer = document.getElementById('ig-dots');

    if (igWrapper && igPrevBtn && igNextBtn && igCards.length > 0) {
        // Criar Dots de Paginação
        if (igDotsContainer) {
            igDotsContainer.innerHTML = '';
            igCards.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (idx === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir para post ${idx + 1}`);
                dot.addEventListener('click', () => {
                    const cardWidth = igCards[0].getBoundingClientRect().width + 24; // width + gap
                    igWrapper.scrollTo({
                        left: idx * cardWidth,
                        behavior: 'smooth'
                    });
                });
                igDotsContainer.appendChild(dot);
            });
        }

        const updateActiveIgDot = () => {
            if (!igDotsContainer) return;
            const firstCard = igCards[0];
            const cardWidth = firstCard.getBoundingClientRect().width + 24;
            const scrollLeft = igWrapper.scrollLeft;
            const activeIndex = Math.round(scrollLeft / cardWidth);

            const dots = igDotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const updateIgNavButtons = () => {
            const isScrollable = igWrapper.scrollWidth > igWrapper.clientWidth;
            if (!isScrollable) {
                igPrevBtn.classList.add('disabled');
                igNextBtn.classList.add('disabled');
                if (igDotsContainer) igDotsContainer.style.display = 'none';
                return;
            } else {
                if (igDotsContainer) igDotsContainer.style.display = 'flex';
            }

            const scrollLeft = igWrapper.scrollLeft;
            const maxScrollLeft = igWrapper.scrollWidth - igWrapper.clientWidth;

            if (scrollLeft <= 5) {
                igPrevBtn.classList.add('disabled');
            } else {
                igPrevBtn.classList.remove('disabled');
            }

            if (scrollLeft >= maxScrollLeft - 5) {
                igNextBtn.classList.add('disabled');
            } else {
                igNextBtn.classList.remove('disabled');
            }

            updateActiveIgDot();
        };

        const getIgScrollAmount = () => {
            const firstCard = igCards[0];
            const cardWidth = firstCard.getBoundingClientRect().width + 24;
            return cardWidth * 2;
        };

        igNextBtn.addEventListener('click', () => {
            igWrapper.scrollBy({
                left: getIgScrollAmount(),
                behavior: 'smooth'
            });
        });

        igPrevBtn.addEventListener('click', () => {
            igWrapper.scrollBy({
                left: -getIgScrollAmount(),
                behavior: 'smooth'
            });
        });

        igWrapper.addEventListener('scroll', updateIgNavButtons);
        window.addEventListener('resize', updateIgNavButtons);
        updateIgNavButtons();
    }
});
