interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
}

const COLORS = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#38bdf8'];

/**
 * Self-contained confetti celebration effect for the food wheel's win screen.
 * Extracted out of FoodWheelComponent so the wheel component doesn't also
 * own a second animation-loop's worth of particle physics.
 */
export class ConfettiEffect {
  private particles: ConfettiParticle[] = [];
  private animFrameId: number | null = null;

  /** Cancels any running animation. Call on component destroy to avoid leaking a RAF loop. */
  public destroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public launch(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    this.particles = [];
    for (let i = 0; i < 90; i++) {
      this.particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 14,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        radius: Math.random() * 5 + 3,
        alpha: 1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (const p of this.particles) {
        if (p.alpha <= 0) continue;
        aliveCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= 0.015;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
      }

      if (aliveCount > 0) {
        this.animFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.animFrameId = null;
      }
    };

    this.destroy();
    this.animFrameId = requestAnimationFrame(render);
  }
}
