document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const menu = document.querySelector('.offcanvas-menu');
    const backdrop = document.querySelector('.offcanvas-backdrop');
    const openButtons = document.querySelectorAll('.home-header > .icon-button');
    const closeButton = document.querySelector('.offcanvas-close');

    function toggleMenu(open) {
        if (!menu || !backdrop) return;
        menu.classList.toggle('open', open);
        backdrop.classList.toggle('open', open);
        menu.setAttribute('aria-hidden', String(!open));
        body.classList.toggle('menu-open', open);
    }

    openButtons.forEach((button) => {
        button.addEventListener('click', () => {
            toggleMenu(true);
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', () => toggleMenu(false));
    }

    if (backdrop) {
        backdrop.addEventListener('click', () => toggleMenu(false));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleMenu(false);
        }
    });

    const homeCarousel = document.querySelector('.product-carousel-card');
    if (homeCarousel) {
        const carouselImage = homeCarousel.querySelector('.carousel-image');
        const carouselTitle = homeCarousel.querySelector('.carousel-product-title');
        const carouselSubtitle = homeCarousel.querySelector('.carousel-product-subtitle');
        const dots = Array.from(homeCarousel.querySelectorAll('.carousel-dots .dot'));

        const slides = [
            {
                image: 'figma-assets/4090.png',
                alt: 'GeForce RTX 4090',
                title: 'RTX 4090',
                subtitle: 'Placa de vídeo: RTX 4090'
            },
            {
                image: 'figma-assets/4080.jpg',
                alt: 'GeForce RTX 4080 Super',
                title: 'RTX 4080 Super',
                subtitle: 'Placa de vídeo: RTX 4080 Super OC Edition'
            },
            {
                image: 'figma-assets/4060ti.png',
                alt: 'GeForce RTX 4060 Ti',
                title: 'RTX 4060 Ti',
                subtitle: 'Placa de vídeo: RTX 4060 Ti 8GB Dual Fan'
            }
        ];

        let currentSlide = 0;

        function setSlide(index) {
            currentSlide = index % slides.length;
            const slide = slides[currentSlide];
            if (!slide) return;
            carouselImage.src = slide.image;
            carouselImage.alt = slide.alt;
            carouselTitle.textContent = slide.title;
            carouselSubtitle.textContent = slide.subtitle;
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('dot--active', dotIndex === currentSlide);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => setSlide(index));
        });

        setSlide(0);
        setInterval(() => setSlide((currentSlide + 1) % slides.length), 5000);
    }

    const detailSlider = document.querySelector('.suggestions-slider');
    const detailPrev = document.querySelector('.slider-control--prev');
    const detailNext = document.querySelector('.slider-control--next');

    if (detailSlider && detailPrev && detailNext) {
        const scrollAmount = detailSlider.clientWidth * 0.75;
        detailPrev.addEventListener('click', () => {
            detailSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        detailNext.addEventListener('click', () => {
            detailSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    const buildsPage = document.querySelector('.screen--projects');
    if (buildsPage) {
        const summaryTotal = buildsPage.querySelector('.summary-top__total');
        const summaryPix = buildsPage.querySelector('.summary-top__right strong');
        const componentList = buildsPage.querySelector('.component-list');
        const draftLink = buildsPage.querySelector('.projects-draft-link');
        const projectPanel = buildsPage.querySelector('.projects-cards');

        function parsePrice(priceText) {
            const cleaned = priceText.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.');
            return Number(cleaned) || 0;
        }

        function formatPrice(value) {
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        function updateBuildTotals() {
            if (!summaryTotal && !summaryPix) return;
            let total = 0;
            if (componentList) {
                componentList.querySelectorAll('.component-row').forEach((row) => {
                    const priceEl = row.querySelector('.component-row__price');
                    if (!priceEl) return;
                    total += parsePrice(priceEl.textContent || 'R$ 0');
                });
            }
            if (summaryTotal) {
                summaryTotal.textContent = formatPrice(total);
            }
            if (summaryPix) {
                summaryPix.textContent = formatPrice(total * 0.85);
            }
        }

        function removeComponentRow(row) {
            if (!row) return;
            row.remove();
            updateBuildTotals();
        }

        if (componentList) {
            componentList.addEventListener('click', (event) => {
                const button = event.target.closest('.row-action');
                if (button) {
                    const row = button.closest('.component-row');
                    removeComponentRow(row);
                }
            });
        }

        function createDraftProject() {
            if (!projectPanel) return;
            const draftCard = document.createElement('article');
            draftCard.className = 'project-card';
            draftCard.innerHTML = `
                <span class="project-card__status project-card__status--muted">RASCUNHO</span>
                <strong class="project-card__title">Novo Rascunho</strong>
                <span class="project-card__price">R$ 0,00</span>
            `;
            projectPanel.appendChild(draftCard);
        }

        if (draftLink) {
            draftLink.addEventListener('click', (event) => {
                event.preventDefault();
                createDraftProject();
            });
        }

        if (projectPanel) {
            projectPanel.addEventListener('click', (event) => {
                const card = event.target.closest('.project-card');
                if (!card) return;
                projectPanel.querySelectorAll('.project-card').forEach((item) => item.classList.remove('project-card--active'));
                card.classList.add('project-card--active');
            });
        }

        updateBuildTotals();
    }

    const cartPage = document.querySelector('.screen--cart');
    if (cartPage) {
        const subtotalElement = document.querySelector('.cart-summary .summary-row:first-of-type .summary-value');
        const totalPixElement = document.querySelector('.summary-total-price');
        const quantityButtons = cartPage.querySelectorAll('.quantity-btn');

        function parsePrice(priceText) {
            const cleaned = priceText.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.');
            return Number(cleaned) || 0;
        }

        function formatPrice(value) {
            return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        function updateCartTotals() {
            const items = cartPage.querySelectorAll('.cart-item');
            let subtotal = 0;

            items.forEach((item) => {
                const priceElement = item.querySelector('.cart-item__price');
                const unitPrice = parsePrice(priceElement.textContent || 'R$ 0');
                const quantityElement = item.querySelector('.quantity-value');
                const quantity = Number(quantityElement.textContent) || 1;
                subtotal += unitPrice * quantity;
            });

            if (subtotalElement) {
                subtotalElement.textContent = formatPrice(subtotal);
            }

            if (totalPixElement) {
                const discounted = subtotal * 0.85;
                totalPixElement.textContent = formatPrice(discounted);
            }
        }

        quantityButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const item = button.closest('.cart-item');
                const quantityElement = item.querySelector('.quantity-value');
                const current = Number(quantityElement.textContent) || 1;
                const next = button.textContent.trim() === '+' ? current + 1 : Math.max(1, current - 1);
                quantityElement.textContent = String(next);
                updateCartTotals();
            });
        });

        updateCartTotals();
    }
});
