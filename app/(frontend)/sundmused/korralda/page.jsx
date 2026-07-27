import { redirect } from "next/navigation";

/* /sundmused/korralda oli lühikest aega (2026-07-27) eraldi alaleht, enne kui
   sisust sai sündmuste lehe modaal. Link võib elada järjehoidjates ja
   brauserite ajaloos — #korralda avab sama sisu modaalina. */
export default function KorraldaRedirect() {
  redirect("/sundmused#korralda");
}
