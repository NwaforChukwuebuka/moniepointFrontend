import { memo, useEffect, useMemo, useState } from "react";
import {
  getApiErrorMessage,
  useCastVoteMutation,
  useGetCandidatesQuery,
  useGetElectionsQuery,
  useGetResultsQuery,
  useLoginVoterMutation,
  useLogoutVoterMutation,
  useRegisterVoterMutation,
} from "./apis/electionApi";
import { clearSessionEmail, getSessionEmail, setSessionEmail } from "./utils/session";
import FeedbackDialog from "./components/FeedbackDialog";

const NG = {
  green: "#008751",
  greenDark: "#005c36",
  greenDeep: "#003824",
  greenLight: "#e8f5ee",
  greenMid: "#b8dfc9",
  greenPale: "#f0faf4",
  white: "#ffffff",
  ink: "#0c1a12",
  muted: "#5a7a65",
  mutedLight: "#8aaa95",
  border: "rgba(0,135,81,0.14)",
  borderMed: "rgba(0,135,81,0.28)",
  borderStrong: "rgba(0,135,81,0.45)",
  bg: "#f4fbf7",
};

function formatApiDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

function getElectionStatus(election) {
  const now = Date.now();
  const opens = new Date(election.votingOpensAt).getTime();
  const closes = new Date(election.votingClosesAt).getTime();
  if (Number.isNaN(opens) || Number.isNaN(closes)) return "upcoming";
  if (now < opens) return "upcoming";
  if (now > closes) return "closed";
  return "open";
}

function FlagStripes({ height = 44 }) {
  const width = Math.round(height * 0.38);
  return (
    <div style={{ display: "flex", height, width: width * 3, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ width, background: NG.green }} />
      <div
        style={{
          width,
          background: NG.white,
          borderLeft: `1px solid ${NG.border}`,
          borderRight: `1px solid ${NG.border}`,
        }}
      />
      <div style={{ width, background: NG.green }} />
    </div>
  );
}

function FlagAccent() {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
      <div style={{ width: 28, height: 3, background: NG.green, borderRadius: 2 }} />
      <div style={{ width: 28, height: 3, background: NG.white, border: `1px solid ${NG.borderMed}`, borderRadius: 2 }} />
      <div style={{ width: 28, height: 3, background: NG.green, borderRadius: 2 }} />
    </div>
  );
}

function Badge({ status }) {
  const map = {
    open: { bg: "#d2f0e2", color: "#004d25", label: "Open" },
    upcoming: { bg: "#d6eaf8", color: "#1a4f7a", label: "Upcoming" },
    closed: { bg: "#fce4d8", color: "#7a2a14", label: "Closed" },
  };
  const tone = map[status] || map.upcoming;
  return (
    <span
      style={{
        display: "inline-block",
        background: tone.bg,
        color: tone.color,
        fontSize: 12,
        fontWeight: 500,
        padding: "4px 13px",
        borderRadius: 20,
        fontFamily: "'IBM Plex Sans',sans-serif",
      }}
    >
      {tone.label}
    </span>
  );
}

function PrimaryBtn({ children, onClick, disabled, full, type = "button" }) {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      style={{
        fontFamily: "'IBM Plex Sans',sans-serif",
        fontSize: 14,
        fontWeight: 500,
        padding: "11px 28px",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? NG.greenMid : NG.green,
        color: NG.white,
        border: "none",
        opacity: disabled ? 0.55 : 1,
        transition: "background 0.14s",
        width: full ? "100%" : undefined,
      }}
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, active, small, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        fontFamily: "'IBM Plex Sans',sans-serif",
        fontSize: small ? 12 : 14,
        fontWeight: 500,
        padding: small ? "6px 14px" : "9px 22px",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        background: active ? NG.greenLight : "transparent",
        color: NG.greenDark,
        border: `1.5px solid ${active ? NG.green : NG.borderStrong}`,
        transition: "all 0.13s",
      }}
    >
      {children}
    </button>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, name }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontFamily: "'IBM Plex Mono',monospace",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: NG.muted,
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          padding: "10px 13px",
          border: `1.5px solid ${focus ? NG.green : NG.borderMed}`,
          borderRadius: 6,
          background: NG.white,
          fontFamily: "'IBM Plex Sans',sans-serif",
          fontSize: 13,
          color: NG.ink,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.12s",
        }}
      />
    </div>
  );
}

function Nav({ tab, onTab, hasBallot, hasResults, isLoggedIn, onLogout, isLoggingOut }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: 68,
        background: NG.white,
        borderBottom: `2.5px solid ${NG.green}`,
      }}
    >
      <button
        type="button"
        onClick={() => onTab("elections")}
        aria-label="Go to home — Elections"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          font: "inherit",
          textAlign: "left",
        }}
      >
        <FlagStripes height={34} />
        <div>
          <div
            style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: NG.ink, letterSpacing: "-0.2px", lineHeight: 1 }}
          >
            electionApp
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 9,
              color: NG.muted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            INEC Voter Portal
          </div>
        </div>
      </button>
      <div style={{ display: "flex", gap: 8 }}>
        {hasBallot && (
          <OutlineBtn active={tab === "vote"} onClick={() => onTab("vote")}>
            Ballot
          </OutlineBtn>
        )}
        {hasResults && (
          <OutlineBtn active={tab === "results"} onClick={() => onTab("results")}>
            Results
          </OutlineBtn>
        )}
        <OutlineBtn active={tab === "elections"} onClick={() => onTab("elections")}>
          Elections
        </OutlineBtn>
        {isLoggedIn ? (
          <OutlineBtn small onClick={onLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "..." : "Logout"}
          </OutlineBtn>
        ) : (
          <OutlineBtn active={tab === "auth"} onClick={() => onTab("auth")}>
            Login
          </OutlineBtn>
        )}
      </div>
    </header>
  );
}

function ElectionsScreen({ elections, onSelect, onResults, loading }) {
  const [hovered, setHovered] = useState(null);
  return (
    <main style={{ padding: "48px 40px", background: NG.bg, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: NG.green,
            marginBottom: 8,
          }}
        >
          Active &amp; Upcoming
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 52, color: NG.ink, letterSpacing: "-1.5px", margin: 0, lineHeight: 1 }}>
          Elections
        </h1>
        <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 14, color: NG.muted, marginTop: 10, marginBottom: 0 }}>
          Select an election to view candidates and cast your ballot.
        </p>
      </div>
      <div style={{ display: "flex", gap: 4, margin: "28px 0 36px" }}>
        <div style={{ width: 32, height: 4, background: NG.green, borderRadius: 2 }} />
        <div style={{ width: 32, height: 4, background: NG.white, border: `1px solid ${NG.borderMed}`, borderRadius: 2 }} />
        <div style={{ width: 32, height: 4, background: NG.green, borderRadius: 2 }} />
      </div>

      {loading && <p style={{ color: NG.muted }}>Loading elections...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>
        {elections.map((election) => {
          const status = getElectionStatus(election);
          const isHovered = hovered === election.id;

          return (
            <div
              key={election.id}
              onClick={() => (status === "closed" ? onResults(election) : onSelect(election))}
              onMouseEnter={() => setHovered(election.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: NG.white,
                border: `1.5px solid ${isHovered ? NG.green : NG.border}`,
                borderRadius: 12,
                padding: 28,
                cursor: "pointer",
                transition: "all 0.14s",
                position: "relative",
                borderTop: `4px solid ${isHovered ? NG.green : "transparent"}`,
                boxShadow: isHovered ? `0 0 0 4px ${NG.greenLight}` : "none",
              }}
            >
              <div style={{ marginBottom: 10 }}>
                <Badge status={status} />
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: NG.mutedLight,
                  marginBottom: 8,
                }}
              >
                {election.level}
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: NG.ink, margin: "0 0 16px", lineHeight: 1.2 }}>
                {election.title}
              </h2>
              <div style={{ height: 1, background: NG.border, marginBottom: 14 }} />
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: NG.muted, lineHeight: 1.9 }}>
                {status === "closed" ? (
                  <>
                    <div>Ended {formatApiDate(election.votingClosesAt)}</div>
                    <div style={{ color: NG.green, fontWeight: 500, marginTop: 4 }}>View results →</div>
                  </>
                ) : (
                  <>
                    <div>Opens {formatApiDate(election.votingOpensAt)}</div>
                    <div>Closes {formatApiDate(election.votingClosesAt)}</div>
                  </>
                )}
              </div>
              {isHovered && (
                <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20, color: NG.green, opacity: 0.5 }}>
                  ›
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function VoteScreen({ election, candidates, onBack, onCastVote, isSubmitting }) {
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(false);
  const [voted, setVoted] = useState(false);

  async function confirmVote() {
    if (!selected) return;
    const success = await onCastVote(selected.id, selected.name, selected.partyCode);
    if (success) {
      setVoted(true);
    }
    setModal(false);
  }

  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modal]);

  return (
    <main style={{ padding: "48px 40px", background: NG.bg, minHeight: "calc(100vh - 68px)" }}>
      <OutlineBtn small onClick={onBack}>
        ← Back to elections
      </OutlineBtn>
      <div style={{ margin: "24px 0 32px" }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: NG.green,
            marginBottom: 6,
          }}
        >
          {election.level}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: NG.ink, margin: 0, letterSpacing: "-0.5px" }}>{election.title}</h1>
        <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13, color: NG.muted, marginTop: 8 }}>
          Select one candidate. Your vote is secret and final.
        </p>
      </div>
      <FlagAccent />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12, marginBottom: 28 }}>
        {candidates.map((candidate) => {
          const isSelected = selected?.id === candidate.id;
          const initials = candidate.name
            .split(" ")
            .map((item) => item[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={candidate.id}
              onClick={() => !voted && setSelected(candidate)}
              style={{
                background: isSelected ? NG.greenLight : NG.white,
                border: `2px solid ${isSelected ? NG.green : NG.border}`,
                borderRadius: 10,
                padding: 20,
                cursor: voted ? "default" : "pointer",
                transition: "all 0.13s",
                opacity: voted && !isSelected ? 0.45 : 1,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${isSelected ? NG.green : NG.borderMed}`,
                  background: isSelected ? NG.green : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: NG.white,
                  transition: "all 0.12s",
                }}
              >
                {isSelected ? "✓" : ""}
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: isSelected ? NG.green : NG.greenMid,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'IBM Plex Mono',monospace",
                  fontSize: 13,
                  color: isSelected ? NG.white : NG.greenDark,
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                {initials}
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: NG.ink, marginBottom: 4 }}>{candidate.name}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: NG.green }}>
                {candidate.partyCode}
              </div>
              <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 12, color: NG.muted, marginTop: 3 }}>{candidate.position}</div>
            </div>
          );
        })}
      </div>
      {!voted ? (
        <PrimaryBtn disabled={!selected || isSubmitting} onClick={() => setModal(true)}>
          {isSubmitting ? "Submitting..." : "Cast my vote"}
        </PrimaryBtn>
      ) : (
        <div
          style={{
            background: NG.greenLight,
            border: `1.5px solid ${NG.green}`,
            borderRadius: 8,
            padding: "14px 20px",
            display: "inline-block",
            fontFamily: "'IBM Plex Sans',sans-serif",
            fontSize: 13,
            color: NG.greenDark,
            lineHeight: 1.7,
          }}
        >
          ✓ Vote cast for <strong>{selected?.name}</strong> ({selected?.partyCode})
          <br />
          <span style={{ color: NG.muted }}>Thank you for participating in Nigerian democracy.</span>
        </div>
      )}
      {modal && selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-vote-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(3,24,12,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          <div style={{ background: NG.white, borderRadius: 10, padding: 28, maxWidth: 320, width: "100%", border: `2px solid ${NG.green}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <FlagStripes height={26} />
              <div id="confirm-vote-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: NG.ink }}>
                Confirm your vote
              </div>
            </div>
            <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 13, color: NG.muted, lineHeight: 1.7, marginBottom: 20 }}>
              You are voting for <strong style={{ color: NG.greenDark }}>{selected.name}</strong> ({selected.partyCode}). This action is{" "}
              <strong>final</strong>.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <OutlineBtn onClick={() => setModal(false)}>Go back</OutlineBtn>
              <PrimaryBtn onClick={confirmVote}>Cast vote</PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ResultsScreen({ election, results, onBack }) {
  const barColors = [NG.green, NG.greenDark, NG.muted];
  return (
    <main style={{ padding: "48px 40px", background: NG.bg, minHeight: "calc(100vh - 68px)" }}>
      <OutlineBtn small onClick={onBack}>
        ← Back to elections
      </OutlineBtn>
      <div style={{ margin: "24px 0 32px" }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: NG.green,
            marginBottom: 6,
          }}
        >
          Official Results
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: NG.ink, margin: 0, letterSpacing: "-0.5px" }}>{election.title}</h1>
      </div>
      <FlagAccent />
      {!results ? (
        <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 14, color: NG.muted }}>Results not yet published.</p>
      ) : (
        <div style={{ maxWidth: 520 }}>
          {results.tallies?.map((tally, index) => {
            const percentage = Math.round((tally.voteCount / Math.max(results.totalVotes, 1)) * 100);
            return (
              <div key={tally.candidateId} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: NG.ink }}>{tally.candidateName}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: NG.muted }}>
                      {tally.partyCode}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: NG.ink }}>
                    {tally.voteCount.toLocaleString()} <span style={{ color: NG.muted }}>({percentage}%)</span>
                  </div>
                </div>
                <div style={{ height: 6, background: NG.greenMid, borderRadius: 3, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: barColors[index] || NG.muted,
                      borderRadius: 3,
                      transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1.5px solid ${NG.border}`, marginTop: 24, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: NG.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Total votes counted
            </span>
            <strong style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: NG.ink }}>{results.totalVotes?.toLocaleString?.() ?? 0}</strong>
          </div>
        </div>
      )}
    </main>
  );
}

function AuthScreen({ onLogin, onRegister, isLoginLoading, isRegisterLoading }) {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    vin: "",
    state: "",
  });

  function updateLogin(event) {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  function updateRegister(event) {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitLogin(event) {
    event.preventDefault();
    await onLogin(loginForm);
  }

  async function submitRegister(event) {
    event.preventDefault();
    const success = await onRegister(registerForm);
    if (success) {
      setMode("login");
    }
  }

  return (
    <main
      style={{
        padding: "48px 24px",
        background: NG.bg,
        minHeight: "calc(100vh - 68px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ marginBottom: 12, textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: NG.green,
              marginBottom: 6,
            }}
          >
            {mode === "login" ? "Voter Portal" : "New Voter"}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: NG.ink, margin: 0, letterSpacing: "-0.8px" }}>
            {mode === "login" ? "Sign in to vote" : "Register to vote"}
          </h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FlagAccent />
        </div>
        <div>
        {mode === "login" ? (
          <form onSubmit={submitLogin}>
            <Input label="Email address" type="email" placeholder="voter@example.com" name="email" value={loginForm.email} onChange={updateLogin} />
            <Input label="Password" type="password" placeholder="••••••••" name="password" value={loginForm.password} onChange={updateLogin} />
            <PrimaryBtn full type="submit" disabled={isLoginLoading}>
              {isLoginLoading ? "Signing in..." : "Sign in"}
            </PrimaryBtn>
            <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 12, color: NG.muted, textAlign: "center", marginTop: 14 }}>
              No account?{" "}
              <span onClick={() => setMode("register")} style={{ color: NG.greenDark, cursor: "pointer", textDecoration: "underline" }}>
                Register to vote
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={submitRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="First name" placeholder="Ngozi" name="firstName" value={registerForm.firstName} onChange={updateRegister} />
              <Input label="Last name" placeholder="Okonkwo" name="lastName" value={registerForm.lastName} onChange={updateRegister} />
            </div>
            <Input label="Email address" type="email" placeholder="ngozi@example.com" name="email" value={registerForm.email} onChange={updateRegister} />
            <Input label="Password" type="password" placeholder="••••••••" name="password" value={registerForm.password} onChange={updateRegister} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="VIN" placeholder="74A1234567890" name="vin" value={registerForm.vin} onChange={updateRegister} />
              <Input label="State of origin" placeholder="Anambra" name="state" value={registerForm.state} onChange={updateRegister} />
            </div>
            <PrimaryBtn full type="submit" disabled={isRegisterLoading}>
              {isRegisterLoading ? "Creating..." : "Create voter account"}
            </PrimaryBtn>
            <p style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 12, color: NG.muted, textAlign: "center", marginTop: 14 }}>
              Already registered?{" "}
              <span onClick={() => setMode("login")} style={{ color: NG.greenDark, cursor: "pointer", textDecoration: "underline" }}>
                Sign in
              </span>
            </p>
          </form>
        )}
        </div>
      </div>
    </main>
  );
}

function App() {
  const [tab, setTab] = useState("elections");
  const [election, setElection] = useState(null);
  const [dialog, setDialog] = useState({ open: false, kind: "info", message: "" });
  const [sessionEmail, setSession] = useState(getSessionEmail());

  const { data: electionData = [], isLoading: electionsLoading, isError: electionsError, error: electionsApiError } = useGetElectionsQuery();
  const { data: candidateData = [], isLoading: candidatesLoading } = useGetCandidatesQuery(election?.id, { skip: !election?.id || tab !== "vote" });
  const { data: resultData } = useGetResultsQuery(election?.id, { skip: !election?.id || tab !== "results" });

  const [registerVoter, { isLoading: isRegisterLoading }] = useRegisterVoterMutation();
  const [loginVoter, { isLoading: isLoginLoading }] = useLoginVoterMutation();
  const [logoutVoter, { isLoading: isLogoutLoading }] = useLogoutVoterMutation();
  const [castVote, { isLoading: isVoteLoading }] = useCastVoteMutation();

  const elections = useMemo(() => electionData, [electionData]);

  function closeDialog() {
    setDialog({ open: false, kind: "info", message: "" });
  }

  useEffect(() => {
    if (!electionsError || !electionsApiError) return;
    setDialog({
      open: true,
      kind: "error",
      message: `Unable to load elections: ${getApiErrorMessage(electionsApiError)}`,
    });
  }, [electionsError, electionsApiError]);

  function handleTab(nextTab) {
    if (nextTab === "elections") {
      setElection(null);
    }
    setTab(nextTab);
  }

  async function handleRegister(payload) {
    try {
      await registerVoter(payload).unwrap();
      setDialog({ open: true, kind: "success", message: "Registration successful. Please sign in." });
      return true;
    } catch (error) {
      setDialog({ open: true, kind: "error", message: getApiErrorMessage(error) });
      return false;
    }
  }

  async function handleLogin(payload) {
    try {
      const response = await loginVoter(payload).unwrap();
      const voterEmail = response?.email || payload.email;
      setSessionEmail(voterEmail);
      setSession(voterEmail);
      setDialog({ open: true, kind: "success", message: "Login successful." });
      setTab("elections");
      return true;
    } catch (error) {
      setDialog({ open: true, kind: "error", message: getApiErrorMessage(error) });
      return false;
    }
  }

  async function handleLogout() {
    if (!sessionEmail) {
      setDialog({ open: true, kind: "warning", message: "No active voter session." });
      return;
    }
    try {
      await logoutVoter(sessionEmail).unwrap();
      clearSessionEmail();
      setSession("");
      setDialog({ open: true, kind: "success", message: "Logged out successfully." });
    } catch (error) {
      setDialog({ open: true, kind: "error", message: getApiErrorMessage(error) });
    }
  }

  async function handleCastVote(candidateId, candidateName, partyCode) {
    if (!sessionEmail) {
      setDialog({ open: true, kind: "warning", message: "Please login before voting." });
      return false;
    }
    try {
      await castVote({
        voterEmail: sessionEmail,
        electionId: election.id,
        candidateId,
      }).unwrap();
      setDialog({ open: true, kind: "success", message: `Vote cast for ${candidateName} (${partyCode}).` });
      return true;
    } catch (error) {
      setDialog({ open: true, kind: "error", message: getApiErrorMessage(error) });
      return false;
    }
  }

  return (
    <>
      <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", background: NG.bg }}>
        <Nav
          tab={tab}
          onTab={handleTab}
          hasBallot={!!election && getElectionStatus(election) !== "closed"}
          hasResults={!!election}
          isLoggedIn={!!sessionEmail}
          onLogout={handleLogout}
          isLoggingOut={isLogoutLoading}
        />
        {tab === "elections" && (
          <ElectionsScreen
            loading={electionsLoading}
            elections={elections}
            onSelect={(selectedElection) => {
              setElection(selectedElection);
              setTab("vote");
            }}
            onResults={(selectedElection) => {
              setElection(selectedElection);
              setTab("results");
            }}
          />
        )}
        {tab === "vote" && election && (
          <VoteScreen
            election={election}
            candidates={candidateData}
            onBack={() => {
              setElection(null);
              setTab("elections");
            }}
            onCastVote={handleCastVote}
            isSubmitting={isVoteLoading || candidatesLoading}
          />
        )}
        {tab === "results" && election && (
          <ResultsScreen
            election={election}
            results={resultData}
            onBack={() => {
              setElection(null);
              setTab("elections");
            }}
          />
        )}
        {tab === "auth" && (
          <AuthScreen
            onLogin={handleLogin}
            onRegister={handleRegister}
            isLoginLoading={isLoginLoading}
            isRegisterLoading={isRegisterLoading}
          />
        )}
      </div>
      <FeedbackDialog open={dialog.open} kind={dialog.kind} onClose={closeDialog}>
        {dialog.message}
      </FeedbackDialog>
    </>
  );
}

export default memo(App);
