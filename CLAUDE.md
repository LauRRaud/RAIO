# RAIO — juhised agentidele

## CSS-i raudreegel

Iga omadus defineeritakse **üks kord**. Kui väärtus on vale, muuda algset
reeglit — **mitte kunagi ära lisa hilisemat ülekirjutust** teise faili ega
impordiloendi lõppu. Just nii tekkis 4000-realine typography-cleanup kiht,
mis 2026-07-21 lahti volditi (struktuur, lõksud ja tööriistad:
CSS-AUDIT-HANDOFF.md).

- Lehteülesed süsteemid (pealkirjad, komponenditüpograafia, karussell,
  kaardikroom) elavad `app/(frontend)/styles/components/` failides; lehe
  eripärad lehefailis (`pages/*.css`); teemapolaarsus `theme/polarity.css`.
- Impordijärjekord `globals.css`-is on kandev — uus fail käib õigesse
  kihti (settings → base → layout → primitives → components → pages → theme),
  mitte lõppu. Komponendikiht ise on järjestatud üldisemast täpsemani ja
  lahendab võrdse spetsiifilisuse viigid positsiooniga.
- Uus reegel käib SISULISELT sobivasse faili ja faili sees õigesse kohta —
  lõppu lisatud reegel võib lõhkuda sama faili hilisema mobiiliploki.
- Enne CSS-i puudutava commit'i tegemist jooksuta `npm run audit:css` —
  see failib, kui sama (media × selektor × omadus) on defineeritud mitmes
  failis.
- Visuaalse muutuse kontrolliks kasuta computed-style snapshot paarisjooksu
  (tööriistad ja metoodika: CSS-AUDIT-HANDOFF.md §4–5).

## Muu

- `messages/{et,en}.json` on avaliku sisu vaikeväärtused; Payload CMS
  (andmebaas) kirjutab neid üle. Kakskeelsus: iga avalik tekst mõlemas keeles.
- Font-size'id kujul `calc(<mõõt> * var(--cms-text-scale, 1))` — invariant,
  mida admini tekstiskaala vajab; ära kaota calc-vormi.
- Deploy ja lokaalne käivitus: vt omaniku memory (deploy-to-server,
  run-locally) või küsi omanikult.
