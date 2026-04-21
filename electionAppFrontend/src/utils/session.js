const SESSION_EMAIL_KEY = "election_voter_email";

export function getSessionEmail() {
  return sessionStorage.getItem(SESSION_EMAIL_KEY) ?? "";
}

export function setSessionEmail(email) {
  sessionStorage.setItem(SESSION_EMAIL_KEY, email);
}

export function clearSessionEmail() {
  sessionStorage.removeItem(SESSION_EMAIL_KEY);
}
