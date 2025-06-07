# LifeManager Component Styling

This guide defines standard Tailwind classes for common UI elements. Review it before writing any components.

## General Principles
- Use Tailwind utility classes exclusively; avoid custom CSS.
- Follow existing components under `src/components/ui` as examples.
- The primary interactive color is `blue-600` with a darker hover state.

## Buttons
Use the button component in `src/components/ui/button.tsx` when possible. Its default variant renders as:

```tsx
<button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded" />
```

Buttons may include icons using flex utilities. Keep text small (`text-sm`) and disabled states at 50% opacity.

## Lists
Unordered lists should use:

```html
<ul className="list-disc list-inside space-y-1 text-sm" />
```

List items should be plain `<li>` elements; avoid extra margins.

## Cards and Panels
Wrap content inside a `div` with:

```html
<div className="bg-white shadow rounded p-4 text-gray-800" />
```

Use this pattern for panels, cards and other container elements.

## Typography
- Page titles: `text-xl font-bold`.
- Form labels and small text: `text-sm`.

## Sidebar and Navigation
Use `bg-gray-800 text-white` for sidebar backgrounds. Headers use the primary blue color.

Stick to these classes to maintain a consistent style across the application.
