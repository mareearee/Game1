# Bubble Lagoon

A relaxing bubble-popping puzzle for your phone. Tap a group of 2 or more matching bubbles to pop it. Bubbles fall and drift together; clear the whole lagoon to earn 3 pearls.

Pop 8 to 11 at once (a Splash) to earn a bomb bubble, and 12 or more (a Tidal wave) to earn a rainbow bubble. Save them, then use them whenever you like: turn any bubble into a bomb (tap it to blast the 3×3 around it) or a rainbow (it matches every color; tap it to pop it with every group touching it).

- `index.html` is the complete game: one file, no install, no app store.
- `game.html` is the same game without the page wrapper (used for the claude.ai artifact).

## Play on your phone

Turn on GitHub Pages (Settings → Pages → Deploy from branch → pick this branch, `/ (root)`), then open the site link in Safari or Chrome and tap **Share → Add to Home Screen**.

## Fair levels

Every board for levels 1–100 is pre-checked by `tools/vet-levels.js`: each one can be fully cleared with plain matches (no bombs or rainbows needed), and how often random tapping clears it eases down from about 35% at level 1 to about 3%. Levels past 100 run the same check while they load. If you change the board generator, re-run `node tools/vet-levels.js` to refresh the table in `game.html`, then rebuild `index.html`.

The Hint button shows a move from a real winning path, and tells you when a full clear is no longer possible from where you are.
