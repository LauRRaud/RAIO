/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
/* ERAND: allpool on KÄSITSI lisatud HEAD (2026-07-27). Kui Payload selle faili
   kunagi üle kirjutab, kaob ka HEAD ja Facebooki eelvaated lähevad uuesti
   katki — vt kommentaari eksporti juures. */
import config from "@payload-config";
import "@payloadcms/next/css";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT
} from "@payloadcms/next/routes";

const restGet = REST_GET(config);

export const GET = restGet;
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);

/* HEAD /api/media/file/<pilt> andis 404 ja Facebooki kraabits luges selle
   pealt iga meediapildi katkiseks ("Provided og:image URL … could not be
   processed as an image"), viskas meie jagamiskaardi minema ja korjas asemele
   suvalise pildi lehelt. Puudutas KÕIKI meediapilte, ka tootelehtede omi.

   Next annab HEAD-i GET-ekspordile edasi, aga Payload'i oma router vaatab
   päringu meetodit ja HEAD-ile käsitlejat ei leia -> 404. Seepärast teeme
   ise GET-päringu ja tagastame sellest ainult staatuse ja päised: HTTP nõuab,
   et HEAD-vastusel keha ei oleks, aga päised peavad olema samad mis GET-il. */
export const HEAD = async (request: Request, context: unknown) => {
  const response = await restGet(
    new Request(request.url, { method: "GET", headers: request.headers }),
    context
  );

  return new Response(null, { status: response.status, headers: response.headers });
};
