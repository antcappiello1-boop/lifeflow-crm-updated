/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        // Deep navy primary — conveys trust, typical for financial services
        ink: {
          50: "#f5f6f8",
          100: "#e8ebef",
          200: "#cfd5de",
          300: "#a8b2c2",
          400: "#7a869e",
          500: "#566281",
          600: "#3f4a66",
          700: "#2f3750",
          800: "#1f2437",
          900: "#111427",
          950: "#0a0c1a",
        },
        // Warm amber accent — calls to action, hot leads
        amber: {
          50: "#fff8ec",
          100: "#ffefd0",
          200: "#ffdca0",
          300: "#ffc266",
          400: "#ffa12c",
          500: "#f28511",
          600: "#d66a0a",
          700: "#ab4e0b",
          800: "#863d11",
          900: "#6d3311",
        },
        success: { 50: "#ecfdf5", 500: "#10b981", 600: "#059669", 700: "#047857" },
        danger: { 50: "#fef2f2", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" },
        warn: { 50: "#fffbeb", 500: "#f59e0b", 600: "#d97706" },
        info: { 50: "#eff6ff", 500: "#3b82f6", 600: "#2563eb" },
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 20, 39, 0.04), 0 1px 3px rgba(17, 20, 39, 0.06)",
        "card-hover": "0 4px 12px rgba(17, 20, 39, 0.08), 0 2px 4px rgba(17, 20, 39, 0.06)",
      },
    },
  },
  plugins: [],
};
