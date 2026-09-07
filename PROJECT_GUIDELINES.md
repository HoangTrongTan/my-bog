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
- **Slide-out Menu Drawer**: `.menu-bars` (`src/app/layouts/main-layout/main-layout.component.html`). Modern glassmorphism panel with glowing avatar header, active route highlighting, spring animation, and backdrop overlay click-to-close.
- **Home Social Pills & Avatar Anchor**: `.top-social` & `.box-img-avartar` (`src/app/views/home/home.component.html`). Dynamic flex sizing without clipping & locked center anchor grid for avatar image/border.
- **Canvas Weather Overlay**: `app-particle-weather` (`src/app/components/particle-weather`). HTML5 canvas particle renderer.
- **Custom Dynamic Cursor**: `app-custom-cursor` (`src/app/components/custom-cursor`). Elevated to **`z-[100000]`** with strict `pointer-events-none` so it sits above all modals without blocking input clicks.
- **Studio Customization Drawer**: `app-theme-character-selector` (`src/app/components/theme-character-selector`). Triggered via Right Sidebar glass column icon ("🎨 Tùy chỉnh Studio") and Avatar Dropdowns.
- **Lucky Fortune & Feedback Page**: `ExpressionComponent` (`/expression`). Interactive shaking bamboo fortune cylinder ("Linh Quẻ Cát Tường") + Wish & Feedback submission book.
- **Cloud & DevOps Knowledge Hub**: `TechKnowledgeComponent` (`/tech-knowledge`). Data source: `src/app/data/tech-knowledge.data.ts`. Filterable card grid & detail modal covering AWS VPC, EC2, DynamoDB, NAT Gateway, Security Groups, Internet Gateway, VPC Peering, Docker, Kubernetes, and ASP.NET Core / Angular deployment on AWS ECS Fargate.

---

## 🚀 5. Projects Stage Timeline & Career Spotlight
- Data source: `src/app/data/my-projects/projects-timeline.data.ts`.
- **Spotlight Company**: **Enterprise NAO** ([enterprisenao.com/vi](https://enterprisenao.com/vi)).
- **Featured Project**: **Landbase 360 - Bất động sản 360** (`landbase-web` at `E:\ID_PTS\ENAO\landbase-web`).
- **Tech Stack Badges**: Docker, Kubernetes (K8s), AWS, Angular 19, Micro-frontends, Web Audio API, Three.js / WebGL.

---

## 🤖 6. Centralized Gemini AI Architecture & Environment Security
All AI-powered features (Gen Z Hot Trends, Thần Số Học & Tử Vi, Rút Quẻ Cát Tường, CV AI Assistant) consume a **single centralized AI layer**:

- **Constants File**: `src/app/constants/ai.constants.ts` (Defines `GEMINI_AI_MODELS` fallback array and `GEMINI_API_BASE_URL`).
- **Utility Helpers**: `src/app/utils/ai.utils.ts`
  - `getGeminiApiUrl(model, apiKey, action)`: Assembles Gemini API URLs dynamically with model parameters.
  - `callGeminiAiApi(prompt, models)`: Executes API requests with automatic model fallback.
- **Config & Vercel API Key Resolution**: `src/app/configs/api.config.ts`
  - `getGeminiApiKey()`: Resolves `AUTH_API_KEY` injected at build-time by `scripts/set-env.js` on Vercel into `env.generated.ts`.
  - Re-exports all AI constants and utilities for 100% backward compatibility across services (`TrendService`, `FortuneService`, `ViewMyCvComponent`).

---

## 📰 7. New Pages & Interactive Features
- **🔥 Gen Z Trends Page (`/trends`)**:
  - Dynamic AI news generator via `TrendService` (`src/app/services/trend.service.ts`).
  - 24-hour `localStorage` cache (`genz_trends_ai_only_v4`).
  - TikTok-style particle heart burst animation on double-tap image or like button.
  - Filterable by 5 Regions (Vietnam, Asia/Douyin, Europe/US, LATAM, Global), 5 Platforms (TikTok, Douyin, Instagram, X/Threads, YouTube), and 5 Categories.
- **🏆 Honors & Awards Page (`/prizes`)**:
  - Highlights national/university software awards (`PrizesComponent` at `src/app/views/prizes/prizes.component.ts`).
  - Interactive glassmorphism detail modal dialogs.

---

## 📊 8. Google Apps Script Web App & Admin Sanctuary (`/expression` & `/admin-feedback`)
The Wish Book & Feedback system connects to a **Google Apps Script Web App Database** for persistent storage:

- **Public View (`/expression`)**: Clean view-only & submission interface. Deletion buttons are REMOVED from the public page to prevent unauthorized data removal.
- **Admin Sanctuary (`/admin-feedback`)**:
  - Accessible ONLY from the Header Avatar Dropdown Menu (NOT listed in the left sidebar menu).
  - **Password Protection**: Requires password `TrongTanDev` to unlock administrative capabilities.
  - **Admin Features**: Single item deletion, batch multi-selection deletion, live search & category/rating filters, CSV export, and statistical counters.
- **CRITICAL GOOGLE APPS SCRIPT CORS & REDIRECT REQUIREMENT**:
  All requests (GET/POST) sent to Google Apps Script Web App SHOULD specify `redirect: 'follow'`, and POST requests MUST use header `Content-Type: text/plain;charset=utf-8` and `JSON.stringify()` payload to handle 302 redirects cleanly and prevent browser preflight CORS OPTIONS failures.

---

## 🍲 10. Vòng Quay Đồ Ăn AI, Open-Meteo Weather Service & Lịch Ăn Tuần (`/food-wheel`)
The Food Wheel & Smart Meal Planner tool (`src/app/views/food-wheel/`) combines Open-Meteo live weather data, Gemini AI personalized menu generation, HTML5 2D Canvas wheel physics, and character theme adaptation:

- **Global Weather Service**: `src/app/services/weather.service.ts`
  - Fetches real-time Hanoi weather (Temp °C, Humidity %, Wind speed, Weather Code) via Open-Meteo API (`https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542...`).
  - Stores global weather state in Angular `signal<WeatherData>` accessible across the application.
- **AI Food Suggestion & Meal Planner Service**: `src/app/services/food-ai.service.ts`
  - Leverages `callGeminiAiApi` to analyze special events of today (holidays, weekend vibes, season) & current weather context to generate 10 optimal dishes + 7-day meal plan (Sáng, Trưa, Tối, Ăn vặt).
- **Mobile Responsiveness & Touch Physics**:
  - **Touch Gesture Physics**: Direct touch drag & flick controls (`touchstart`, `touchmove`, `touchend`) allowing mobile users to grab and spin/flick the wheel with finger/thumb.
  - **Mobile Day Filtering**: Quick day filter chip bar (T2..CN / Tất cả) for 7-day meal plan cards.
  - **Mobile Sticky Action Bar**: Bottom floating CTA bar on mobile screens with quick spin & sound toggle.
  - **Haptic Feedback**: Mobile vibration (`navigator.vibrate`) on slice ticks, spins, and fanfare wins.
- **Theme Adaptation**: Wheel pointer, outer glow, slice color palettes, and tick/fanfare audio synthesize dynamically according to `ThemeService.activeCharacterStyle()` (`CHARACTER_STYLES` in `src/app/configs/theme.ts`).

---

## 🔒 11. Critical Rules for Future AI Agents
1. **Light Mode High Contrast**: NEVER use hardcoded `#fff`, `#efeff1`, or white text colors without scoping or using `var(--text-primary)` / `body.light-mode` overrides. Light Mode text MUST ALWAYS render in high-contrast dark slate (`#0f172a`).
2. **Cursor Layering**: Custom cursor elements must keep `pointer-events-none` and high `z-index` so clicks pass through seamlessly to underlying UI components.
3. **Theme Service Compatibility**: Preserve signal getters/setters and legacy method signatures in `ThemeService` (`loadTheme()`, `getTheme()`, `setTheme()`, `getColorPreset()`).
4. **Mobile Navigation**: Keep studio customization triggers inside the top avatar dropdown on mobile to prevent blocking mobile bottom nav buttons.
5. **Centralized AI Service Calls**: NEVER call Gemini AI endpoints directly using ad-hoc `fetch()` loops. ALWAYS import and use `callGeminiAiApi(prompt)` or `getGeminiApiUrl(model)` from `src/app/configs/api.config` or `src/app/utils/ai.utils`.
6. **Google Apps Script Web App Calls**: ALWAYS set `redirect: 'follow'`, and for POST requests set `Content-Type: text/plain;charset=utf-8` with `JSON.stringify()` body to handle Google 302 redirects and avoid preflight CORS errors.
7. **Global Weather State**: ALWAYS access or update weather via `WeatherService.weatherSignal()` in `src/app/services/weather.service.ts`.
8. **Build Verification**: ALWAYS run `npm run build` using `run_command` after writing code to ensure 100% clean compilation.
