document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById('main-logo');
    const header = document.getElementById('main-header');
    
    // Elementi per la logica dei titoli
    const titles = document.querySelectorAll('.section-title');
    const dockedContainer = document.getElementById('docked-titles');
    const dockingPoint = 80; 

    // Variabili per il calcolo esatto del logo
    let startX = 0;
    let startY = 0;
    const startScale = 3.5;
    const targetScale = 1;
    const maxScrollLogo = 350;

    function calculateLogoPositions() {
        // 1. Resettiamo la trasformazione per misurare la posizione originale (reale) del logo nell'header
        logo.style.transform = 'none';
        const rect = logo.getBoundingClientRect();
        
        // 2. Troviamo il centro esatto dello schermo
        const screenCenterX = window.innerWidth / 2;
        
        // 3. Calcoliamo la distanza esatta per centrarlo
        // Sottraiamo la posizione nativa (rect.left) e la metà della sua larghezza ingrandita
        startX = screenCenterX - rect.left - ((rect.width * startScale) / 2);
        
        // 4. Distanza dal top dello schermo per la posizione iniziale (es. 150px)
        startY = 150 - rect.top; 
        
        // Riapplichiamo lo scroll per non avere scatti visivi durante il ridimensionamento della finestra
        onScroll();
    }

    function onScroll() {
        const scrollY = window.scrollY;
        
        // --- LOGICA LOGO CONTINUO ---
        const progress = Math.min(scrollY / maxScrollLogo, 1); 
        const currentScale = startScale - ((startScale - targetScale) * progress);

        // Il logo si sposta gradualmente dal centro (startX, startY) a zero (la sua posizione naturale a sinistra)
        const currentX = startX * (1 - progress);
        const currentY = startY * (1 - progress);

        logo.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;

        // --- LOGICA TITOLI CHE TOCCANO IL SOFFITTO ---
        titles.forEach(title => {
            const wrapperId = title.getAttribute('data-target');
            const wrapper = document.getElementById(wrapperId);
            const wrapperRect = wrapper.getBoundingClientRect();

            // Aggancio alla barra
            if (wrapperRect.top <= dockingPoint) {
                if (title.parentNode !== dockedContainer) {
                    dockedContainer.appendChild(title);
                }
            } else {
                // Ritorno alla posizione originale
                if (title.parentNode !== wrapper) {
                    wrapper.appendChild(title);
                    title.style.display = 'block'; // Ci assicuriamo che torni visibile nella sua pagina
                }
            }
        });

        // --- LOGICA DI SOSTITUZIONE NELLA BARRA ---
        // Se ci sono più titoli nella barra, mostriamo solo l'ultimo arrivato (quello della sezione corrente)
        const dockedChildren = Array.from(dockedContainer.children);
        dockedChildren.forEach((child, index) => {
            if (index === dockedChildren.length - 1) {
                child.style.display = 'block'; // Mostra il titolo attuale
            } else {
                child.style.display = 'none';  // Nasconde i titoli precedenti
            }
        });
    }

    // Assicuriamoci che le immagini e il layout siano caricati prima di calcolare
    window.addEventListener('load', calculateLogoPositions);
    window.addEventListener('resize', calculateLogoPositions);
    window.addEventListener('scroll', onScroll);
    
    // Inizializzazione rapida per prevenire sfarfallii
    calculateLogoPositions(); 
});
