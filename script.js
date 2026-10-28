/**
 * G. Pulla Reddy Food Court – Smart Queue Management System
 * Vanilla JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileDrawer();
  initScrollReveal();
  initStatsCounter();
  initParticleCanvas();
  initCardTilt();
  initMenuFilters();
  initQuickOrder();
  initLiveQueueSimulator();
  initAccessibleNavigation();
  initImageFallbacks();
});

/* ===================================================================
   1. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], main > section[id]');

  if (!navbar) return;

  const handleScroll = () => {
    // Add scrolled class for glass blur and border enhancement
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active menu link
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ===================================================================
   2. MOBILE HAMBURGER MENU & DRAWER
   =================================================================== */
function initMobileDrawer() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileDrawer) return;

  const toggleDrawer = (open) => {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
    hamburgerBtn.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburgerBtn.addEventListener('click', () => toggleDrawer());

  // Close drawer when any mobile nav link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      toggleDrawer(false);
    }
  });
}

/* ===================================================================
   3. REVEAL-ON-SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   =================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-item');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ===================================================================
   4. ANIMATED STATISTICS COUNTER
   =================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      if (isNaN(target)) return;

      const duration = 1600;
      const start = 0;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * (target - start) + start);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const statsSection = document.querySelector('.quick-stats-grid');
  if (!statsSection) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(statsSection);
  } else {
    animateCounters();
  }
}

/* ===================================================================
   5. BACKGROUND GOLDEN PARTICLE CANVAS
   =================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Check if reduced motion is requested
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Create subtle floating particles
  const particleCount = Math.min(Math.floor(width / 35), 45);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.1, // gently rising upwards like warm food aroma
      opacity: Math.random() * 0.5 + 0.15,
      hue: Math.random() > 0.4 ? 42 : 24, // Gold (#FFD166) or Warm Orange (#FF7A18)
    });
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 50%, 0.8)`;
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   6. 3D TILT EFFECT ON FOOD SHOWCASE
   =================================================================== */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (!tiltCards.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===================================================================
   7. MENU CATEGORY FILTER TABS
   =================================================================== */
function initMenuFilters() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!tabButtons.length || !menuCards.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-category');

      menuCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   8. QUICK ORDER ACTIONS & TOAST NOTIFICATION
   =================================================================== */
function initQuickOrder() {
  const quickAddButtons = document.querySelectorAll('.btn-quick-add');
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  let toastTimer = null;

  window.showToast = (title, message) => {
    if (!toast) return;
    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  };

  quickAddButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.getAttribute('data-item') || 'Selected Item';
      const itemPrice = btn.getAttribute('data-price') || '30';

      // Store in demo session cart
      try {
        const cart = JSON.parse(sessionStorage.getItem('gpr_cart') || '[]');
        cart.push({ name: itemName, price: parseInt(itemPrice, 10), timestamp: Date.now() });
        sessionStorage.setItem('gpr_cart', JSON.stringify(cart));
      } catch (err) {
        // storage fallback
      }

      window.showToast(
        `Added to Quick Tray!`,
        `${itemName} (₹${itemPrice}) ready for digital token checkout.`
      );
    });
  });
}

/* ===================================================================
   9. LIVE QUEUE DISPLAY & QUICK TOKEN CHECKER
   =================================================================== */
function initLiveQueueSimulator() {
  const readyList = document.getElementById('readyTokensList');
  const cookingList = document.getElementById('cookingTokensList');
  const resultBox = document.getElementById('checkResultBox');
  const queryInput = document.getElementById('tokenQueryInput');

  // Interactive Token Quick Check Function
  window.quickCheckToken = () => {
    const rawQuery = queryInput.value.trim().toUpperCase();
    if (!rawQuery) return;

    resultBox.style.display = 'block';

    // Mock lookups for campus tokens
    const readyTokens = ['A-104', 'B-212', 'C-089', '104', '212', '89'];
    const cookingTokens = ['A-105', 'A-106', 'B-214', '105', '106', '214'];

    if (readyTokens.some(t => rawQuery.includes(t))) {
      resultBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 2rem;">🔔</div>
          <div>
            <h4 style="color: #4ADE80; font-family: var(--font-heading); margin-bottom: 0.25rem;">
              Token #${rawQuery} is READY FOR PICKUP!
            </h4>
            <p style="color: var(--color-cream); font-size: 0.9rem;">
              Please proceed to <strong>Counter 1 (Food Court Front)</strong> with your student ID or verification code.
            </p>
          </div>
        </div>
      `;
    } else if (cookingTokens.some(t => rawQuery.includes(t))) {
      resultBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 2rem;">🍳</div>
          <div>
            <h4 style="color: var(--color-gold); font-family: var(--font-heading); margin-bottom: 0.25rem;">
              Token #${rawQuery} is Currently Cooking in Kitchen
            </h4>
            <p style="color: var(--color-cream); font-size: 0.9rem;">
              Estimated ready time: <strong>~2 to 3 minutes</strong>. We'll sound an alert when ready.
            </p>
          </div>
        </div>
      `;
    } else {
      // Any other token number entered gets a friendly simulated status
      const simulatedCounter = (Math.floor(Math.random() * 3) + 1);
      const simulatedMinutes = (Math.floor(Math.random() * 5) + 2);
      resultBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 2rem;">⏳</div>
          <div>
            <h4 style="color: var(--color-cream); font-family: var(--font-heading); margin-bottom: 0.25rem;">
              Token #${rawQuery} — Order Verified in Queue
            </h4>
            <p style="color: var(--color-cream-muted); font-size: 0.9rem;">
              Your order is queued at <strong>Counter ${simulatedCounter}</strong>. Estimated wait time: ~${simulatedMinutes} mins.
            </p>
            <div style="margin-top: 0.6rem;">
              <a href="token.html?token=${encodeURIComponent(rawQuery)}" style="color: var(--color-gold); font-weight: 600; text-decoration: underline;">
                Open Full Interactive Token Tracker & Live Chime →
              </a>
            </div>
          </div>
        </div>
      `;
    }
  };
}

/* ===================================================================
   10. ACCESSIBLE KEYBOARD NAVIGATION & SMOOTH SCROLLING
   =================================================================== */
function initAccessibleNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus({ preventScroll: true });
      }
    });
  });
}

/* ===================================================================
   11. IMAGE OFFLINE FALLBACK GENERATOR
   =================================================================== */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = 'true';
      const altText = this.getAttribute('alt') || 'G. Pulla Reddy Canteen Dish';
      const cleanTitle = altText.split('.')[0].slice(0, 30);
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#062F28"/>
              <stop offset="50%" stop-color="#0B5D46"/>
              <stop offset="100%" stop-color="#101613"/>
            </linearGradient>
            <radialGradient id="plateGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFD166" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#FF7A18" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="600" height="400" fill="url(#bg)"/>
          <circle cx="300" cy="200" r="140" fill="url(#plateGlow)"/>
          <circle cx="300" cy="200" r="110" stroke="#FFD166" stroke-width="2" stroke-dasharray="6 4" fill="none" opacity="0.6"/>
          <circle cx="300" cy="200" r="95" stroke="#FF7A18" stroke-width="1.5" fill="#0A1813" opacity="0.9"/>
          <text x="300" y="185" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="42">🍲</text>
          <text x="300" y="235" text-anchor="middle" font-family="'Poppins', sans-serif" font-size="19" font-weight="700" fill="#FFF7E8">${cleanTitle}</text>
          <text x="300" y="265" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#FFD166" letter-spacing="1.5">G. PULLA REDDY FOOD COURT</text>
        </svg>
      `;
      this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  });
}

