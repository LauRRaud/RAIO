/* Struktuurandmete (schema.org) skriptiplokk. JSON.stringify + replace hoiab
   ära </script> injektsiooni sisust tulevate stringide kaudu. */
export function JsonLd({ data }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
