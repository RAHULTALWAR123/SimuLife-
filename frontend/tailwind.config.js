import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "corporate",
      "synthwave",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "black",
      "luxury",
      "dracula",
      "autumn",
      "business",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
      snapchat : {
          
        primary: "#FFFC00", // Snapchat's signature yellow
        secondary: "#FFFC00", // Slightly darker yellow for secondary
        accent: "#FFFC00", // Yellow accent with opacity variations
        neutral: "#1C1C1E", // Dark gray for neutral/bg elements
        "base-100": "#000000", // Pure black base
        "base-200": "#121212", // Slightly lighter black
        "base-300": "#1C1C1E", // Dark gray for card backgrounds
        info: "#00A8FF", // Bright blue for info
        success: "#00FF7F", // Bright green for success
        warning: "#FFAA00", // Orange-yellow for warning
        error: "#FF453A", // Red for errors
        },
      }
    
    ]
  }
}
