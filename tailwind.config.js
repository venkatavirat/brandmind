/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", ":root.dark"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        primary: "var(--primary)",
        border: "var(--border)",
        muted: "var(--muted)",
        intelligence: "var(--intelligence)",
        "intelligence-muted": "var(--intelligence-muted)",
        "intelligence-border": "var(--intelligence-border)",
        success: "var(--success)",
        warning: "var(--warning)",
        destructive: "var(--destructive)",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 2px)",
        md: "var(--radius)",
        lg: "calc(var(--radius) + 2px)",
      },
    },
  },
  plugins: [],
};