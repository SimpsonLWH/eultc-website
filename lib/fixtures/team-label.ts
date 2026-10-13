import type { TeamGender } from "@/lib/db/models/fixture";

// Render persisted gender/team values with the club's familiar team naming convention.
export function formatTeamLabel(gender: TeamGender, teamNumber: number): string {
  const genderLabel = gender === "male" ? "Men's" : "Women's";
  return `${genderLabel} ${teamNumber}${ordinalSuffix(teamNumber)} team`;
}

// Handle 11th-13th before applying the ordinary last-digit ordinal suffix.
function ordinalSuffix(value: number): string {
  const lastTwoDigits = value % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}