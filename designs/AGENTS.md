# HomePortal prototype engine

This Vite application is a disposable-design workspace with a durable engine. The engine indexes and hosts prototypes; prototypes are independent applications used to explore product ideas before they enter HomePortal.

## Commands

- `npm run dev` — start the prototype engine.
- `npm run build` — type-check and create the production build.
- `npm run lint` — run oxlint.
- `npm run preview` — serve the production build locally.

Run commands from `designs/`.

## Adding a prototype

Create one folder at `src/prototypes/<prototype-id>/`. The folder name and metadata ID must use lowercase kebab-case. The engine automatically discovers files matching `src/prototypes/*/index.tsx`; never add a central registry entry.

`index.tsx` must default-export a `PrototypeDefinition`:

```tsx
import type { PrototypeDefinition } from '../../engine/types/prototype'
import { MyPrototype } from './prototype'
import './prototype.scss'

const prototype: PrototypeDefinition = {
  meta: {
    id: 'my-prototype',
    name: 'My prototype',
    description: 'What this prototype is testing.',
    status: 'exploratory',
    updatedAt: '2026-08-09',
    tags: ['optional', 'searchable'],
  },
  Component: MyPrototype,
}

export default prototype
```

Valid statuses are `exploratory`, `in-progress`, and `ready`. Dates use `YYYY-MM-DD` and are updated deliberately rather than inferred from Git.

## Independence rules

- A prototype owns its shell, navigation, nested routes, components, fixtures, state, and styles.
- Never import code from another prototype.
- Never add application navigation, domain components, layouts, or HomePortal-specific UI to `src/engine/`.
- Engine code is limited to discovery, routing, error containment, developer tools, shared types, and other prototype-hosting infrastructure.
- A prototype may import engine types. It should not import engine UI.
- Prefer duplication between early prototypes over creating a premature shared abstraction. Extract only tooling that every prototype needs to run or be inspected.

## Styling

Tailwind, daisyUI, and Sass are available. Use Tailwind for rapid layout and utilities, daisyUI for accessible controls and local theme primitives, and Sass for scoped authored styles that benefit from nesting or composition.

Every prototype stylesheet must be scoped beneath a unique root class such as `.container-dashboard-prototype`. Do not define global element styles, root variables, or generic class names from a prototype stylesheet. A prototype may establish a completely different visual system from every other prototype.

Global styles in `src/index.css` belong to the engine and toolchain only. Do not turn them into a shared HomePortal design system.

## Routing and behavior

- Every prototype must open directly at `/prototypes/<prototype-id>` and survive a browser refresh when served with the Vite SPA fallback.
- Nested routes belong beneath that URL and must use relative links.
- The engine toolbar is the only UI shared across prototypes. Do not visually integrate it into a prototype.
- A prototype failure must remain contained by the engine error boundary.
- Do not use iframes unless the isolation model is deliberately revisited for the whole engine.

## Quality checklist

Before considering a prototype ready:

- Confirm its direct URL and nested routes.
- Test desktop, tablet, mobile, and responsive toolbar presets.
- Test light and dark themes only if the prototype claims to support them.
- Check keyboard navigation, visible focus, semantic headings, labels, and contrast.
- Check empty, loading, error, overflow, and realistic-content states relevant to the idea.
- Run `npm run lint` and `npm run build`.
- Update its explicit `updatedAt` date.

## Removing a prototype

Delete its folder. Auto-discovery removes it from the index; no engine files should need editing. Confirm that inbound links now receive the engine not-found state.

The dummy prototype is an executable example, not product direction. Replace or remove it once a real prototype exists.
