# Task: Project Setup

## Todo
- [x] Initialize `tasks/` directory <!-- id: 1 -->
- [x] Create `tasks/todo.md` (Self-reference) <!-- id: 2 -->
- [x] Create `tasks/lessons.md` <!-- id: 3 -->
- [x] Initialize `.gitignore` for sensitive files <!-- id: 7 -->
- [x] Initialize basic project structure <!-- id: 4 -->
- [x] Set up `.env` template (.env.example) <!-- id: 5 -->
- [x] Verify setup against `AGENTS.md` principles <!-- id: 6 -->

- [x] Initialize Next.js 14 project (`price-of-a-life`) <!-- id: 8 -->
    - [x] Run `create-next-app` with exact settings <!-- id: 9 -->
    - [x] Verify `npm run dev` loads <!-- id: 10 -->
    - [x] Document Next.js version <!-- id: 11 -->

- [x] Define Core Types <!-- id: 12 -->
    - [x] Create `types/index.ts` with required interfaces <!-- id: 13 -->
    - [x] Verify types with `npx tsc --noEmit` <!-- id: 14 -->

- [x] Initialize Case Data <!-- id: 15 -->
- [x] Create `data/cases.json` with provided cases <!-- id: 16 -->
    - [x] Verify types with `npx tsc --noEmit` <!-- id: 17 -->

- [x] Implement Core Utilities and Engine <!-- id: 18 -->
    - [x] Create `lib/currencyUtils.ts` <!-- id: 19 -->
    - [x] Create `lib/patternEngine.ts` <!-- id: 20 -->
    - [x] Verify types with `npx tsc --noEmit` <!-- id: 21 -->

- [x] Implement Landing Page <!-- id: 22 -->
    - [x] Clean up `app/globals.css` <!-- id: 23 -->
    - [x] Implement `app/page.tsx` landing screen <!-- id: 24 -->
    - [x] Verify visual rendering on localhost:3000 <!-- id: 25 -->

- [x] Implement Play Page (`app/play/page.tsx`) <!-- id: 26 -->
    - [x] Implement Fisher-Yates shuffle for cases <!-- id: 27 -->
    - [x] Handle game state (guessing vs revealed) <!-- id: 28 -->
    - [x] Implement zero-payout and null-age edge cases <!-- id: 29 -->
    - [x] Implement Guessing UI and Payout input <!-- id: 30 -->
    - [x] Implement Reveal UI with methodology and source <!-- id: 31 -->
    - [x] Verify types with `npx tsc --noEmit` <!-- id: 32 -->

- [x] Implement Result Page (`app/result/page.tsx`) <!-- id: 33 -->
    - [x] Read guesses from `sessionStorage` <!-- id: 34 -->
    - [x] Call `getPattern` to determine bias and agreement <!-- id: 35 -->
    - [x] Implement "Copy result" with clipboard API <!-- id: 36 -->
    - [x] Conduct full E2E test (start to finish) <!-- id: 37 -->
    - [x] Verify types with `npx tsc --noEmit` <!-- id: 38 -->


- [x] Prepare Repository for Push <!-- id: 39 -->
    - [x] Initialize Git repository <!-- id: 40 -->
    - [x] Review `.gitignore` completeness <!-- id: 41 -->
    - [x] Create initial commit <!-- id: 42 -->
    - [x] Connect to remote `https://github.com/garvit-pandia/value-of-life-v2` <!-- id: 43 -->
    - [x] Push to main branch <!-- id: 44 -->
- [x] Final Structural and Content Check <!-- id: 45 -->
    - [x] Verify all paths are correct <!-- id: 46 -->
    - [x] Ensure no debug logs or sensitive data in files <!-- id: 47 -->
    - [x] Confirm `README.md` is descriptive and accurate <!-- id: 48 -->

## Review
The project "Price of a Life" is fully implemented as a professional Next.js 14 application.

### Key Deliverables:
1.  **Architecture**: Strict TypeScript mode, App Router, and minimalist Tailwind CSS styling.
2.  **Core Engine**: Logic for calculating legal valuation bias and demographic agreement.
3.  **Data Integrity**: 9 distinct legal cases covering wide ranges of payouts (₹0 to ₹114 crore).
4.  **UI/UX**:
    -   Minimalist black aesthetic across all screens.
    -   Fluid game loop with shuffle logic and color-coded feedback.
    -   Responsive result page with social sharing (clipboard) functionality.
5.  **Verification**: Conducted full E2E tests confirming logic accuracy and state persistence.
6.  **Deployment**: Ready for repository push and public access.


