import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import md5 from "md5"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api.valantis.store:41000/',
    prepareHeaders: (headers) => {
        if (!headers.has("Content-Type")) {
            headers.set('Content-Type', 'application/json')
        }
        const date = new Date()
        const timestamp = date.toISOString().slice(0, 10).replace(/-/g, '')
        const xAuth = md5(`Valantis_${timestamp}`)
        headers.set('X-Auth', xAuth)
        return headers
    },
})

const baseQueryWithRetry = retry(
    async (args, api, extraOptions) => {
      const result = await baseQuery(args, api, extraOptions)

      if (result?.error?.data ) {
        console.log(result.error.data)
      }

      return result
    },
    {
      maxRetries: 5,
    }
  )

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithRetry,
    endpoints: () => ({}),
})