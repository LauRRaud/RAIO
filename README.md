# RAIO

RAIO website and shop built with Next.js and Payload CMS.

## Admin

Open `/admin` and choose **Veebilehe haldus → Lehtede sisu ja kujundus** to edit page sections, typography, colors, images, navigation labels and the footer. Carousel cards are managed in their clearly named collections: **Treeningud**, **Vahendite kaardid**, **Sündmused**, **Tooted** and **Journal artiklid**.

Empty editor fields keep the current website copy and design, so the editor can be adopted section by section. Estonian and English are edited through Payload's locale switcher.

## Production

Copy `.env.example` to the deployment environment and configure a real `DATABASE_URL` and a strong, unique `PAYLOAD_SECRET`. Never commit the real values.

Run the production pipeline with:

```bash
npm run ci
npm run start
```

`npm run ci` applies pending PostgreSQL migrations before building the Next.js application. Production initialization intentionally fails when `PAYLOAD_SECRET` is missing.
