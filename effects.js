// effects.js

const canvas = document.getElementById('starCanvas');
if (!canvas) {
  throw new Error('Canvas element #starCanvas not found');
}

const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resizeCanvas);

const isMobile = window.innerWidth <= 768 || navigator.maxTouchPoints > 0;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const starCount = isMobile ? 45 : 120;
const streakRate = isMobile ? 1 : 4;
const palette = ['#ff7dd9', '#7ef0ff', '#ffe37a', '#ff8dd6', '#8de0ff'];

// ⭐ Twinkling stars
let stars = [];
for (let i = 0; i < starCount; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.7 + 0.6,
    alpha: Math.random(),
    delta: Math.random() * 0.018 + 0.006,
    color: palette[Math.floor(Math.random() * palette.length)]
  });
}

// 🌧️ Streaks
class Streak {
  constructor() {
    this.x = Math.random() * width;
    this.y = -60;
    this.length = Math.random() * 80 + 120;
    this.speed = Math.random() * 2.6 + 4.2;
    this.alpha = 1;
    this.fade = 0.007;
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.y += this.speed;
    this.alpha -= this.fade;
  }
  draw() {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.length);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  alive() {
    return this.alpha > 0 && this.y < height + this.length;
  }
}

const streaks = [];

// 💥 Particles
class Particle {
  constructor(x, y, color) {
    const a = Math.random() * Math.PI * 2;
    const s = (isMobile ? 1.8 : 4) + Math.random() * (isMobile ? 1.1 : 2.5);
    this.x = x;
    this.y = y;
    this.vx = Math.cos(a) * s;
    this.vy = Math.sin(a) * s;
    this.alpha = 1;
    this.size = Math.random() * (isMobile ? 1.6 : 3) + (isMobile ? 1.4 : 2.6);
    this.color = color || palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.vy += 0.03;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.015;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  alive() {
    return this.alpha > 0;
  }
}

const textParticles = [];
const fontStyle = 'bold 64px "Segoe UI", sans-serif';
const textColor = '#aaffff';
let textQueue = [
  "🎉 Happy Birthday 🎉",
  "Huỳnh Thị Thùy Lâm (Mie)",
  "📅 16/07/2026",
  "🎂 18 tuổi",
  "Chúc mừng sinh nhật!",
  "Hạnh phúc và thành công!"
];
let explodeStarted = false;
let currentTextIndex = 0;
let explodeCooldown = 0;

function explodeText(txt) {
  if (isMobile || isReducedMotion) return;

  const off = document.createElement('canvas');
  const tctx = off.getContext('2d');
  tctx.font = fontStyle;
  const m = tctx.measureText(txt);
  off.width = m.width;
  off.height = 120;
  tctx.font = fontStyle;
  tctx.fillStyle = '#fff';
  tctx.fillText(txt, 0, 90);
  const img = tctx.getImageData(0, 0, off.width, off.height).data;
  for (let y = 0; y < off.height; y += 6) {
    for (let x = 0; x < off.width; x += 6) {
      const i = (y * off.width + x) * 4 + 3;
      if (img[i] > 128) {
        const px = canvas.width / 2 - off.width / 2 + x;
        const py = canvas.height / 2 - off.height / 2 + y;
        textParticles.push(new Particle(px, py, textColor));
      }
    }
  }
  explodeCooldown = 150; // frames to wait before showing next
}

// 💖 Heart
let heartAlpha = 0;
let heartPulse = 0;
function drawHeart(cx, cy, size, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size, size);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ff669a';
  ctx.shadowColor = '#ff66c4';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.moveTo(0, 0.3);
  ctx.bezierCurveTo(0, -0.3, -0.5, -0.3, -0.5, 0.1);
  ctx.bezierCurveTo(-0.5, 0.6, 0, 0.9, 0, 1);
  ctx.bezierCurveTo(0, 0.9, 0.5, 0.6, 0.5, 0.1);
  ctx.bezierCurveTo(0.5, -0.3, 0, -0.3, 0, 0.3);
  ctx.closePath();
  ctx.shadowColor = '#ff66c4';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#19001d');
  bg.addColorStop(0.45, 'rgba(53, 20, 100, 0.85)');
  bg.addColorStop(1, '#21062a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 💡 Soft sparkle overlay
  if (Math.random() < 0.045) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  stars.forEach(star => {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;
    ctx.beginPath();
    ctx.globalAlpha = 0.6 + star.alpha * 0.4;
    ctx.fillStyle = star.color;
    ctx.shadowColor = star.color;
    ctx.shadowBlur = 14;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  for (let i = 0; i < streakRate; i++) {
    if (Math.random() < 0.8) streaks.push(new Streak());
  }
  streaks.forEach(s => { s.update(); s.draw(); });
  for (let i = streaks.length - 1; i >= 0; i--) {
    if (!streaks[i].alive()) streaks.splice(i, 1);
  }

  textParticles.forEach(p => { p.update(); p.draw(); });
  for (let i = textParticles.length - 1; i >= 0; i--) {
    if (!textParticles[i].alive()) textParticles.splice(i, 1);
  }

  if (textParticles.length === 0 && explodeCooldown <= 0 && currentTextIndex < textQueue.length) {
    explodeText(textQueue[currentTextIndex]);
    currentTextIndex++;
  }

  if (explodeCooldown > 0) explodeCooldown--;

  if (currentTextIndex >= textQueue.length && textParticles.length === 0) {
    heartAlpha = Math.min(1, heartAlpha + 0.012);
    heartPulse += 0.06;
    const scale = 0.14 + Math.sin(heartPulse) * 0.006;
    drawHeart(width / 2, height * 0.82, scale, heartAlpha);
  }

  requestAnimationFrame(animate);
}

let animationStarted = false;
function startAnimation() {
  if (animationStarted) return;
  animationStarted = true;
  animate();
}

window.addEventListener('load', startAnimation);
window.startStarAnimation = startAnimation;
