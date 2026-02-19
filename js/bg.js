// js/bg.js
(() => {
  // Pull your CSS variables so the sketch matches your theme
  const css = getComputedStyle(document.documentElement);
  const BG = css.getPropertyValue("--bg").trim() || "#0b1220";
  const ACCENT = css.getPropertyValue("--accent").trim() || "#3b82f6";
  const MUTED = css.getPropertyValue("--muted").trim() || "#b7c6e6";

  // Cursor trail
  const trail = [];
  const TRAIL_LENGTH = 18;

  
  const dots = [];
  const DOT_COUNT = 90;

  // Rocket trail particles
  const particles = [];
  let cursorX = 0;
  let cursorY = 0;


  function hexToRgb(hex) {
    const h = hex.replace("#", "").trim();
    if (h.length !== 6) return { r: 59, g: 130, b: 246 };
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  const accentRGB = hexToRgb(ACCENT);
  const mutedRGB = hexToRgb(MUTED);

  window.setup = function () {
    noCursor();
    // Create and tag the canvas so we can style it reliably in CSS
    const c = createCanvas(windowWidth, windowHeight);
    c.id("bg-canvas");

    // Slightly reduce load on high-refresh displays
    frameRate(60);

    // Seed dots
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: random(width),
        y: random(height),
        vx: random(-0.35, 0.35),
        vy: random(-0.35, 0.35),
        r: random(1.2, 2.6),
      });
    }
  };

  window.draw = function () {
    // Background (p5 can parse hex colors)
    clear();
    

    // Subtle “constellation” lines + dots
    noFill();

    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];

      // Move + bounce
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > width) a.vx *= -1;
      if (a.y < 0 || a.y > height) a.vy *= -1;

      // Dot
      noStroke();
      fill(mutedRGB.r, mutedRGB.g, mutedRGB.b, 170);
      circle(a.x, a.y, a.r * 2);

      // Lines to nearby dots
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const d = dist(a.x, a.y, b.x, b.y);
        if (d < 120) {
          stroke(accentRGB.r, accentRGB.g, accentRGB.b, map(d, 0, 120, 90, 0));
          line(a.x, a.y, b.x, b.y);
        }
      }
    }

// ---- Rocket Cursor ----

// Store previous position for angle calculation
let dx = mouseX - cursorX;
let dy = mouseY - cursorY;

// Smooth motion
cursorX = lerp(cursorX, mouseX, 0.25);
cursorY = lerp(cursorY, mouseY, 0.25);

// Calculate angle of movement
let angle = atan2(dy, dx);

// Draw rotated rocket
push();
translate(cursorX, cursorY);
rotate(angle + PI); // adjust so rocket points forward
textAlign(CENTER, CENTER);
textSize(28);
text("🚀", 0, 0);
pop();

// Emit flame particles opposite movement direction
for (let i = 0; i < 2; i++) {
  particles.push({
    x: cursorX,
    y: cursorY,
    vx: -cos(angle) * random(1, 2) + random(-0.5, 0.5),
    vy: -sin(angle) * random(1, 2) + random(-0.5, 0.5),
    size: random(4, 9),
    life: 255
  });
}

// Update + draw particles
for (let i = particles.length - 1; i >= 0; i--) {
  let p = particles[i];

  p.x += p.vx;
  p.y += p.vy;
  p.life -= 7;

  // Flame gradient
  let r = 255;
  let g = map(p.life, 0, 255, 0, 200);
  let b = 0;

  noStroke();
  fill(r, g, b, p.life);
  ellipse(p.x, p.y, p.size);

  if (p.life <= 0) {
    particles.splice(i, 1);
  }
}


  };

  window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
  };
})();
