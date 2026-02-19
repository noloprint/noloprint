window.addEventListener('load', () => {
  const logoWrap = document.querySelector('.hero-logo');
  const topBar = document.getElementById('top-bar');
  const headings = Array.from(document.querySelectorAll('.section-heading'));
  const heroTitle = document.getElementById('hero-title');

  // posizione iniziale: centro della viewport per il logo (calcoliamo dinamicamente)
  const computeInitialLogoPos = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const wrapW = logoWrap.offsetWidth;
    const wrapH = logoWrap.offsetHeight;
    // centro orizzontale e verticale (visibile nella hero)
    return {
      left: (vw - wrapW) / 2,
      top: (vh * 0.35) - (wrapH / 2) // leggermente sopra centro per estetica
    };
  };

  let logoInitial = computeInitialLogoPos();
  // target finale in alto a sinistra
  const logoTarget = { left: 18, top: 12, scale: 0.78 };
  const animDistance = 320; // scroll in px per completare l'animazione del logo

  // imposto posizione fissa iniziale
  logoWrap.style.position = 'fixed';
  logoWrap.style.left = logoInitial.left + 'px';
  logoWrap.style.top = logoInitial.top + 'px';
  logoWrap.style.transform = 'translate(0,0)';

  // calcola offsetY originali per ogni heading (usiamo offsetTop relativo al documento)
  const barHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bar-height')) || 64;
  const recalcHeadingOffsets = () => {
    headings.forEach(h => {
      // rimuoviamo eventuale placeholder per calcolo pulito
      h.dataset.originalOffset = (h.getBoundingClientRect().top + window.scrollY).toString();
      h.dataset.isSticky = 'false';
    });
  };
  recalcHeadingOffsets();

  // Se si ridimensiona la finestra, ricalcola posizioni
  window.addEventListener('resize', () => {
    logoInitial = computeInitialLogoPos();
    // se il logo non è ancora completamente "raggiunto" dal scroll, riposizionalo al centro
    if (window.scrollY < animDistance) {
      logoWrap.style.left = logoInitial.left + 'px';
      logoWrap.style.top = logoInitial.top + 'px';
      logoWrap.style.transform = 'scale(1)';
    }
    recalcHeadingOffsets();
  });

  // funzione helper: rendi sticky (inserisce placeholder per evitare salto)
  function makeSticky(h) {
    if (h.dataset.isSticky === 'true') return;
    const placeholder = document.createElement('div');
    placeholder.style.height = `${h.offsetHeight}px`;
    placeholder.className = 'heading-placeholder';
    h.parentNode.insertBefore(placeholder, h);
    h.dataset.placeholderId = 'ph-' + Math.random().toString(36).slice(2,9);
    h.dataset.isSticky = 'true';

    h.classList.add('is-sticky');
    // stili inline per sicurezza ( vengono rimossi quando si "unsticky" )
    h.style.position = 'fixed';
    h.style.top = `${barHeight}px`;
    h.style.right = '20px';
    h.style.left = 'auto';
    h.style.width = `calc(100% - 40px)`;
    h.style.transformOrigin = 'right center';
    h.style.transform = 'scale(0.86)';
    h.style.zIndex = 6;
    h.style.background = 'transparent';
  }

  function removeSticky(h) {
    if (h.dataset.isSticky !== 'true') return;
    // rimuovo placeholder se presente (lo troviamo come elemento precedente)
    const placeholder = h.previousElementSibling;
    if (placeholder && placeholder.classList.contains('heading-placeholder')) {
      placeholder.parentNode.removeChild(placeholder);
    }
    h.dataset.isSticky = 'false';
    h.classList.remove('is-sticky');

    // rimuovo gli stili inline impostati
    h.style.position = '';
    h.style.top = '';
    h.style.right = '';
    h.style.left = '';
    h.style.width = '';
    h.style.transform = '';
    h.style.zIndex = '';
    h.style.background = '';
  }

  // scroll handler
  window.addEventListener('scroll', () => {
    const s = window.scrollY;

    // LOGO: interpolazione posizione e scala in base allo scroll (0..animDistance)
    const p = Math.min(Math.max(s / animDistance, 0), 1);
    const nx = logoInitial.left + (logoTarget.left - logoInitial.left) * p;
    const ny = logoInitial.top + (logoTarget.top - logoInitial.top) * p;
    const sc = 1 + (logoTarget.scale - 1) * p;
    logoWrap.style.left = `${nx}px`;
    logoWrap.style.top = `${ny}px`;
    logoWrap.style.transform = `scale(${sc})`;

    // Top-bar alpha progress (fa apparire la sfumatura)
    const alphaMaxAt = 200;
    const alpha = Math.min(s / alphaMaxAt, 1);
    topBar.style.background = `linear-gradient(to bottom, rgba(255,255,255,${alpha}), rgba(255,255,255,0))`;

    // HEADINGS: sticky quando scroll supera la loro offset originale - barHeight
    headings.forEach(h => {
      const originalOffset = Number(h.dataset.originalOffset || 0);
      if (window.scrollY + barHeight >= originalOffset) {
        makeSticky(h);
      } else {
        removeSticky(h);
      }
    });
  });

  // prima esecuzione per sincronizzare stato se la pagina viene ricaricata con scroll
  window.dispatchEvent(new Event('scroll'));
});
