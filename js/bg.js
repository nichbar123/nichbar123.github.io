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
    background(BG);

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

    // Soft mouse glow (very subtle)
    noStroke();
    fill(accentRGB.r, accentRGB.g, accentRGB.b, 28);
    circle(mouseX, mouseY, 180);

    // ---- Cursor Trail ----

// Add current mouse position
    trail.push({ x: mouseX, y: mouseY });

// Keep trail length fixed
    if (trail.length > TRAIL_LENGTH) {
      trail.shift();
}

// Draw trail
    for (let i = 0; i < trail.length; i++) {
      const p = trail[i];
      const alpha = map(i, 0, trail.length, 10, 120);
      const size = map(i, 0, trail.length, 4, 14);

      noStroke();
      fill(accentRGB.r, accentRGB.g, accentRGB.b, alpha);
      circle(p.x, p.y, size);
}

  };

  window.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
  };
})();
