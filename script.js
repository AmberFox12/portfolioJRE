// ===== Active nav link =====
(function markActive() {
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current) a.classList.add('active');
  });
})();

// ===== Mobile menu toggle =====
(function menu() {
  const btn = document.querySelector('.menu-toggle');
  const list = document.querySelector('.nav-links');
  if (!btn || !list) return;
  btn.addEventListener('click', () => {
    list.classList.toggle('open');
  });
})();

// ===== Scroll reveal =====
(function reveal() {
  const els = document.querySelectorAll('.reveal, .reveal-stagger');

  // Mark already-in-view elements as visible immediately on load (no scroll needed)
  const markIfInView = (el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      el.classList.add('visible');
      return true;
    }
    return false;
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => {
    if (markIfInView(el)) return;
    io.observe(el);
  });
})();

// ===== Scroll to top =====
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.scrollToTop = scrollToTop;

// ===== Project filters =====
(function projectFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filters.length || !cards.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(c => {
        const tags = (c.dataset.tags || '').split(',');
        if (f === 'all' || tags.includes(f)) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });
})();

// ===== Project photo modal =====
const projectPhotos = {
  'jeu-probleme': {
    title: 'Jeu Problème — Captures',
    photos: [
      { src: 'images/Acceuil.png', title: 'Page d\'accueil', description: 'Interface d\'accueil avec les options principales du jeu.' },
      { src: 'images/Jeux.png', title: 'Interface de jeu', description: 'Zone de jeu avec les problèmes de programmation et éditeur de code.' },
      { src: 'images/Classement.png', title: 'Classement', description: 'Tableau des meilleurs scores et classement des joueurs.' },
      { src: 'images/Historique.png', title: 'Historique', description: 'Historique des parties jouées et statistiques.' }
    ]
  },
  'jeu-probleme-doc': {
    title: 'Jeu à problèmes — Documentation',
    photos: [
      { src: 'images/MCD_JeuxPB.jpg', title: 'Modèle conceptuel de données', description: 'MCD du jeu : utilisateurs, rôles (Joueur/Créateur/Juge/Admin), problèmes, soumissions et classement.', contain: false },
      { src: 'uploads/Equipe3_loisir_JeuProbleme.pdf', title: 'Dossier équipe (PDF)', description: 'Dossier complet du projet ADP réalisé en équipe de 3 — analyse, conception, livrables.', isPdf: true }
    ]
  },
  'rftg': {
    title: 'Application RFTG — Schémas',
    photos: [
      { src: 'images/architecture_rftg.png', title: 'Architecture trois apps', description: 'Luigi (Android), Mario (Laravel) et Toad (Spring Boot) autour d\'une base MySQL dérivée de Sakila.' },
      { src: 'images/MCD_RFTG.png', title: 'Modèle conceptuel de données', description: 'MCD de l\'application : clients, dvd, livraisons et locations.' }
    ]
  },
  'rftg-shots': {
    title: 'Application RFTG — Captures',
    photos: [
      { src: 'images/Mario_admin.png', title: 'Mario — Interface admin', description: 'Application Laravel pour le personnel : gestion du catalogue de films et du stock de DVD.' },
      { src: 'images/Luigi_android.png', title: 'Luigi — Application Android', description: 'Application Android pour les clients : recherche de films et ajout au panier.' }
    ]
  }
};

function openPhotoModal(id) {
  const modal = document.getElementById('photoModal');
  const title = document.getElementById('modalTitle');
  const gallery = document.getElementById('modalGallery');
  const p = projectPhotos[id];
  if (!modal || !p) return;

  title.textContent = p.title;

  // Support legacy {photos: [...]} OR new {sections: [{label, photos}]}
  const sections = p.sections || [{ label: null, photos: p.photos || [] }];
  let html = '';
  let zoomIdx = 0;
  sections.forEach(sec => {
    if (sec.label) {
      html += `<h4 class="modal-section-label">${sec.label}</h4>`;
    }
    html += '<div class="modal-section-grid">';
    sec.photos.forEach(ph => {
      if (ph.isPdf) {
        html += `
          <div class="modal-photo modal-photo--pdf">
            <a class="modal-pdf-tile" href="${ph.src}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="14" x2="15" y2="14"/>
                <line x1="9" y1="17" x2="15" y2="17"/>
              </svg>
              <span class="modal-pdf-action">Ouvrir le PDF</span>
              <span class="modal-pdf-filename">${ph.src.split('/').pop()}</span>
            </a>
            <div class="modal-photo-caption">
              <h4>${ph.title}</h4>
              <p>${ph.description}</p>
            </div>
          </div>`;
        return;
      }
      const cls = ph.contain === false ? '' : 'cap-desktop';
      html += `
        <div class="modal-photo">
          <img class="${cls}" src="${ph.src}" alt="${ph.title}" data-zoom="${zoomIdx++}">
          <div class="modal-photo-caption">
            <h4>${ph.title}</h4>
            <p>${ph.description}</p>
          </div>
        </div>`;
    });
    html += '</div>';
  });
  gallery.innerHTML = html;

  // attach zoom handlers
  gallery.querySelectorAll('img[data-zoom]').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closePhotoModal() {
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}
window.openPhotoModal = openPhotoModal;
window.closePhotoModal = closePhotoModal;

// ===== Lightbox (zoom on image) =====
function openLightbox(src, alt) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Fermer">✕</button>
      <div class="lightbox-stage">
        <img class="lightbox-img" alt="">
      </div>
      <div class="lightbox-hint">Cliquer / molette pour zoomer · Glisser pour déplacer · Échap pour fermer</div>
    `;
    document.body.appendChild(lb);

    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

    const img = lb.querySelector('.lightbox-img');
    let scale = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0;

    const apply = () => {
      img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      img.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
    };

    img.addEventListener('click', e => {
      e.stopPropagation();
      if (scale === 1) { scale = 2.2; }
      else if (scale < 3) { scale = Math.min(4, scale + 1); }
      else { scale = 1; tx = 0; ty = 0; }
      apply();
    });

    img.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      scale = Math.min(5, Math.max(1, scale + delta));
      if (scale === 1) { tx = 0; ty = 0; }
      apply();
    }, { passive: false });

    img.addEventListener('mousedown', e => {
      if (scale <= 1) return;
      dragging = true; sx = e.clientX - tx; sy = e.clientY - ty;
      img.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      tx = e.clientX - sx; ty = e.clientY - sy;
      apply();
    });
    window.addEventListener('mouseup', () => { dragging = false; if (scale > 1) img.style.cursor = 'grab'; });

    lb._reset = () => { scale = 1; tx = 0; ty = 0; apply(); };
  }

  const img = lb.querySelector('.lightbox-img');
  img.src = src;
  img.alt = alt || '';
  lb._reset && lb._reset();
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('show');
  // re-show body scroll only if the photo modal isn't also open
  const photoModal = document.getElementById('photoModal');
  if (!photoModal || !photoModal.classList.contains('show')) {
    document.body.style.overflow = '';
  }
}
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// ===== Zoom on any [data-zoom-src] image (extra shots) =====
document.querySelectorAll('img[data-zoom-src]').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(img.src, img.alt);
  });
});

window.addEventListener('click', e => {
  const modal = document.getElementById('photoModal');
  if (modal && e.target === modal) closePhotoModal();
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('show')) { closeLightbox(); return; }
    closePhotoModal();
  }
});

// ===== Contact form =====
(function contactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const wrap = document.getElementById('contact-form-wrap');
  const success = document.getElementById('contact-success');
  const errorEl = document.getElementById('form-error');
  const btn = document.getElementById('form-btn');

  // Coordonnées injectées uniquement après envoi réussi
  const c = {
    e: ['jules', 'renad27', 'gmail.com'].join('@').replace('renad27@', 'renad27@'),
    p: '06 14 64 54 02',
    l: 'Caen, France'
  };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    errorEl.textContent = '';

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        document.getElementById('coord-email').textContent = c.e;
        document.getElementById('coord-phone').textContent = c.p;
        document.getElementById('coord-location').textContent = c.l;
        wrap.hidden = true;
        success.hidden = false;
      } else {
        const data = await res.json().catch(() => ({}));
        errorEl.textContent = (data.errors || []).map(e => e.message).join(' ') || 'Une erreur est survenue, veuillez réessayer.';
      }
    } catch {
      errorEl.textContent = 'Impossible d\'envoyer le message. Vérifiez votre connexion.';
    }

    btn.classList.remove('loading');
    btn.disabled = false;
  });
})();
