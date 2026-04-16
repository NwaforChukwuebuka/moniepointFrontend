import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
    const BASE_URL = import.meta.env.VITE_STORE_API_URL;

export const fakeStoreApi = createApi({
    reducerPath: "fakeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
    }),
    endpoints: (builder) => ({
        login:builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            })
        })

})
});

export const { useLoginMutation } = fakeStoreApi;   