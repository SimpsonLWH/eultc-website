export type PreviewPlayer = {
  rank: number;
  name: string;
  previewEmail: string;
};

export type PreviewFixture = {
  matchWeek: number;
  date: string;
  teamNumber: number;
  opponent: string;
  homeOrAway: "home" | "away";
};

export type SkippedCupTie = {
  matchWeek: number;
  teamNumber: number;
};

export type PreviewFixtureParseResult = {
  fixtures: PreviewFixture[];
  skippedCupTies: SkippedCupTie[];
  warnings: string[];
};

// Canonical Wednesday dates inferred from the organiser's weekly sequence.
// The source stores matchweeks 2 and 6 as July and April dates due to locale.
export const CANONICAL_MATCHWEEK_DATES: Readonly<Record<number, string>> = {
  1: "2026-09-30",
  2: "2026-10-07",
  3: "2026-10-14",
  4: "2026-10-21",
  5: "2026-10-28",
  6: "2026-11-04",
  7: "2026-11-11",
  8: "2026-11-18",
  9: "2026-11-25",
};

function cellText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim();
}

function requireText(value: unknown, label: string): string {
  const text = cellText(value);
  if (!text) {
    throw new Error(`${label} is required.`);
  }
  return text;
}

function requireInteger(value: unknown, label: string): number {
  const number =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }
  return number;
}

function isBlankValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

function isBlankRow(row: readonly unknown[]): boolean {
  return row.every(isBlankValue);
}

function previewEmail(rank: number): string {
  return `preview-rank-${String(rank).padStart(2, "0")}@preview.invalid`;
}

/**
 * Convert the organiser's Ranking List into the only player fields needed by
 * the public preview. Emails are deliberately synthetic and never editable.
 */
export function parseRankingRows(rows: readonly unknown[][]): PreviewPlayer[] {
  if (rows.length < 2) {
    throw new Error("Ranking List must contain a header and at least one player.");
  }

  const players: PreviewPlayer[] = [];
  let expectedRank = 1;

  for (const [index, row] of rows.slice(1).entries()) {
    if (isBlankRow(row)) {
      continue;
    }

    const rowNumber = index + 2;
    const rank = requireInteger(row[0], `Ranking List row ${rowNumber} rank`);
    if (rank !== expectedRank) {
      throw new Error(
        `Ranking List row ${rowNumber} has rank ${rank}; expected rank ${expectedRank}.`
      );
    }

    const name = requireText(row[1], `Ranking List row ${rowNumber} name`);
    players.push({ rank, name, previewEmail: previewEmail(rank) });
    expectedRank += 1;
  }

  if (players.length === 0) {
    throw new Error("Ranking List contains no players.");
  }

  return players;
}

function parseFixtureCell(
  value: unknown,
  matchWeek: number,
  teamNumber: number
): PreviewFixture | SkippedCupTie | null {
  const text = cellText(value);
  if (!text || /^no fixture$/i.test(text)) {
    return null;
  }
  if (/^cup tie$/i.test(text)) {
    return { matchWeek, teamNumber };
  }

  const match = /^(.*?)\s+-\s+(home|away)$/i.exec(text);
  if (!match?.[1] || !match[2]) {
    throw new Error(
      `Matchweek ${matchWeek} M${teamNumber} must end in Home or Away.`
    );
  }

  const opponent = match[1].replace(/\s+/g, " ").trim();
  if (!opponent) {
    throw new Error(`Matchweek ${matchWeek} M${teamNumber} opponent is required.`);
  }

  return {
    matchWeek,
    date: "",
    teamNumber,
    opponent,
    homeOrAway: match[2].toLowerCase() === "home" ? "home" : "away",
  };
}

/**
 * Parse the organiser's fixture matrix. The matrix has one row per matchweek
 * and one column each for M1-M5. Cup ties are reported rather than guessed.
 */
export function parseFixtureRows(
  rows: readonly unknown[][]
): PreviewFixtureParseResult {
  const header = rows[0];
  if (
    !header ||
    cellText(header[0]) !== "Match Week" ||
    cellText(header[1]) !== "Match Date" ||
    header.slice(2, 7).some((value, index) => cellText(value) !== `M${index + 1}`)
  ) {
    throw new Error("Fixture List has an unexpected header.");
  }

  const fixtures: PreviewFixture[] = [];
  const skippedCupTies: SkippedCupTie[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();

  for (const [index, row] of rows.slice(1).entries()) {
    if (isBlankRow(row)) {
      continue;
    }

    const rowNumber = index + 2;
    const matchWeek = requireInteger(
      row[0],
      `Fixture List row ${rowNumber} matchweek`
    );
    const canonicalDate = CANONICAL_MATCHWEEK_DATES[matchWeek];
    if (!canonicalDate) {
      throw new Error(`Matchweek ${matchWeek} has no canonical preview date.`);
    }
    if (isBlankValue(row[1])) {
      throw new Error(`Fixture List row ${rowNumber} match date is required.`);
    }

    for (let teamNumber = 1; teamNumber <= 5; teamNumber += 1) {
      const parsed = parseFixtureCell(row[teamNumber + 1], matchWeek, teamNumber);
      if (!parsed) {
        continue;
      }
      if ("opponent" in parsed) {
        const key = `${matchWeek}:${teamNumber}`;
        if (seen.has(key)) {
          throw new Error(`Matchweek ${matchWeek} M${teamNumber} is duplicated.`);
        }
        seen.add(key);
        fixtures.push({ ...parsed, date: canonicalDate });
      } else {
        skippedCupTies.push(parsed);
        warnings.push(
          `Skipped unresolved cup tie at Matchweek ${matchWeek} M${teamNumber}.`
        );
      }
    }
  }

  if (fixtures.length === 0) {
    throw new Error("Fixture List contains no importable fixtures.");
  }

  return {
    fixtures: fixtures.sort(
      (a, b) =>
        a.matchWeek - b.matchWeek || a.teamNumber - b.teamNumber
    ),
    skippedCupTies,
    warnings,
  };
}
