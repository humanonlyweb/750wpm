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

## Tech Stack

Nuxt 4, Vue 3, Dexie, fflate
