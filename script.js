document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById('main-logo');
    const titles = document.querySelectorAll('.section-title');
    const dockedContainer = document.getElementById('docked-titles');
    
    const startScale = 5; 
    const maxScroll = 350;

    function initPositions() {
        logo.style.transform = 'none';
        const rect = logo.getBoundingClientRect();
        
        // Calcolo centro orizzontale
        const centerX = window.innerWidth / 2;
        // Partenza ALTA: 50px dal top (sopra l'immagine)
        const startYPos = 60; 

        startX = centerX - rect.left - (rect.width * startScale / 2);
        startY = startYPos - rect.top;
        
        update();
    }

    function update() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / maxScroll, 1);

        // Movimento Logo: prevale lo spostamento a sinistra (X) e scala
        const curX = startX * (1 - progress);
        const curY = startY * (1 - progress);
        const curScale = startScale - ((startScale - 1) * progress);
        
        logo.style.transform = `translate(${curX}px, ${curY}px) scale(${curScale})`;

        // Gestione Titoli CMYK
        titles.forEach(title => {
            const wrapper = document.getElementById(title.dataset.target);
            const rect = wrapper.getBoundingClientRect();

            // Quando il titolo tocca il soffitto (barra)
            if (rect.top <= 30) { 
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

        // Logica di visibilità: solo l'ultimo titolo arrivato si vede nella barra
        const docked = Array.from(dockedContainer.children);
        docked.forEach((el, idx) => {
            // Mantiene il suo colore originale tramite lo stile inline ereditato
            el.style.display = (idx === docked.length - 1) ? 'block' : 'none';
        });
    }

    window.addEventListener('scroll', update);
    window.addEventListener('resize', initPositions);
    window.addEventListener('load', initPositions);
    
    initPositions();
});
