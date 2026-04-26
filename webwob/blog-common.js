// ===================== BLOG COMMON JS =====================

function openPost(title) {
  var home = document.getElementById('home');
  var detail = document.getElementById('detail');
  if (home) home.style.display = 'none';
  if (detail) detail.style.display = 'block';
  var titleEl = document.getElementById('title');
  if (titleEl) titleEl.innerText = title;
}

function goBack() {
  // Check if the clicked element has a custom link (data-href)
  var clickedEl = event.target.closest('[data-href]');
  var href = clickedEl ? clickedEl.getAttribute('data-href') : null;
  
  if (href) {
    window.location.href = href;
    return;
  }
  
  // Fallback: toggle home/detail view if both exist
  var home = document.getElementById('home');
  var detail = document.getElementById('detail');
  if (home && detail) {
    home.style.display = 'block';
    detail.style.display = 'none';
  } else {
    // Final fallback: browser back
    history.back();
  }
}

// ===================== CAROUSEL GALLERY =====================
(function() {
  var track = document.getElementById('galleryTrack');
  if (!track) return; // No carousel on this page

  var slides = document.querySelectorAll('.gallery-slide');
  var prevBtn = document.getElementById('galleryPrev');
  var nextBtn = document.getElementById('galleryNext');
  var dotsContainer = document.getElementById('galleryDots');

  var currentSlide = 0;
  var totalSlides = slides.length;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxSlide() {
    return totalSlides - getSlidesPerView();
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    var slidesPerView = getSlidesPerView();
    var dotCount = Math.ceil(totalSlides / slidesPerView);
    for (var i = 0; i < dotCount; i++) {
      var dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', (function(idx) {
        return function() { goToSlide(idx * slidesPerView); };
      })(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    var dots = document.querySelectorAll('.gallery-dot');
    var slidesPerView = getSlidesPerView();
    var activeDotIndex = Math.floor(currentSlide / slidesPerView);
    dots.forEach(function(dot, index) {
      dot.classList.toggle('active', index === activeDotIndex);
    });
  }

  function goToSlide(index) {
    var maxSlide = getMaxSlide();
    currentSlide = Math.max(0, Math.min(index, maxSlide));
    var slideWidth = 100 / getSlidesPerView();
    track.style.transform = 'translateX(-' + (currentSlide * slideWidth) + '%)';
    updateDots();
  }

  function nextSlide() {
    var maxSlide = getMaxSlide();
    if (currentSlide < maxSlide) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0); // Loop back to beginning
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(getMaxSlide()); // Loop to end
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-play carousel
  var autoPlay = setInterval(nextSlide, 4000);
  var galleryWrapper = document.querySelector('.gallery-wrapper');
  if (galleryWrapper) {
    galleryWrapper.addEventListener('mouseenter', function() { clearInterval(autoPlay); });
    galleryWrapper.addEventListener('mouseleave', function() {
      autoPlay = setInterval(nextSlide, 4000);
    });
  }

  // Update on resize
  window.addEventListener('resize', function() {
    createDots();
    goToSlide(currentSlide);
  });

  createDots();
})();

// ===================== GALLERY LIGHTBOX =====================
(function() {
  var galleryImgs = document.querySelectorAll('.gallery-img');
  if (galleryImgs.length === 0) return; // No gallery on this page

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.querySelector('.lightbox-close');
  var lightboxPrev = document.querySelector('.lightbox-prev');
  var lightboxNext = document.querySelector('.lightbox-next');
  var currentImgSpan = document.getElementById('current-img');
  var totalImgSpan = document.getElementById('total-img');

  var currentIndex = 0;
  var totalImages = galleryImgs.length;

  if (totalImgSpan) totalImgSpan.textContent = totalImages;

  // Open lightbox
  galleryImgs.forEach(function(img, index) {
    img.addEventListener('click', function() {
      currentIndex = index;
      showImage();
      if (lightbox) lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  // Show current image
  function showImage() {
    if (lightboxImg) lightboxImg.src = galleryImgs[currentIndex].src;
    if (currentImgSpan) currentImgSpan.textContent = currentIndex + 1;
  }

  // Next image
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function(e) {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % totalImages;
      showImage();
    });
  }

  // Previous image
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      showImage();
    });
  }

  // Close lightbox
  function closeLightbox() {
    if (lightbox) lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  // Close when clicking outside the image
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox || lightbox.style.display !== 'block') return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        e.preventDefault();
        currentIndex = (currentIndex + 1) % totalImages;
        showImage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage();
        break;
    }
  });

  // Touch swipe support for mobile
  var touchStartX = 0;
  var touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    lightbox.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
  }

  function handleSwipe() {
    var swipeThreshold = 50;
    var diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        currentIndex = (currentIndex + 1) % totalImages;
      } else {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      }
      showImage();
    }
  }
})();
