const progressBar = document.querySelector("#progressBar");
const frames = [...document.querySelectorAll(".frame")];
const navLinks = [...document.querySelectorAll("[data-link]")];
const revealEls = [...document.querySelectorAll(".reveal")];

frames.forEach((frame) => {
  [...frame.querySelectorAll(".reveal")].forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 110, 330)}ms`;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const frameObserver = new IntersectionObserver(
  (entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    const id = active.target.id;
    document.body.dataset.frame = active.target.dataset.frame || id;
    frames.forEach((frame) => frame.classList.toggle("active-frame", frame === active.target));
    navLinks.forEach((link) => link.classList.toggle("active", link.dataset.link === id));
  },
  { threshold: [0.34, 0.5, 0.66] }
);

frames.forEach((frame) => frameObserver.observe(frame));
if (frames[0]) frames[0].classList.add("active-frame");

function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const amount = total <= 0 ? 0 : window.scrollY / total;
  progressBar.style.width = `${Math.min(100, Math.max(0, amount * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const canvas = document.querySelector("#grainCanvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from({ length: width < 760 ? 38 : 72 }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1 + Math.random() * 2.4,
    speed: 0.14 + Math.random() * 0.42,
    phase: index * 0.41,
  }));
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawBean(x, y, size, angle, colorA, colorB) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const gradient = ctx.createRadialGradient(-size * 0.24, -size * 0.28, 2, 0, 0, size);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.72, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(245, 242, 234, 0.34)";
  ctx.lineWidth = Math.max(1.5, size * 0.05);
  ctx.beginPath();
  ctx.moveTo(-size * 0.1, -size * 0.76);
  ctx.bezierCurveTo(size * 0.24, -size * 0.28, -size * 0.22, size * 0.18, size * 0.1, size * 0.76);
  ctx.stroke();
  ctx.restore();
}

function scrollRatio() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  return total <= 0 ? 0 : window.scrollY / total;
}

function animate(time) {
  ctx.clearRect(0, 0, width, height);
  const ratio = scrollRatio();

  particles.forEach((p) => {
    p.y += p.speed;
    if (p.y > height + 8) p.y = -8;
    const alpha = 0.18 + Math.sin(time * 0.001 + p.phase) * 0.08;
    ctx.fillStyle = `rgba(215, 168, 79, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x + Math.sin(time * 0.0008 + p.phase) * 18, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  const x = width * (0.2 + 0.62 * Math.sin(ratio * Math.PI * 1.2) ** 2);
  const y = height * (0.18 + 0.64 * ((ratio * 8) % 1));
  const palette = [
    ["#d7a84f", "#704228"],
    ["#a7d8b6", "#2f5644"],
    ["#d86b5d", "#5a2622"],
    ["#7aa7ff", "#273d65"],
  ][Math.floor(ratio * 8) % 4];

  drawBean(x, y, 32 + Math.sin(time * 0.002) * 4, ratio * Math.PI * 7, palette[0], palette[1]);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
