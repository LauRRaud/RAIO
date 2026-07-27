/* Aktsepteerib kõiki kujusid, mida omanik võib admini kleepida: tavaline
   watch-link, jagamislink youtu.be, shorts, live, embed või paljas ID. Vigane
   või tühi väärtus annab null'i — kutsuja näitab siis lihtsalt pilti ja leht
   ei lagune katkise lingi pärast.

   Ühine fail, sest sama kontrolli teeb nii server (kas modaalis on üldse
   videoplokk?) kui klient (mis ID iframe'i läheb). */
export function youtubeId(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );

  return match ? match[1] : null;
}
