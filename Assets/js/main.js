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
  menu?.classList.toggle("hidden", !open);
}

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
  } catch {
    setStatus(`Something went wrong. Please email me directly at ${EMAIL}.`, "error");
  } finally {
    submit.disabled = false;
  }
});

/* ---------- Skills logo ring: pause / play ---------- */
const orbit = document.querySelector("[data-orbit]");
const orbitBtn = orbit?.querySelector("[data-orbit-toggle]");
orbitBtn?.addEventListener("click", () => {
  const paused = orbit.toggleAttribute("data-paused");
  orbitBtn.setAttribute("aria-pressed", String(paused));
  orbitBtn.textContent = paused ? "Play animation" : "Pause animation";
});

/* ---------- Footer year ---------- */
const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
