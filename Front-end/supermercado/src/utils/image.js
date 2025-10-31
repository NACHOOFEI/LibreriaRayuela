// Utilidad para resolver la URL de una imagen.
// Si `img` ya es una URL absoluta la devuelve tal cual.
// Si es un path relativo (p.ej. nombre de archivo), concatena con
// VITE_S3_BASE_URL (defínelo en .env: VITE_S3_BASE_URL=https://mi-bucket.s3.amazonaws.com)
/*export function getImageUrl(img) {
  if (!img) return "";
  if (typeof img !== "string") return "";

  // Si ya es una URL absoluta o esquema protocol-relative
  if (/^(https?:)?\/\//i.test(img)) return img;

  const base = import.meta.env.VITE_S3_BASE_URL || "";
  if (!base) return img; // si no hay base, devolvemos lo que venga

  // normalize slashes
  const b = base.replace(/\/$/, "");
  const p = img.replace(/^\//, "");
  return `${b}/${p}`;
}
esto se va a usar despues cuando haya imagenes en S3
export default getImageUrl;
*/
