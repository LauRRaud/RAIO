import { TextureSlideshowClient } from "@/components/TextureSlideshowClient";
import { getTextureBackdrops } from "@/lib/payloadContent";

/* Serverikomponent: pildid + intervall tulevad Taustaslaidid globalist
   (admin), tühjad kategooriad langevad tagasi public/"RAIO taust" kausta.
   NB klientkomponendid (nt Header) ei saa seda importida — kasuta seal
   TextureSlideshowClient + getHeaderTextures() propina lehelt. */
export async function TextureSlideshow({ set = "dark" }) {
  const { interval, sets } = await getTextureBackdrops();
  const images = sets[set] || [];
  if (!images.length) return null;
  return <TextureSlideshowClient set={set} images={images} interval={interval} />;
}
