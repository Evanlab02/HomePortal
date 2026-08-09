# HomePortal prototype engine

This Vite application is a disposable-design workspace with a durable engine. The engine indexes and hosts prototypes; each prototype is a static, high-fidelity representation of one product surface or one named state before it enters HomePortal.

## Prototype truth contract

- A prototype shows what a product page or component should look like. It is not a miniature application, demo flow, playground, or substitute frontend.
- One prototype represents one independently reviewable surface or state. Split sign-in, registration, invitation acceptance, MFA challenge, and similar destinations when they have different arrival paths or product semantics.
- Do not add navigation merely to make related prototypes discoverable. The engine index is the discovery mechanism. Product navigation appears only when it belongs on the real surface.
- Do not simulate backend behavior, authentication, saving, redirects, success transitions, downloads, or multi-page journeys inside a prototype. Forms and controls may be visually complete while remaining inert.
- JavaScript inside a prototype is exceptional. Use it only when the interaction itself is the design question, such as an expandable control, drag behavior, or animation study. Document why it is necessary.
- Loading, empty, error, success, permission, and overflow treatments are separate named prototypes or engine-selected visual states. They are not reached by completing fake tasks.
- Never put implementation notes, prototype tips, test credentials, state-switch instructions, or developer commentary inside the product canvas. Put them in metadata, the engine toolbar, AGENTS.md, or a clearly separated engine-only annotation.
- Do not invent product navigation, permissions, capabilities, household data, or system claims to make a composition feel complete. Use the smallest realistic fixture content necessary to judge the surface.
- A product engineer should be able to copy the visible hierarchy without having to guess which elements were only added for prototype exploration.

## Commands

- Before starting Vite, check whether the prototype engine is already available at `http://localhost:5173`. Reuse the running server when it is available instead of launching a second instance.
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
    tag: 'Application Manager',
    status: 'exploratory',
    updatedAt: '2026-08-09',
  },
  Component: MyPrototype,
}

export default prototype
```

Valid statuses are `exploratory`, `in-progress`, `re-review`, `ready`, and `implemented`. Dates use `YYYY-MM-DD` and are updated deliberately rather than inferred from Git.

Prototypes created by an agent must use `in-progress` unless the user explicitly instructs the agent to mark them as `ready`.

## Independence rules

- A prototype owns its surface, fixtures, and styles. It should normally have no local routing or behavioral state.
- Never import code from another prototype.
- Never add application navigation, domain components, layouts, or HomePortal-specific UI to `src/engine/`.
- Engine code is limited to discovery, routing, error containment, developer tools, shared types, and other prototype-hosting infrastructure.
- A prototype may import engine types. It should not import engine UI.
- Prefer duplication between unrelated early prototypes over creating a premature abstraction. A clearly named visual family may share presentation-only scaffolding under `src/prototype-support/`; it must not contain product behavior, routing, or state.

## Styling

Tailwind, daisyUI, and Sass are available. Use Tailwind for rapid layout and utilities, daisyUI for accessible controls and local theme primitives, and Sass for scoped authored styles that benefit from nesting or composition.

Every prototype must include a unique root class such as `.homeportal-login-prototype`. Shared family styles must also remain beneath an explicit family root. Do not define global element styles, root variables, or generic class names from prototype stylesheets.

Global styles in `src/index.css` belong to the engine and toolchain only. Do not turn them into a shared HomePortal design system.

## Routing and behavior

- Every prototype must open directly at `/prototypes/<prototype-id>` and survive a browser refresh when served with the Vite SPA fallback.
- Do not add nested routes by default. A nested route is justified only when the real product surface itself owns that routing structure and routing is the design question.
- The engine toolbar is the only UI shared across prototypes. Do not visually integrate it into a prototype.
- A prototype failure must remain contained by the engine error boundary.
- Do not use iframes unless the isolation model is deliberately revisited for the whole engine.

## Quality checklist

Before considering a prototype ready:

- Confirm its direct URL.
- Test desktop, tablet, mobile, and responsive toolbar presets.
- Test both light and dark themes. HomePortal prototypes support both unless their metadata explicitly documents a product-approved exception.
- Check keyboard navigation, visible focus, semantic headings, labels, and contrast.
- Check relevant empty, loading, error, success, disabled, overflow, and realistic-content states as separate named surfaces or engine-selected states.
- Run `npm run lint` and `npm run build`.
- Update its explicit `updatedAt` date.

## Removing a prototype

Delete its folder. Auto-discovery removes it from the index; no engine files should need editing. Confirm that inbound links now receive the engine not-found state.

Before marking a prototype ready, ask: “Would an engineer reasonably believe every visible element belongs in the final product?” If not, remove or clearly relocate the ambiguous material.
