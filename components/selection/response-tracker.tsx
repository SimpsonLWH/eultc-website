// Render response totals, the ranked response table, and the no-response roster.
import Card from "@/components/ui/card";

// Keep row props scalar so server-rendered content does not expose model objects.
export type TrackerResponse = {
  id: string;
  rank: number;
  name: string;
  status: "available" | "unavailable";
  note: string | null;
  updatedAt: Date;
};

// Render the admin-only summary and responsive desktop/mobile response lists.
export default function ResponseTracker({
  available,
  unavailable,
  noResponse,
  total,
  respondedPlayers,
  noResponsePlayers,
}: {
  available: number;
  unavailable: number;
  noResponse: number;
  total: number;
  respondedPlayers: TrackerResponse[];
  noResponsePlayers: { id: string; rank: number; name: string }[];
}) {
  const responded = available + unavailable;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-club-950">
          Response summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Responded {responded} of {total}, available {available}, unavailable{" "}
          {unavailable}, no response {noResponse}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {responded + noResponse} active players counted
        </p>
      </Card>

      <section aria-labelledby="responded-heading" className="space-y-3">
        <h2
          id="responded-heading"
          className="text-lg font-semibold text-club-950"
        >
          Responses ({responded})
        </h2>
        {respondedPlayers.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            No active players have responded yet.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-md border border-slate-200 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Rank
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Player
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Answer
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Note
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {respondedPlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="px-4 py-3 text-slate-600">{player.rank}</td>
                      <th
                        className="px-4 py-3 font-medium text-slate-900"
                        scope="row"
                      >
                        {player.name}
                      </th>
                      <td className="px-4 py-3">
                        <AnswerLabel status={player.status} />
                      </td>
                      <td className="max-w-xs px-4 py-3 text-slate-600">
                        {player.note || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        <ResponseTimestamp value={player.updatedAt} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {respondedPlayers.map((player) => (
                <Card key={player.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Rank {player.rank}
                      </p>
                      <h3 className="mt-1 font-semibold text-club-950">
                        {player.name}
                      </h3>
                    </div>
                    <AnswerLabel status={player.status} />
                  </div>
                  <p className="mt-3 text-sm leading-5 text-slate-600">
                    <span className="font-medium text-slate-700">Note:</span>{" "}
                    {player.note || "—"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Updated <ResponseTimestamp value={player.updatedAt} />
                  </p>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="no-response-heading" className="space-y-3">
        <h2
          id="no-response-heading"
          className="text-lg font-semibold text-club-950"
        >
          No response ({noResponse})
        </h2>
        {noResponsePlayers.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            Every active player has responded.
          </p>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-md border border-slate-200 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Rank
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Player
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Answer
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {noResponsePlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="px-4 py-3 text-slate-600">{player.rank}</td>
                      <th
                        className="px-4 py-3 font-medium text-slate-900"
                        scope="row"
                      >
                        {player.name}
                      </th>
                      <td className="px-4 py-3 text-slate-500">No response</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="space-y-3 md:hidden">
              {noResponsePlayers.map((player) => (
                <li key={player.id}>
                  <Card className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Rank {player.rank}
                      </p>
                      <p className="mt-1 font-semibold text-club-950">
                        {player.name}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-slate-500">
                      No response
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

// Use text as well as color to make each availability answer unambiguous.
function AnswerLabel({ status }: { status: TrackerResponse["status"] }) {
  const isAvailable = status === "available";

  return (
    <span
      className={
        isAvailable
          ? "inline-flex rounded-full bg-club-50 px-2.5 py-1 text-xs font-semibold text-club-800"
          : "inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800"
      }
    >
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  );
}

// Format response timestamps in the same London timezone as fixture dates.
function ResponseTimestamp({ value }: { value: Date }) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}
