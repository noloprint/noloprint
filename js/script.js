// Gestione animazioni su scroll
window.addEventListener('load', () => {
  const heroLogo = document.querySelector('.hero-logo');
  const headings = document.querySelectorAll('section h2');
  const topBar = document.getElementById('top-bar');

  // Calcola posizione iniziale del logo (centro)
  const initialLeft = (window.innerWidth - heroLogo.offsetWidth) / 2;
  const initialTop = (window.innerHeight - heroLogo.offsetHeight) / 2;
  const targetLeft = 20; // posizione finale in alto a sinistra (px)
  const targetTop = 20;
  const threshold = 300; // scroll per completare l'animazione

  // Imposta posizione fissa iniziale del logo
  heroLogo.style.position = 'fixed';
  heroLogo.style.left = initialLeft + 'px';
  heroLogo.style.top = initialTop + 'px';

  // Ascolta evento scroll
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const progress = Math.min(scroll / threshold, 1);

    // Muovi e scala il logo
    const newLeft = initialLeft + (targetLeft - initialLeft) * progress;
    const newTop = initialTop + (targetTop - initialTop) * progress;
    const scale = 1 - 0.2 * progress;
    heroLogo.style.left = newLeft + 'px';
    heroLogo.style.top = newTop + 'px';
    heroLogo.style.transform = `scale(${scale})`;

    // Aggiorna trasparenza della barra in alto
    const maxScroll = 200;
    const alpha = Math.min(scroll / maxScroll, 1);
    topBar.style.background = `linear-gradient(to bottom, rgba(255,255,255,${alpha}), rgba(255,255,255,0))`;

    // Gestisci i titoli delle sezioni (sticky)
    const barHeight = 60;
    headings.forEach(h2 => {
      const rect = h2.getBoundingClientRect();
      if (rect.top <= barHeight) {
        h2.classList.add('sticky');
      } else {
        h2.classList.remove('sticky');
      }
    });
  });
});
