# CSS-korrastuse üleandmiskaart (etapp B voltimine + etapp C)

*Seis: 2026-07-21. Eelmine agent (Fable) viis läbi etapid 0–A ja B alguse; see
dokument on iseseisev juhis töö lõpetamiseks. Loe TERVIKUNA enne alustamist.*

---

## 1. Eesmärk ja arhitektuuriprintsiip

Projektis oli 12,5k rea CSS-ist ~4k rida `typography-cleanup` ülekirjutuskihis,
mille ainus võim oli "olen viimane import, seega võidan". Siht:

- **iga omadus defineeritakse üks kord**; kui väärtus on vale, muudetakse
  algset reeglit — mitte kunagi ei lisata hilisemat ülekirjutust;
- lehteülesed harmoniseerimissüsteemid (pealkirjad, komponenditüpograafia,
  karussell, kaardikroom) elavad **ausate nimedega** `components/` failides;
- lehepõhine kraam elab lehefailis; surnud (alati kaotavad) deklaratsioonid
  kustutatakse;
- lõpuks valvur, mis ei lase kihil uuesti tekkida.

**Lõppstruktuur:** settings → base → layout → primitives → components →
pages → theme(polarity). `pages/typography-cleanup/` kataloog kaob.

## 2. Mis on TEHTUD (commit'itud, main)

- `45b1731` etapp A: surnud koodi kustutus (−114 rida; 7 klassi, 31 muutujat).
- `64f8b0d` SEO-kiht; `949f474` + `d89b03f` hero-parandused (mitte-CSS-audit).
- `c24d118` **B1**: importer lahustatud, globals.css impordib 17 endist
  kihifaili OTSE endises järjekorras; komponendifailid tõstetud:
  04→`components/card-frames.css`, 09/10/11→`components/carousel-*.css`,
  13→`frames-shadows.css`, 14→`overlay-cards.css`, 16→`card-polish.css`.
- `ae9375f` **00-tokens volditud**: tüposkaalatokenid `settings/tokens.css`-i;
  `--ui-box-*` pere elab `theme/polarity.css :root`-is, kus `--ui-box-muted`
  parandati võitvale väärtusele `#f8f3ec`.

## 3. Mis on POOLELI (tööpuus, commit'imata!)

**01-headings voltimine on failides valmis, snapshot-kontroll oli käimas.**
Muudatused tööpuus:
- UUS `components/headings.css` (lehteülene pealkirjasüsteem, endine 01,
  puhastatud: kaks `.store-hero-copy p` reeglit liidetud, `:not(.store-kicker)`
  eemaldatud, kriipsu-`!important`-valvurid maha);
- surnud konkurendid kustutatud: events/journal/tools/training/about hero-h1
  mõõdud + mobiili h1 font-size plokid; kõik `.X-short-rule` stiiliplokid
  (element on peidetud); about.css 3× `h2::before` kriipsugeneraatorit;
  training.css `quality-list::after` + `workshop h2::after`; kaartide
  `background`-deklaratsioonid (events/journal/shop/product — võidab
  headings.css `var(--ui-box-bg)`); heroes.css short-rule taustagrupp;
- globals.css: import `01-headings.css` → `components/headings.css`;
  vana fail `git rm`-itud.

**Enne jätkamist:** jooksuta snapshot-kontroll (§5) ja kui puhas → commit
sõnumiga stiilis "CSS stage B: fold 01-headings into components/headings.css".
Kui EI ole puhas: diffi read näitavad täpselt, milline omadus muutus — leia
vastav kustutatud deklaratsioon ja too tagasi / paranda.

NB: tööpuus on ka OMANIKU muudatused `public/RAIO taust/` all (kustutatud
3.jpg, uus Info/ kaust) — ÄRA neid oma commit'idesse pane.

## 4. Tööriistad (asuvad `C:\Users\rauds\.claude\projects\C--Users-rauds-Desktop-Projektid-RAIO\memory\tools\`)

Kopeeri need oma sessiooni scratchpad'i ja jooksuta sealt.

| Skript | Mis teeb |
|---|---|
| `style-snapshot.mjs <dir>` | 21 lehte × 2 vaateava computed-style JSON. `BASE=http://localhost:<port>` env! Deterministlik: animatsioonid maas, transform/opacity väljas, pildiootus 3s race'iga, skip-elemendid ei nihuta indekseid. |
| `snapshot-diff.mjs <enne> <pärast> [--verbose]` | Võrdlus. Exit 0 = identne. |
| `merge-css.mjs <globals.css> <välja.css>` | Liidab @importid ===FILE=== markeritega — kaskaadi tõevaade. |
| `dup-report.mjs` | (jooksuta scratchpadis, vajab merged.css) sama selektor+omadus mitmes failis. |

**Etalon:** genereeri TÖÖ ALGUSES värske (`node style-snapshot.mjs etalon`),
verifitseeri determinism (teine jooks + diff → identne), ja võrdle IGA
voltimissammu järel selle vastu. Pärast igat puhast commit'i võid etaloni
uuendada või hoida sama.

**Müra, mida IGNOREERIDA diffis:**
- sümmeetrilised `margin-left/right` "0px"↔"42px" paarid tsentreeritud
  sektsioonidel (`margin:auto` lahendumise võidujooks, mõlemas suunas);
- `display:none` elementide (nt `.X-short-rule`) stiilidiffid pärast nende
  surnud kujundusreeglite kustutamist — element on nähtamatu, computed style
  muutub, pilt mitte.
KÕIK MUU on päris regressioon.

**ETALONI ROISKUMINE (õpitud valusalt):** omanik kasutab adminit (tekstid,
sektsioonivärvid, tekstuurid) samal ajal — CMS-i muudatus muudab DOM-i klasse
ja inline-muutujaid ning vana etalon muutub võrreldamatuks (sajad võltsdiffid:
sektsioonitaustad, pärandvärvid, `home-world-card-*` klassid). SEEPÄRAST:
võrdle AINULT paarisjooksuga — `git stash push -u -- "app/(frontend)"` →
snapshot (vana CSS, praegune sisu) → `git stash pop` → snapshot (uus CSS) →
diff. Kaks jooksu järjest, sisu külmutatud.

**SPETSIIFILISUSLÕKS JÄRGMISTE KIHIFAILIDE VASTU (juhtus päriselt):**
`:not(.surnud-klass)` eemaldamine langetab reegli (0,2,1)→(0,1,1) ja siis
võidab teda mõni HILISEM kihifail sama sihtmärgi üldreegliga (nt
component-type lehe-p reegel võitis store-hero p oma). Kontrolli iga
lihtsustuse võitjat ka JÄRGNEVATE importide, mitte ainult lehefailide vastu;
vajadusel hoia spetsiifilisus dokumenteeritud eesliitega (nt
`.store-hero .store-hero-copy p` + kommentaar miks).

**Dev-server:** `preview_start` nimega `raio-dev` (launch.json). Port võib
olla hõivatud (teine projekt) → autoport annab muu pordi → kasuta seda
BASE-ina. DB: docker `raio-db` (port 5433) peab jooksma.

## 5. Voltimise metoodika (IGA faili juures)

1. Loe kihifail läbi. Iga reegli kohta otsusta:
   - **lehteülene süsteem** (mitme lehe klassid ühes reeglis) → jääb/läheb
     `components/` süsteemifaili (headings.css, component-type.css, …);
   - **ühe lehe reegel** → tõsta lehefaili õigesse kohta VÕI kui lehefailis on
     sama sihtmärgi reegel, vii võitev väärtus sinna;
   - **vestigiaal** (stiilib peidetud/kustutatud elementi; `content:none`
     valvur, mille generaator on kadunud) → kustuta sootuks.
2. **Surnud konkurent** = lehefaili deklaratsioon, mille kihifail sama
   elemendi samale omadusele ALATI üle kirjutab (sama või kõrgem
   spetsiifilisus + hilisem positsioon). Kustuta konkurent; jäta lehefaili
   alles omadused, mida kiht EI kata (margin, max-width, color jne) —
   kontrolli omadus-haaval!
3. **Spetsiifilisuslõksud:**
   - `:not(.klass)` lisab (0,1,0) — lihtsustamine muudab kaalu; lihtsusta
     ainult koos konkurentide kustutamisega;
   - `:is()` loendis olevat surnud klassi EI TOHI komapoolitusega eemaldada
     skriptiga (süntaks!) — käsitsi, ja kontrolli, et max-spetsiifilisusega
     argument ei muutu;
   - mobiiliplokid (`@media (max-width: …)`) lehefailides on sageli TERVENISTI
     surnud, sest kiht võidab ka mobiilis (sama spets, hilisem) JA
     12-hero-mobile-polish kirjutab omakorda üle — kontrolli mõlemat.
4. **Polarity-lõks:** kihifailid laaditakse PÄRAST `theme/polarity.css`-i,
   lehefailid ENNE. Kui tõstad reegli lehefaili ja polarity määrab sama
   sihtmärki, hakkab polarity võitma → kontrolli iga tõstetava reegli kohta
   (dup-report näitab polarity-ristumisi). Kui kihi väärtus PEAB võitma,
   paranda väärtus polarity's endas (nagu tehti `--ui-box-muted`).
5. globals.css-ist import maha / ümber; vana fail `git rm`.
6. Snapshot → diff → puhas? → commit (üks fail = üks commit, inglise keeles,
   selgitusega MIKS; lõppu `Co-Authored-By: Claude <model> <noreply@anthropic.com>`).

## 6. Järelejäänud sammud (praeguse tasklisti numbrid)

Impordijärjekord globals.css-is on SÄILITATAV kuni fail kaob/voldiitakse.

- **#5 · 02-component-type** (201 r) → `components/component-type.css`
  (lehteülene komponenditüpograafia; 01-ga külgnev import, võib ka liita
  headings.css-iga üheks `components/typography.css`-iks — siis kommenteeri).
  Surnud konkurendid lehefailides: kaardi-h3 mõõdud, `.store-product-body h3`
  jms — NB lehefailide sildigruppide (0.78rem uppercase) h2-harud kuuluvad
  ülesandesse #12, ära siin topelt tee.
- **#6 · 03-store-catalog** (250 r) → shop.css. 13 täpset dup'i; kihis on
  spetsiifilisusvõimendusi (`.store-page .store-price strong`) — normaliseeri
  shop.css tasemele koos konkurendi kustutamisega. **4 polarity-ristumist** —
  kontrolli igaüht (§5.4).
- **#7 · 05-events-cards** (136 r) → events.css (16 dup'i).
- **#8 · 06-journal-cards** (142 r) → journal.css (23 dup'i — suurim kolle).
- **#9 · 07-events-journal-passes** (231 r) → events/journal + NB fail
  sisaldab `@media` sees `:root` tüpotokeneid (`--type-page-hero` jt mobiili
  väärtused) — need peavad minema `settings/tokens.css`-i baasploki JÄRELE
  (sama failis hilisem plokk võidab mobiilis).
- **#10 · 08-tools-material** (201 r) → tools.css (4 dup'i + 1
  polarity-ristumine).
- **#11 · 12-hero-mobile-polish** (305 r) → heroes.css mobiiliplokki (see on
  hero-süsteemi mobiiliosa, heroes.css on ta aus kodu). 3 dup'i 01-ga on juba
  lahendatud (01 volditud), kontrolli üle.
- **#12 · 15-section-headers** (346 r) → osalt `components/headings.css`
  (sektsioonipäiste süsteem), osalt lehefailid. Siin korista ka lehefailide
  sildigruppide surnud h2-harud (events/journal/tools/training/shop
  "0.78rem uppercase" grupid + hilisemad 0.7rem kordused).
- **#13 · karussell**: `carousel-legacy.css` + `carousel-system.css` +
  `carousel-type.css` on külgnevad impordid → liida üheks
  `components/carousel.css` (järjekord säilib → ohutu), SIIS sisemine dedup:
  legacy(09) vs system(10) dubleerivad reeglid — hilisem võidab, kustuta
  varasemad kaotajad. 4 dup'i card-polish(16)-ga → võitja carousel-type'i või
  card-polish'i, kumb on sihtmärgi aus kodu. NB `.store-kicker` viide
  carousel-type's kui veel alles → kustuta harud (klass on surnud).
- **#14 · kaardikroom**: `card-frames.css`(04) + `frames-shadows.css`(13) +
  `card-polish.css`(16) + `overlay-cards.css`(14) — EI OLE kõik külgnevad
  (vahel 05–12, 15) → liitmisel kontrolli ristumised vahepealsete failidega
  (pärast #5–#12 on vahepealsed kadunud → liitmine muutub ohutuks; tee see
  ülesanne VIIMASENA enne #15). Kaardivahede hoovad `--raio-event-eyebrow-top`
  ja `--raio-card-foot-lift` SÄILITA (memory: card-spacing-levers).
- **#15 · etapp C** (punktid 2–3 on JUBA TEHTUD Fable poolt):
  1. `pages/typography-cleanup/` kataloog peab olema tühi → kustuta;
  2. ✔ valvur on olemas: `scripts/css-duplicate-guard.mjs` + `npm run
     audit:css` (praegu FAIL 75 duplikaadiga — number peab voltimistega
     kahanema nullini; kasuta seda IGA voltimissammu edenemismõõdikuna);
  3. ✔ CLAUDE.md on loodud (raudreegel + audit:css kohustus);
  4. `npm run build` + snapshot-paarisjooks + lõppraport (ridade arv
     enne/pärast: algne 12 654 → loe kokku);
  5. uuenda memory `css-audit-progress.md` (etapp B+C valmis, commit'id).

## 7. Commit'i ja push'i kord

- Iga samm eraldi commit; ära sega omaniku failimuudatusi (`public/RAIO taust/`).
- Push + deploy AINULT kui omanik palub. Deploy: vt memory `deploy-to-server`
  (ssh sotsiaalai, `/home/ubuntu/apps/raio`, pm2 `raio`; CSS-muudatused ei
  vaja migratsioone ega `npm ci`-d).

## 8. Definition of done

- `pages/typography-cleanup/` ei eksisteeri; globals.css impordiloend on
  settings→base→layout→primitives→components→pages→theme, ilma
  üleminekukommentaarita;
- `npm run audit:css` läbib puhtalt (0 duplikaati);
- värske snapshot == etalon (v.a §4 müra); `npm run build` läbib;
- CLAUDE.md reegel + memory uuendatud; lõppraport omanikule eesti keeles.
