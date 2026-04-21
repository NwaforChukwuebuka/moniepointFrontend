import { memo, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router";
import {
  getApiErrorMessage,
  useCastVoteMutation,
  useGetCandidatesQuery,
  useGetElectionsQuery,
} from "../apis/electionApi";
import { getSessionEmail } from "../utils/session";
import { formatDateTime, isVotingOpen } from "../utils/date";
import StatusMessage from "../components/StatusMessage";
import FeedbackDialog from "../components/FeedbackDialog";

function Candidates() {
  const { electionId } = useParams();
  const context = useOutletContext();
  const sessionEmail = context?.sessionEmail || getSessionEmail();
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [feedback, setFeedback] = useState({ open: false, kind: "info", message: "" });
  const [fetchErrorDialogOpen, setFetchErrorDialogOpen] = useState(true);

  const { data: candidates = [], isLoading, isError, error } = useGetCandidatesQuery(electionId);
  const { data: elections = [] } = useGetElectionsQuery();
  const [castVote, { isLoading: isCastingVote }] = useCastVoteMutation();

  const currentElection = useMemo(
    () => elections.find((election) => election.id === electionId),
    [electionId, elections]
  );
  const votingOpen = isVotingOpen(currentElection);

  useEffect(() => {
    if (isError) setFetchErrorDialogOpen(true);
  }, [isError]);

  async function handleVote() {
    setFeedback({ open: false, kind: "info", message: "" });

    if (!sessionEmail) {
      setFeedback({ open: true, kind: "warning", message: "Login is required before casting a vote." });
      return;
    }

    if (!selectedCandidateId) {
      setFeedback({ open: true, kind: "warning", message: "Select a candidate before submitting your vote." });
      return;
    }

    if (!votingOpen) {
      setFeedback({ open: true, kind: "error", message: "Voting is currently closed for this election." });
      return;
    }

    try {
      const response = await castVote({
        voterEmail: sessionEmail,
        electionId,
        candidateId: selectedCandidateId,
      }).unwrap();
      setFeedback({ open: true, kind: "success", message: response?.message || "Vote submitted successfully." });
    } catch (submissionError) {
      setFeedback({ open: true, kind: "error", message: getApiErrorMessage(submissionError) });
    }
  }

  if (isLoading) {
    return <StatusMessage>Loading candidates...</StatusMessage>;
  }

  if (isError) {
    return (
      <section className="page">
        <h2>Candidates</h2>
        <p style={{ color: "#64748b" }}>Candidates could not be loaded.</p>
        <FeedbackDialog open={fetchErrorDialogOpen} kind="error" onClose={() => setFetchErrorDialogOpen(false)}>
          {getApiErrorMessage(error)}
        </FeedbackDialog>
      </section>
    );
  }

  return (
    <section>
      <h2>Candidates</h2>
      {currentElection && (
        <StatusMessage kind={votingOpen ? "success" : "info"}>
          Voting window: {formatDateTime(currentElection.votingOpensAt)} -{" "}
          {formatDateTime(currentElection.votingClosesAt)}
        </StatusMessage>
      )}
      {!sessionEmail && (
        <StatusMessage kind="info">
          You are not logged in. <Link to="/auth/login">Login</Link> to vote.
        </StatusMessage>
      )}
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {candidates.map((candidate) => (
          <label className="card" key={candidate.id} style={{ display: "block" }}>
            <input
              type="radio"
              name="candidateId"
              value={candidate.id}
              checked={selectedCandidateId === candidate.id}
              onChange={() => setSelectedCandidateId(candidate.id)}
            />{" "}
            <strong>{candidate.name}</strong> ({candidate.partyCode}) - {candidate.position}
          </label>
        ))}
      </div>
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="button" onClick={handleVote} disabled={isCastingVote || !votingOpen}>
          {isCastingVote ? "Submitting..." : "Cast Vote"}
        </button>
        <Link to={`/elections/${electionId}/results`}>View Results</Link>
      </div>
      <FeedbackDialog open={feedback.open} kind={feedback.kind} onClose={() => setFeedback((f) => ({ ...f, open: false }))}>
        {feedback.message}
      </FeedbackDialog>
    </section>
  );
}

export default memo(Candidates);
