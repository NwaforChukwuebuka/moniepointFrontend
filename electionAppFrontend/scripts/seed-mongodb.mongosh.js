/**
 * Seed elections + candidates for electionApp (Spring) MongoDB.
 *
 * Database URI (from backend application.properties):
 *   mongodb://localhost:27017/nigerian_election
 *
 * Run from project root:
 *   mongosh mongodb://localhost:27017/nigerian_election scripts/seed-mongodb.mongosh.js
 *
 * Or from mongo shell:
 *   load("scripts/seed-mongodb.mongosh.js")
 *
 * This script uses string _id values (e1, e2, c1, …) so they are stable and match the UI mock.
 * It only touches collections `elections` and `candidates`. It does not delete existing data.
 * To replace everything, uncomment the deleteMany blocks at the bottom first (see WARNING).
 */

/* global db, ISODate */

const elections = [
  {
    _id: "e1",
    title: "2026 State Gubernatorial",
    level: "STATE",
    votingOpensAt: ISODate("2026-04-20T08:00:00.000Z"),
    votingClosesAt: ISODate("2026-04-22T18:00:00.000Z"),
    resultsPublished: false,
  },
  {
    _id: "e2",
    title: "House of Reps District 3",
    level: "FEDERAL",
    votingOpensAt: ISODate("2026-04-20T08:00:00.000Z"),
    votingClosesAt: ISODate("2026-04-22T20:00:00.000Z"),
    resultsPublished: false,
  },
  {
    _id: "e3",
    title: "Local Council Ward 7",
    level: "LOCAL",
    votingOpensAt: ISODate("2026-05-10T08:00:00.000Z"),
    votingClosesAt: ISODate("2026-05-10T20:00:00.000Z"),
    resultsPublished: false,
  },
  {
    _id: "e0",
    title: "Senate By-Election",
    level: "FEDERAL",
    votingOpensAt: ISODate("2026-03-01T08:00:00.000Z"),
    votingClosesAt: ISODate("2026-04-10T20:00:00.000Z"),
    resultsPublished: true,
  },
];

const candidates = [
  // e1 — Governor
  { _id: "c1", electionId: "e1", name: "Amara Okafor", partyCode: "APP", position: "Governor" },
  { _id: "c2", electionId: "e1", name: "Bashir Musa", partyCode: "NPP", position: "Governor" },
  { _id: "c3", electionId: "e1", name: "Chidinma Eze", partyCode: "UDP", position: "Governor" },
  // e2 — House of Reps
  { _id: "c4", electionId: "e2", name: "David Adeola", partyCode: "APP", position: "Rep, Dist. 3" },
  { _id: "c5", electionId: "e2", name: "Fatima Bello", partyCode: "NPP", position: "Rep, Dist. 3" },
  // e3 — Councillor
  { _id: "c6", electionId: "e3", name: "Grace Okonkwo", partyCode: "IND", position: "Councillor" },
  { _id: "c7", electionId: "e3", name: "Henry Dike", partyCode: "UDP", position: "Councillor" },
  { _id: "c8", electionId: "e3", name: "Ify Nwachukwu", partyCode: "APP", position: "Councillor" },
  // e0 — closed election (candidates aligned with typical results tallies)
  { _id: "r1", electionId: "e0", name: "James Obi", partyCode: "NPP", position: "Senator" },
  { _id: "r2", electionId: "e0", name: "Kemi Adeyemi", partyCode: "APP", position: "Senator" },
  { _id: "r3", electionId: "e0", name: "Leke Salami", partyCode: "IND", position: "Senator" },
];

// Upsert by _id so re-running is safe
for (const doc of elections) {
  db.elections.replaceOne({ _id: doc._id }, doc, { upsert: true });
}
for (const doc of candidates) {
  db.candidates.replaceOne({ _id: doc._id }, doc, { upsert: true });
}

print("Seeded elections: " + elections.length);
print("Seeded candidates: " + candidates.length);

/*
 * OPTIONAL — remove prior seed IDs only (uncomment if you need a clean re-seed):
 *
 * WARNING: This deletes documents whose _id is in the lists above. Adjust if you use other ids.
 *
 * db.elections.deleteMany({ _id: { $in: ["e0","e1","e2","e3"] } });
 * db.candidates.deleteMany({ _id: { $in: ["c1","c2","c3","c4","c5","c6","c7","c8","r1","r2","r3"] } });
 */
