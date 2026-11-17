// Small progressive enhancements. The page works without any of this.

const root = document.documentElement;

/* ---------- Theme toggle ---------- */
const themeBtn = document.querySelector("[data-theme-toggle]");
const themeIcon = document.querySelector("[data-theme-icon]");
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  if (theme === "light") root.dataset.theme = "light";
  else delete root.dataset.theme;
  const next = theme === "light" ? "dark" : "light";
  themeBtn?.setAttribute("aria-label", `Switch to ${next} theme`);
  themeIcon?.setAttribute("href", theme === "light" ? "#i-moon" : "#i-sun");
  themeColor?.setAttribute("content", theme === "light" ? "#ffffff" : "#0a0a0b");
}

applyTheme(root.dataset.theme === "light" ? "light" : "dark");

themeBtn?.addEventListener("click", () => {
  const theme = root.dataset.theme === "light" ? "dark" : "light";
  applyTheme(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {}
});

/* ---------- Mobile menu ---------- */
const menuBtn = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

function setMenu(open) {
  menuBtn?.setAttribute("aria-expanded", String(open));
  menuBtn?.querySelector(".sr-only")?.replaceChildren(open ? "Close menu" : "Menu");
  menu?.toggleAttribute("data-open", open);
}
// close the menu if the window grows past the mobile breakpoint
matchMedia("(min-width: 48rem)").addEventListener("change", (e) => e.matches && setMenu(false));

menuBtn?.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
menu?.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuBtn?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuBtn.focus();
  }
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Contact form (EmailJS loads only when someone sends a message) ---------- */
const form = document.querySelector("[data-contact-form]");
const status = form?.querySelector("[data-form-status]");
const submit = form?.querySelector("[data-submit]");
const EMAILJS = { publicKey: "dbLyKxuFSb-dZwgDR", service: "service_yep9wjg", template: "template_7lhjvjq" };
const EMAIL = "edwinalexandervargas.dev@gmail.com";

function loadEmailJS() {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => resolve(window.emailjs);
    s.onerror = reject;
    document.head.append(s);
  });
}

function setStatus(message, tone) {
  status.textContent = message;
  status.className = `min-h-6 text-sm ${tone === "error" ? "text-danger" : tone === "success" ? "text-success" : "text-muted"}`;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    const firstInvalid = form.querySelector(":invalid");
    setStatus("Please fill in your name, a valid email and a message.", "error");
    firstInvalid?.focus();
    return;
  }
  submit.disabled = true;
  setStatus("Sending…");
  try {
    const emailjs = await loadEmailJS();
    await emailjs.sendForm(EMAILJS.service, EMAILJS.template, form, { publicKey: EMAILJS.publicKey });
    form.reset();
    setStatus("Thanks! Your message is on its way. I'll get back to you soon.", "success");
  } catch (err) {
    console.error("Contact form failed:", err?.status, err?.text ?? err);
    setStatus(`Something went wrong. Please email me directly at ${EMAIL}.`, "error");
  } finally {
    submit.disabled = false;
  }
});

/* ---------- Skills logo ring: spin that eases in and out ---------- */
const orbit = document.querySelector("[data-orbit]");
const ring = orbit?.querySelector(".orbit-ring");
const orbitBtn = orbit?.querySelector("[data-orbit-toggle]");
const orbitIcon = orbit?.querySelector("[data-orbit-icon]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

if (orbit && ring && !reduceMotion.matches) {
  const SPEED = 10; // degrees per second (one turn every 36s)
  const EASE = 0.45; // seconds to roughly settle when slowing down or speeding up
  let angle = 0;
  let velocity = SPEED;
  let pausedByUser = false;
  let hovering = false;
  let onScreen = true;
  let last = performance.now();
  let frame = 0;

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const target = pausedByUser || hovering ? 0 : SPEED;
    velocity += (target - velocity) * (1 - Math.exp(-dt / EASE));
    if (Math.abs(velocity) < 0.01 && target === 0) velocity = 0;
    angle = (angle + velocity * dt) % 360;
    ring.style.setProperty("--spin", `${angle}deg`);
    frame = velocity === 0 && target === 0 ? 0 : requestAnimationFrame(tick);
  };
  const run = () => {
    if (!frame && onScreen) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  orbit.querySelector(".orbit").addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") {
      hovering = true;
      run();
    }
  });
  orbit.querySelector(".orbit").addEventListener("pointerleave", () => {
    hovering = false;
    run();
  });

  orbitBtn?.addEventListener("click", () => {
    pausedByUser = !pausedByUser;
    orbitBtn.setAttribute("aria-pressed", String(pausedByUser));
    orbitBtn.setAttribute("aria-label", pausedByUser ? "Play logo animation" : "Pause logo animation");
    orbitIcon?.setAttribute("href", pausedByUser ? "#i-play" : "#i-pause");
    run();
  });

  // Don't spend frames while the ring is off screen
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (!onScreen) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else run();
  }).observe(orbit);
}

/* ---------- Rocket scroll button ---------- */
const rocket = document.querySelector("[data-rocket]");
if (rocket) {
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const direction = () => (scrollY > maxScroll() / 2 ? "up" : "down");
  let busy = false;
  let ticking = false;

  const syncDirection = () => {
    const dir = direction();
    rocket.dataset.dir = dir;
    rocket.setAttribute("aria-label", dir === "up" ? "Scroll to top" : "Scroll to bottom");
  };
  syncDirection();
  addEventListener(
    "scroll",
    () => {
      if (busy || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        syncDirection();
        ticking = false;
      });
    },
    { passive: true },
  );

  rocket.addEventListener("click", () => {
    if (busy) return;
    const target = direction() === "up" ? 0 : maxScroll();
    if (reduceMotion.matches) {
      scrollTo({ top: target, behavior: "instant" });
      syncDirection();
      return;
    }
    busy = true;
    rocket.classList.add("is-launching");
    // lift off first, then the page follows
    setTimeout(() => scrollTo({ top: target, behavior: "smooth" }), 180);

    let done = false;
    const land = () => {
      if (done) return;
      done = true;
      removeEventListener("scrollend", land);
      rocket.classList.add("is-landing");
      rocket.classList.remove("is-launching");
      syncDirection();
      setTimeout(() => {
        rocket.classList.remove("is-landing");
        busy = false;
      }, 500);
    };
    setTimeout(() => addEventListener("scrollend", land, { once: true }), 200);
    setTimeout(land, 1600); // fallback for browsers without scrollend
  });
}

/* ---------- Footer year ---------- */
const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
