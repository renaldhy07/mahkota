// === MAHKOTA - Unified script.js (dengan fungsi Neon Sound) ===
document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA NEON SOUND ---
    const neonSoundAudio = document.createElement('audio');
    neonSoundAudio.id = 'neonStaticSound';
    neonSoundAudio.loop = true;
    neonSoundAudio.src = 'assets/neon_static.mp3'; 
    neonSoundAudio.volume = 0.5; // Atur volume agar tidak terlalu keras
    document.body.appendChild(neonSoundAudio);

    const neonSound = document.getElementById('neonStaticSound');

    // Fungsi untuk memulai dan menghentikan suara
    const playNeonSound = () => {
        if (neonSound) {
            if (neonSound.paused) {
                neonSound.play().catch(error => {
                    console.log("Audio play was prevented. User interaction needed.");
                });
            }
        }
    };

    document.body.addEventListener('click', playNeonSound, { once: true });


    // --- LOGIKA TEMA DAN TAHUN (Kode Anda yang sudah ada) ---

    // === FOOTER YEAR ===
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // === THEME TOGGLE (3-Mode: Dark Neon, Dark Neutral, Light Neutral) ===
    const themeToggle = document.getElementById('themeToggle');

    const THEME_MODES = ['dark-neon', 'dark-neutral', 'light-neutral'];
    let currentModeIndex = 0;

    const applyStoredTheme = () => {
        let storedMode = localStorage.getItem('themeMode') || 'dark-neon';
        currentModeIndex = THEME_MODES.indexOf(storedMode);
        if (currentModeIndex === -1) {
            currentModeIndex = 0;
            storedMode = 'dark-neon';
        }

        document.body.classList.remove('dark-neon', 'dark-neutral', 'light-neutral');
        document.body.classList.add(storedMode);

        // Update tombol toggle
        if (themeToggle) {
            if (storedMode === 'dark-neon') themeToggle.textContent = '✨';
            else if (storedMode === 'dark-neutral') themeToggle.textContent = '🌙';
            else themeToggle.textContent = '☀️';
        }
        
        // Kontrol suara neon
        if (storedMode === 'dark-neon') {
            playNeonSound();
        } else {
            if (neonSound && !neonSound.paused) {
                neonSound.pause();
            }
        }
    };

    // === NEON COLOR ROTATION ===
    const NEON_COLORS = [
        '#FFB6C1', // 1. Cotton Candy (Light Pink)
        '#FF7F50', // 2. Sunset Dream (Coral)
        '#E6E6FA', // 3. Lavender Sky (Lavender)
        '#ADD8E6', // 4. Ocean Breeze (Light Blue)
        '#98FB98', // 5. Minty Glow (Pale Green)
        '#FFDAB9', // 6. Soft Sunrise (Peach)
        '#FF6347', // 7. Coral Mist (Tomato/Bright Coral)
        '#8A2BE2', // 8. Blueberry Light (Blue Violet)
        '#FFFACD', // 9. Lemon Cloud (Lemon Chiffon)
        '#FFDAB9', // 10. Peachy Aura (Peach Puff)
        '#9370DB', // 11. Dreamwave (Medium Purple)
        '#FFC0CB', // 12. Neon Pastel (Pink)
        '#87CEFA', // 13. Sky Blossom (Light Sky Blue)
        '#FFD700', // 14. Aurora Glow (Gold)
        '#EE82EE', // 15. Violet Mist (Violet)
        '#BFFF00', // 16. Citrus Mint (Chartreuse)
        '#FFE4B5', // 17. Moccasin (Frosted Peach)
        '#00CED1', // 18. Tropical Glow (Dark Turquoise)
        '#F08080', // 19. Blush Horizon (Light Coral)
        '#4682B4'  // 20. Moonlight Neon (Steel Blue)
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

    // Ambil warna neon yang tersimpan atau gunakan default (Cotton Candy)
    const storedNeonColor = localStorage.getItem('neonColor');
    if (storedNeonColor && NEON_COLORS.includes(storedNeonColor)) {
        currentColorIndex = NEON_COLORS.indexOf(storedNeonColor);
        applyNeonColor(storedNeonColor);
    } else {
        applyNeonColor(NEON_COLORS[0]); // Default: Cotton Candy
    }
    
    // Panggil applyStoredTheme untuk inisiasi tema yang benar setelah warna neon diatur
    applyStoredTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();

            // Pindah ke mode berikutnya
            currentModeIndex = (currentModeIndex + 1) % THEME_MODES.length;
            const newMode = THEME_MODES[currentModeIndex];

            // Hapus mode lama, tambahkan mode baru
            document.body.classList.remove('dark-neon', 'dark-neutral', 'light-neutral');
            document.body.classList.add(newMode);
            localStorage.setItem('themeMode', newMode);

            // Update tombol toggle
            if (newMode === 'dark-neon') themeToggle.textContent = '✨';
            else if (newMode === 'dark-neutral') themeToggle.textContent = '🌙';
            else themeToggle.textContent = '☀️';

            // Rotasi warna neon hanya jika beralih ke Dark Neon
            if (newMode === 'dark-neon') {
                rotateNeonColor();
                playNeonSound(); // Putar suara saat beralih ke mode neon
            } else {
                if (neonSound && !neonSound.paused) {
                    neonSound.pause(); // Hentikan suara saat beralih dari mode neon
                }
            }
            
            // Pastikan warna neon default diatur jika beralih ke mode non-neon
            if (newMode !== 'dark-neon') {
                document.body.style.setProperty('--neon-bg-color', NEON_COLORS[currentColorIndex]);
            }
        });
    }

    // === HERO SLIDER ===
    const slidesContainer = document.querySelector('.slides');
    if (slidesContainer) {
        const slides = slidesContainer.querySelectorAll('.slide');
        const scrollLeft = document.querySelector('.scroll-left');
        const scrollRight = document.querySelector('.scroll-right');
        let currentIndex = 0;
        let slideInterval;

        const showSlide = (index) => {
            slides.forEach((s, i) => {
                s.classList.remove('active');
                if (i === index) {
                    s.classList.add('active');
                }
            });
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        };

        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, 5000); // Ganti slide setiap 5 detik
        };

        const stopSlideShow = () => {
            clearInterval(slideInterval);
        };

        if (scrollLeft && scrollRight) {
            scrollLeft.addEventListener('click', () => {
                stopSlideShow();
                prevSlide();
                startSlideShow();
            });

            scrollRight.addEventListener('click', () => {
                stopSlideShow();
                nextSlide();
                startSlideShow();
            });
        }

        showSlide(currentIndex);
        startSlideShow();
    }

    // === CATALOG MODAL ===
    const catalogModal = document.getElementById('catalogModal');
    const openCatalog = document.getElementById('openCatalog');
    const closeCatalog = document.getElementById('closeCatalog');
    const catalogImage = document.getElementById('catalogImage');
    const nextCatalog = document.getElementById('nextCatalog');
    const prevCatalog = document.getElementById('prevCatalog');
    const catalogImages = ['assets/catalog1.jpg', 'assets/catalog2.jpg'];
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
    }

}); // DOMContentLoaded end


// ===== LIGHTBOX FUNCTIONALITY (Portofolio) =====
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close'); // Menggunakan querySelector karena sudah diubah menjadi button
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const portfolioGrid = document.getElementById('portfolioGrid');

    let currentImageIndex = 0;
    let portfolioImages = [];
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum distance for a swipe to be registered

    // Load portfolio images
    function loadPortfolioImages() {
      // Generate 9 portfolio items dengan path folder "portofolio"
      for (let i = 1; i <= 9; i++) {
        portfolioImages.push({
          id: i,
          src: `assets/portofolio/${i}.jpg`,
          alt: `Hasil Kerja ${i}`
        });
      }

      // Hanya render grid jika elemen portfolioGrid ada (hanya di portofolio.html)
      if (portfolioGrid) {
        portfolioGrid.innerHTML = portfolioImages.map((img, index) => `
          <div class="portfolio-item" data-index="${index}">
            <img src="${img.src}" alt="${img.alt}" class="portfolio-img" loading="lazy">
            <div class="portfolio-overlay">
              <div class="portfolio-overlay-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
            </div>
          </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
          item.addEventListener('click', () => openLightbox(index));
        });
      }
    }

    // Open lightbox
    function openLightbox(index) {
        if (!lightboxModal) return;
        currentImageIndex = index;
        lightboxImg.src = portfolioImages[index].src;
        lightboxImg.alt = portfolioImages[index].alt;
        lightboxModal.classList.add('active');
        if (lightboxCounter) {
            lightboxCounter.textContent = `${index + 1} / ${portfolioImages.length}`;
        }
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Navigate to previous image
    function previousImage() {
        if (!portfolioImages.length) return;
        if (currentImageIndex > 0) {
            openLightbox(currentImageIndex - 1);
        } else {
            openLightbox(portfolioImages.length - 1);
        }
    }

    // Navigate to next image
    function nextImage() {
        if (!portfolioImages.length) return;
        if (currentImageIndex < portfolioImages.length - 1) {
            openLightbox(currentImageIndex + 1);
        } else {
            openLightbox(0);
        }
    }

    // Event listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', previousImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    // Close on background click
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            // Pastikan hanya menutup jika mengklik langsung modal background, bukan elemen di dalamnya
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') previousImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });

    // --- SWIPE GESTURE LOGIC ---

    // Touch start
    if (lightboxModal) {
        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        // Touch end
        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, false);
    }

    function handleGesture() {
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                // Swipe left (next image)
                nextImage();
            } else {
                // Swipe right (previous image)
                previousImage();
            }
        }
        // Reset touch coordinates
        touchStartX = 0;
        touchEndX = 0;
    }
    // --- END SWIPE GESTURE LOGIC ---

    // Initialize
    if (portfolioGrid) {
        loadPortfolioImages();
    }
});
