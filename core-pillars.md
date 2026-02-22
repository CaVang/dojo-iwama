# Core Pillars & Safety Guarantee Module

**Objective:** Add a new section on the homepage highlighting the 3 core pillars and safety guarantee of the Dojo to convince parents to enroll their children immediately.

## Why this task?
Based on the brainstorm (Option C), parents need to see the tangible benefits and safety commitments of Aikido for their children:
- Non-violent self-defense
- Discipline & Respect
- Physical Fitness & Digital Detox

## Implementation Steps Taken:
1. **Design & Translation**:
   - Added `home.corePillars` namespace to both `en.json` and `vi.json`.
   - Used high-converting copywriting tailored for parents.
2. **Component (`CorePillarsSection.tsx`)**:
   - Created a responsive Grid section (3 columns on Desktop, 1 on Mobile).
   - Used Framer Motion for scroll-revealed animations.
   - Utilized `lucide-react` icons (ShieldCheck, Award, Activity).
   - Applied Dojo-Iwama standard design tokens (washi background variations, japan-blue/bamboo accents).
3. **Integration**:
   - Injected the new component directly into `src/app/[locale]/page.tsx` beneath the `AgeGroupsSection`.

## Status
✅ Complete.
