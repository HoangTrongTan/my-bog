# 📐 PROJECT GUIDELINES & DESIGN SYSTEM SPECIFICATIONS
> **IMPORTANT FOR ALL FUTURE AI AGENTS & DEVELOPERS**: Read this document before making any code edits or feature additions to `personal-profile-angular`. Do not alter or break the established architecture, CSS custom variables, character themes, or component structures documented here.

---

## 🎨 1. Core Architecture & Styling Stack
- **Framework**: Angular 19 (Standalone Components, Signals, RxJS).
- **Styling Engines**: **Tailwind CSS v3** + **SCSS Design Tokens** + **Angular Material** + **Angular CDK**.
- **Global Stylesheet**: `src/styles.scss` (Imports `@tailwind base; @tailwind components; @tailwind utilities;` and Sass modules `@use "./app/styles/index"`).
- **Theme Tokens File**: `src/app/styles/_theme.scss` (Defines CSS variables for `:root`, `body.light-mode`, 5 Color Presets, and 5 Character Styles).
- **Audio Soundscape Engine**: `AudioService` (`src/app/services/audio.service.ts`) powering Web Audio API synthesizers for ambient BGM & UI sound effects.

---

## 🌈 2. CSS Custom Variables & Design Tokens
Always use CSS variables for theme consistency across components:
- `--bg-page`: Main body background color.
- `--bg-card`: Glassmorphism card background (`rgba(...)`).
- `--bg-card-hover`: Elevated card hover background.
- `--text-primary`: Primary body text color (`#f3f4f6` in Dark Mode, `#0f172a` in Light Mode).
- `--text-secondary`: Muted secondary text color (`#9ca3af` in Dark Mode, `#475569` in Light Mode).
- `--accent-color`: Main theme accent color (dynamically updated by active color preset).
- `--accent-secondary`: Secondary gradient accent color.
- `--glow-color`: Box shadow RGBA glow color.
- `--border-color`: Glass border color.
- `--cursor-trail-color`: Particle mouse trail color.

---

## 🎭 3. Character Presets & Theme Engine
The application supports 5 Character Style Presets managed by `ThemeService` (`src/app/services/theme.service.ts`):

1. **🥷 Ninja / Shadow Shinobi** (`style-ninja`):
   - Kunai cursor, crimson glowing smoke, red accent (`#ef4444`).
   - Loader: Rotating Kunai Shuriken with crimson shadow trail.
   - Fortune Modal: Crimson Shinobi Scroll.
2. **🤖 Robot / Sci-Fi Mecha** (`style-robot`):
   - Laser crosshair cursor, digital grid particles, cyan accent (`#06b6d4`).
   - Loader: Cyberpunk HUD scanning ring with rotating radar sweep.
   - Fortune Modal: Cyber Scanner HUD.
3. **⚡ High-Tech / Quantum Code** (`style-quantum`):
   - Hologram diamond cursor, binary code stream, purple accent (`#a855f7`).
   - Loader: Quantum Matrix Code cube with floating code particles.
   - Fortune Modal: Quantum Holo-Grid.
4. **🐉 Quan Vân Trường / Võ Thượng Tướng** (`style-quan-van-truong`):
   - Thanh Long Yển Nguyệt Đao cursor, dragon flame aura, emerald & gold accents (`#10b981`).
   - Loader: Bát Quái Đồ Flame Spinner with dragon aura.
   - Fortune Modal: Bát Quái Dragon Blade scroll.
5. **🌌 Cosmic / Galaxy Explorer** (`style-cosmic`):
   - Star portal cursor, stardust particles, galaxy pink accent (`#ec4899`).
   - Loader: Stardust Galaxy Constellation Portal spinner.
   - Fortune Modal: Cosmic Stardust Portal.

### 🎨 5 Custom Color Presets
Switchable in real time via dynamic root inline style overrides (`ThemeService.setColorPreset()`):
- `preset-cyberpunk`: Cyan `#00f3ff` & Pink `#ff007f`.
- `preset-emerald`: Emerald `#10b981` & Mint `#34d399`.
- `preset-sunset`: Rose `#f43f5e` & Orange `#fb923c`.
- `preset-sapphire`: Sapphire `#3b82f6` & Violet `#8b5cf6`.
- `preset-solar`: Solar Gold `#eab308` & Orange `#f97316`.

### 🌧️ 4 Weather Overlay Modes
Canvas particle weather system controlled by `ParticleWeatherComponent`:
- `snow`: Floating snowfall particles with mouse wind influence.
- `rain`: Raindrops with splash effects.
- `sun`: Solar light flares with warm ambient glow.
- `stardust`: Orbiting cosmic stardust particles with mouse spark trails.

---

## 🤹 4. Key Interactive Components & Layout Architecture
- **Canvas Weather Overlay**: `app-particle-weather` (`src/app/components/particle-weather`). HTML5 canvas particle renderer.
- **Custom Dynamic Cursor**: `app-custom-cursor` (`src/app/components/custom-cursor`). Elevated to **`z-[100000]`** with strict `pointer-events-none` so it sits above all modals without blocking input clicks.
- **Studio Customization Drawer**: `app-theme-character-selector` (`src/app/components/theme-character-selector`). Triggered via Right Sidebar glass column icon ("🎨 Tùy chỉnh Studio") and Avatar Dropdowns. Floating bottom-right button removed for clean screen layout.
- **Draggable Menu Sidebar**: `LeftSidebarComponent` (`src/app/layouts/main-layout/left-sidebar`). Reorderable navigation items powered by Angular CDK (`@angular/cdk/drag-drop`).
- **Matching Right Glass Column**: `RightSidebarComponent` (`src/app/layouts/main-layout/right-sidebar`). Vertical glass card column (`w-[100px] h-full`) matching Left Sidebar aesthetic with quick action tooltips.
- **AI Fortune Oracle Modal**: `app-fortune-modal` (`src/app/components/fortune-modal`). Powered by `FortuneService` using Gemini API (`gemini-2.0-flash`) with Pythagorean Numerology fallback.
- **Mobile Bottom Navigation**: `app-mobile-bottom-nav` (`src/app/components/mobile-bottom-nav`). Fixed 5-button bottom navbar for mobile screens (`< 768px`).
- **Character-Adaptive Loader**: `app-loader` (`src/app/components/loader.ts`). Dynamically renders spinners matching the active character style.

---

## 🚀 5. Projects Stage Timeline & Career Spotlight
- Data source: `src/app/data/my-projects/projects-timeline.data.ts`.
- **Spotlight Company**: **Enterprise NAO** ([enterprisenao.com/vi](https://enterprisenao.com/vi)).
- **Featured Project**: **Landbase 360 - Bất động sản 360** (`landbase-web` at `E:\ID_PTS\ENAO\landbase-web`).
- **Tech Stack Badges**: Docker, Kubernetes (K8s), AWS, Angular 19, Micro-frontends, Web Audio API, Three.js / WebGL.

---

## 🔒 6. Critical Rules for Future AI Agents
1. **Light Mode High Contrast**: NEVER use hardcoded `#fff`, `#efeff1`, or white text colors without scoping or using `var(--text-primary)` / `body.light-mode` overrides. Light Mode text MUST ALWAYS render in high-contrast dark slate (`#0f172a`).
2. **Cursor Layering**: Custom cursor elements must keep `pointer-events-none` and high `z-index` so clicks pass through seamlessly to underlying UI components.
3. **Theme Service Compatibility**: Preserve signal getters/setters and legacy method signatures in `ThemeService` (`loadTheme()`, `getTheme()`, `setTheme()`, `getColorPreset()`).
4. **Mobile Navigation**: Keep studio customization triggers inside the top avatar dropdown on mobile to prevent blocking mobile bottom nav buttons.
5. **Build Verification**: ALWAYS run `npm run build` using `run_command` after writing code to ensure 100% clean compilation.
