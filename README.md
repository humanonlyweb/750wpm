# 750wpm

A speed reading app using RSVP (Rapid Serial Visual Presentation). Words are displayed one at a time at a fixed position, eliminating eye movement and enabling faster reading speeds.

## Features

- **RSVP Reader** with ORP (Optimal Recognition Point) highlighting
- **Adjustable speed** from 200–1000 WPM
- **File import** for `.epub`, `.txt`, and `.md` files
- **Reading list** with progress tracking (stored in IndexedDB)
- **Focus mode** for distraction-free reading
- **Keyboard shortcuts** for hands-free control

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `R` | Reset |
| `↑` `↓` | Adjust speed |
| `Z` | Toggle focus mode |
| `Esc` | Exit focus mode |

## Development

```bash
bun install
bun dev
```

## Tech Stack

Nuxt 4, Vue 3, Dexie, fflate
