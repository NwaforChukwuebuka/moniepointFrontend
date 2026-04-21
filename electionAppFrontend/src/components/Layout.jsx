import { memo, useState } from "react";
import { Link, Outlet } from "react-router";
import { useLogoutVoterMutation, getApiErrorMessage } from "../apis/electionApi";
import { clearSessionEmail, getSessionEmail } from "../utils/session";

function Layout() {
  const [sessionEmail, setSession] = useState(getSessionEmail());
  const [feedback, setFeedback] = useState("");
  const [logoutVoter, { isLoading }] = useLogoutVoterMutation();

  async function handleLogout() {
    setFeedback("");
    if (!sessionEmail) {
      setFeedback("No active voter session.");
      return;
    }

    try {
      await logoutVoter(sessionEmail).unwrap();
      clearSessionEmail();
      setSession("");
      setFeedback("Logged out successfully.");
    } catch (error) {
      setFeedback(getApiErrorMessage(error));
    }
  }

  return (
    <>
      <header style={{ background: "#0f172a", color: "#fff", padding: "1rem 0" }}>
        <div
          style={{
            width: "min(960px, 92%)",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <nav style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/">Elections</Link>
            <Link to="/auth/register">Register</Link>
            {sessionEmail ? (
              <button type="button" onClick={handleLogout} disabled={isLoading} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, font: "inherit", textDecoration: "underline" }}>
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <Link to="/auth/login">Login</Link>
            )}
          </nav>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <small>{sessionEmail ? `Voter: ${sessionEmail}` : "Not logged in"}</small>
          </div>
        </div>
      </header>
      <main className="page">
        {feedback && <p>{feedback}</p>}
        <Outlet context={{ sessionEmail, setSessionEmail: setSession }} />
      </main>
    </>
  );
}

export default memo(Layout);
