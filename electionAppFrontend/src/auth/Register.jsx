import { memo, useState } from "react";
import { Link } from "react-router";
import { getApiErrorMessage, useRegisterVoterMutation } from "../apis/electionApi";
import FeedbackDialog from "../components/FeedbackDialog";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  vin: "",
  state: "",
};

function Register() {
  const [form, setForm] = useState(initialForm);
  const [registerVoter, { isLoading }] = useRegisterVoterMutation();
  const [dialog, setDialog] = useState({ open: false, kind: "info", message: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setDialog({ open: false, kind: "info", message: "" });

    try {
      await registerVoter(form).unwrap();
      setForm(initialForm);
      setDialog({ open: true, kind: "success", message: "Registration successful. You can now login." });
    } catch (error) {
      setDialog({ open: true, kind: "error", message: getApiErrorMessage(error) });
    }
  }

  return (
    <section className="card">
      <h2>Register Voter</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" required />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          required
        />
        <input name="vin" value={form.vin} onChange={handleChange} placeholder="VIN" required />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Register"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Already registered? <Link to="/auth/login">Login here</Link>
      </p>
      <FeedbackDialog open={dialog.open} kind={dialog.kind} onClose={() => setDialog((d) => ({ ...d, open: false }))}>
        {dialog.message}
      </FeedbackDialog>
    </section>
  );
}

export default memo(Register);
