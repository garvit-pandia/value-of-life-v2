# Architectural & Code Improvement Suggestions

Based on a thorough review of the current implementation (specifically `app/play/page.tsx` and the project setup) and adhering to our **AGENTS.md** principles—specifically *Demand Elegance*, *Simplicity First*, and *Verification Before Done*—here are the prioritized suggestions for improvement.

## 🔴 High Priority: Code Elegance & Robustness
*These changes will resolve brittle areas, improve code maintainability, and ensure bugs don't creep in during future updates.*

### 1. Refactor `app/play/page.tsx` into Sub-components (Demand Elegance)
**The Issue:** `app/play/page.tsx` is an overworked "God Component" spanning >250 lines. It handles the Fisher-Yates array shuffling, state management, input handling, and multiple UI states (Guessing vs. Revealed). 
**The Fix:** Break this into distinct, single-responsibility components:
- `<ProgressBar />`: Manages the header and current case count.
- `<CaseCard />`: Dumb component purely for displaying the `currentCase` details.
- `<GuessingPhase />`: Focuses entirely on input, units (Lakhs/Crores), and validating the lock-in.
- `<RevealPhase />`: Handles displaying the actual verdict and the methodology.

### 2. Replace `sessionStorage` with React Context (Robustness)
**The Issue:** Passing the final guesses to the `/result` page by dumping them into `sessionStorage.setItem('guesses', JSON.stringify(...))` creates a brittle dependency. If a user drops directly onto the `/result` page or the JSON serialization fails, the app will crash or have no data.
**The Fix:** Implement a lightweight Context Provider (e.g., `GameContext`) at the layout level. This keeps the state contained within the React ecosystem, allows for strict type-checking of the state, and removes raw DOM string manipulation.

### 3. Bulletproof Input Validation (Bug Fixing)
**The Issue:** Currently, the input validation uses a regex `^\d*\.?\d*$` and hardcoded string comparisons like `inputValue === '0' || inputValue === '00'`. This allows broken edge cases (like `"0."`, `"."` or `"0.0"`) which will allow the user to bypass the disabled button and send `NaN` or `0` formats into the parsing engine.
**The Fix:** Clean up the numeric parsing. Rather than validating via string checks, convert to a real `Number` strictly or use a library that handles proper INR comma separations (₹1,00,000) dynamically as they type, significantly improving the UX.

---

## 🟡 Medium Priority: UX & Polish
*These changes will improve the user experience and align the app with the "Premium Aesthetic" requirements.*

### 4. Fix Black Screen Hydration / Loading States
**The Issue:** During the `useEffect` shuffle initialization, the app returns `<div className="min-h-screen bg-black" />`. Depending on device speed, this appears as a broken flash of black screen rather than a deliberate transition.
**The Fix:** Implement a subtle skeleton loader, a glowing pulse effect, or a minimal typography fade-in to mask the rendering time gracefully.

### 5. Keyboard Navigation & Accessibility (A11y)
**The Issue:** Currently, users must click the "Declare Verdict" button manually. This is tedious for an interface where they type a number on a keyboard.
**The Fix:** Wrap the guess input and button in a semantic `<form>` element. This allows users to simply hit the **"Enter"** key to declare their verdict. Additionally, provide `aria-labels` to the inputs since the placeholder "0.00" isn't sufficient for screen readers.

---

## 🟢 Low Priority: Optimization
*Do not over-engineer these, but consider them for future scalability.*

### 6. SSR Data Fetching & Randomization Strategy
**The Issue:** Everything in `/play` uses `'use client'`, including reading the `casesData`. While this is fine for a small 9-case JSON file, it bloats the client bundle.
**The Fix:** You can pass the seed or pre-randomized array directly from a Next.js Server Component, meaning the JSON payload and heavy lifting happen on the server, ensuring absolute zero hydration delay. 

---

### Recommended Next Steps for Workflow
If you agree with this assessment, my recommendation is to tackle **High Priority 1 & 3** via a single subagent refactor. Let me know which of these points you would like me to draft an implementation plan for!
