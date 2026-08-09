# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Python and Django provide the application foundation.
- HTMX is the default approach for interactive server-rendered UI.
- React is available where richer client-side interaction is necessary rather than as the default rendering model.
- Vite and TypeScript support the frontend toolchain.
- Tailwind CSS, Sass/SCSS, and daisyUI provide the styling foundation.
- The application is developed and deployed with Docker Compose.
- HomePortal may access the local Docker socket directly.

## Users

The primary user is Evan, using HomePortal at home to operate and understand his own home lab. Broader reuse by other home-lab owners is a possible future direction, not a requirement for the current product.

## Product Purpose

HomePortal is a personal interface for Evan's home-lab setup. Its first milestone should make the containers in its own Docker Compose project visible and understandable without expanding into a general-purpose home-lab platform.

Success for v0.1.0 means delivering a useful, working Docker-focused experience while learning what the larger product should become through hands-on prototyping.

## Positioning

HomePortal is made by Evan for Evan. It can embody his exact workflows and support custom integrations without needing to accommodate every user's setup. It is not currently intended to compete with or find a market position among existing home-lab dashboards.

## Operating Context

HomePortal runs as part of a Docker Compose home-lab environment and observes the containers belonging to that Compose project. The initial workflow is to inspect what is running and understand each container's current resource use and output.

## Capabilities and Constraints

- v0.1.0 is intentionally limited to Docker integration.
- Discover and display every container running as part of HomePortal's Docker Compose project.
- Show useful container information including CPU usage, memory usage, and logs.
- Direct access to the local Docker socket is permitted.
- Keep delivery incremental and work on one coherent capability at a time.
- General-purpose configuration, third-party reuse, and integrations beyond Docker remain future decisions.

## Brand Commitments

- The product name is HomePortal.
- The project is personal and owner-built; its language and behavior should not pretend to be a mature commercial platform.

## Evidence on Hand

- The repository README identifies HomePortal as Evan's work-in-progress home-lab setup.
- No production screenshots, usage data, testimonials, case studies, or other proof assets currently exist. Future work must not fabricate them.

## Product Principles

1. Build for the real home lab and its owner before designing for hypothetical users.
2. Do one useful thing at a time and keep each milestone deliberately focused.
3. Prefer direct, understandable visibility into the system over generalized platform abstractions.
4. Use prototypes to discover the product, then expand only from demonstrated needs.
5. Preserve the freedom to write purpose-built integrations as the home lab evolves.
