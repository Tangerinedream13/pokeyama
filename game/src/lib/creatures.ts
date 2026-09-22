import fs from "fs";
import path from "path";

export interface CreatureStats {
  hp: number;
  attack: number;
  defense: number;
  magic: number;
  speed: number;
  luck: number;
}

export interface Creature {
  number: string;
  slug: string;
  name: string;
  subtitle: string;
  type: string;
  habitat: string;
  temperament: string;
  battleStyle: string;
  description: string;
  battleMoves: string[];
  signatureMoveName: string;
  signatureMoveDescription: string;
  stats: CreatureStats;
  evolutionPrevious: string;
  evolutionNext: string;
  rarity: string;
  image: string;
}

const CREATURES_DIR = path.join(process.cwd(), "..", "creatures");

/** Splits a creature markdown file into its "## Heading" sections, keyed in file order. */
function splitSections(content: string): Map<string, string> {
  const sections = new Map<string, string>();
  const headingRegex = /^##\s+(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];

  for (let i = 0; i < matches.length; i++) {
    const heading = matches[i][1].trim();
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : content.length;
    sections.set(heading, content.slice(start, end).trim());
  }

  return sections;
}

function parseKeyValueLines(body: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of body.split("\n")) {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      result[match[1].trim()] = match[2].trim();
    }
  }
  return result;
}

function parseCreatureFile(filename: string): Creature {
  const filePath = path.join(CREATURES_DIR, filename);
  const content = fs.readFileSync(filePath, "utf-8");

  const slug = filename.replace(/^\d+-/, "").replace(/\.md$/, "");
  const titleMatch = content.match(/^#\s*(\d+)\s*-\s*(.+)$/m);
  const number = titleMatch?.[1] ?? "000";
  const name = titleMatch?.[2]?.trim() ?? slug.toUpperCase();

  const sections = splitSections(content);
  const [subtitle, overviewBody] = [...sections.entries()][0] ?? ["", ""];
  const overview = parseKeyValueLines(overviewBody);

  const battleMovesBody = sections.get("Battle Moves") ?? "";
  const battleMoves = battleMovesBody
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);

  const signatureBody = (sections.get("Signature Move") ?? "")
    .split("\n")
    .filter((l) => l.trim());
  const signatureMoveName = signatureBody[0]?.trim() ?? "";
  const signatureMoveDescription = signatureBody.slice(1).join(" ").trim();

  const statsBody = parseKeyValueLines(sections.get("Stats") ?? "");
  const stats: CreatureStats = {
    hp: Number(statsBody["HP"] ?? 0),
    attack: Number(statsBody["Attack"] ?? 0),
    defense: Number(statsBody["Defense"] ?? 0),
    magic: Number(statsBody["Magic"] ?? 0),
    speed: Number(statsBody["Speed"] ?? 0),
    luck: Number(statsBody["Luck"] ?? 0),
  };

  const evolutionBody = parseKeyValueLines(sections.get("Evolution") ?? "");

  return {
    number,
    slug,
    name,
    subtitle,
    type: overview["Type"] ?? "",
    habitat: overview["Habitat"] ?? "",
    temperament: overview["Temperament"] ?? "",
    battleStyle: overview["Battle Style"] ?? "",
    description: (sections.get("Description") ?? "").trim(),
    battleMoves,
    signatureMoveName,
    signatureMoveDescription,
    stats,
    evolutionPrevious: evolutionBody["Previous"] ?? "None",
    evolutionNext: evolutionBody["Next"] ?? "None",
    rarity: (sections.get("Rarity") ?? "").trim(),
    image: `/images/${slug}.png`,
  };
}

export function getAllCreatures(): Creature[] {
  const files = fs.readdirSync(CREATURES_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map(parseCreatureFile)
    .sort((a, b) => a.number.localeCompare(b.number));
}

export function getCreatureBySlug(slug: string): Creature | undefined {
  return getAllCreatures().find((c) => c.slug === slug);
}
