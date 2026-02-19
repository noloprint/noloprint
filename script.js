document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById('main-logo');
    const titles = document.querySelectorAll('.section-title');
    const dockedContainer = document.getElementById('docked-titles');
    
    const startScale = 4; // Logo molto grande all'inizio
    const maxScroll = 400; // Pixel di scorrimento per finire l'animazione
    let startX = 0;
    let startY = 0;

    function initPositions() {
        logo.style.transform = 'none';
        const rect = logo.getBoundingClientRect();
        
        // Calcola il centro dello schermo relativo alla posizione finale del logo
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2.5;

        startX = centerX - rect.left - (rect.width * startScale / 2);
        startY = centerY - rect.top;
        
        update();
    }

    function update() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / maxScroll, 1);

        // Animazione Logo
        const curX = startX * (1 - progress);
        const curY = startY * (1 - progress);
        const curScale = startScale - ((startScale - 1) * progress);
        logo.style.transform = `translate(${curX}px, ${curY}px) scale(${curScale})`;

        // Animazione Titoli
        titles.forEach(title => {
            const wrapper = document.getElementById(title.dataset.target);
            const rect = wrapper.getBoundingClientRect();

            if (rect.top <= 40) {
                if (title.parentNode !== dockedContainer) {
                    dockedContainer.appendChild(title);
                }
            } else {
                if (title.parentNode !== wrapper) {
                    wrapper.appendChild(title);
                    title.style.display = 'block';
                }
            }
        });

        // Mostra solo l'ultimo titolo presente nel contenitore della barra
        const docked = Array.from(dockedContainer.children);
        docked.forEach((el, idx) => {
            el.style.display = (idx === docked.length - 1) ? 'block' : 'none';
        });
    }

    window.addEventListener('scroll', update);
    window.addEventListener('resize', initPositions);
    window.addEventListener('load', initPositions);
    
    initPositions();
});
