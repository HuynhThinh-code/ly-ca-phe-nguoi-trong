const progressBar = document.querySelector("#progressBar");
const sceneLinks = [...document.querySelectorAll("[data-nav]")];
const scenes = [...document.querySelectorAll(".scene")];
const revealEls = [...document.querySelectorAll(".reveal")];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const sceneObserver = new IntersectionObserver(
  (entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    const scene = active.target.dataset.scene;
    document.body.dataset.scene = scene;
    sceneLinks.forEach((link) => link.classList.toggle("active", link.dataset.nav === scene));
  },
  { threshold: [0.36, 0.52, 0.68] }
);

scenes.forEach((scene) => sceneObserver.observe(scene));

function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const amount = total <= 0 ? 0 : window.scrollY / total;
  progressBar.style.width = `${Math.min(100, Math.max(0, amount * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const cupPrice = document.querySelector("#cupPrice");
const grams = document.querySelector("#grams");
const cupsOut = document.querySelector("#cupsOut");
const revenueOut = document.querySelector("#revenueOut");

function formatMillion(value) {
  const million = value / 1_000_000;
  return `${million.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
}

function updateCalculator() {
  const roastedGrams = 1000 * 0.82;
  const cups = Math.floor(roastedGrams / Number(grams.value));
  const revenue = cups * Number(cupPrice.value);
  cupsOut.textContent = `${cups} ly`;
  revenueOut.textContent = formatMillion(revenue);
}

[cupPrice, grams].forEach((input) => input.addEventListener("input", updateCalculator));
updateCalculator();

const beanCanvas = document.querySelector("#beanCanvas");
const beanCtx = beanCanvas.getContext("2d");
const stormCanvas = document.querySelector("#stormCanvas");
const stormCtx = stormCanvas.getContext("2d");
let width = 0;
let height = 0;
let stormWidth = 0;
let stormHeight = 0;
let particles = [];

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  beanCanvas.width = width * dpr;
  beanCanvas.height = height * dpr;
  beanCanvas.style.width = `${width}px`;
  beanCanvas.style.height = `${height}px`;
  beanCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const stormRect = stormCanvas.getBoundingClientRect();
  stormWidth = Math.max(1, stormRect.width);
  stormHeight = Math.max(1, stormRect.height);
  stormCanvas.width = stormWidth * dpr;
  stormCanvas.height = stormHeight * dpr;
  stormCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  particles = Array.from({ length: width < 760 ? 44 : 86 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1 + Math.random() * 2.6,
    speed: 0.2 + Math.random() * 0.55,
    phase: i * 0.37,
  }));
}

window.addEventListener("resize", resize);
resize();

function currentScrollRatio() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  return total <= 0 ? 0 : window.scrollY / total;
}

function drawBean(ctx, x, y, size, angle, colorA, colorB, crease = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const gradient = ctx.createRadialGradient(-size * 0.2, -size * 0.24, 2, 0, 0, size);
  gradient.addColorStop(0, colorA);
  gradient.addColorStop(1, colorB);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.74, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
  ctx.shadowBlur = 20;
  if (crease) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 242, 214, 0.42)";
    ctx.lineWidth = Math.max(2, size * 0.05);
    ctx.beginPath();
    ctx.moveTo(-size * 0.12, -size * 0.8);
    ctx.bezierCurveTo(size * 0.24, -size * 0.34, -size * 0.26, size * 0.22, size * 0.12, size * 0.78);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackground(time) {
  beanCtx.clearRect(0, 0, width, height);
  const scroll = currentScrollRatio();

  particles.forEach((p) => {
    p.y += p.speed;
    if (p.y > height + 8) p.y = -8;
    const shimmer = 0.3 + Math.sin(time * 0.001 + p.phase) * 0.18;
    beanCtx.fillStyle = `rgba(244, 203, 115, ${shimmer})`;
    beanCtx.beginPath();
    beanCtx.arc(p.x + Math.sin(time * 0.0007 + p.phase) * 16, p.y, p.r, 0, Math.PI * 2);
    beanCtx.fill();
  });

  const pathX = width * (0.18 + 0.64 * Math.sin(scroll * Math.PI * 1.15) ** 2);
  const pathY = height * (0.18 + 0.66 * ((scroll * 11) % 1));
  const phase = Math.floor(scroll * 11);
  const colors = [
    ["#efb95e", "#7e2b20"],
    ["#d84b42", "#6e201b"],
    ["#d59b43", "#3b1a11"],
    ["#8f5a32", "#24150f"],
    ["#63b36f", "#1f4c35"],
  ][phase % 5];

  beanCtx.globalAlpha = 0.94;
  drawBean(beanCtx, pathX, pathY, 36 + Math.sin(time * 0.002) * 4, scroll * Math.PI * 8, colors[0], colors[1]);
  beanCtx.globalAlpha = 1;

  beanCtx.strokeStyle = "rgba(255, 242, 214, 0.12)";
  beanCtx.lineWidth = 1.2;
  beanCtx.beginPath();
  for (let i = 0; i <= 140; i += 1) {
    const t = i / 140;
    const x = width * (0.15 + 0.7 * Math.sin(t * Math.PI * 1.15) ** 2);
    const y = height * (0.12 + 0.76 * t);
    if (i === 0) beanCtx.moveTo(x, y);
    else beanCtx.lineTo(x, y);
  }
  beanCtx.stroke();
}

function drawStorm(time) {
  if (!stormWidth || !stormHeight) return;
  stormCtx.clearRect(0, 0, stormWidth, stormHeight);
  const gradient = stormCtx.createLinearGradient(0, 0, stormWidth, stormHeight);
  gradient.addColorStop(0, "rgba(216, 75, 66, 0.16)");
  gradient.addColorStop(1, "rgba(99, 179, 111, 0.08)");
  stormCtx.fillStyle = gradient;
  stormCtx.fillRect(0, 0, stormWidth, stormHeight);

  stormCtx.strokeStyle = "rgba(244, 203, 115, 0.84)";
  stormCtx.lineWidth = 3;
  stormCtx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const t = i / 120;
    const x = t * stormWidth;
    const wave = Math.sin(t * 18 + time * 0.002) * 34 + Math.sin(t * 43) * 16;
    const trend = stormHeight * (0.34 + t * 0.24);
    const y = trend + wave;
    if (i === 0) stormCtx.moveTo(x, y);
    else stormCtx.lineTo(x, y);
  }
  stormCtx.stroke();

  stormCtx.strokeStyle = "rgba(255, 242, 214, 0.28)";
  stormCtx.lineWidth = 1;
  for (let i = 0; i < 12; i += 1) {
    const x = ((time * 0.04 + i * 97) % (stormWidth + 120)) - 60;
    stormCtx.beginPath();
    stormCtx.moveTo(x, 0);
    stormCtx.lineTo(x - 80, stormHeight);
    stormCtx.stroke();
  }
}

function animate(time) {
  drawBackground(time);
  drawStorm(time);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
