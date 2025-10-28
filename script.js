// === MAHKOTA - Unified script.js ===
document.addEventListener('DOMContentLoaded', () => {

  // === FOOTER YEAR ===
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === THEME TOGGLE ===
  const themeToggle = document.getElementById('themeToggle');
  const applyStoredTheme = () => {
    const t = localStorage.getItem('theme');
    if (t === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  };
  applyStoredTheme();
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
      
      // Rotasi warna neon hanya ketika berganti ke Dark Mode (atau tetap di Dark Mode)
      if (!document.body.classList.contains('light-mode')) {
        rotateNeonColor();
      }
    });
  }

  // === NEON COLOR ROTATION ===
  const NEON_COLORS = [
    '#FFFF00', // Yellow
    '#FF69B4', // Pink
    '#8A2BE2', // Purple
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#50C878'  // Emerald
  ];
  let currentColorIndex = 0;

  function applyNeonColor(color) {
    document.body.style.setProperty('--neon-bg-color', color);
    localStorage.setItem('neonColor', color);
  }

  function rotateNeonColor() {
    currentColorIndex = (currentColorIndex + 1) % NEON_COLORS.length;
    const newColor = NEON_COLORS[currentColorIndex];
    applyNeonColor(newColor);
  }

  // Ambil warna neon yang tersimpan atau gunakan default (Yellow)
  const storedNeonColor = localStorage.getItem('neonColor');
  if (storedNeonColor && NEON_COLORS.includes(storedNeonColor)) {
    currentColorIndex = NEON_COLORS.indexOf(storedNeonColor);
    applyNeonColor(storedNeonColor);
  } else {
    applyNeonColor(NEON_COLORS[0]); // Default: Yellow
  }

  // === CATALOG MODAL ===
  const catalogModal = document.getElementById('catalogModal');
  const openCatalog = document.getElementById('openCatalog');
  const closeCatalog = document.getElementById('closeCatalog');
  const catalogImage = document.getElementById('catalogImage');
  const nextCatalog = document.getElementById('nextCatalog');
  const prevCatalog = document.getElementById('prevCatalog');
  const catalogImages = ['assets/catalog1.jpg', 'assets/catalog2.jpg', 'assets/catalog3.jpg'];
  let catalogIndex = 0;

  function updateCatalogImage() {
    if (!catalogImage) return;
    catalogImage.style.opacity = 0;
    setTimeout(() => {
      catalogImage.src = catalogImages[catalogIndex];
      catalogImage.onload = () => { catalogImage.style.opacity = 1; };
    }, 150);
  }

  if (openCatalog) openCatalog.addEventListener('click', (e) => {
    e.preventDefault();
    catalogModal.classList.add('show');
    catalogModal.style.display = 'flex';
    catalogIndex = 0;
    updateCatalogImage();
  });
  if (closeCatalog) closeCatalog.addEventListener('click', () => closeModal(catalogModal));
  if (catalogModal) catalogModal.addEventListener('click', (e) => { if (e.target === catalogModal) closeModal(catalogModal); });
  if (nextCatalog) nextCatalog.addEventListener('click', () => { catalogIndex = (catalogIndex + 1) % catalogImages.length; updateCatalogImage(); });
  if (prevCatalog) prevCatalog.addEventListener('click', () => { catalogIndex = (catalogIndex - 1 + catalogImages.length) % catalogImages.length; updateCatalogImage(); });

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    modal.style.display = 'none';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(catalogModal);
    }
  });

  // === HAMBURGER MENU LOGIC ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const closeMenu = document.getElementById('closeMenu');

  // Fungsi untuk menutup menu dan mengembalikan scroll
  function closeNav() {
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener('click', closeNav);
  }

  // Menutup menu saat link diklik (kecuali dropdown)
  if (navLinks) {
    navLinks.querySelectorAll('a:not(.dropbtn)').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // === MOBILE DROPDOWN PRICELIST ===
  const dropBtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  
  if (dropBtn && dropdownContent) {
    // Toggle dropdown saat dropbtn diklik
    dropBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Hanya toggle jika di mobile atau jika di desktop dan belum terbuka
      if (window.innerWidth <= 768 || !dropdownContent.classList.contains('show')) {
        dropdownContent.classList.toggle('show');
      }
    });
    
    // Menutup dropdown saat klik di luar
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        dropdownContent.classList.remove('show');
      }
    });

    // Memperbaiki masalah hilang cepat di desktop (hover)
    const navDropdown = document.querySelector('.nav-dropdown');
    navDropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        dropdownContent.classList.add('show');
      }
    });
    navDropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        dropdownContent.classList.remove('show');
      }
    });
  }

}); // DOMContentLoaded end
