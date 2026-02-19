document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById('main-logo');
    const titles = document.querySelectorAll('.section-title');
    const dockedContainer = document.getElementById('docked-titles');
    
    const startScale = 4.5; 
    const maxScroll = 400;

    function initPositions() {
        logo.style.transform = 'none';
        const rect = logo.getBoundingClientRect();
        
        // Centro dello schermo
        const centerX = window.innerWidth / 2;
        // Partenza molto in alto
        const startYPos = 50; 

        // Calcolo spostamento: parte dal centro e finisce nella sua posizione naturale nell'header
        startX = centerX - rect.left - (rect.width * startScale / 2);
        startY = startYPos - rect.top;
        
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

        // Gestione Titoli
        titles.forEach(title => {
            const wrapper = document.getElementById(title.dataset.target);
            const rect = wrapper.getBoundingClientRect();

            // Quando il titolo della sezione tocca la barra (90px dal top)
            if (rect.top <= 90) { 
                if (title.parentNode !== dockedContainer) {
                    dockedContainer.appendChild(title);
                }
            } else {
                if (title.parentNode !== wrapper) {
                    wrapper.appendChild(title);
                }
            }
        });

        // Mostra solo l'ultimo titolo e mantiene il colore originale
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
