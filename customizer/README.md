# AJ Legacy interactive garment studio

React and Tailwind application served at `/customizer.html`. Build with `npm ci && npm run build`; verify placement rules with `npm test`. Production bundles are committed so the existing static Cloudflare site needs no framework server.

All personalization takes place in keyboard-accessible SVG hotspots. Popovers dismiss on outside click or Escape. Front and back maintain separate placements. Brand logos are reserved immutable objects. Each placed object reserves its complete rectangular zone plus a 3 viewBox-unit safety gap. AABB checks include touching boundaries and run again at export. No free dragging is allowed. The source of truth for permission and collision logic is `src/rules.mjs`.

Garment type and collection are independent: Lower always excludes state/breed; Memorial and Gym exclude state/breed on every garment. Breed is K9-only. Headwear permits Name, Rank, Unit and State. Graphic zones are available on upper/lower garments, separately from text zones. The state emblem is a typographic state badge. K9 breed is rendered as breed lettering. Thin-line flag is an original vector motif.

The studio uses an accurate-to-layout vector placement template, not a photographic final product proof. Uploaded PNG/JPEG/WebP graphics remain in browser memory and are embedded in the JSON export. They are not uploaded to a server. Existing scripture artwork and brand logo are referenced by relative asset paths in JSON.

Export schema `ajlegacy.print.v1` includes garment, size, ink, color, exact 500×500 viewBox coordinates, normalized coordinates, surface, string names, fixed logo and assets. Coordinates refer to the full template viewBox top-left. Physical millimeters/inches must be calibrated by the supplier for the garment size. This is a production handoff, not a payment/order backend. Checkout remains disabled. Changing garment or collection clears placements after confirmation; reload also clears the current design.

Store navigation links to the studio. Individual product screens link with collection and garment query parameters. Existing collection images, product artwork, and existing customizers remain intact.

Design-specific eligibility is declared in `src/designs.mjs`, not inferred from collection names, filenames, or customer uploads. Breed requires K9 + containsDog + Breed capability + eligible garment. ThinLine, State and Abbreviation each require their own explicit artwork capability as well as garment/collection permission. Unknown designs fall back to an essentials template with no artwork-specific extras. Uploaded graphics receive only Name/Rank/Unit eligibility. Artwork changes clear placements. Export validates current eligibility and includes design identity/capabilities and applicable breed/thin-line supplier artwork requests. Original image pixels are preserved; requested dog/line changes are supplied for supplier proof rather than destructive pixel replacement.
