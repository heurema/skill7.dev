import { defineConfig, presetWind, presetAttributify } from "unocss";

export default defineConfig({
  presets: [presetWind(), presetAttributify()],
  shortcuts: {
    "btn-primary":
      "px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors",
    "card":
      "rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow",
    "badge":
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    "badge-active": "badge bg-green-100 text-green-800",
    "badge-beta": "badge bg-yellow-100 text-yellow-800",
    "badge-deprecated": "badge bg-red-100 text-red-800",
    "badge-verified": "badge bg-indigo-100 text-indigo-800",
  },
  theme: {
    colors: {
      brand: {
        50: "#eef2ff",
        100: "#e0e7ff",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        900: "#312e81",
      },
    },
  },
});
