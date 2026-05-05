# Tech Debt Tracker

Use this file for debt that is real, acknowledged, and intentionally deferred.

| Date | Area | Debt | Why Deferred | Risk | Next Trigger |
|------|------|------|--------------|------|--------------|
| YYYY-MM-DD | `[area]` | `[debt]` | `[reason]` | `[risk]` | `[when to revisit]` |
| 2026-05-05 | `feat-005 / media assets` | Full WebP/AVIF rollout for landing and story photography cannot be completed yet because `public/images/` has no production photos and story still uses placeholders. | Repo currently ships only `public/guests/anh-tu.svg` as real media; adding speculative assets would invent product content. | Medium — image acceptance remains partial until real assets arrive. | Revisit when couple delivers final landing/story photo set for production. |
