# Mixzi Project Instructions

## Stack

- Use React 19 with TypeScript and Vite.
- Use React Router DOM for navigation and route state.
- Use Tailwind CSS and the existing shadcn/Base UI components.
- Use `lucide-react` for icons when an icon is needed.

## Project Conventions

- Keep route definitions in `src/router/routes.tsx`. Treat `routes.tsx` as the source of truth for paths, labels, components, and navigation metadata.
- Use `NavLink`, `useLocation`, and React Router matching APIs for active navigation states. Do not duplicate route paths as string literals when a value exists in `RoutePaths` or `routes`.
- Keep shared layout components under `src/components/ui/`.
- Preserve the existing `BrowserRouter` and `MixziLayout` structure unless the task explicitly requires changing the routing architecture.
- Files containing JSX must use `.tsx` or `.jsx` extensions. Use `.tsx` for React components in this project.
- Render HTML content inside regular HTML elements such as `div`, `main`, or `section`. Do not use icon components, SVG elements, or SVG wrappers as layout containers.
- Prefer small, focused changes and preserve existing public component APIs.
- Follow the existing formatting style in the file being edited. Avoid unrelated refactors.

## UI Guidelines

- Use the existing shadcn/Base UI primitives instead of introducing a competing component pattern.
- Keep navigation responsive and usable on small screens.
- Keep active route styling visually clear and derive it from React Router state.

## Professional UI Standards & EU Accessibility (EN 301 549)

When generating or refactoring UI components, strictly follow these principles:

### 1. European Accessibility Act (EN 301 549 / WCAG 2.2 AA & AAA)

- Maintain a minimum contrast ratio of 4.5:1 for standard text and 3:1 for large text or essential UI components.
- Never convey information using color alone. Provide redundant visual cues such as icons, patterns, or text labels.
- Always provide highly visible `:focus-visible` outlines, with a minimum 2px solid high-contrast outline. Never remove an outline without a robust custom fallback.
- Use native HTML5 semantic elements by default. Add ARIA attributes such as `aria-expanded`, `aria-hidden`, and `aria-describedby` only when native elements cannot describe the state.
- Give icon-only controls accessible names and give navigation links meaningful labels.

### 2. Anthropometry & Mobile Ergonomics

- Interactive elements must have a minimum touch target of 48x48 CSS pixels and at least 8px spacing between targets.
- Place primary navigation and core CTAs in the bottom-center easy-reach zone on mobile where the layout allows it.
- Place destructive actions such as Delete and Cancel away from the easiest tap zones to prevent accidental activation.
- Use a base font size of exactly 16px (1rem). Keep line-height between 1.5 and 2.0 for readable body text.

### 3. Dark Mode & Theming Architecture

- Use semantic design tokens or utility classes instead of hardcoded color values such as `#FF0000`.
- In dark mode, communicate elevation with varying surface lightness rather than relying mainly on drop shadows.
- Avoid pure black backgrounds and pure white text. Prefer off-black surfaces and off-white text, and desaturate brand colors in dark themes.
- Respect `prefers-color-scheme: dark` and `prefers-reduced-motion: reduce` when implementing themes or motion.

### 4. Cognitive Load & Layout Constraints

- Group related elements logically using Gestalt principles and limit visible choices to reduce decision fatigue.
- Avoid fixed-width containers. Layouts must scale to a 320px viewport without requiring horizontal scrolling.

## Validation

- For visual changes, use `npm run dev` and inspect the result in the browser.
- Do not run `npm run build` unless the user explicitly requests a production build or compilation validation.
- Before finishing, check that the edited files have no JSX parse errors and that the relevant route renders correctly.
