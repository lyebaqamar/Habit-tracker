# Dev Weekends Fellowship 2026 — Technical Assessment Answers

### 1. How to Run
* **Prerequisites:** Make sure you have Node.js installed on your computer.
* **Steps to run locally:**
    1. Clone or download this project folder.
    2. Open your terminal in the root directory and run `npm install` to install packages.
    3. Run `npm run dev` to start the local development server.
    4. Open `http://localhost:5173` in your browser.

---

### 2. Stack & Design Choices
* **Why React?** I chose React with standard CSS because it handles real-time data adjustments smoothly. When a user toggles a checkbox, the active streak count recalculates instantly without forcing a complete page refresh.
* **Design Decision 1 (Grid Interface over List):** I built a strict horizontal grid alignment (habits on the left vertical axis, calendar week dates across the top horizontal row). This layout choice ensures a user can evaluate their structural consistency over time at a single glance, which a simple row list cannot offer.
* **Design Decision 2 (Monday Start Defense):** I configured the calendar arrays to start strictly on Monday. This aligns with standard industrial workweeks and educational schedules, ensuring users plan their habits relative to their core workflow distribution.

---

### 3. Responsive & Accessibility
* **Screen Scaling (360px vs 1440px):** On wide desktops, the structure extends naturally across the viewport. To handle narrow 360px mobile views without breaking the grid, I wrapped the table matrix inside a CSS overflow container. This enables clean horizontal swipe gestures while holding the habit name column fixed.
* **Accessibility Feature:** The grid relies on semantic native HTML checkboxes and standard focus styles. This enables simple keyboard navigation where a user can move through cells with the `Tab` key and toggle completions with the `Spacebar`.
* **Accessibility Skipped & Why:** I deliberately omitted custom screen-reader live announcements (`aria-live` regions) for dynamic streak updates due to the tight deadline constraint, prioritizing cross-device responsive stability.

---

### 4. AI Usage
* **Tool Used:** I utilized an AI assistant to fetch a foundational calendar layout.
* **Prompt Given:** "Give me an advanced JavaScript template for a weekly grid habit tracker using React and LocalStorage."
* **AI Output:** The template provided a standard header structure with hardcoded text tags like "Pro" and heavy decoration elements such as calendar emojis.
* **Modifications Made:** I modified the AI output by removing the generic "Pro" text indicator and visual calendar emojis from the main layout header to establish a clean and professional appearance. I also refactored the structural elements to match standard production guidelines.

---

### 5. Honest Gap
* **Unpolished Area:** The streak tracking numbers work properly, but visually it is represented only by a basic orange string container.
* **Future Solution:** With an extra 24 hours, I would implement micro-animation libraries to trigger canvas confetti animations when milestone thresholds (like a complete 7-day row match) are met to optimize user engagement.