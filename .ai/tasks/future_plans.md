# Future Architecture & Feature Pipeline

This document catalogs an exhaustive brainstorm of high-value features, abstract concepts, and deep architectural improvements intended to elevate "The Price of a Life" from an interactive experiment into a fully-fledged, multiplayer, psychological masterpiece.

## Tier 1: Advanced Gameplay Mechanics & Meta-Narrative
Features that fundamentally alter or deepen how the user interacts with the application.

- [ ] **The "Gavel Falls" Pressure System**: Implement a strict 10-second timer per case. This forces players to rely entirely on gut instinct over analytical math, revealing truer subconscious biases.
- [ ] **Objection / "Lodge Appeal" Mechanic**: Give the user one "Objection" per round. If a court's payout deeply repulses them on a moral level, they can click `[LODGE APPEAL]`. It flags the case as "CONTESTED" in the global database.
- [ ] **Endless "Banality of Evil" Mode**: An alternative flow where cases loop infinitely with slight procedural variations. The user is trapped evaluating lives as a corporate actuary until they locate a hidden 'Resign' button.
- [ ] **Consulting AI Agents**: Introduce 'Advisors' (e.g., 'Corporate Actuary', 'Defense Attorney') that provide brief, conflicting, generating text-bubble advice for each case before the user guesses.

## Tier 2: Hardcore Aesthetics & Tactility
Features aimed at maximizing the "Bureaucratic Noir" vibe through physical interactions and micro-animations.

- [ ] **Draggable Redaction Tape (Framer Motion)**: Rather than relying on a CSS `animate-unredact` keyframe, the user must physically click and drag a heavy black strip off the screen to reveal the "Official Verdict".
- [ ] **Custom "Ink Stamp" Cursor**: Replace the default mouse cursor with a heavy, custom SVG. When clicking the `Submit` button, the cursor drops, playing a physical stamping animation that leaves a faint ink residue.
- [ ] **CRT / VHS Route Transitions**: Mask the hard transitions between pages (Landing -> Play -> Result) with severe visual artifacting, screen tearing, or a "Projector Slide" effect.
- [ ] **Dynamic Teletype Printing**: Instead of mounting instantly, blocks of text (like the Methodology quote) should procedurally type out character-by-character along with the generative audio engine.

## Tier 3: Architecture & Global Consensus
Features requiring database integration, persistence, and server-side logic.

- [ ] **Edge Database / Public Consensus (Supabase/Vercel)**: Log every guess made by every user. During the reveal phase, display a third data point: `The Humanity Average`. Show how the public values the life vs. how the cold legal system valued it.
- [ ] **Persistent "Actuarial Ranking" (`localStorage`)**: Track the user's cumulative bias and accuracy over multiple visits. Promote them up the corporate ladder (from "Junior File Clerk" to "Chief Demographics Assessor"), subtly altering the UI to look more premium/classified at higher ranks.
- [ ] **Expanded Procedural Database**: Break free from the static `cases.json`. Introduce dynamically fetched cases across different real-world jurisdictions (e.g., cross-referencing Indian cases vs. US cases) to highlight systemic global valuation disparities.
- [ ] **Hardcore Edge SSR**: Refactor the game logic to rely heavily on Next.js Server Components. Deliver the initial payloads with near-zero JavaScript to optimize performance and mimic ultra-fast, lightweight terminal software.

## Tier 4: Data Visualization & Exportability
Features focused on how the user interprets and shares their final bias results.

- [ ] **The "Scale of Bias" (Terminal Dot Plot)**: On the Results screen, render an ASCII-inspired 2D graph plotting the user's valuations against demographic lines (e.g., Age vs. Payout), forcing them to visually confront their bias clusters.
- [ ] **Printable Dossier SVG/PDF**: Add a brutalist `[PRINT CERTIFICATE OF APPRAISAL]` feature that compiles their entire session into an A4/Letter sized layout that they can physically print or save locally.
- [ ] **Dynamic Social OpenGraph (OG) Images via `@vercel/og`**: Dynamically generate Twitter/Discord share images styled as redacted dossiers, stamping their specific Bias Result directly into the thumbnail.

## Tier 5: Accessibility (A11y) & Edge Cases
- [ ] **Aria-Live Tension Broadcasts**: Introduce invisible tags that audibly announce to screen-readers when the system's "stress/tension" levels are escalating.
- [ ] **High-Contrast Override Option**: For visually impaired users, add an Easter egg terminal command or hidden toggle to force an ultra-high contrast `#ffffff` text state, overriding the `parchment/60` aesthetic.
