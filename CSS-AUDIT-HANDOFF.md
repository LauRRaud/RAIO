# CSS-i arhitektuur ja auditi kokkuvõte

*Audit lõpetatud 2026-07-21. See dokument kirjeldab lõppstruktuuri ja neid
lõkse, mis auditi käigus päriselt kätte maksid — loe enne CSS-i puutumist.*

---

## 1. Struktuur

`app/(frontend)/globals.css` impordib täpses järjekorras:

```
settings → base → layout → primitives → components → pages → theme(polarity)
                                          ↑
                            komponendikiht: üldisemast täpsemani
```

**Komponendikihi järjekord on kandev.** Reeglid on seal enamasti võrdse
spetsiifilisusega (0,1,1) ja lahendavad viigi positsiooniga:

| Järjekord | Fail | Mida hoiab |
|---|---|---|
| 1 | `headings.css` | lehteülene pealkirjasüsteem |
| 2 | `component-type.css` | lehteülene komponenditüpograafia, ostukorvi read |
| 3 | `store-catalog.css` | poe kataloog |
| 4 | `band-cta.css` | bändide CTA-nupud |
| 5 | `card-frames.css` | kaardiraamid, tootepildi nurgad |
| 6 | `events-cards.css` | sündmuste ülekattekaardid |
| 7 | `journal-cards.css` | ajakirja ülekattekaardid |
| 8 | `tools-material.css` | "Miks puu ja kivi" bänd |
| 9 | `carousel.css` | karussellisüsteem (endised 09+10+11) |
| 10 | `hero-polish.css` | hero viimistlus + mobiiliplokid |
| 11 | `card-chrome.css` | raamid/varjud + ülekattepind (endised 13+14) |
| 12 | `section-headers.css` | sektsioonipäiste meta-rida |
| 13 | `card-polish.css` | kaardi jalavahe hoovad |

Lisaks `header/footer/texture-backdrop` (iseseisvad komponendid).

## 2. Raudreegel

Iga omadus defineeritakse **üks kord**. Vale väärtuse korral muuda algset
reeglit — ära lisa hilisemat ülekirjutust. Kontroll: **`npm run audit:css`**
(`scripts/css-duplicate-guard.mjs`) failib, kui sama (media × selektor ×
omadus) on defineeritud mitmes failis. Praegu **0 duplikaati / 4694
deklaratsiooni**.

## 3. Lõksud, mis päriselt kätte maksid

1. **`!important` varasemas failis võidab hilisema tavadeklaratsiooni.**
   Duplikaadi "kaotaja" pole alati varasem fail. Näide: `tools.css`
   `.tools-material-panel { background: … !important }` võidab
   `components/tools-material.css` tavareeglit. Kontrolli päris kaskaadist,
   ära järelda impordijärjekorrast.

2. **Spetsiifilisuse kadu järgmiste kihifailide vastu.** `:not(.surnud-klass)`
   eemaldamine langetab (0,2,1)→(0,1,1) ja siis võidab mõni HILISEM fail sama
   sihtmärgi üldreegliga. Kontrolli võitjat ka järgnevate importide, mitte
   ainult lehefailide vastu.

3. **Reegli lisamine faili LÕPPU võib lõhkuda mobiili.** Kui failis on
   hiljem `@media (max-width: …)` plokk sama selektoriga, siis lõppu lisatud
   globaalne reegel võidab ka mobiilis. Lisa õigesse kohta, mitte lõppu.

4. **Lehepõhised kaardikihid peavad jääma lehteülesest tüpograafiast
   HILJEMAKS.** Muidu võidab üldine (0,1,1) kaardireegel lehepõhist.

5. **Etaloni roiskumine.** Omanik võib adminis sisu muuta samal ajal — CMS-i
   muudatus muudab DOM-i ja vana snapshot muutub võrreldamatuks. Kahtluse
   korral tee sisu-külmutatud paarisjooks (`git stash` → snapshot → `pop` →
   snapshot).

6. **Kommentaarid parseris.** Rida-haaval kommentaaride eemaldamine jätab
   mitmerealises kommentaaris oleva sulu alles → sügavusloendus ja
   `@media` kontekst lähevad paigast. Valvur eemaldab kommentaarid nüüd üle
   reapiiride.

## 4. Tööriistad

`memory/tools/` (kasutaja mälukaustas) — kopeeri scratchpad'i ja jooksuta:

| Skript | Mida teeb |
|---|---|
| `style-snapshot.mjs <kaust>` | 21 lehte × 2 vaateava computed-style JSON (`BASE=http://localhost:PORT`) |
| `snapshot-diff.mjs <a> <b>` | võrdlus; exit 0 = identne |
| `merge-css.mjs` | liidab @importid, kaskaadi tõevaade |
| `dead-decl-scan.mjs` | **päris kaskaadimootorist** (CDP `getMatchedStylesForNode`) — millised deklaratsioonid ei võida mitte kusagil |
| `dup-losers.mjs` | täpsete duplikaatide kaotajad reanumbritega |

**Snapshot-müra, mida ignoreerida:** sümmeetrilised `margin-left/right`
paarid tsentreeritud sektsioonidel (`margin:auto` lahendumise võidujooks,
esineb mõlemas suunas). Kõik muu on päris regressioon.

## 5. Mis tehti (commit'id)

| Commit | Sisu |
|---|---|
| `45b1731` | etapp A: surnud kood (7 klassi, 31 muutujat, −114 rida) |
| `c24d118` | B1: importer lahustatud, komponendifailid ausatesse kodudesse |
| `ae9375f` | 00-tokens → settings/tokens.css |
| `936808f` | 01-headings → components/headings.css |
| `ef158f9` | valvur + CLAUDE.md raudreegel |
| `ccadba2` | 02/05/06 → components/ |
| `b5d8c89` | 03/08/12/15 → components/ (03 jagatud kaheks) |
| `f3e892c` | 07 jaotatud; `pages/typography-cleanup/` kadus |
| `ed1d9d4` | karusselli ja kaardikroomi konsolideerimine |

**Tulemus:** 12 611 → 12 198 rida, 113 → 0 failideülest duplikaati,
ülekirjutuskiht (18 faili, ~4000 rida) kadunud.
