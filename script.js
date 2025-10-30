// Fungsi untuk menginisialisasi toggle tema
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Cek tema yang tersimpan di localStorage, default ke 'dark-neon'
  const savedTheme = localStorage.getItem('theme') || 'dark-neon';
  body.className = savedTheme;

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-neon')) {
      body.className = 'dark-neutral';
      localStorage.setItem('theme', 'dark-neutral');
      themeToggle.textContent = '⚫'; // Dark Neutral
    } else if (body.classList.contains('dark-neutral')) {
      body.className = 'light-neutral';
      localStorage.setItem('theme', 'light-neutral');
      themeToggle.textContent = '⚪'; // Light Neutral
    } else {
      body.className = 'dark-neon';
      localStorage.setItem('theme', 'dark-neon');
      themeToggle.textContent = '✨'; // Dark Neon
    }
  });

  // Set initial button text
  if (savedTheme === 'dark-neon') {
    themeToggle.textContent = '✨';
  } else if (savedTheme === 'dark-neutral') {
    themeToggle.textContent = '⚫';
  } else {
    themeToggle.textContent = '⚪';
  }
}

// Fungsi untuk menginisialisasi menu hamburger
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const closeMenu = document.getElementById('closeMenu');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.add('open');
      document.body.style.overflow = 'hidden'; // Mencegah scroll saat menu terbuka
    });

    closeMenu.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });

    // Tutup menu saat link diklik di mobile
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }
}

// Fungsi untuk menginisialisasi dropdown
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const dropbtn = dropdown.querySelector('.dropbtn');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    // Toggle dropdown saat di-klik (untuk mobile/touch device)
    dropbtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Tutup dropdown lain yang terbuka
      dropdowns.forEach(d => {
        if (d !== dropdown) {
          d.querySelector('.dropdown-content').classList.remove('show');
        }
      });
      dropdownContent.classList.toggle('show');
    });

    // Tutup dropdown saat klik di luar
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdownContent.classList.remove('show');
      }
    });
  });
}

// Fungsi untuk menginisialisasi modal katalog
function initCatalogModal() {
  const openCatalog = document.getElementById('openCatalog');
  const catalogModal = document.getElementById('catalogModal');
  const closeCatalog = document.getElementById('closeCatalog');
  const catalogImage = document.getElementById('catalogImage');
  const prevCatalog = document.getElementById('prevCatalog');
  const nextCatalog = document.getElementById('nextCatalog');

  if (!openCatalog || !catalogModal) return;

  const catalogImages = [
    'assets/catalog1.jpg',
    'assets/catalog2.jpg',
    'assets/catalog3.jpg'
  ];
  let currentCatalogIndex = 0;

  function updateCatalogImage() {
    catalogImage.src = catalogImages[currentCatalogIndex];
  }

  openCatalog.addEventListener('click', (e) => {
    e.preventDefault();
    catalogModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    updateCatalogImage();
  });

  closeCatalog.addEventListener('click', () => {
    catalogModal.style.display = 'none';
    document.body.style.overflow = '';
  });

  catalogModal.addEventListener('click', (e) => {
    if (e.target === catalogModal) {
      catalogModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  prevCatalog.addEventListener('click', () => {
    currentCatalogIndex = (currentCatalogIndex - 1 + catalogImages.length) % catalogImages.length;
    updateCatalogImage();
  });

  nextCatalog.addEventListener('click', () => {
    currentCatalogIndex = (currentCatalogIndex + 1) % catalogImages.length;
    updateCatalogImage();
  });
}

// Fungsi untuk menginisialisasi slider hero
function initHeroSlider() {
  const slides = document.querySelector('.slides');
  const sliderContainer = document.querySelector('.slider-container');
  const prevBtn = document.querySelector('.scroll-left');
  const nextBtn = document.querySelector('.scroll-right');

  if (!slides || !sliderContainer) return;

  let slideIndex = 0;
  const totalSlides = slides.children.length;
  let slideWidth = sliderContainer.offsetWidth; // Mengambil lebar dari container

  // Update slideWidth saat window resize
  window.addEventListener('resize', () => {
    slideWidth = sliderContainer.offsetWidth;
    updateSlider(false); // Update tanpa transisi saat resize
  });

  function updateSlider(useTransition = true) {
    if (useTransition) {
      slides.style.transition = 'transform 1s ease-in-out';
    } else {
      slides.style.transition = 'none';
    }
    slides.style.transform = `translateX(${-slideIndex * slideWidth}px)`;
    
    // Update active class
    Array.from(slides.children).forEach((s, index) => {
      s.classList.remove('active');
      if (index === slideIndex) {
        s.classList.add('active');
      }
    });
  }

  prevBtn.addEventListener('click', () => {
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    slideIndex = (slideIndex + 1) % totalSlides;
    updateSlider();
  });

  // Auto-slide every 5 seconds
  setInterval(() => {
    slideIndex = (slideIndex + 1) % totalSlides;
    updateSlider();
  }, 5000);

  // Initial call to set the correct position
  updateSlider();

  /* === Fitur Swipe untuk Hero Slider === */
  let touchstartX = 0;
  let touchendX = 0;
  const swipeThreshold = 50; 

  sliderContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
  });

  sliderContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    if (touchendX < touchstartX - swipeThreshold) {
      // Swipe Left (Show Next)
      slideIndex = (slideIndex + 1) % totalSlides;
      updateSlider();
    }

    if (touchendX > touchstartX + swipeThreshold) {
      // Swipe Right (Show Prev)
      slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }
  });
}

// Fungsi untuk menginisialisasi tahun di footer
function initYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Fungsi untuk menginisialisasi Lightbox Portofolio
function initPortfolioLightbox() {
  const portfolioGrid = document.getElementById('portfolioGrid');
  if (portfolioGrid) {
    // Mengurangi jumlah gambar menjadi 9 sesuai permintaan
    const images = [
      'assets/portofolio/1.jpg',
      'assets/portofolio/2.jpg',
      'assets/portofolio/3.jpg',
      'assets/portofolio/4.jpg',
      'assets/portofolio/5.jpg',
      'assets/portofolio/6.jpg',
      'assets/portofolio/7.jpg',
      'assets/portofolio/8.jpg',
      'assets/portofolio/9.jpg'
      // Gambar 10 sampai 21 dihapus
    ];

    // Karena markup HTML sudah dibuat statis di portofolio.html (9 item),
    // kita hanya perlu mengambil semua item untuk fungsionalitas lightbox.
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Lightbox elements
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxClose = lightboxModal.querySelector('.lightbox-close');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      // Pastikan index tidak melebihi batas array images
      if (currentIndex < 0) {
        currentIndex = images.length - 1;
      } else if (currentIndex >= images.length) {
        currentIndex = 0;
      }
      
      // Update image source dan counter
      lightboxImage.src = images[currentIndex];
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }

    // Event listener untuk membuka lightbox
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        openLightbox(index);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    // Close when clicking outside the image (but not on the buttons)
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
          showNext();
        } else if (e.key === 'ArrowLeft') {
          showPrev();
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
    });

    /* === Fitur Swipe untuk Mobile === */
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50; // Jarak minimal swipe dalam pixel

    function handleGesture() {
      if (touchendX < touchstartX - swipeThreshold) {
        // Swipe Left (Show Next)
        showNext();
      }

      if (touchendX > touchstartX + swipeThreshold) {
        // Swipe Right (Show Prev)
        showPrev();
      }
    }

    // Gunakan lightboxImageContainer untuk area swipe yang lebih luas
    const lightboxImageContainer = document.getElementById('lightboxImageContainer');
    if (lightboxImageContainer) {
      lightboxImageContainer.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
      });

      lightboxImageContainer.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
      });
    }
    
    // Tambahkan event listener untuk mencegah scroll saat lightbox aktif di mobile
    lightboxModal.addEventListener('touchmove', e => {
        e.preventDefault();
    }, { passive: false });
  }
}


// Panggil fungsi inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHamburgerMenu();
  initDropdowns();
  initCatalogModal();
  initHeroSlider();
  initYear();

  // Inisialisasi Lightbox Portofolio (Hanya di portofolio.html)
  if (window.location.pathname.includes('portofolio.html')) {
    initPortfolioLightbox();
  }
});
