// Initialize Lenis
const lenis = new Lenis({
  duration: 1.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 2.0,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: false });

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth <= 768;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // ── PRELOADER TIMELINE ─────────────────────────────────────────
  // Returns a Promise that resolves when the full cinematic sequence is done
  const preloaderPromise = new Promise(resolve => {
    gsap.timeline({ onComplete: resolve })
      // 1. T R C letters slide up one by one
      .to('.preloader-char', {
        y: 0, opacity: 1,
        stagger: 0.18, duration: 0.9,
        ease: 'power4.out'
      })
      // 2. First red line expands beneath TRC
      .to('.first-line', {
        width: '100%', duration: 0.7,
        ease: 'power3.inOut'
      }, '-=0.2')
      // 3. "THE RIGHT CLICK" text rises in
      .to('.preloader-sub', {
        opacity: 1, y: 0, duration: 0.65,
        ease: 'power2.out'
      }, '-=0.15')
      // 4. Second red line appears below the subtitle
      .to('.second-line', {
        width: '100%', duration: 0.7,
        ease: 'power3.inOut'
      }, '-=0.25')
      // 5. Cinematic hold — let it breathe
      .to({}, { duration: 0.8 });
  });

  // ── INITIALIZATION ─────────────────────────────────────────────
  async function startApp() {
    // 1. Fetch Firebase data (with 3s timeout so preloader never hangs forever)
    let data = null;
    try {
      if (typeof window.fetchTRCData === 'function') {
        data = await Promise.race([
          window.fetchTRCData(),
          new Promise((_, reject) => setTimeout(() => reject('Timeout'), 3000))
        ]);
      }
    } catch (e) { console.warn("Data fetch skipped or timed out:", e); }

    // 2. Apply data to [data-trc] elements
    if (data) {
      document.querySelectorAll('[data-trc]').forEach(el => {
        const key = el.getAttribute('data-trc');
        if (data[key]) {
          if (el.tagName === 'A') {
            if (key.includes('wa')) el.href = `https://wa.me/${data[key].replace(/\D/g, '')}`;
            else if (key.includes('phone')) el.href = `tel:${data[key].replace(/\D/g, '')}`;
            else if (key.includes('email')) el.href = `mailto:${data[key]}`;
            else el.innerText = data[key];
          } else if (el.tagName === 'IMG') {
            el.src = data[key];
          } else {
            if (data[key].includes('<') || data[key].includes('\n')) {
              el.innerHTML = data[key].replace(/\n/g, '<br>');
            } else {
              el.innerText = data[key];
            }
          }
        }
      });
    }

    // 3. Word Reveal Setup (wraps each word in an animated span)
    document.querySelectorAll('.word-reveal').forEach(el => {
      const nodes = Array.from(el.childNodes);
      let html = '';
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent.trim().split(/\s+/).filter(Boolean).forEach(w => {
            html += `<span class="word-wrap"><span class="word">${w}&nbsp;</span></span>`;
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'BR') {
            html += '<br>';
          } else {
            const cls = node.className ? ` class="${node.className}"` : '';
            node.innerText.trim().split(/\s+/).filter(Boolean).forEach(w => {
              html += `<span class="word-wrap"><span class="word"><span${cls}>${w}</span>&nbsp;</span></span>`;
            });
          }
        }
      });
      el.innerHTML = html;
    });

    // 4. CRITICAL: Wait for the full cinematic preloader sequence to complete
    //    before we slide it away. This guarantees TRC + lines + subtitle are
    //    always fully visible for the right amount of time.
    await preloaderPromise;

    // 5. Slide preloader up — reveal site below
    gsap.timeline()
      .to('#preloader', { y: '-100%', duration: 1.1, ease: 'expo.inOut' })
      .to('#preloader', { opacity: 0, duration: 0.4 }, '-=0.4')
      .set('#preloader', { display: 'none' })
      .add(() => { initScrollAnimations(); });
  }

  startApp();

  // ── CUSTOM CURSOR ─────────────────────────────────────────────
  if (!isTouchDevice) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      const xTo  = gsap.quickTo(ring, 'x', { duration: 0.1, ease: 'power3' });
      const yTo  = gsap.quickTo(ring, 'y', { duration: 0.1, ease: 'power3' });
      window.addEventListener('mousemove', (e) => {
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        xTo(e.clientX); yTo(e.clientY);
      });
      document.querySelectorAll('.nav-links a,.btn,.project-card,.faq-question,.filter-pill').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(ring, { scale: 2, opacity: 0.6, duration: 0.3 });
          gsap.to(dot, { scale: 0, duration: 0.3 });
          if (el.classList.contains('project-card')) {
            gsap.to(ring, { backgroundColor: 'rgba(215,3,33,0.15)', borderColor: 'rgba(215,3,33,0.8)' });
            ring.setAttribute('data-text', 'VIEW');
          }
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(ring, { scale: 1, opacity: 1, backgroundColor: 'transparent', borderColor: 'rgba(215,3,33,0.7)', duration: 0.3 });
          gsap.to(dot, { scale: 1, duration: 0.3 });
          ring.removeAttribute('data-text');
        });
      });
    }
  }

  // ── MAGNETIC BUTTONS ───────────────────────────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width/2)*0.4, y: (e.clientY - r.top - r.height/2)*0.4, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
    });
  }

  // ── MOBILE MENU ────────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks  = document.querySelectorAll('.mobile-menu a');
  let menuOpen = false;

  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      menuOpen = false;
      gsap.to(hamburger.children[0], { y: 0, rotation: 0,  duration: 0.3 });
      gsap.to(hamburger.children[1], { opacity: 1, duration: 0.3 });
      gsap.to(hamburger.children[2], { y: 0, rotation: 0,  duration: 0.3 });
      gsap.to(menuLinks, { y: 30, opacity: 0, duration: 0.2 });
      gsap.to(mobileMenu, { clipPath: 'circle(0% at calc(100% - 40px) 40px)', duration: 0.6, ease: 'power3.inOut' });
      lenis.start();
    };

    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      if (menuOpen) {
        gsap.to(hamburger.children[0], { y: 6.5,  rotation: 45,  duration: 0.3 });
        gsap.to(hamburger.children[1], { opacity: 0, duration: 0.3 });
        gsap.to(hamburger.children[2], { y: -6.5, rotation: -45, duration: 0.3 });
        gsap.to(mobileMenu, { clipPath: 'circle(150% at calc(100% - 40px) 40px)', duration: 0.6, ease: 'power3.inOut' });
        gsap.to(menuLinks, { y: 0, opacity: 1, stagger: 0.08, delay: 0.3 });
        lenis.stop();
      } else { closeMenu(); }
    });
    menuLinks.forEach(l => l.addEventListener('click', closeMenu));
  }

  // ── NAV + PROGRESS BAR ─────────────────────────────────────────
  const nav = document.querySelector('nav');
  const progressBar = document.querySelector('.progress-bar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 100);
      const h = document.body.offsetHeight - window.innerHeight;
      if (h > 0 && progressBar) progressBar.style.width = (window.scrollY / h * 100) + '%';
    });
  }

  // ── SERVICES ACCORDION ─────────────────────────────────────────
  document.querySelectorAll('.service-row-header').forEach(header => {
    header.addEventListener('click', () => {
      const row  = header.parentElement;
      const body = row.querySelector('.service-row-body');
      const open = row.classList.contains('open');
      document.querySelectorAll('.service-row').forEach(r => {
        r.classList.remove('open');
        gsap.to(r.querySelector('.service-row-body'), { height: 0, duration: 0.4, ease: 'power3.inOut' });
      });
      if (!open) {
        row.classList.add('open');
        gsap.to(body, { height: 'auto', duration: 0.5, ease: 'power3.inOut' });
      }
    });
  });

  // ── SCROLL ANIMATIONS ──────────────────────────────────────────
  function initScrollAnimations() {
    // 1. HERO staggered word reveal
    gsap.from('.hero .word', {
      y: '105%', skewY: 4, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.065
    });

    // 2. SECTION HEADLINES
    document.querySelectorAll('section:not(.hero) .word-reveal').forEach(el => {
      gsap.from(el.querySelectorAll('.word'), {
        scrollTrigger: { trigger: el, start: 'top 82%' },
        y: '105%', skewY: 3, opacity: 0, duration: 1.0, ease: 'expo.out', stagger: 0.06
      });
    });

    // 3. LABELS
    document.querySelectorAll('.label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'expo.out'
      });
    });

    // 4. FADE-UP
    document.querySelectorAll('.fade-up').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 87%' },
        y: 60, opacity: 0, duration: 0.95, ease: 'expo.out'
      });
    });

    // 5. STAT COUNTERS
    document.querySelectorAll('.stat-num span[data-target]').forEach(el => {
      gsap.from(el, {
        innerHTML: 0, duration: 2.2, ease: 'expo.out', snap: { innerHTML: 1 },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true }
      });
    });

    // 6. SERVICE ROWS
    document.querySelectorAll('.service-row').forEach((row, i) => {
      gsap.from(row, {
        scrollTrigger: { trigger: row, start: 'top 88%' },
        x: -30, opacity: 0, duration: 0.8, delay: i * 0.07, ease: 'expo.out'
      });
    });

    // 7. FOUNDER LINE
    document.querySelectorAll('.founder-note').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'expo.out'
      });
    });
  }

  // ── FAQ ACCORDION ──────────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('active');
        gsap.to(el.querySelector('.faq-answer'), { height: 0, duration: 0.4, ease: 'power2.out' });
      });
      if (!isOpen) {
        item.classList.add('active');
        gsap.to(answer, { height: 'auto', duration: 0.4, ease: 'power2.out' });
      }
    });
  });

  // ── PORTFOLIO FILTERS ──────────────────────────────────────────
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-cat') === filter;
        gsap.to(card, { opacity: match ? 1 : 0.2, duration: 0.3, pointerEvents: match ? 'auto' : 'none' });
      });
    });
  });

  // ── CONTACT FORM ────────────────────────────────────────────────
  const form       = document.getElementById('contact-form');
  const successMsg = document.querySelector('.form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'SENDING...';
      setTimeout(() => {
        btn.textContent = originalText;
        form.reset();
        if (successMsg) {
          successMsg.style.display = 'block';
          gsap.from(successMsg, { y: 10, opacity: 0, duration: 0.4 });
          setTimeout(() => gsap.to(successMsg, { opacity: 0, duration: 0.4, onComplete: () => successMsg.style.display = 'none' }), 5000);
        }
      }, 1500);
    });
  }

  // ── INQUIRY POPUP ────────────────────────────────────────────────
  const inquiryPopup = document.getElementById('inquiry-popup');
  if (inquiryPopup) {
    setTimeout(() => {
      if (!sessionStorage.getItem('popupShown')) {
        inquiryPopup.classList.add('show');
        lenis.stop();
        sessionStorage.setItem('popupShown', 'true');
      }
    }, 8000);
    
    const closeInquiryPopup = () => {
      inquiryPopup.classList.remove('show');
      lenis.start();
    };
    
    document.querySelector('.popup-close')?.addEventListener('click', closeInquiryPopup);
    document.querySelector('.popup-overlay')?.addEventListener('click', closeInquiryPopup);

    const popupForm = document.getElementById('popup-contact-form');
    if (popupForm) {
      popupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = popupForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = '✓ Sent!';
          setTimeout(() => {
            closeInquiryPopup();
            btn.innerHTML = originalText;
            btn.disabled = false;
            popupForm.reset();
          }, 1500);
        }, 1000);
      });
    }
  }
});
