/* Hero-pealkirja trepp (omanik 2026-07-21: "pealkiri sammudega, nagu trepi
   astmed"). Tekst tükeldatakse astmeteks kas eksplitsiitse reavahetuse (\n)
   või lausepiiride järgi — nii töötab see ka admini sisu peal, kus haldur
   saab astmed reavahetusega ise paika panna. Üheastmeline pealkiri renderdub
   täpselt nagu enne. Astmete taane elab components/headings.css-is. */
export function SteppedTitle({ text }) {
  const source = String(text ?? "");
  const parts = (source.includes("\n")
    ? source.split("\n")
    : source.match(/[^.!?]+[.!?]*/g) || [source]
  )
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length < 2) return source;

  return parts.map((part, i) => (
    <span key={i} className="hero-title-step">
      {part}
    </span>
  ));
}
