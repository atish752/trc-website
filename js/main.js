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


  // ── PRELOADER ──────────────────────────────────────────────────
  const tl = gsap.timeline({ onComplete: initScrollAnimations });
  tl.to('.preloader-char',  { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out' })
    .to('.preloader-line',   { width: '100%', duration: 0.6, ease: 'power3.inOut' }, '-=0.2')
    .to('.preloader-sub',    { opacity: 1, duration: 0.4 }, '-=0.2')
    .to('.preloader-progress', { width: '100%', duration: 0.8, ease: 'power2.inOut' }, '+=0.3')
    .to('#preloader',        { clipPath: 'inset(100% 0 0 0)', duration: 0.7, ease: 'power4.inOut' })
    .set('#preloader',       { display: 'none' });

  // ── CUSTOM CURSOR (desktop only) ───────────────────────────────
  if (!isTouchDevice) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
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
          gsap.to(ring, { backgroundColor: 'rgba(160,82,45,0.15)', borderColor: 'rgba(160,82,45,0.8)' });
          ring.setAttribute('data-text', 'VIEW');
        }
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, opacity: 1, backgroundColor: 'transparent', borderColor: 'rgba(160,82,45,0.7)', duration: 0.3 });
        gsap.to(dot, { scale: 1, duration: 0.3 });
        ring.removeAttribute('data-text');
      });
    });
    window.addEventListener('mousedown', () => gsap.to([dot, ring], { scale: 0.7, duration: 0.15 }));
    window.addEventListener('mouseup',   () => gsap.to([dot, ring], { scale: 1,   duration: 0.15 }));
  }

  // ── MAGNETIC BUTTONS (desktop only) ───────────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width/2)*0.4, y: (e.clientY - r.top - r.height/2)*0.4, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
    });
  }

  // ── MOBILE MENU ───────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks  = document.querySelectorAll('.mobile-menu a');
  let menuOpen = false;

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
  function closeMenu() {
    menuOpen = false;
    gsap.to(hamburger.children[0], { y: 0, rotation: 0,  duration: 0.3 });
    gsap.to(hamburger.children[1], { opacity: 1, duration: 0.3 });
    gsap.to(hamburger.children[2], { y: 0, rotation: 0,  duration: 0.3 });
    gsap.to(menuLinks, { y: 30, opacity: 0, duration: 0.2 });
    gsap.to(mobileMenu, { clipPath: 'circle(0% at calc(100% - 40px) 40px)', duration: 0.6, ease: 'power3.inOut' });
    lenis.start();
  }

  // ── NAV + PROGRESS BAR ───────────────────────────────────────
  const nav = document.querySelector('nav');
  const progressBar = document.querySelector('.progress-bar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 100);
    const h = document.body.offsetHeight - window.innerHeight;
    if (h > 0) progressBar.style.width = (window.scrollY / h * 100) + '%';
  });

  // ── WORD REVEAL SETUP (preserves .accent-word spans) ────────
  document.querySelectorAll('.word-reveal').forEach(el => {
    const nodes = Array.from(el.childNodes);
    let html = '';
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.trim().split(/\s+/).filter(Boolean).forEach(w => {
          html += `<span class="word-wrap"><span class="word">${w}&nbsp;</span></span>`;
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const cls = node.className ? ` class="${node.className}"` : '';
        node.innerText.trim().split(/\s+/).filter(Boolean).forEach(w => {
          html += `<span class="word-wrap"><span class="word"><span${cls}>${w}</span>&nbsp;</span></span>`;
        });
      }
    });
    el.innerHTML = html;
  });


  // ── SERVICES ACCORDION ───────────────────────────────────────
  document.querySelectorAll('.service-row-header').forEach(header => {
    header.addEventListener('click', () => {
      const row  = header.parentElement;
      const body = row.querySelector('.service-row-body');
      const open = row.classList.contains('open');
      // Close all
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

  // ── MOBILE PROCESS DOTS (Removed with horizontal layout) ──

  // ── SCROLL ANIMATIONS ──────────────────────────────────────────
  function initScrollAnimations() {

    // 1. HERO — cinematic staggered word reveal
    gsap.from('.hero .word', {
      y: '105%',
      skewY: 4,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.065
    });

    // 2. SECTION HEADLINES — clip-path line wipe (Don Molinico style)
    document.querySelectorAll('section:not(.hero) .word-reveal').forEach(el => {
      gsap.from(el.querySelectorAll('.word'), {
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
        y: '105%',
        skewY: 3,
        opacity: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.06
      });
    });

    // 3. LABEL LINES — horizontal clip-path reveal
    document.querySelectorAll('.label').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.9,
        ease: 'expo.out'
      });
    });

    // 4. FADE-UP elements — with slight skew
    document.querySelectorAll('.fade-up').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 87%' },
        y: 60,
        opacity: 0,
        duration: 0.95,
        ease: 'expo.out'
      });
    });

    // 5. SECTION PARALLAX — subtle scrub background shift
    if (!isMobile) {
      document.querySelectorAll('.about-section,.why-section,.testimonials-section').forEach(section => {
        gsap.to(section, {
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          y: -40,
          ease: 'none'
        });
      });
    }

    // 6. STAT COUNTERS
    document.querySelectorAll('.stat-num span[data-target]').forEach(el => {
      gsap.from(el, {
        innerHTML: 0,
        duration: 2.2,
        ease: 'expo.out',
        snap: { innerHTML: 1 },
        scrollTrigger: { trigger: el, start: 'top 80%', once: true }
      });
    });

    // 7. SERVICE ROWS — staggered slide-in
    document.querySelectorAll('.service-row').forEach((row, i) => {
      gsap.from(row, {
        scrollTrigger: { trigger: row, start: 'top 88%' },
        x: -30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.07,
        ease: 'expo.out'
      });
    });

    // 8. WHY CARDS — staggered pop-up
    gsap.from('.why-card', {
      scrollTrigger: { trigger: '.why-grid', start: 'top 85%' },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.09
    });

    // 9. TESTIMONIAL CARDS — staggered
    gsap.from('.test-card', {
      scrollTrigger: { trigger: '.test-grid', start: 'top 85%' },
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.12
    });

    // 10. HORIZONTAL RED LINE — grows across on section enter
    document.querySelectorAll('.founder-note').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        scaleX: 0,
        transformOrigin: 'left',
        duration: 0.8,
        ease: 'expo.out'
      });
    });

    // 11. FEATURE CARDS — stagger slide-right
    gsap.from('.feature-card', {
      scrollTrigger: { trigger: '.about-features', start: 'top 85%' },
      x: -20,
      opacity: 0,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.1
    });

    // (Process animation removed here because it now uses the standard .fade-up class)
  }


  // ── FAQ ACCORDION ────────────────────────────────────────────
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

  // ── PORTFOLIO FILTERS ────────────────────────────────────────
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

  // ── PORTFOLIO MODAL ──────────────────────────────────────────
  const modal        = document.querySelector('.project-modal');
  const backdrop     = document.querySelector('.modal-backdrop');
  const modalClose   = document.querySelector('.modal-close');
  const modalContent = document.querySelector('.modal-content');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const h4  = card.querySelector('h4');
      const img = card.querySelector('img');
      if (!h4 || !img) return;
      modal.querySelector('.modal-title').innerText = h4.innerText;
      modal.querySelector('.modal-cat').innerText   = card.getAttribute('data-cat') || '';
      modal.querySelector('.modal-left').innerHTML  = `<img src="${img.src}" alt="Screenshot"><img src="${img.src}" alt="Screenshot 2" style="filter:brightness(0.8)">`;
      modal.style.display = 'flex';
      gsap.to(backdrop,     { opacity: 1, duration: 0.4 });
      gsap.to(modalContent, { x: 0,       duration: 0.6, ease: 'power4.out' });
      lenis.stop();
    });
  });

  function closeModal() {
    gsap.to(backdrop,     { opacity: 0,     duration: 0.4 });
    gsap.to(modalContent, { x: '100%', duration: 0.4, ease: 'power3.in', onComplete: () => { modal.style.display = 'none'; lenis.start(); } });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (backdrop)   backdrop.addEventListener('click', closeModal);

  // ── CONTACT FORM ──────────────────────────────────────────────
  const form       = document.getElementById('contact-form');
  const successMsg = document.querySelector('.form-success');
  const submitBtn  = form ? form.querySelector('button[type="submit"]') : null;
  if (form && submitBtn) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      submitBtn.textContent = 'SENDING...';
      submitBtn.style.opacity = '0.7';
      setTimeout(() => {
        submitBtn.textContent = 'SEND MY ENQUIRY →';
        submitBtn.style.opacity = '1';
        form.reset();
        successMsg.style.display = 'block';
        gsap.from(successMsg, { y: 10, opacity: 0, duration: 0.4 });
        setTimeout(() => gsap.to(successMsg, { opacity: 0, duration: 0.4, onComplete: () => successMsg.style.display = 'none' }), 5000);
      }, 1500);
    });
  }

  // ── INQUIRY POPUP (5-10s delay) ──────────────────────────────
  const inquiryPopup = document.getElementById('inquiry-popup');
  const popupClose = document.querySelector('.popup-close');
  const popupOverlay = document.querySelector('.popup-overlay');
  if (inquiryPopup) {
    setTimeout(() => {
      if (!sessionStorage.getItem('popupShown')) {
        inquiryPopup.classList.add('show');
        lenis.stop();
        sessionStorage.setItem('popupShown', 'true');
      }
    }, 7000);
    
    const closeInquiryPopup = () => {
      inquiryPopup.classList.remove('show');
      lenis.start();
    };
    
    if (popupClose) popupClose.addEventListener('click', closeInquiryPopup);
    if (popupOverlay) popupOverlay.addEventListener('click', closeInquiryPopup);
  }
});
