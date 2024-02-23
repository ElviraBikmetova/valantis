import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import md5 from "md5";
import { limit } from '../components/products/Products';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://api.valantis.store:40000/',
        prepareHeaders: (headers) => {
            if (!headers.has("Content-Type")) {
                headers.set('Content-Type', 'application/json')
            }
            const date = new Date()
            const timestamp = date.toISOString().slice(0, 10).replace(/-/g, '')
            const xAuth = md5(`Valantis_${timestamp}`)
            // console.log(xAuth)
            headers.set('X-Auth', xAuth)
            return headers
        },
    }),
    endpoints: (builder) => ({
        getIds: builder.mutation({
            query: ({ offset, limit }) => ({
                method: 'POST',
                body: {
                    action: 'get_ids',
                    params: {offset, limit}
                }
            }),
            transformResponse: (response) => {
                const uniqueIds = [...new Set(response.result)]
                if (response.result.length < limit) {
                    return {isMaxLimit: true, ids: uniqueIds}
                }
                return {isMaxLimit: false, ids: uniqueIds}
            }
        }),
        getItems: builder.mutation({
            query: (ids) => ({
                method: 'POST',
                body: {
                    action: 'get_items',
                    params: {ids}
                }
            }),
            transformResponse: (response) =>
                response.result.reduce((acc, current) => {
                    if (!acc.find(item => item.id === current.id)) {
                        return [...acc, current]
                    }

                    return acc
                }, [])
        }),
        getFields: builder.mutation({
            query: (field) => ({
                method: 'POST',
                body: {
                    action: 'get_fields',
                    params: {'field': field}
                }
            }),
            transformResponse: (response) => [...new Set(response.result)]
        }),
        filter: builder.mutation({
            query: (field) => ({
                method: 'POST',
                body: {
                    action: 'filter',
                    params: field
                }
            }),
            transformResponse: (response) => {
                const uniqueIds = [...new Set(response.result)]
                if (response.result.length < limit) {
                    return {isMaxLimit: true, ids: uniqueIds}
                }
                return {isMaxLimit: false, ids: uniqueIds}
            }
        }),
    }),
})