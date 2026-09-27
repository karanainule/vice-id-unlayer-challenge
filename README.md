# VICE ID

**Everyone arrives with a story. Build yours.**

An identity-creation terminal for **Leonora** — a fictional, neon-lit coastal
city inspired by the visual mood of open-world crime dramas. Upload a photo
or pick one of six original Leonora locals, edit it into shape with a real
in-browser image editor, and watch the city react as your file goes public
on **Nightwire**.

## Challenge

Built for the **Unlayer "Build with React Image Editor" challenge**. The
editor isn't a bolted-on demo page — it's the core mechanic. The application's
central idea is that *your identity is not chosen, it's edited*: the user's
whole journey (profile → **edit** → file → publish) hinges on actually using
[`@unlayer/react-image-editor`](https://github.com/unlayer/react-image-editor)
to produce the portrait that becomes their identity card and their Nightwire
post.

## Concept

1. **Profile** — start from your own photo or one of six original fictional
   Leonora archetypes (The Driver, The Fixer, The Ghost, The Runner, The
   Dealer, The Unknown).
2. **Edit** — crop, filter, draw, add text/shapes/stickers, and frame your
   visual in the real Unlayer editor. The saved output feeds every later
   screen.
3. **File** — name your alias, pick a role and district, set a wanted level,
   write a signature quote, and generate a classified-looking identity card
   (with a barcode, a decorative code, coordinates, and a status stamp).
4. **Publish** — release your file to **Nightwire**, the city's feed. Watch
   simulated likes, views, NPC comments, and city notifications roll in.
5. **My File** — a persistent dashboard for your identity, backed by
   `localStorage` so it survives a refresh.

All character art, city imagery, UI chrome, and copy are original —
procedurally generated SVG/canvas work and hand-written text. Nothing is
downloaded from, or claims affiliation with, any existing game, studio, or
publisher.

## Features

- Deep, meaningful **React Image Editor** integration (not a side demo)
- Photo upload with drag-and-drop, type/size validation, and graceful
  fallbacks for broken images
- Six original, procedurally generated preset character portraits
- A generated, classified-document-style identity card, downloadable as a
  PNG via a dependency-free `<canvas>` renderer
- A simulated social feed (**Nightwire**) with fictional NPC reactions and
  ambient "the city is watching" notifications
- Fully client-side: no backend, no database, no auth, no required API keys
- Local persistence via `localStorage` — your file survives a page refresh
- Responsive from 375px phones to 1920px desktops
- Reduced-motion support, keyboard navigation, visible focus states, and
  semantic markup throughout
- Guarded routes: visiting `/edit` or `/file` before you have an image shows
  a friendly "not initialized" screen instead of breaking

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/) icons
- [`@unlayer/react-image-editor`](https://www.npmjs.com/package/@unlayer/react-image-editor)
- [React Router](https://reactrouter.com/)

No backend, no database, no authentication, and no paid or required API keys.

## Project structure

```
src/
  components/   Reusable UI: AppShell, GlassCard, ImageEditorPanel, IdentityCard, ...
  pages/        Route-level screens: Landing, IdentitySetup, Editor, IdentityFile, Nightwire, Profile
  hooks/        useIdentity (creation-flow state), useLocalStorage
  data/         Preset character profiles, sample feed posts, NPC reaction copy
  utils/        Image validation/encoding, id/record generation, canvas card renderer
  types/        Shared TypeScript types (IdentityProfile, etc.)
```

## Running locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## Deployment

The project is ready for [Vercel](https://vercel.com/):

1. Push this repository to GitHub.
2. Import it in Vercel as a new project (framework preset: **Vite**).
3. No environment variables are required.
4. Deploy. `vercel.json` includes an SPA rewrite so client-side routes like
   `/create` or `/nightwire` work correctly on refresh and direct visits.

## Why React Image Editor

The editor is the hinge the entire app turns on:

- `IdentitySetupPage` hands the chosen (uploaded or preset) image to
  `ImageEditorPanel`, which mounts `<ImageEditor />` with the current stable
  API: `image`, `options`, a `ref` exposing the live `editor` instance,
  and the `onLoad` / `onSave` / `onCancel` / `onLoadError` / `onError`
  callbacks.
- Saving calls `editor.getImage()` (via the save button) or reads the
  `dataUrl` from the `onSave` callback, and stores it as the user's
  `editedImage`.
- `IdentityFilePage` and the Nightwire feed both render that exact edited
  image — there's no independent "final" photo that bypasses the editor.
- Every tool group (crop, resize, filters, draw, text, shapes, stickers,
  frames) is left enabled, and cinematic microcopy next to the editor keeps
  the framing clear: *"the city only sees what you show it."*

## Screenshots

_Add screenshots or a short screen recording of the Profile → Edit → File →
Nightwire flow here before submitting._

## License

MIT — see [`LICENSE`](./LICENSE). VICE ID is an original, fan-made fictional
concept and is not affiliated with, endorsed by, or produced by Rockstar
Games, Take-Two Interactive, or any related entity.
