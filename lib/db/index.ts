// Public database API: callers can import domain operations without depending on file layout.
export { connectToDatabase } from "./connection";
export {
  getActivePlayerById,
  getPlayerByEmail,
  getPlayerById,
  listRankings,
} from "./players";
export {
  createFixture,
  getFixtureById,
  listFixtures,
  listOpenFixtures,
  updateFixture,
  type FixtureInput,
  type FixtureScope,
} from "./fixtures";
export {
  listPlayerResponses,
  listResponsesForFixtures,
  listResponsesForFixture,
  upsertAvailability,
} from "./availability";
export { getUserRoleByEmail, isAdminEmail } from "./roles";
export {
  createRankingPlayer,
  ensurePlayerRole,
  listRankingAccounts,
  saveRankingPositions,
} from "./rankings";
export { serializeFixture, serializeRankedPlayer } from "./serialize";
