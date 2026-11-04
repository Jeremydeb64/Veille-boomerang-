import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Couleurs Boomerang (reprises de extension/newtab.css)
export const COLORS = {
  rose: "#ED1B54",
  noir: "#1D1D1B",
  gris: "#F0F0F0",
  grisTxt: "#A8A8A4",
};

export const FONT = "GT Walsheim";

const weights = [
  ["400", "gtw-regular"],
  ["500", "gtw-medium"],
  ["700", "gtw-bold"],
  ["900", "gtw-black"],
] as const;

export const fontsLoaded = Promise.all(
  weights.map(([weight, file]) =>
    loadFont({
      family: FONT,
      url: staticFile(`fonts/${file}.woff2`),
      weight,
    }),
  ),
);
