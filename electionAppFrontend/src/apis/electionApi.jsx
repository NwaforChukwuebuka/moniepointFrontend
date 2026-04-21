import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const errorData = result.error.data;
    const message =
      typeof errorData?.data === "string"
        ? errorData.data
        : typeof errorData === "string"
          ? errorData
          : result.error.error || "Request failed";

    return {
      error: {
        ...result.error,
        data: message,
      },
    };
  }

  const payload = result.data;
  if (payload && typeof payload === "object" && "success" in payload) {
    if (!payload.success) {
      return {
        error: {
          status: "CUSTOM_ERROR",
          data: typeof payload.data === "string" ? payload.data : "Request failed",
        },
      };
    }

    return { data: payload.data };
  }

  return result;
};

export const electionApi = createApi({
  reducerPath: "electionApi",
  baseQuery,
  endpoints: (builder) => ({
    getElections: builder.query({
      query: () => "/elections",
    }),
    getCandidates: builder.query({
      query: (electionId) => `/elections/${electionId}/candidates`,
    }),
    getResults: builder.query({
      query: (electionId) => `/elections/${electionId}/results`,
    }),
    registerVoter: builder.mutation({
      query: (body) => ({
        url: "/voter",
        method: "POST",
        body,
      }),
    }),
    loginVoter: builder.mutation({
      query: ({ email, password }) => ({
        url: "/voter/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    logoutVoter: builder.mutation({
      query: (email) => ({
        url: "/voter/logout",
        method: "POST",
        body: { email },
      }),
    }),
    castVote: builder.mutation({
      query: ({ voterEmail, electionId, candidateId }) => ({
        url: "/elections/vote",
        method: "POST",
        body: { voterEmail, electionId, candidateId },
      }),
    }),
  }),
});

export const {
  useGetElectionsQuery,
  useGetCandidatesQuery,
  useGetResultsQuery,
  useRegisterVoterMutation,
  useLoginVoterMutation,
  useLogoutVoterMutation,
  useCastVoteMutation,
} = electionApi;

export function getApiErrorMessage(error) {
  if (!error) return "Something went wrong.";
  if (typeof error?.data === "string") return error.data;
  if (typeof error?.error === "string") return error.error;
  return "Something went wrong.";
}
