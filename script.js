"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Matrix background */
const canvas = document.querySelector("#matrix");
const context = canvas?.getContext("2d");
const characters = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;
let drops = [];
let previousFrame = 0;

function resizeMatrix() {
  if (!canvas || !context) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  drops = Array.from(
    { length: Math.ceil(window.innerWidth / fontSize) },
    () => Math.random() * -60,
  );
}

function drawMatrix(timestamp = 0) {
  if (!canvas || !context || reducedMotion.matches) return;

  if (timestamp - previousFrame > 75) {
    context.fillStyle = "rgba(4, 7, 6, 0.12)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "#82f746";
    context.font = `${fontSize}px ui-monospace, monospace`;

    drops.forEach((position, index) => {
      const character = characters[Math.floor(Math.random() * characters.length)];
      context.fillText(character, index * fontSize, position * fontSize);
      drops[index] =
        position * fontSize > window.innerHeight && Math.random() > 0.975
          ? 0
          : position + 1;
    });

    previousFrame = timestamp;
  }

  window.requestAnimationFrame(drawMatrix);
}

resizeMatrix();
if (!reducedMotion.matches) {
  window.requestAnimationFrame(drawMatrix);
}
window.addEventListener("resize", resizeMatrix);

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

/* Only the seven requested page titles are revealed on scroll. */
const animatedTitles = document.querySelectorAll(".title-animate");

animatedTitles.forEach((title) => {
  const delay = Number.parseInt(title.dataset.titleDelay || "0", 10);
  title.style.setProperty("--title-delay", `${Number.isNaN(delay) ? 0 : delay}ms`);
});

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  animatedTitles.forEach((title) => title.classList.add("title-visible"));
} else {
  const titleObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("title-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  animatedTitles.forEach((title) => titleObserver.observe(title));
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
