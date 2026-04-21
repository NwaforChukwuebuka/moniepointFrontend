# Election API — Frontend (React) integration guide

This document describes the **REST API** exposed by the **electionApp** Spring Boot backend (`moniepoint.electionApp`). Use it as the contract when building a **separate React** project.

---

## Important rules (must follow)

These constraints apply to **every** change in this election frontend repo. They are not optional notes.

| Rule | Requirement |
|------|-------------|
| **Backend codebase** | The Java/Spring source of truth is on disk at `C:\Users\USER\IdeaProjects\electionApp`. When the API contract is unclear or this guide drifts, confirm behavior and DTOs there (controllers under `moniepoint.electionApp.controllers`, request/response DTOs as listed in §11). |
| **Coding style (class reference)** | Implement this React app using the **same style and conventions** as the in-class reference project: `C:\Users\USER\Desktop\moniepointFrontend\ecommerce`. Match how that app organizes files, names components and hooks, calls APIs, handles loading/errors, and structures pages—so this codebase stays consistent with what was taught. |

---

## 1. Base URL and environments

| Environment   | Example base URL              |
|---------------|-------------------------------|
| Local (IDE)   | `http://localhost:8080`       |
| Custom port   | Set in backend `application.properties` (`server.port=...`) — default is **8080**. |

Configure the React app with an environment variable (e.g. `VITE_API_BASE_URL` or `REACT_APP_API_BASE_URL`) and **never** hardcode production URLs in source.

**All API paths below are relative to the base URL** (e.g. `GET {base}/elections`).

---

## 2. Response envelope

Every successful controller response and handled business error uses the same wrapper:

```json
{
  "success": true,
  "data": { }
}
```

| Field      | Type    | Meaning |
|------------|---------|---------|
| `success`  | boolean | `true` on success, `false` on handled errors (see §7). |
| `data`     | object, array, string, or number | Payload on success; on handled errors, **a string** with the error message. |

**Dates:** Fields typed as `Instant` in Java are JSON **strings** in **ISO-8601** form (e.g. `2026-04-01T08:00:00Z`).

**IDs:** `electionId`, `candidateId`, and Mongo document ids are **strings** (often 24-character hex ObjectIds).

---

## 3. Authentication and session model (important)

This backend does **not** use JWT, cookies, or Spring Security sessions for the voter UI.

- **Register** creates a voter in MongoDB.
- **Login** sets `loggedIn: true` on that voter document (stored server-side).
- **Vote** requires that voter to exist and have `loggedIn === true`. The voter is identified by **`voterEmail` in the JSON body** of `POST /elections/vote`, not by a token.
- **Logout** sets `loggedIn: false`.

**Frontend responsibilities:**

1. After a successful login, keep the **email** (and optionally password only in memory for re-login — avoid storing password in `localStorage`).
2. Call **cast vote** with the **same** email in the request body (`voterEmail`) together with `electionId` and `candidateId`.
3. Treat “logged in” as **UX state** plus **server state**: if the user never logged in on this device but the DB still has `loggedIn: true` from an old session, behavior depends on backend data; for a clean UX, call logout when leaving or use a proper auth redesign later.

**Security note (for stakeholders):** Login and vote use **`POST` with JSON bodies** (credentials in the body, not the URL path). Still treat as coursework unless you add HTTPS, rate limiting, and stronger auth for production.

---

## 4. Suggested user flow (screens)

1. **Election list** — `GET /elections` → user picks an election.
2. **Candidates** — `GET /elections/{electionId}/candidates` → show ballot.
3. **Register** (optional) — `POST /voter` → then login.
4. **Login** — `POST /voter/login` with JSON `{ email, password }` → store email; confirm `data.isLoggedIn` / `data.loggedIn` in JSON (exact key depends on serialization; inspect the network tab once).
5. **Vote** — `POST /elections/vote` with JSON `{ voterEmail, electionId, candidateId }`.
6. **Results** — `GET /elections/{electionId}/results`.
7. **Logout** — `POST /voter/logout` with JSON `{ email }`.

**Backend rules you must surface in the UI:**

- Voting is only allowed while **now** is between `votingOpensAt` and `votingClosesAt` for that election (otherwise API returns an error).
- **One vote per voter per election** (duplicate vote → error).
- Candidate must belong to the selected election.

---

## 5. URL encoding (legacy / alternate backends)

The **current** Spring controllers use **JSON bodies** for login, logout, and vote (`email`, `password`, `voterEmail` as fields), so you do not need path encoding for those calls.

If you ever call an API variant that puts `email` in the **path**, encode the segment: `encodeURIComponent(email)` (e.g. `ada@example.com` → `ada%40example.com`).

---

## 6. CORS (separate React origin)

The backend **does not ship CORS configuration** in the repo. If the React dev server runs on another origin (e.g. `http://localhost:5173` or `http://localhost:3000`) and the API on `http://localhost:8080`, the **browser will block** requests until the **Java team** adds CORS (or you use a **dev proxy** in Vite/Webpack that forwards `/api` to the backend so the browser sees same-origin).

Coordinate with backend: allow your dev origin (and production web origin) via `Access-Control-Allow-Origin` and allow methods `GET`, `POST`, and needed headers (`Content-Type`).

---

## 7. Errors

Handled business exceptions return **HTTP 400** with the same envelope:

```json
{
  "success": false,
  "data": "Human readable message from server"
}
```

Examples of messages (wording may match exception text): duplicate voter, invalid login, election not found, voting closed, already voted, invalid candidate, must log in to vote.

**Frontend pattern:** If `response.ok` is false, parse JSON if possible and read `data` as string; if `success === false` on 400, show `data` to the user.

Unhandled server errors (500) may not follow this shape; handle generically.

---

## 8. Endpoints reference

### 8.1 List elections

| Item        | Value |
|------------|--------|
| **Method** | `GET` |
| **Path**   | `/elections` |
| **Auth**   | None |
| **Success HTTP** | `200 OK` |

**`data` type:** array of election summaries.

**Each element:**

| Field               | Type    | Description |
|---------------------|---------|-------------|
| `id`                | string  | Election id (use in other routes). |
| `title`             | string  | Display title. |
| `level`             | string  | e.g. `STATE`. |
| `votingOpensAt`     | string  | ISO-8601 instant. |
| `votingClosesAt`    | string  | ISO-8601 instant. |
| `resultsPublished`  | boolean | Whether results are published (domain flag). |

---

### 8.2 List candidates for an election

| Item        | Value |
|------------|--------|
| **Method** | `GET` |
| **Path**   | `/elections/{electionId}/candidates` |
| **Auth**   | None |
| **Success HTTP** | `200 OK` |

**`data` type:** array of candidates.

**Each element:**

| Field        | Type   | Description |
|--------------|--------|-------------|
| `id`         | string | Candidate id (use when voting). |
| `name`       | string | |
| `partyCode`  | string | |
| `position`   | string | |

---

### 8.3 Election results

| Item        | Value |
|------------|--------|
| **Method** | `GET` |
| **Path**   | `/elections/{electionId}/results` |
| **Auth**   | None |
| **Success HTTP** | `200 OK` |

**`data` type:** object:

| Field         | Type   | Description |
|---------------|--------|---------------|
| `electionId`  | string | |
| `totalVotes`  | number | Total ballots counted. |
| `tallies`     | array  | Per-candidate totals. |

**Each tally item:**

| Field           | Type   | Description |
|-----------------|--------|---------------|
| `candidateId`   | string | |
| `candidateName` | string | |
| `partyCode`     | string | |
| `voteCount`     | number | |

---

### 8.4 Register voter

| Item        | Value |
|------------|--------|
| **Method** | `POST` |
| **Path**   | `/voter` |
| **Auth**   | None |
| **Success HTTP** | `201 Created` |
| **Content-Type** | `application/json` |

**Request body (JSON):**

| Field       | Type   | Required | Description |
|-------------|--------|----------|-------------|
| `firstName` | string | yes      | |
| `lastName`  | string | yes      | |
| `email`     | string | yes      | Unique. |
| `password`  | string | yes      | Stored as plain text in current backend (course-style). |
| `vin`       | string | yes      | Unique. |
| `state`     | string | yes      | |

**`data` type (success):** object:

| Field        | Type    | Description |
|--------------|---------|-------------|
| `email`      | string  | |
| `isLoggedIn` | boolean | Usually `false` after register (confirm in network tab). |

---

### 8.5 Login

| Item        | Value |
|------------|--------|
| **Method** | `POST` |
| **Path**   | `/voter/login` |
| **Auth**   | JSON body `{ email, password }`. |
| **Success HTTP** | `200 OK` |

**`data` type (success):** object:

| Field        | Type    | Description |
|--------------|---------|-------------|
| `email`      | string  | |
| `isLoggedIn` | boolean | Expect `true` after success. |

---

### 8.6 Logout

| Item        | Value |
|------------|--------|
| **Method** | `POST` |
| **Path**   | `/voter/logout` |
| **Auth**   | JSON body `{ email }`. |
| **Success HTTP** | `200 OK` |

**`data` type (success):** object with `email`, `isLoggedIn` (expect `false`).

---

### 8.7 Cast vote

| Item        | Value |
|------------|--------|
| **Method** | `POST` |
| **Path**   | `/elections/vote` |
| **Auth**   | Voter must exist and be logged in server-side; **`voterEmail` in JSON body**. |
| **Success HTTP** | `201 Created` |
| **Content-Type** | `application/json` |

**Request body (JSON):**

| Field          | Type   | Required | Description |
|----------------|--------|----------|-------------|
| `voterEmail`   | string | yes      | Must match the logged-in voter. |
| `electionId`   | string | yes      | Must match the election the user is voting in. |
| `candidateId`  | string | yes      | Must belong to that election. |

**`data` type (success):** object:

| Field         | Type   | Description |
|---------------|--------|-------------|
| `message`     | string | Confirmation text. |
| `electionId`  | string | |

---

## 9. Minimal TypeScript types (optional)

```ts
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; data: string };

export type ElectionSummary = {
  id: string;
  title: string;
  level: string;
  votingOpensAt: string;
  votingClosesAt: string;
  resultsPublished: boolean;
};

export type Candidate = {
  id: string;
  name: string;
  partyCode: string;
  position: string;
};

export type ElectionResults = {
  electionId: string;
  totalVotes: number;
  tallies: Array<{
    candidateId: string;
    candidateName: string;
    partyCode: string;
    voteCount: number;
  }>;
};

export type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  vin: string;
  state: string;
};

export type CastVoteBody = {
  voterEmail: string;
  electionId: string;
  candidateId: string;
};
```

---

## 10. Fetch examples (browser)

Replace `API` with your base URL variable.

```ts
const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const r = await fetch(`${API}${path}`);
  const json = (await r.json()) as ApiResponse<T>;
  if (!r.ok) throw new Error(typeof json.data === "string" ? json.data : r.statusText);
  if (!json.success) throw new Error(String(json.data));
  return json;
}

// Elections
const elections = await apiGet<ElectionSummary[]>("/elections");

// Candidates
const candidates = await apiGet<Candidate[]>(`/elections/${electionId}/candidates`);

// Register
const reg = await fetch(`${API}/voter`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(registerBody),
});
const regJson = await reg.json();
if (!reg.ok || !regJson.success) throw new Error(String(regJson.data));

// Login
const login = await fetch(`${API}/voter/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const loginJson = await login.json();
if (!login.ok || !loginJson.success) throw new Error(String(loginJson.data));

// Vote
const vote = await fetch(`${API}/elections/vote`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ voterEmail: email, electionId, candidateId }),
});
const voteJson = await vote.json();
if (!vote.ok || !voteJson.success) throw new Error(String(voteJson.data));
```

---

## 11. Who to ask when the contract changes

The **source of truth** is the Java code:

- `moniepoint.electionApp.controllers.VoterController`
- `moniepoint.electionApp.controllers.ElectionController`
- Request DTOs under `dtos/requests/`
- Response DTOs under `dtos/responses/`

If the team adds **OpenAPI (SpringDoc)** later, prefer the generated spec over this file and update this document or replace it with a link to Swagger UI.

---

## 12. Quick reference table

| Method | Path | Success status |
|--------|------|----------------|
| `GET` | `/elections` | 200 |
| `GET` | `/elections/{electionId}/candidates` | 200 |
| `GET` | `/elections/{electionId}/results` | 200 |
| `POST` | `/elections/vote` | 201 |
| `POST` | `/voter` | 201 |
| `POST` | `/voter/login` | 200 |
| `POST` | `/voter/logout` | 200 |
