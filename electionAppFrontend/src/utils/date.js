export function formatDateTime(value) {
  if (!value) return "N/A";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleString();
}

export function isVotingOpen(election) {
  if (!election?.votingOpensAt || !election?.votingClosesAt) return false;
  const now = Date.now();
  const opensAt = new Date(election.votingOpensAt).getTime();
  const closesAt = new Date(election.votingClosesAt).getTime();
  if (Number.isNaN(opensAt) || Number.isNaN(closesAt)) return false;
  return now >= opensAt && now <= closesAt;
}
