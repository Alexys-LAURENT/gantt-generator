/**
 * Génère une couleur pastel unique à partir d'un nom de groupe
 * Utilise un hash pour garantir la cohérence des couleurs
 */
export function generatePastelColorFromText(text: string): string {
  // Générer un hash simple à partir du texte
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Utiliser le hash pour générer des composantes RGB pastel (entre 180 et 255)
  const red = 180 + (Math.abs(hash) % 76);
  const green = 180 + (Math.abs(hash >> 8) % 76);
  const blue = 180 + (Math.abs(hash >> 16) % 76);

  // Convertir en hexadécimal
  const toHex = (value: number) => {
    const hex = Math.round(value).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

/**
 * Génère une couleur vive unique pour une flèche de dépendance
 * Basé sur les clés source et cible pour garantir l'unicité
 */
export function generateArrowColorFromKeys(
  sourceKey: number,
  targetKey: number
): string {
  const hash = sourceKey * 1000 + targetKey;
  const hue = hash % 360;
  // Saturation et luminosité pour des couleurs vives mais pas trop flashy
  return `hsl(${hue}, 70%, 50%)`;
}
