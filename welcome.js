// ===== CONFETTI =====
(function () {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    const colors = ['#1976d2', '#90caf9', '#ffffff', '#42a5f5', '#1e88e5', '#a78bfa', '#34d399'];
    const particles = [];
    function createParticle(x, y) {
        return { x, y, vx: (Math.random() - 0.5) * 8, vy: Math.random() * -12 - 4, size: Math.random() * 9 + 4, color: colors[Math.floor(Math.random() * colors.length)], rotation: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.25, shape: Math.random() > 0.5 ? 'rect' : 'circle', opacity: 1, gravity: 0.35 };
    }
    function launch() {
        const cx = canvas.width / 2;
        for (let i = 0; i < 80; i++) particles.push(createParticle(cx + (Math.random() - 0.5) * 200, canvas.height * 0.3));
        setTimeout(() => { for (let i = 0; i < 60; i++) particles.push(createParticle(cx + (Math.random() - 0.5) * 400, canvas.height * 0.2)); }, 300);
        setTimeout(() => { for (let i = 0; i < 50; i++) particles.push(createParticle(cx + (Math.random() - 0.5) * 300, canvas.height * 0.25)); }, 600);
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.vy += p.gravity; p.y += p.vy; p.rotation += p.spin; p.opacity -= 0.008;
            if (p.opacity <= 0 || p.y > canvas.height + 20) { particles.splice(i, 1); continue; }
            ctx.save(); ctx.globalAlpha = Math.max(0, p.opacity); ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
            if (p.shape === 'rect') { ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7); }
            else { ctx.beginPath(); ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2); ctx.fill(); }
            ctx.restore();
        }
        if (particles.length > 0) requestAnimationFrame(animate);
    }
    window.addEventListener('load', () => { launch(); animate(); });
})();

// ===== CORNER ARROW =====
(function () {
    const NS = 'http://www.w3.org/2000/svg';
    const COLOR = 'rgba(25,118,210,0.8)';

    function el(tag, attrs) {
        const e = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
        return e;
    }

    function updatePath() {
        const path = document.getElementById('corner-arrow-path');
        const btn = document.querySelector('.pin-cards .pin-card:first-child .chrome-btn.active');
        if (!path || !btn) return;
        const r = btn.getBoundingClientRect();
        const sx = r.right - r.width / 2;
        const sy = r.top + r.height / 2;
        const ex = window.innerWidth - 150;
        const ey = 0;
        const cp1x = sx + (ex - sx) * 0.55;
        const cp1y = sy;
        const cp2x = ex;
        const cp2y = sy + (ey - sy) * 0.45;
        path.setAttribute('d', `M ${sx} ${sy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${ex} ${ey}`);
    }

    function drawStatic() {
        const svg = document.getElementById('corner-arrow-svg');
        if (!svg) return;
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const ex = window.innerWidth - 150;
        const ey = 0;
        const path = el('path', { id: 'corner-arrow-path', d: '', stroke: COLOR, 'stroke-width': '2', 'stroke-dasharray': '6 4', 'stroke-linecap': 'round', fill: 'none' });
        svg.appendChild(path);
        const ripple = el('circle', { cx: ex, cy: ey, r: '30', fill: 'none', stroke: COLOR, 'stroke-width': '2' });
        const aR = document.createElementNS(NS, 'animate');
        aR.setAttribute('attributeName', 'r'); aR.setAttribute('from', '30'); aR.setAttribute('to', '110'); aR.setAttribute('dur', '1.6s'); aR.setAttribute('repeatCount', 'indefinite');
        const aO = document.createElementNS(NS, 'animate');
        aO.setAttribute('attributeName', 'opacity'); aO.setAttribute('from', '0.7'); aO.setAttribute('to', '0'); aO.setAttribute('dur', '1.6s'); aO.setAttribute('repeatCount', 'indefinite');
        ripple.appendChild(aR); ripple.appendChild(aO);
        svg.appendChild(ripple);
        svg.appendChild(el('circle', { cx: ex, cy: ey, r: '25', fill: COLOR }));
        updatePath();
    }

    window.addEventListener('load', drawStatic);
    window.addEventListener('resize', drawStatic);
    window.addEventListener('scroll', updatePath, { passive: true });

    // Hide corner arrow when user scrolls out of the hero section.
    const hint = document.querySelector('.corner-hint');
    const hero = document.querySelector('.hero');
    if (hint && hero) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                hint.style.transition = 'opacity 0.3s ease';
                hint.style.opacity = entry.isIntersecting ? '1' : '0';
                hint.style.pointerEvents = entry.isIntersecting ? '' : 'none';
            },
            { threshold: 0 }
        );
        observer.observe(hero);
    }
})();

// ===== WALKTHROUGH ARROW =====
(function () {
    const inner = document.getElementById('wt-inner');
    if (!inner) return;

    const NS = 'http://www.w3.org/2000/svg';
    const COLOR = 'rgba(25,118,210,0.82)';

    // Build SVG overlay
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'wt-arrow-svg');
    inner.appendChild(svg);

    // Dashed path
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('stroke', COLOR); path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '6 4'); path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('fill', 'none');
    svg.appendChild(path);

    // Ripple at button end
    const ripple = document.createElementNS(NS, 'circle');
    ripple.setAttribute('r', '7'); ripple.setAttribute('fill', 'none');
    ripple.setAttribute('stroke', COLOR); ripple.setAttribute('stroke-width', '1.5');
    const aR = document.createElementNS(NS, 'animate');
    aR.setAttribute('attributeName', 'r'); aR.setAttribute('from', '7'); aR.setAttribute('to', '22');
    aR.setAttribute('dur', '1.4s'); aR.setAttribute('repeatCount', 'indefinite');
    const aO = document.createElementNS(NS, 'animate');
    aO.setAttribute('attributeName', 'opacity'); aO.setAttribute('from', '0.65'); aO.setAttribute('to', '0');
    aO.setAttribute('dur', '1.4s'); aO.setAttribute('repeatCount', 'indefinite');
    ripple.appendChild(aR); ripple.appendChild(aO); svg.appendChild(ripple);

    // Dot at button end
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', '3.5'); dot.setAttribute('fill', COLOR); svg.appendChild(dot);

    const items = inner.querySelectorAll('.wt-item');

    function rel(el) {
        const cr = inner.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        return { left: er.left - cr.left, top: er.top - cr.top, w: er.width, h: er.height,
                 cx: er.left - cr.left + er.width / 2, cy: er.top - cr.top + er.height / 2 };
    }

    function draw(item) {
        const btn = document.getElementById(item.dataset.target);
        if (!btn) return;
        const b = rel(btn);
        const h = rel(item.querySelector('.wt-item-header'));

        // Start: left edge of right-side header; End: center of mockup button
        const sx = h.left, sy = h.cy;
        const ex = b.cx,   ey = b.cy;
        const dist = sx - ex;
        const cp1x = sx - dist * 0.42, cp1y = sy;
        const cp2x = ex + dist * 0.22, cp2y = ey;

        path.setAttribute('d', `M ${sx} ${sy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${ex} ${ey}`);
        ripple.setAttribute('cx', ex); ripple.setAttribute('cy', ey);
        dot.setAttribute('cx', ex);   dot.setAttribute('cy', ey);
    }

    function setActive(item) {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        inner.querySelectorAll('.wt-btn-active').forEach(e => e.classList.remove('wt-btn-active'));
        const btn = document.getElementById(item.dataset.target);
        if (btn) btn.classList.add('wt-btn-active');

        // Fade out, wait for accordion to finish opening, then redraw and fade in.
        svg.style.opacity = '0';
        const body = item.querySelector('.wt-item-body');
        if (body) {
            body.addEventListener('transitionend', () => {
                if (item.classList.contains('active')) {
                    draw(item);
                    svg.style.opacity = '1';
                }
            }, { once: true });
        } else {
            draw(item);
            svg.style.opacity = '1';
        }
    }

    window.addEventListener('load', () => { if (items[0]) setActive(items[0]); });
    window.addEventListener('resize', () => { const a = inner.querySelector('.wt-item.active'); if (a) draw(a); });
    window.addEventListener('scroll', () => { const a = inner.querySelector('.wt-item.active'); if (a) draw(a); }, { passive: true });

    items.forEach(item => {
        item.addEventListener('mouseenter', () => setActive(item));
        item.addEventListener('click', () => setActive(item));
    });

    // Hovering a mockup button activates its linked accordion item.
    items.forEach(item => {
        const btn = document.getElementById(item.dataset.target);
        if (btn) {
            btn.addEventListener('mouseenter', () => setActive(item));
        }
    });
})();
