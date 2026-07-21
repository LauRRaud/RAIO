/* Hero-pealkirja trepp (omanik 2026-07-21: "pealkiri sammudega, nagu trepi
   astmed — et ei oleks sirgelt joonduses read").

   Astmete tuletus peab töötama SUVALISE sisuga. Pealkiri tuleb Payloadi
   administ ja andmebaasi reavahetused on ebajärjekindlad — mõni pealkiri on
   seal sõna-sõnalt \n-idega murtud (andis 4-astmelise trepi), mõni üldse
   mitte. Seepärast EI loeta \n-e: normaliseerime kogu tühiku ja tuletame
   astmed ise sõnadest. Nii on tulemus sama, ükskõik mis DB-s parajasti on.

   Reeglid:
   - 1 sõna → trepp puudub (renderdub täpselt nagu enne);
   - kuni 3 sõna → iga sõna oma aste;
   - rohkem → kolm tähemahult tasakaalus astet (keskpunkti-meetod, vt allpool),
     nii et ükski aste ei jää liiga pikaks ega murdu ise keskelt.
   Astmete taane (ja MILLINE aste astub) elab components/headings.css-is. */
const MAX_STEPS = 3;

/* Jaga sõnad `chunkCount` järjestikuseks tükiks, tähemahult tasakaalus.
   Keskpunkti-meetod: iga sõna läheb sinna tükki, kuhu tema tähejärjestuse
   KESKPUNKT ideaalse võrdjaotuse järgi langeb. Ahne "täida kuni sihini"
   ületäitis esimese tüki (nt "Mõtteid, kogemusi" 17 tähte, siht 11) — keskpunkt
   annab ühtlasema jaotuse ega lõhu järjekorda. */
function balancedChunks(words, chunkCount) {
  const count = Math.min(chunkCount, words.length);
  if (count <= 1) return [words.join(" ")];

  const lengths = words.map((w) => w.length + 1); // +1 ≈ sõnavahe
  const total = lengths.reduce((a, b) => a + b, 0);

  const chunks = Array.from({ length: count }, () => []);
  let cum = 0;
  for (let i = 0; i < words.length; i++) {
    const mid = cum + lengths[i] / 2;
    let slot = Math.floor((mid / total) * count);
    if (slot > count - 1) slot = count - 1;
    chunks[slot].push(words[i]);
    cum += lengths[i];
  }

  // Keskpunkt on monotoonne, seega slot ei kahane — järjekord säilib. Väga
  // ebaühtlase sisu korral võib mõni tükk tühjaks jääda; viskame need välja
  // (tulemuseks lihtsalt vähem astmeid, mitte katkine trepp).
  return chunks.filter((c) => c.length).map((c) => c.join(" "));
}

export function SteppedTitle({ text }) {
  const source = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!source) return null;

  const words = source.split(" ");
  let parts;
  if (words.length <= 1) parts = [source];
  else if (words.length <= MAX_STEPS) parts = words;
  else parts = balancedChunks(words, MAX_STEPS);

  parts = parts.filter(Boolean);
  if (parts.length < 2) return source;

  return parts.map((part, i) => (
    <span key={i} className="hero-title-step">
      {part}
    </span>
  ));
}
