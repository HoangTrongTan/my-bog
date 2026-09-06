import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife?: number;
  life?: number;
}

@Component({
  selector: 'app-particle-weather',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #particleCanvas class="fixed inset-0 pointer-events-none z-[1] w-full h-full"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: none;
    }
  `]
})
export class ParticleWeatherComponent implements OnInit, OnDestroy {
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private themeService = inject(ThemeService);
  private ctx!: CanvasRenderingContext2D;
  private animId: number = 0;
  private weatherParticles: Particle[] = [];
  private mouseParticles: Particle[] = [];
  private mouseX = -100;
  private mouseY = -100;

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initWeatherParticles();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
    this.initWeatherParticles();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // Spawn mouse trail particles based on active character style
    const style = this.themeService.activeCharacterStyle();
    const count = 2;
    for (let i = 0; i < count; i++) {
      let color = 'rgba(0, 243, 255, 0.8)';
      if (style === 'style-ninja') color = 'rgba(239, 68, 68, 0.9)';
      else if (style === 'style-robot') color = 'rgba(6, 182, 212, 0.9)';
      else if (style === 'style-quantum') color = 'rgba(168, 85, 247, 0.9)';
      else if (style === 'style-quan-van-truong') color = 'rgba(16, 185, 129, 0.9)';
      else if (style === 'style-cosmic') color = 'rgba(236, 72, 153, 0.9)';

      this.mouseParticles.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 30 + 20
      });
    }
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initWeatherParticles() {
    this.weatherParticles = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = Math.floor((width * height) / 18000);

    for (let i = 0; i < count; i++) {
      this.weatherParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 3 + 1,
        color: '#ffffff',
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  }

  private animate = () => {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width;
    const height = canvas.height;
    const mode = this.themeService.activeWeatherMode();

    this.ctx.clearRect(0, 0, width, height);

    // 1. Draw Weather Particles
    if (mode !== 'off') {
      for (const p of this.weatherParticles) {
        if (mode === 'snow') {
          p.y += p.vy * 0.8;
          p.x += Math.sin(p.y * 0.01) * 0.5;
          p.color = 'rgba(255, 255, 255, 0.85)';
          p.size = p.size > 4 ? 3 : p.size;
        } else if (mode === 'rain') {
          p.y += p.vy * 4;
          p.x += 0.3;
          p.color = 'rgba(0, 243, 255, 0.6)';
        } else if (mode === 'sun') {
          p.y -= p.vy * 0.3;
          p.x += Math.cos(p.y * 0.02) * 0.4;
          p.color = 'rgba(254, 240, 138, 0.7)';
        } else if (mode === 'stardust') {
          p.x += (Math.random() - 0.5) * 0.4;
          p.y += (Math.random() - 0.5) * 0.4;
          p.color = 'rgba(236, 72, 153, 0.8)';
        }

        // Wrap around canvas screen
        if (p.y > height) p.y = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        // Render particle
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;

        if (mode === 'rain') {
          // Streak line
          this.ctx.strokeStyle = p.color;
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p.x - 1, p.y + p.size * 6);
          this.ctx.stroke();
        } else {
          // Circle dot
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }
    }

    // 2. Draw Sunbeams if sun mode is active
    if (mode === 'sun') {
      this.ctx.save();
      const grad = this.ctx.createRadialGradient(width * 0.85, 0, 10, width * 0.85, 0, width * 0.6);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();
    }

    // 3. Draw Mouse Trail Particles
    for (let i = this.mouseParticles.length - 1; i >= 0; i--) {
      const p = this.mouseParticles[i];
      p.life = (p.life || 0) + 1;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha = 1 - (p.life / (p.maxLife || 30));

      if (p.life >= (p.maxLife || 30)) {
        this.mouseParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * (1 - p.life / (p.maxLife || 30)), 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(this.animate);
  };
}
