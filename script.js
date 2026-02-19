document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById('main-logo');
    const subtitle = document.getElementById('hero-subtitle');
    const header = document.getElementById('main-header');
    
    // Elementi per la logica dei titoli
    const titles = document.querySelectorAll('.section-title');
    const dockedContainer = document.getElementById('docked-titles');
    
    // Altezza dopo la quale un titolo si aggancia alla barra (circa l'altezza dell'header)
    const dockingPoint = 80; 

    function onScroll() {
        const scrollY = window.scrollY;
        
        // --- LOGICA LOGO CONTINUO ---
        // Decidiamo in quanti pixel di scorrimento il logo finisce la sua animazione
        const maxScrollLogo = 350; 
        const progress = Math.min(scrollY / maxScrollLogo, 1); // Va da 0 a 1

        // Dimensioni: Inizia grande (es. scala 3.5), finisce a dimensione reale (scala 1)
        const startScale = 3.5;
        const targetScale = 1;
        const currentScale = startScale - ((startScale - targetScale) * progress);

        // Calcoliamo la posizione iniziale per tenerlo perfettamente al centro
        // Il logo ha transform-origin: top left.
        const headerPadding = window.innerWidth * 0.05; // 5% di padding come da CSS
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = 200; // Altezza iniziale dal top dello schermo

        const startX = screenCenterX - ((logo.offsetWidth * startScale) / 2) - headerPadding;
        const startY = screenCenterY;

        // Man mano che progress va a 1, currentX e currentY vanno a 0 (posizione finale in alto a sx)
        const currentX = startX * (1 - progress);
        const currentY = startY * (1 - progress);

        logo.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

        // Sfumiamo la scritta "Universo della stampa" mentre scorriamo
        subtitle.style.opacity = 1 - (progress * 2);

        // --- LOGICA TITOLI CHE TOCCANO IL SOFFITTO ---
        titles.forEach(title => {
            const wrapperId = title.getAttribute('data-target');
            const wrapper = document.getElementById(wrapperId);
            const wrapperRect = wrapper.getBoundingClientRect();

            // Se il contenitore originale tocca o supera il soffitto (dockingPoint)
            if (wrapperRect.top <= dockingPoint) {
                // Spostiamo fisicamente l'elemento nella barra. 
                // Essendo lo *stesso* elemento, la transizione CSS si attiva per il rimpicciolimento.
                if (title.parentNode !== dockedContainer) {
                    dockedContainer.appendChild(title);
                }
            } else {
                // Se scorriamo verso l'alto, il titolo torna al suo posto originale
                if (title.parentNode !== wrapper) {
                    wrapper.appendChild(title);
                }
            }
        });
    }

    // Ascoltiamo lo scroll e il resize della finestra (per ricalcolare il centro su mobile)
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    
    // Inizializza subito la posizione
    onScroll(); 
});
