// Mahkota - unified script.js
// Pastikan file HTML punya elemen dengan id yang sama seperti di index.html

document.addEventListener('DOMContentLoaded', () => {
  // === FOOTER YEAR ===
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === THEME TOGGLE (persist) ===
  const themeToggle = document.getElementById('themeToggle');
  const applyStoredTheme = () => {
    const t = localStorage.getItem('theme');
    if (t === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  };
  applyStoredTheme();
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // === NEON LAMP (neon background) ===
  // ensure neonLayer exists (CSS should already define #neonLayer)
  let neonLayer = document.getElementById('neonLayer');
  if (!neonLayer) {
    neonLayer = document.createElement('div');
    neonLayer.id = 'neonLayer';
    document.body.appendChild(neonLayer);
  }

  const neonColorSelect = document.getElementById('neonColor');
  const colorBtn = document.getElementById('colorBtn');
  const colorPanel = document.getElementById('colorPanel');
  const fontBtn = document.getElementById('fontBtn');
  const fontPanel = document.getElementById('fontPanel');
  const fontSelector = document.getElementById('fontSelector');

  // helper to show/hide panels using 'hidden' class (your HTML uses class "hidden")
  function togglePanel(panel) {
    if (!panel) return;
    if (panel.classList.contains('hidden')) {
      // hide other panels
      if (colorPanel) colorPanel.classList.add('hidden');
      if (fontPanel) fontPanel.classList.add('hidden');
      panel.classList.remove('hidden');
      panel.classList.add('show'); // some CSS variants use 'show'
    } else {
      panel.classList.add('hidden');
      panel.classList.remove('show');
    }
  }

  if (colorBtn && colorPanel) {
    colorBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      togglePanel(colorPanel);
    });
  }
  if (fontBtn && fontPanel) {
    fontBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      togglePanel(fontPanel);
    });
  }

  // apply neon color change
  if (neonColorSelect) {
    // restore saved color
    const savedNeon = localStorage.getItem('neonColor');
    if (savedNeon) {
      neonColorSelect.value = savedNeon;
      // apply initial
      if (savedNeon !== 'none') {
        document.body.classList.add('neon-bg');
        document.body.style.setProperty('--neon-bg-color', savedNeon);
        neonLayer.style.background = `radial-gradient(circle at center, ${savedNeon}33, #000000cc)`;
        neonLayer.style.boxShadow = `0 0 80px ${savedNeon}`;
      } else {
        document.body.classList.remove('neon-bg');
        neonLayer.style.background = 'transparent';
        neonLayer.style.boxShadow = 'none';
      }
    }

    neonColorSelect.addEventListener('change', (e) => {
      const color = e.target.value;
      localStorage.setItem('neonColor', color);
      if (color === 'none') {
        document.body.classList.remove('neon-bg');
        neonLayer.style.background = 'transparent';
        neonLayer.style.boxShadow = 'none';
        document.body.style.removeProperty('--neon-bg-color');
      } else {
        document.body.classList.add('neon-bg');
        document.body.style.setProperty('--neon-bg-color', color);
        neonLayer.style.background = `radial-gradient(circle at center, ${color}33, #000000cc)`;
        neonLayer.style.boxShadow = `0 0 80px ${color}`;
      }
      // collapse panel after pick
      if (colorPanel) { colorPanel.classList.add('hidden'); colorPanel.classList.remove('show'); }
    });
  }

  // font selector
  if (fontSelector) {
    // restore saved
    const savedFont = localStorage.getItem('siteFont');
    if (savedFont) {
      document.body.style.fontFamily = savedFont;
      fontSelector.value = savedFont;
    }

    fontSelector.addEventListener('change', (e) => {
      document.body.style.fontFamily = e.target.value;
      localStorage.setItem('siteFont', e.target.value);
      if (fontPanel) { fontPanel.classList.add('hidden'); fontPanel.classList.remove('show'); }
    });
  }

  // close panels when clicking outside
  document.addEventListener('click', (ev) => {
    const clickedInsideUI = (el) => el && (el.id === 'uiPanel' || el.closest && el.closest('#uiPanel'));
    if (!clickedInsideUI(ev.target)) {
      if (colorPanel) colorPanel.classList.add('hidden');
      if (fontPanel) fontPanel.classList.add('hidden');
    }
  });

  // === HERO SLIDER (auto + arrows + responsive sizing) ===
  const slidesWrap = document.querySelector('.slides');
  const slideEls = document.querySelectorAll('.slide');
  const leftBtn = document.querySelector('.scroll-left');
  const rightBtn = document.querySelector('.scroll-right');

  // utility: show slide index
  let currentSlide = 0;
  function showSlide(i) {
    if (!slidesWrap || slideEls.length === 0) return;
    currentSlide = (i + slideEls.length) % slideEls.length;
    // set transform to show slide
    slidesWrap.style.transform = `translateX(-${currentSlide * 100}%)`;
    // update active classes
    slideEls.forEach((s, idx) => s.classList.toggle('active', idx === currentSlide));
  }

  // make sure slidesWrap has appropriate CSS (we use translateX with flex)
  // autoplay
  let autoSlideInterval = null;
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
  }
  function stopAutoSlide() {
    if (autoSlideInterval) { clearInterval(autoSlideInterval); autoSlideInterval = null; }
  }

  if (slidesWrap && slideEls.length > 0) {
    // ensure width is properly handled by CSS (slides are 100% each)
    showSlide(0);
    startAutoSlide();

    // pause on hover
    slidesWrap.addEventListener('mouseenter', stopAutoSlide);
    slidesWrap.addEventListener('mouseleave', startAutoSlide);
  }

  // arrow buttons
  if (leftBtn) leftBtn.addEventListener('click', (e) => { e.preventDefault(); showSlide(currentSlide - 1); startAutoSlide(); });
  if (rightBtn) rightBtn.addEventListener('click', (e) => { e.preventDefault(); showSlide(currentSlide + 1); startAutoSlide(); });

  // keyboard navigation (optional)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
  });

  // recalculation on resize (keeps slides centered)
  window.addEventListener('resize', () => { showSlide(currentSlide); });

  // === PRICELIST MODAL (PDF in iframe) ===
const pricelistModal = document.getElementById('pricelistModal');
const closePdf = document.getElementById('closePdf');
const iframeEl = pricelistModal ? pricelistModal.querySelector('iframe') : null;

// Semua link pricelist
const pdfLinks = document.querySelectorAll('.dropdown-content a');

if (pdfLinks && pricelistModal && iframeEl) {
  pdfLinks.forEach(link => {
    link.addEventListener('click', (ev) => {
      ev.preventDefault();

      // deteksi jenis pricelist dari teks link
      const text = link.textContent.trim().toLowerCase();

      let filePath = 'assets/pdf.pdf'; // default sablon
      if (text.includes('konveksi')) filePath = 'assets/pricelist-konveksi.pdf';
      else if (text.includes('merchandise')) filePath = 'assets/pricelist-merchandise.pdf';

      iframeEl.src = filePath;

      pricelistModal.classList.add('show');
      pricelistModal.style.display = 'flex';
    });
  });
}

// tombol tutup
if (closePdf) {
  closePdf.addEventListener('click', () => {
    if (pricelistModal) {
      pricelistModal.classList.remove('show');
      pricelistModal.style.display = 'none';
    }
  });
}

// klik luar menutup modal
if (pricelistModal) {
  pricelistModal.addEventListener('click', (ev) => {
    if (ev.target === pricelistModal) {
      pricelistModal.classList.remove('show');
      pricelistModal.style.display = 'none';
    }
  });
}


  // === CATALOG MODAL (image viewer with next/prev) ===
  const catalogModal = document.getElementById('catalogModal');
  const openCatalog = document.getElementById('openCatalog');
  const closeCatalog = document.getElementById('closeCatalog');
  const catalogImage = document.getElementById('catalogImage');
  const nextCatalog = document.getElementById('nextCatalog');
  const prevCatalog = document.getElementById('prevCatalog');

  // You can edit this array to point to your katalog files in /assets
  const catalogImages = [
    'assets/catalog1.jpg',
    'assets/catalog2.jpg',
    'assets/catalog3.jpg'
  ];
  let catalogIndex = 0;

  function updateCatalogImage() {
    if (!catalogImage) return;
    catalogImage.style.opacity = 0;
    setTimeout(() => {
      catalogImage.src = catalogImages[catalogIndex];
      catalogImage.onload = () => { catalogImage.style.opacity = 1; };
    }, 150);
  }

  if (openCatalog && catalogModal) {
    openCatalog.addEventListener('click', (ev) => {
      ev.preventDefault();
      catalogModal.classList.add('show');
      catalogModal.style.display = 'flex';
      catalogIndex = 0;
      updateCatalogImage();
    });
  }
  if (closeCatalog) closeCatalog.addEventListener('click', () => {
    if (catalogModal) { catalogModal.classList.remove('show'); catalogModal.style.display = 'none'; }
  });
  if (catalogModal) {
    catalogModal.addEventListener('click', (ev) => {
      if (ev.target === catalogModal) { catalogModal.classList.remove('show'); catalogModal.style.display = 'none'; }
    });
  }
  if (nextCatalog) nextCatalog.addEventListener('click', () => {
    catalogIndex = (catalogIndex + 1) % catalogImages.length;
    updateCatalogImage();
  });
  if (prevCatalog) prevCatalog.addEventListener('click', () => {
    catalogIndex = (catalogIndex - 1 + catalogImages.length) % catalogImages.length;
    updateCatalogImage();
  });

  // close modals with Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pricelistModal) { pricelistModal.classList.remove('show'); pricelistModal.style.display = 'none'; }
      if (catalogModal) { catalogModal.classList.remove('show'); catalogModal.style.display = 'none'; }
    }
  });

  // === Mobile-friendly dropdown for pricelist: tap to open on small screens ===
  const dropBtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  if (dropBtn && dropdownContent) {
    dropBtn.addEventListener('click', (ev) => {
      // on mobile, toggling by click is helpful
      if (window.innerWidth <= 900) {
        ev.preventDefault();
        dropdownContent.classList.toggle('show');
      }
    });
    // click outside closes
    document.addEventListener('click', (ev) => {
      if (!ev.target.closest('.nav-dropdown')) {
        if (dropdownContent) dropdownContent.classList.remove('show');
      }
    });
  }

  // ensure that any panel 'show' vs 'hidden' classes are consistent on load
  if (colorPanel) { colorPanel.classList.add('hidden'); colorPanel.classList.remove('show'); }
  if (fontPanel) { fontPanel.classList.add('hidden'); fontPanel.classList.remove('show'); }

}); // DOMContentLoaded end
