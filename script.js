"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Matrix background */
const canvas = document.querySelector("#matrix");
const context = canvas?.getContext("2d");
const characters = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;
let drops = [];

let matrixTimer;

function randomGlyph() {
  return characters[Math.floor(Math.random() * characters.length)];
}

function resizeMatrix() {
  if (!context) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.font = `${fontSize}px ui-monospace, monospace`;

  const rows = Math.ceil(height / fontSize);
  drops = Array.from({ length: Math.ceil(width / fontSize) }, (_, col) => {
    const head = Math.floor(Math.random() * (rows + 12)) - 8;
    for (let tail = 6; tail >= 0; tail--) {
      context.fillStyle = `rgba(130,247,70,${(7 - tail) / 9})`;
      context.fillText(randomGlyph(), col * fontSize, (head - tail) * fontSize);
    }
    return head + 1;
  });
}

function drawMatrix() {
  context.fillStyle = "rgba(4, 7, 6, 0.16)";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context.fillStyle = "#86f54f";
  drops.forEach((row, col) => {
    context.fillText(randomGlyph(), col * fontSize, row * fontSize);
    drops[col] = row * fontSize > window.innerHeight ? -Math.floor(Math.random() * 25) : row + 1;
  });
}

function syncMatrix() {
  clearInterval(matrixTimer);
  if (context && !document.hidden && !reducedMotion.matches) {
    matrixTimer = setInterval(drawMatrix, 90);
  }
}

resizeMatrix();
syncMatrix();
window.addEventListener("resize", resizeMatrix);
document.addEventListener("visibilitychange", syncMatrix);
reducedMotion.addEventListener("change", syncMatrix);

/* Mobile navigation */
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");

function closeNavigation() {
  if (!toggle || !nav) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeNavigation();
    }
  });
}

// Keep each heading's original reveal and bring its terminal prompt in with it.
const titles = document.querySelectorAll(".title-animate");
const panels = document.querySelectorAll([
  ".instrument", ".about-copy", ".identity-card", ".role-card", ".highlights",
  ".skill-card", ".project-card", ".certificate-feature", ".credential-card",
  ".achievement-card", ".htb-profile-card", ".contact-terminal",
].join(","));

function reveal(entry) {
  if (entry.classList.contains("title-animate")) {
    entry.classList.add("title-visible");
    entry.closest("section").querySelector(".eyebrow").classList.add("prompt-visible");
  } else {
    entry.classList.add("panel-visible");
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal(entry.target);
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px 0px 0px", threshold: 0 });
  for (const element of [...titles, ...panels]) observer.observe(element);
} else {
  titles.forEach(reveal);
}

/* Active navigation state */
const navLinks = [...document.querySelectorAll("#primary-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
      threshold: [0.01, 0.2, 0.5],
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const year = document.querySelector("#year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}
