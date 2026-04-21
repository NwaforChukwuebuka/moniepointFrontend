import { memo, useEffect, useState } from "react";
import { Link } from "react-router";
import { useGetElectionsQuery } from "../apis/electionApi";
import { formatDateTime, isVotingOpen } from "../utils/date";
import StatusMessage from "../components/StatusMessage";
import FeedbackDialog from "../components/FeedbackDialog";

function Elections() {
  const { data: elections = [], isLoading, isError, error } = useGetElectionsQuery();
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);

  useEffect(() => {
    if (isError) setErrorDialogOpen(true);
  }, [isError]);

  if (isLoading) {
    return <StatusMessage>Loading elections...</StatusMessage>;
  }

  if (isError) {
    return (
      <section className="page">
        <h2>Available Elections</h2>
        <p style={{ color: "#64748b" }}>Unable to load elections. Try again later.</p>
        <FeedbackDialog open={errorDialogOpen} kind="error" onClose={() => setErrorDialogOpen(false)}>
          {error?.data || "Failed to fetch elections."}
        </FeedbackDialog>
      </section>
    );
  }

  return (
    <section>
      <h2>Available Elections</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        {elections.map((election) => (
          <article className="card" key={election.id}>
            <h3>{election.title}</h3>
            <p>Level: {election.level}</p>
            <p>Opens: {formatDateTime(election.votingOpensAt)}</p>
            <p>Closes: {formatDateTime(election.votingClosesAt)}</p>
            <p>Status: {isVotingOpen(election) ? "Voting open" : "Voting closed"}</p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link to={`/elections/${election.id}/candidates`}>View Candidates</Link>
              <Link to={`/elections/${election.id}/results`}>View Results</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default memo(Elections);
