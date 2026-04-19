@tailwind base;
@tailwind components;
@tailwind utilities;

/* Font choices:
   - Display: "Fraunces" — a distinctive modern serif with character, used
     sparingly for marquee numbers and page titles. Keeps the UI from
     looking like every other SaaS admin.
   - Sans:    "Geist" — clean, highly legible, great at small sizes where
     agents scan lead lists. */
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Geist:wght@400;500;600;700&display=swap");

:root {
  --font-sans: "Geist", system-ui, -apple-system, sans-serif;
  --font-display: "Fraunces", Georgia, serif;
}

html, body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: theme("colors.ink.900");
  background: theme("colors.ink.50");
}

/* Tabular numbers everywhere — crucial in a CRM where you scan figures */
.tabular { font-variant-numeric: tabular-nums; }

/* Subtle grid background for empty/auth pages */
.bg-grid {
  background-image:
    linear-gradient(to right, rgba(17, 20, 39, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(17, 20, 39, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Shadcn-style focus ring */
*:focus-visible {
  outline: 2px solid theme("colors.amber.500");
  outline-offset: 2px;
  border-radius: 4px;
}

/* Scrollbar — quieter */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: theme("colors.ink.200");
  border-radius: 10px;
  border: 2px solid theme("colors.ink.50");
}
::-webkit-scrollbar-thumb:hover { background: theme("colors.ink.300"); }
