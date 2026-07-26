import { NextResponse } from "next/server";

/* Ainus ülesanne: öelda juurlayoutile, millisel teel päring on.
   <html lang> elab juurlayoutis (app/(frontend)/layout.jsx) ja <html> ei ole
   nested layout'ist ülekirjutatav — samas ei näe juurlayout pathname'i.
   Ilma selleta teataksid /en lehed end eesti keelsena.

   Next 16 nimi on proxy.js (endine middleware.js). Muud ülesannet siin ei
   ole — päringut ei kirjutata ümber ega suunata. */
export default function proxy(request) {
  const headers = new Headers(request.headers);
  headers.set("x-raio-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico).*)"]
};
