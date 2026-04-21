import { memo, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { getApiErrorMessage, useLoginVoterMutation } from "../apis/electionApi";
import { setSessionEmail } from "../utils/session";
import FeedbackDialog from "../components/FeedbackDialog";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [dialog, setDialog] = useState({ open: false, kind: "info", message: "" });
  const navigateAfterClose = useRef(false);
  const [loginVoter, { isLoading }] = useLoginVoterMutation();
  const navigate = useNavigate();
  const context = useOutletContext();

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((previous) => ({ ...previous, [name]: value }));
  }

  function closeDialog() {
    setDialog((d) => ({ ...d, open: false }));
    if (navigateAfterClose.current) {
      navigateAfterClose.current = false;
      navigate("/");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setDialog({ open: false, kind: "info", message: "" });

    try {
      const response = await loginVoter(credentials).unwrap();
      const email = response?.email || credentials.email;
      setSessionEmail(email);
      context?.setSessionEmail?.(email);
      navigateAfterClose.current = true;
      setDialog({ open: true, kind: "success", message: "Login successful." });
    } catch (error) {
      navigateAfterClose.current = false;
      setDialog({ open: true, kind: "error", message: getApiErrorMessage(error) });
    }
  }

  return (
    <section className="card">
      <h2>Login Voter</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <input
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        New voter? <Link to="/auth/register">Register here</Link>
      </p>
      <FeedbackDialog open={dialog.open} kind={dialog.kind} onClose={closeDialog}>
        {dialog.message}
      </FeedbackDialog>
    </section>
  );
}

export default memo(Login);
