// Charte graphique reprise du PDF « Proposition de reprise et plan de financement ».
export const C = {
  blue: "#123A91", // bleu principal (titres, cartes pleines, en-têtes de tableau)
  navy: "#1E2A3B", // texte foncé, bandeau « Tu restes majoritaire »
  mid: "#5B7BC4", // chevron « Accompagner »
  light: "#F4F7FD", // fonds de cartes et de séparateurs
  rowAlt: "#DCE5F5", // lignes de tableau mises en avant
  grey: "#5B6577", // sous-titres, pied de page
  rule: "#D5DCE8", // filets clairs
  red: "#C0262D", // soldes négatifs
  white: "#FFFFFF",
  pale: "#A9BCE6", // libellé clair sur fond foncé
};

export const FONT_TITLE = "Carlito, Calibri, sans-serif"; // équivalent métrique de Calibri Bold
export const FONT_BODY = "'Liberation Sans', Arial, sans-serif"; // équivalent métrique d'Arial

// Le PDF fait 1333 px de large ; la vidéo 1920 px. Facteur d'échelle :
export const K = 1920 / 1333;
export const px = (v: number) => Math.round(v * K);

export const FPS = 30;
