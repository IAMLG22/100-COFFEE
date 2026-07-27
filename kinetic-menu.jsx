// Menú kinetic GSAP — adaptado a la marca 100% COFFEE (lógica de animación original intacta).
const { useEffect, useRef, useState } = React;

// Resuelve SIEMPRE, con true/false según haya cargado el script o no.
// Antes solo escuchaba 'load': si el CDN devolvía error la promesa se quedaba viva
// para siempre, `ready` nunca pasaba a true y el menú dejaba de abrirse en silencio.
// El temporizador cubre el caso peor, una red que acepta la conexión y no contesta:
// ahí tampoco llega a dispararse 'error'.
function ensureScript(src, timeoutMs = 5000) {
  return new Promise(res => {
    let hecho = false;
    const fin = ok => { if (!hecho) { hecho = true; res(ok); } };
    setTimeout(() => fin(false), timeoutMs);
    const existing = [...document.scripts].find(s => s.src === src);
    if (existing) {
      if (existing.dataset.loaded) return fin(true);
      existing.addEventListener('load', () => fin(true));
      existing.addEventListener('error', () => fin(false));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => { s.dataset.loaded = '1'; fin(true); };
    s.onerror = () => fin(false);
    document.head.appendChild(s);
  });
}

const CSS = `
.km-root{font-family:'Jost',sans-serif}
.km-root .site-header-wrapper{position:fixed;top:0;left:0;right:0;z-index:110;transition:background .35s,box-shadow .35s}
.km-root .header{padding:16px 5vw}
.km-root .nav-row{display:flex;justify-content:space-between;align-items:center;gap:20px}
.km-root .nav-logo-row{font-family:'Oswald',sans-serif;font-size:20px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:inherit;text-decoration:none;transition:color .3s}
.km-root .nav-logo-row:hover{color:#E09A4C}
.km-root .nav-close-btn{display:flex;align-items:center;gap:12px;background:transparent;border:1px solid currentColor;border-radius:999px;padding:11px 22px;color:inherit;cursor:pointer;pointer-events:auto;transition:color .3s,transform .25s,background .3s}
.km-root .nav-close-btn:hover{color:#E09A4C;transform:translateY(-2px)}
.km-root .menu-button-text{position:relative;height:1.45em;overflow:hidden}
.km-root .menu-button-text p{margin:0;font-size:13px;letter-spacing:2.5px;text-transform:uppercase;font-weight:500;line-height:1.45em;font-family:'Jost',sans-serif}
.km-root .icon-wrap{width:15px;height:15px;display:flex}
.km-root .menu-button-icon{display:block}
.km-root .nav-overlay-wrapper{display:none;position:fixed;inset:0;z-index:100}
.km-root .overlay{position:absolute;inset:0;background:rgba(10,9,8,.5);cursor:pointer}
.km-root .menu-content{position:absolute;top:0;right:0;height:100%;width:min(35em,88vw);overflow:hidden}
.km-root .menu-bg{position:absolute;inset:0}
.km-root .backdrop-layer{position:absolute;inset:0;background:#0A0908}
.km-root .backdrop-layer.first{background:#C6853F}
.km-root .backdrop-layer.second{background:#26160E}
.km-root .ambient-background-shapes{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.km-root .bg-shape{position:absolute;right:-8%;bottom:-6%;width:82%;height:62%;opacity:0;visibility:hidden}
.km-root .bg-shape.active{opacity:1;visibility:visible}
.km-root .menu-content-wrapper{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;height:100%;padding:6em max(3em,8%) 3em;box-sizing:border-box}
.km-root .menu-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.15em}
.km-root .menu-list-item{overflow:hidden}
.km-root .nav-link{display:inline-block;position:relative;text-decoration:none;padding:.12em 0;pointer-events:auto}
.km-root .nav-link-text{margin:0;font-family:'Oswald',sans-serif;text-transform:uppercase;font-weight:600;font-size:clamp(38px,4.6vw,62px);line-height:1.08;color:#F5EDDD;transition:color .3s;white-space:nowrap}
.km-root .nav-link:hover .nav-link-text{color:#E09A4C}
.km-root .menu-list-item.is-small{margin-top:1.4em}
.km-root .nav-link.is-small .nav-link-text{font-size:clamp(19px,1.8vw,25px);font-weight:500;letter-spacing:1.5px;text-decoration:underline;text-underline-offset:7px;text-decoration-thickness:1.5px;color:#E0B27C}
.km-root .nav-link.is-small:hover .nav-link-text{color:#E09A4C}
`;

function KineticMenu() {
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      await ensureScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
      await ensureScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js');
      if (!alive) return;
      const gsap = window.gsap;
      if (gsap) {
        try {
          if (window.CustomEase) gsap.registerPlugin(window.CustomEase);
          if (!gsap.parseEase('main')) {
            window.CustomEase.create('main', '0.65, 0.01, 0.05, 0.99');
          }
          gsap.defaults({ ease: 'main', duration: 0.7 });
        } catch (e) {
          console.warn('CustomEase failed to load, falling back to default.', e);
          gsap.defaults({ ease: 'power2.out', duration: 0.7 });
        }
      } else {
        console.warn('[menu] GSAP no disponible: el menú funciona sin animación.');
      }
      // Se marca listo haya GSAP o no. La animación es un adorno; abrir y cerrar el
      // menú no puede quedar condicionado a que responda un CDN de terceros.
      setReady(true);
    })();
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { alive = false; window.removeEventListener('scroll', onScroll); };
  }, []);

  // Shape hover effects (lógica original intacta)
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const gsap = window.gsap;
    if (!gsap) return;   // sin GSAP no hay formas de fondo; el menú sigue siendo usable
    const ctx = gsap.context(() => {
      const menuItems = containerRef.current.querySelectorAll('.menu-list-item[data-shape]');
      const shapesContainer = containerRef.current.querySelector('.ambient-background-shapes');
      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute('data-shape');
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;
        if (!shape) return;
        const shapeEls = shape.querySelectorAll('.shape-element');
        const onEnter = () => {
          if (shapesContainer) shapesContainer.querySelectorAll('.bg-shape').forEach((s) => s.classList.remove('active'));
          shape.classList.add('active');
          gsap.fromTo(shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)', overwrite: 'auto' });
        };
        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
            onComplete: () => shape.classList.remove('active'),
            overwrite: 'auto',
          });
        };
        item.addEventListener('mouseenter', onEnter);
        item.addEventListener('mouseleave', onLeave);
        item._cleanup = () => {
          item.removeEventListener('mouseenter', onEnter);
          item.removeEventListener('mouseleave', onLeave);
        };
      });
    }, containerRef);
    return () => {
      ctx.revert();
      if (containerRef.current) {
        containerRef.current.querySelectorAll('.menu-list-item[data-shape]').forEach((item) => item._cleanup && item._cleanup());
      }
    };
  }, [ready]);

  // Open/close animation (tiempos y transforms originales intactos)
  useEffect(() => {
    if (!ready || !containerRef.current) return;
    const gsap = window.gsap;
    // Camino sin GSAP: se abre y se cierra igual, sin la coreografía de entrada.
    // Es el estado en el que antes el menú se quedaba muerto sin avisar.
    if (!gsap) {
      const nw = containerRef.current.querySelector('.nav-overlay-wrapper');
      if (nw) {
        nw.setAttribute('data-nav', isMenuOpen ? 'open' : 'closed');
        nw.style.display = isMenuOpen ? 'block' : 'none';
      }
      return;
    }
    const ctx = gsap.context(() => {
      const navWrap = containerRef.current.querySelector('.nav-overlay-wrapper');
      const menu = containerRef.current.querySelector('.menu-content');
      const overlay = containerRef.current.querySelector('.overlay');
      const bgPanels = containerRef.current.querySelectorAll('.backdrop-layer');
      const menuLinks = containerRef.current.querySelectorAll('.nav-link');
      const fadeTargets = containerRef.current.querySelectorAll('[data-menu-fade]');
      const menuButton = containerRef.current.querySelector('.nav-close-btn');
      const menuButtonTexts = menuButton && menuButton.querySelectorAll('p');
      const menuButtonIcon = menuButton && menuButton.querySelector('.menu-button-icon');
      const tl = gsap.timeline();
      if (isMenuOpen) {
        if (navWrap) navWrap.setAttribute('data-nav', 'open');
        tl.set(navWrap, { display: 'block' })
          .set(menu, { xPercent: 0 }, '<')
          .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, '<')
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, '<')
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, '<')
          .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, '<+=0.35');
        if (fadeTargets.length) {
          tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: 'all' }, '<+=0.2');
        }
      } else {
        if (navWrap) navWrap.setAttribute('data-nav', 'closed');
        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, '<')
          .to(menuButtonTexts, { yPercent: 0 }, '<')
          .to(menuButtonIcon, { rotate: 0 }, '<')
          .set(navWrap, { display: 'none' });
      }
    }, containerRef);
    return () => ctx.revert();
  }, [isMenuOpen, ready]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMenuOpen]);

  // Scroll lock del body mientras el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(p => !p);
  const closeMenu = () => setIsMenuOpen(false);

  const light = scrolled || isMenuOpen;
  const links = [
    { label: 'La Carta', href: '#carta', shape: '1' },
    { label: 'Reseñas', href: '#resenas', shape: '2' },
    { label: 'Comunidad', href: '#comunidad', shape: '3' },
    { label: 'Visítanos', href: '#visitanos', shape: '4' },
  ];

  return (
    <div ref={containerRef} className="km-root">
      <style>{CSS}</style>
      <div className="site-header-wrapper" style={{
        color: '#F5EDDD',
        background: scrolled && !isMenuOpen ? 'rgba(15,9,5,.92)' : 'transparent',
        backdropFilter: scrolled && !isMenuOpen ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled && !isMenuOpen ? 'blur(14px)' : 'none',
        boxShadow: scrolled && !isMenuOpen ? '0 8px 30px rgba(0,0,0,.3)' : 'none',
      }}>
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row">
              <a href="#top" aria-label="home" className="nav-logo-row w-inline-block">100 % COFFEE</a>
              <div className="nav-row__right">
                <button role="button" className="nav-close-btn" onClick={toggleMenu} style={{ pointerEvents: 'auto' }}>
                  <div className="menu-button-text">
                    <p className="p-large">Menú</p>
                    <p className="p-large">Cerrar</p>
                  </div>
                  <div className="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="menu-button-icon">
                      <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                      <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                      <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                      <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                      <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                      <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>
              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(212,175,55,0.15)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(139,69,19,0.15)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(224,178,124,0.10)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(212,175,55,0.15)" />
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(212,175,55,0.18)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(139,69,19,0.15)" strokeWidth="40" fill="none" />
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(212,175,55,0.3)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(139,69,19,0.3)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(224,178,124,0.3)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(212,175,55,0.3)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(139,69,19,0.25)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(224,178,124,0.25)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(212,175,55,0.25)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(224,178,124,0.3)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(212,175,55,0.3)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(139,69,19,0.3)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(224,178,124,0.3)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(212,175,55,0.3)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(139,69,19,0.3)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(224,178,124,0.3)" />
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(212,175,55,0.12)" />
                  <path className="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(224,178,124,0.10)" />
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(212,175,55,0.15)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(139,69,19,0.12)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(224,178,124,0.10)" strokeWidth="20" />
                </svg>
              </div>
            </div>
            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {links.map(l => (
                  <li className="menu-list-item" data-shape={l.shape} key={l.href}>
                    <a href={l.href} className="nav-link w-inline-block" onClick={closeMenu}>
                      <p className="nav-link-text">{l.label}</p>
                      <div className="nav-link-hover-bg"></div>
                    </a>
                  </li>
                ))}
                <li className="menu-list-item is-small" data-shape="5">
                  <a href="https://maps.app.goo.gl/GKaq3qdyVo62jsaj7" target="_blank" rel="noopener noreferrer" className="nav-link is-small w-inline-block" onClick={closeMenu}>
                    <p className="nav-link-text" data-menu-fade style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      Cómo llegar
                      <svg width="0.72em" height="0.72em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }} aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </p>
                    <div className="nav-link-hover-bg"></div>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

module.exports = { KineticMenu };
