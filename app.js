document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO HEADER DINÂMICO ---
    const header = document.getElementById('main-header');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    const handleScroll = () => {
        if (window.scrollY > 50) { header.classList.add('header-scrolled'); } 
        else { header.classList.remove('header-scrolled'); }
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = `${scrollPercent}%`;
    };
    window.addEventListener('scroll', handleScroll);

    // --- LÓGICA DE ANIMAÇÃO DAS BARRAS DE HABILIDADE ---
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target.querySelector('.skill-level');
                skillLevel.style.width = skillLevel.dataset.level;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.skill-card-detailed').forEach(card => { skillObserver.observe(card); });

    // --- EFEITO 3D TILT NOS CARDS ---
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2
    });

    // --- EFEITO MAGNÉTICO NOS ÍCONES SOCIAIS ---
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY, target } = e;
            const { clientWidth, clientHeight } = target;
            const x = (offsetX / clientWidth - 0.5) * 40; // O valor 40 controla a intensidade
            const y = (offsetY / clientHeight - 0.5) * 40;
            link.style.transform = `translate(${x}px, ${y}px)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translate(0,0)';
        });
    });

    // --- CURSOR, PRELOADER, TEMA, ETC. (RESTANTE DO CÓDIGO) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX; const posY = e.clientY;
        cursorDot.style.left = `${posX}px`; cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: 'forwards' });
    });
    const links = document.querySelectorAll('a, button, .slider, input, textarea');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => { cursorOutline.classList.add('hover-grow'); });
        link.addEventListener('mouseleave', () => { cursorOutline.classList.remove('hover-grow'); });
    });

    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => { preloader.classList.add('preloader-hidden'); });

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-mode') { themeToggle.checked = true; }
    }
    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
        loadParticles(body.classList.contains('dark-mode'));
    });

    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { backToTopButton.classList.add('visible'); } 
        else { backToTopButton.classList.remove('visible'); }
    });

    const sr = ScrollReveal({ origin: 'top', distance: '60px', duration: 2500, delay: 400, reset: false });
    sr.reveal('.inicio-content', { origin: 'bottom' });
    sr.reveal('.section h2, .section-subtitle');
    sr.reveal('.sobre-content', { origin: 'left' });
    sr.reveal('.focus-card', { interval: 100 });
    sr.reveal('.project-card');
    sr.reveal('#contact-form', { origin: 'bottom' });

    new TypeIt("#subtitle", { strings: ["Desenvolvedor de Software.", "Analista de Cyber Security.", "Criador de Soluções Seguras."], speed: 75, loop: true, breakLines: false, waitUntilVisible: true }).go();

    function loadParticles(isDarkMode) {
        const particleColor = isDarkMode ? '#00ff9d' : '#03a9f4';
        const linkColor = isDarkMode ? '#00ff9d' : '#4fc3f7';
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } },
            particles: { color: { value: particleColor }, links: { color: linkColor, distance: 150, enable: true, opacity: 0.5, width: 1 }, move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1.5, straight: false }, number: { density: { enable: true, area: 800 }, value: 80 }, opacity: { value: 0.5 }, shape: { type: "circle" }, size: { value: { min: 1, max: 5 } } },
            detectRetina: true
        });
    }
    loadParticles(body.classList.contains('dark-mode'));
});