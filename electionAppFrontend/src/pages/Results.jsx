import { memo, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getApiErrorMessage, useGetResultsQuery } from "../apis/electionApi";
import StatusMessage from "../components/StatusMessage";
import FeedbackDialog from "../components/FeedbackDialog";

function Results() {
  const { electionId } = useParams();
  const { data, isLoading, isError, error } = useGetResultsQuery(electionId);
  const [errorDialogOpen, setErrorDialogOpen] = useState(true);

  useEffect(() => {
    if (isError) setErrorDialogOpen(true);
  }, [isError]);

  if (isLoading) {
    return <StatusMessage>Loading results...</StatusMessage>;
  }

  if (isError) {
    return (
      <section className="page">
        <h2>Election Results</h2>
        <p style={{ color: "#64748b" }}>Results could not be loaded.</p>
        <FeedbackDialog open={errorDialogOpen} kind="error" onClose={() => setErrorDialogOpen(false)}>
          {getApiErrorMessage(error)}
        </FeedbackDialog>
      </section>
    );
  }

  return (
    <section>
      <h2>Election Results</h2>
      <p>Total votes: {data?.totalVotes ?? 0}</p>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {(data?.tallies ?? []).map((tally) => (
          <article className="card" key={tally.candidateId}>
            <h3>{tally.candidateName}</h3>
            <p>Party: {tally.partyCode}</p>
            <p>Votes: {tally.voteCount}</p>
          </article>
        ))}
      </div>
      <p style={{ marginTop: "1rem" }}>
        <Link to={`/elections/${electionId}/candidates`}>Back to candidates</Link>
      </p>
    </section>
  );
}

export default memo(Results);
