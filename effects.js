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

// ⭐ Twinkling stars
let stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random(),
    delta: Math.random() * 0.02 + 0.005,
  });
}

// 🌧️ Streaks
class Streak {
  constructor() {
    this.x = Math.random() * width;
    this.y = -60;
    this.length = Math.random() * 80 + 120;
    this.speed = Math.random() * 3 + 4;
    this.alpha = 1;
    this.fade = 0.006;
    this.color = '#cc66ff';
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
    const s = Math.random() * 4 + 2;
    this.x = x;
    this.y = y;
    this.vx = Math.cos(a) * s;
    this.vy = Math.sin(a) * s;
    this.alpha = 1;
    this.size = Math.random() * 2 + 2;
    this.color = color;
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
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // 💡 Neon flicker overlay
  if (Math.random() < 0.05) {
    ctx.fillStyle = 'rgba(0,255,255,0.03)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  stars.forEach(star => {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;
    ctx.beginPath();
    ctx.globalAlpha = star.alpha;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  for (let i = 0; i < 6; i++) {
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
    heartAlpha += 0.01;
    heartPulse += 0.05;
    const scale = 0.12 + Math.sin(heartPulse) * 0.005;
    drawHeart(width / 2, height * 0.8, scale, heartAlpha);
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
