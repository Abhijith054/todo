# Zero-Gravity To-Do

Zero-Gravity To-Do is a premium, futuristic task manager application featuring immersive WebGL backgrounds and fluid glassmorphism interfaces. The application leverages dynamic aesthetic elements—like reactive cursor tracking and custom animated glowing borders—to create a stunning "space-like" user experience.

## ✨ Features

- **Immersive Environment:** A reactive Unicorn Studio WebGL background that springs to life upon mouse movement and gracefully dims when idle.
- **Glassmorphism UI:** Seamlessly integrated frosted-glass design tokens applied across all interactable containers, widgets, and sidebars.
- **Micro-Animations:** Fluid, high-fidelity micro-interactions built with Framer Motion and custom CSS (e.g., conic gradient borders on `BeamButton`).
- **Calendar & Timeline Integration:** An organized schedule view that synchronizes your untimed priorities and timed tasks flawlessly.
- **Performance Optimized:** Uses `backdrop-filter: blur`, z-index layering optimizations, and efficient React Hooks to keep the interface highly performant.

## 🚀 Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Vanilla CSS + Tailwind CSS (for layout and utility scaling)
- **Animation Framework:** Framer Motion
- **WebGL Rendering:** Unicorn Studio
- **Icons & Extras:** Native SVG and UUID generation

## 📦 Installation & Setup

Ensure you have [Node.js](https://nodejs.org) installed on your system. 

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd zero-gravity-todo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` (or the port specified in your terminal) to view the application in your browser.

## 🎨 Design Engineering Notes

- **Unicorn Studio Integration:** Built as a fully reactive React component (`UnicornBackground.jsx`) that safely manages the lifecycle of the external script.
- **Custom React Hooks (`App.jsx`):** State is heavily memoized using `useMemo` and `useCallback` to reduce frame-drops when the animated background is running.
- **Tailwind Only:** Advanced layouts like the dashboard container structure rely purely on Tailwind utilities combined with deep custom CSS `.beam-btn` classes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to open an issue if you want to request new glassmorphism widgets or timeline features.
