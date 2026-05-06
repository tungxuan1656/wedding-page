# Feat 012: Background Audio Player

## Purpose / Big Picture
Add an optional background music player to the website to enhance the emotional storytelling experience. It must have play/pause controls so users can mute it if they prefer.

## Scope
- New component: `components/shared/audio-player.tsx`
- Integration: `app/layout.tsx` (so it persists across page navigations, e.g., to `/story`).
- Out of scope: Auto-playing audio without user interaction (browsers block this anyway).

## Non-negotiable Requirements
- Must not auto-play aggressively (must respect browser autoplay policies).
- Must have visible play/pause toggle.
- Must persist audio state across route changes.

## Progress
- [x] Create `AudioPlayer` component.
- [x] Integrate into `app/layout.tsx`.
- [x] Verify audio playback and control toggles.

## Surprises & Discoveries
- Volume set to 0.25 as requested.
- Floating button moved to top-right corner.
- Used `useEffect` to manage audio instance to ensure persistence across route changes.

## Decision Log
- Decision: Place the audio player component in the global layout.
  Rationale: This ensures the music doesn't stop and restart when the user navigates from the landing page to the story page.

## Context and Orientation
- `app/layout.tsx`: Root layout for the application.
- `components/shared/`: Shared UI components.

## Plan of Work (Narrative)
1. Create `components/shared/audio-player.tsx`.
   - Use the HTML5 `<audio>` element with a placeholder `.mp3` file.
   - Use React state to manage `isPlaying`.
   - Create a floating toggle button (e.g., bottom-left or top-right) with a music icon.
2. Update `app/layout.tsx` to include the player so it sits above all page content.

## Concrete Steps (Commands)
```bash
./init.sh
```

## Validation and Acceptance
- Load the site. Music should not play automatically.
- Click the play button. Music should play.
- Click the pause button. Music should pause.
- Navigate to `/story` while music is playing. It should continue seamlessly.

## Idempotence & Recovery
- Safe to re-run. Revert `app/layout.tsx` if needed.

## Interfaces & Dependencies
- Standard HTML5 Audio API.

## Implementation Notes
- **Mandatory Patterns**: `docs/references/frontend/component-structure-pattern.md`
- **Companion Skills**: `frontend-patterns`
- **Pitfalls**: Autoplay policies require a user interaction (like clicking "Xem hành trình" or "Play") before audio can start.
