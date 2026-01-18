# 750wpm

A speed reading app with two reading modes: RSVP (Rapid Serial Visual Presentation) and Bionic Reading.

## Features

- **RSVP Mode** — Words displayed one at a time with ORP (Optimal Recognition Point) highlighting
- **Bionic Mode** — Full text with bolded word beginnings to guide the eye
- **Adjustable speed** — 200–1000 WPM (RSVP) or fixation % (Bionic)
- **File import** — `.epub`, `.txt`, and `.md` files
- **Reading list** — Progress tracking stored in IndexedDB
- **Focus mode** — Distraction-free reading (RSVP)
- **Light/Dark theme** — Respects system preference, persists choice
- **Keyboard shortcuts** — Hands-free control

## Keyboard Shortcuts

### Global

| Key | Action |
|-----|--------|
| `M` | Toggle reading mode (RSVP/Bionic) |

### RSVP Mode

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `R` | Reset |
| `↑` `↓` | Adjust speed |
| `Z` | Toggle focus mode |
| `Esc` | Exit focus mode |

### Bionic Mode

| Key | Action |
|-----|--------|
| `↑` `↓` | Scroll up/down |
| `Home` `End` | Jump to top/bottom |

## Development

```bash
bun install
bun dev
```

## Deployment

The app auto-deploys to Cloudflare Workers on every push to `main`.

### Setup

1. Fork/clone this repository
2. Add `CLOUDFLARE_API_TOKEN` to your GitHub repository secrets
   - Go to **Settings → Secrets and variables → Actions → New repository secret**
3. Update `wrangler.jsonc` with your domain configuration:
   ```jsonc
   {
     "routes": [
       {
         "pattern": "your-domain.com",
         "custom_domain": true
       }
     ]
   }
   ```
4. Push to `main` — the CI workflow handles build and deployment

### Manual Deployment

```bash
bun run build
bunx wrangler deploy
```

## Tech Stack

Nuxt 4, Vue 3, Dexie, fflate
