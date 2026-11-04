// Lit la veille du jour directement depuis ../data/articles.json (mis à jour par GitHub Actions).
import raw from "../../data/articles.json";

type Article = {
  title: string;
  link: string;
  date: string;
  summary: string;
  source: string;
  section: string;
};

export type Headline = { title: string; source: string };

export type SectionData = {
  id: string;
  label: string;
  count: number;
  headlines: Headline[];
};

export type RecapProps = {
  dateLabel: string;
  articleCount: number;
  sourceCount: number;
  sections: SectionData[];
};

const SECTIONS: { id: string; label: string }[] = [
  { id: "valais", label: "Valais" },
  { id: "romandie", label: "Romandie" },
  { id: "com-suisse", label: "Com’ Suisse" },
  { id: "com-france", label: "Com’ France" },
  { id: "international", label: "International" },
];

const HEADLINES_PER_SECTION = 3;
const MAX_TITLE = 110;

const shorten = (s: string) => {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= MAX_TITLE) return t;
  return t.slice(0, t.lastIndexOf(" ", MAX_TITLE)) + "…";
};

// Les plus récents d'abord, en variant les sources quand c'est possible.
const pickHeadlines = (articles: Article[]): Headline[] => {
  // Écarte les titres d'émission du type « Mardi 03.11.2026 » ou « TAGESINFO vom 03.11.2026 »
  const usable = articles.filter(
    (a) => a.title.trim().split(/\s+/).length >= 5,
  );
  const sorted = [...(usable.length ? usable : articles)].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const picked: Article[] = [];
  const usedSources = new Set<string>();
  for (const a of sorted) {
    if (picked.length >= HEADLINES_PER_SECTION) break;
    if (!usedSources.has(a.source)) {
      picked.push(a);
      usedSources.add(a.source);
    }
  }
  for (const a of sorted) {
    if (picked.length >= HEADLINES_PER_SECTION) break;
    if (!picked.includes(a)) picked.push(a);
  }
  return picked.map((a) => ({ title: shorten(a.title), source: a.source }));
};

export const buildRecap = (): RecapProps => {
  const articles = (raw as { articles: Article[] }).articles;
  const generatedAt = new Date((raw as { generated_at: string }).generated_at);

  const dateLabel = generatedAt.toLocaleDateString("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich",
  });

  const sections = SECTIONS.map(({ id, label }) => {
    const inSection = articles.filter((a) => a.section === id);
    return {
      id,
      label,
      count: inSection.length,
      headlines: pickHeadlines(inSection),
    };
  }).filter((s) => s.count > 0);

  return {
    dateLabel: dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1),
    articleCount: articles.length,
    sourceCount: new Set(articles.map((a) => a.source)).size,
    sections,
  };
};
