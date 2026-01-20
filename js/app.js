(() => {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

  // --- UI: show who opened (if available)
  const whoEl = document.getElementById('who');
  let userLabel = "";
  try {
    if (tg) {
      tg.ready();
      tg.expand();
      const u = tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;
      if (u) {
        const name = [u.first_name, u.last_name].filter(Boolean).join(' ');
        const uname = u.username ? `@${u.username}` : "";
        userLabel = `${name}${uname ? ` (${uname})` : ""} [id:${u.id}]`;
        whoEl.textContent = `Открыто: ${name}${uname ? ` — ${uname}` : ""}`;
      } else {
        whoEl.textContent = "";
      }
    } else {
      whoEl.textContent = "";
    }
  } catch {
    if (whoEl) whoEl.textContent = "";
  }

  if (whoEl && !whoEl.textContent) {
    whoEl.style.display = 'none';
  }

  // --- Discord notify (on open, once per session)
  async function notifyDiscordOnce() {
    const cfg = window.APP_CONFIG || {};
    const url = cfg.DISCORD_WEBHOOK_URL;
    if (!url || url === "https://discord.com/api/webhooks/1459594953679441934/L5XH5D46GOZtYS1AnZDQeqAsmH2ncJxclgVAtO3I5HtTNmbb1-yHf3V5-gQpyCji5Q9B") return;

    const key = "discord_notified_v1";
    if (sessionStorage.getItem(key) === "1") return;
    sessionStorage.setItem(key, "1");

    const payload = {
      username: "Заявки",
      // без аватарки специально
      content: userLabel
        ? `Запуск Web-App. Пользователь: ${userLabel}`
        : "Запуск Web-App (пользователь не определён — вероятно открыт не внутри Telegram)."
    };

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      // молча: чтобы не ломать UX
    }
  }
  notifyDiscordOnce();

  // --- Button
  const applyBtn = document.getElementById('applyBtn');
  applyBtn.addEventListener('click', () => {
    const cfg = window.APP_CONFIG || {};
    const link = cfg.TARGET_BOT_LINK || "https://t.me/IpachiBot?start=7225974704";

    // Telegram-first open
    try {
      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(link);
        return;
      }
    } catch {}

    // fallback
    window.location.href = link;
  });

  // --- Animated background (particles)
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const rnd = (a, b) => a + Math.random() * (b - a);
  const dots = Array.from({ length: 70 }, () => ({
    x: rnd(0, w),
    y: rnd(0, h),
    r: rnd(0.8, 2.8),
    vx: rnd(-0.18, 0.18),
    vy: rnd(-0.12, 0.12),
    a: rnd(0.08, 0.35)
  }));

  let t0 = performance.now();
  function tick(t) {
    const dt = Math.min(40, t - t0);
    t0 = t;

    // background gradient
    const gx = (Math.sin(t * 0.00025) * 0.5 + 0.5) * w;
    const gy = (Math.cos(t * 0.00022) * 0.5 + 0.5) * h;
    const g = ctx.createRadialGradient(gx, gy, 60, w * 0.5, h * 0.5, Math.max(w, h));
    g.addColorStop(0, 'rgba(255,42,42,0.20)');
    g.addColorStop(0.42, 'rgba(176,0,0,0.12)');
    g.addColorStop(1, 'rgba(5,5,5,1)');

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // dots
    for (const p of dots) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 210, 210, ${p.a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
