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
    });
  }

  // === NEON LAMP ===
  const neonColorSelect = document.getElementById('neonColor');
  const colorBtn = document.getElementById('colorBtn');
  const colorPanel = document.getElementById('colorPanel');

  if (colorBtn && colorPanel) {
    colorBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      colorPanel.classList.toggle('hidden');
    });
    // Menutup panel saat klik di luar
    document.addEventListener('click', (ev) => {
      if (!ev.target.closest('#uiPanel')) {
        colorPanel.classList.add('hidden');
      }
    });
  }

  if (neonColorSelect) {
    const savedNeon = localStorage.getItem('neonColor');
    if (savedNeon) {
      neonColorSelect.value = savedNeon;
      applyNeon(savedNeon);
    }

    neonColorSelect.addEventListener('change', (e) => {
      const color = e.target.value;
      localStorage.setItem('neonColor', color);
      applyNeon(color);
      colorPanel.classList.add('hidden');
    });
  }

  function applyNeon(color) {
    if (color === 'none') {
      document.body.classList.remove('neon-bg');
      document.body.style.setProperty('--neon-bg-color', '#00FFFF'); // Default Cyan
    } else {
      document.body.classList.add('neon-bg');
      document.body.style.setProperty('--neon-bg-color', color);
    }
  }

  // === HERO SLIDER ===
  const slidesWrap = document.querySelector('.slides');
  const slideEls = document.querySelectorAll('.slide');
  const leftBtn = document.querySelector('.scroll-left');
  const rightBtn = document.querySelector('.scroll-right');
  let currentSlide = 0;
  let autoSlideInterval = null;

  function showSlide(i) {
    if (!slidesWrap || slideEls.length === 0) return;
    currentSlide = (i + slideEls.length) % slideEls.length;
    slidesWrap.style.transform = `translateX(-${currentSlide * 100}%)`;
    slideEls.forEach((s, idx) => s.classList.toggle('active', idx === currentSlide));
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  if (slidesWrap && slideEls.length > 0) {
    showSlide(0);
    startAutoSlide();
    slidesWrap.addEventListener('mouseenter', stopAutoSlide);
    slidesWrap.addEventListener('mouseleave', startAutoSlide);
  }
  if (leftBtn) leftBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  if (rightBtn) rightBtn.addEventListener('click', () => showSlide(currentSlide + 1));

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
