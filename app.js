/* Arthur Soares — portfolio interactions. No external libraries or trackers. */
document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const themeButton = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'light'));
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeMeta.setAttribute('content', theme === 'dark' ? '#07131a' : '#f5f7fb');
  if (persist) {
    try { localStorage.setItem('arthur-theme', theme); } catch (_) { /* Storage may be disabled. */ }
  }
}

applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
});
window.matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', event => {
  try { if (localStorage.getItem('arthur-theme')) return; } catch (_) { return; }
  applyTheme(event.matches ? 'light' : 'dark');
});

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('open');
  header.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
}

toggle.addEventListener('click', () => {
  const isOpen = toggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    nav.classList.add('open');
    header.classList.add('menu-active');
    document.body.classList.add('menu-open');
  }
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const progressBar = document.getElementById('scroll-progress-bar');
const backToTop = document.querySelector('.back-to-top');
let scrollTicking = false;
function updateScrollUI() {
  const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${Math.min(1, window.scrollY / travel)})`;
  backToTop.classList.toggle('visible', window.scrollY > 700);
  scrollTicking = false;
}
updateScrollUI();
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollUI);
}, { passive: true });
window.addEventListener('resize', updateScrollUI);

const focusText = document.getElementById('rotating-focus');
if (focusText && !prefersReducedMotion) {
  const focuses = ['análise de eventos', 'resposta a incidentes', 'automação defensiva', 'segurança de redes'];
  let focusIndex = 0;
  window.setInterval(() => {
    focusText.classList.add('is-changing');
    window.setTimeout(() => {
      focusIndex = (focusIndex + 1) % focuses.length;
      focusText.textContent = focuses[focusIndex];
      focusText.classList.remove('is-changing');
    }, 180);
  }, 3600);
}

if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const frame = document.querySelector('.visual-frame');
  frame.addEventListener('pointermove', event => {
    const bounds = frame.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    frame.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
    frame.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
    frame.style.setProperty('--spot-x', `${((x + 1) * 50).toFixed(1)}%`);
    frame.style.setProperty('--spot-y', `${((y + 1) * 50).toFixed(1)}%`);
  });
  frame.addEventListener('pointerleave', () => {
    frame.style.removeProperty('--tilt-x');
    frame.style.removeProperty('--tilt-y');
    frame.style.removeProperty('--spot-x');
    frame.style.removeProperty('--spot-y');
  });
}

const screenshotDialog = document.getElementById('screenshot-dialog');
const expandPreview = document.querySelector('.preview-expand');
const closePreview = document.querySelector('.dialog-close');
if (screenshotDialog?.showModal && expandPreview && closePreview) {
  expandPreview.addEventListener('click', () => screenshotDialog.showModal());
  closePreview.addEventListener('click', () => screenshotDialog.close());
  screenshotDialog.addEventListener('click', event => {
    if (event.target === screenshotDialog) screenshotDialog.close();
  });
  screenshotDialog.addEventListener('close', () => expandPreview.focus());
}

const reveals = [...document.querySelectorAll('.reveal')];
let deepLinkTarget = null;
try { deepLinkTarget = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) { /* Ignore malformed fragments. */ }
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 32px 0px' });
  reveals.forEach((element, index) => {
    if (deepLinkTarget && (element === deepLinkTarget || deepLinkTarget.contains(element))) element.classList.add('in-view');
    if (element.closest('.project-grid, .skills-grid, .method-steps, .journey-list')) {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    }
    revealObserver.observe(element);
  });
} else {
  reveals.forEach(element => element.classList.add('in-view'));
}

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
