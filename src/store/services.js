import { baseApi } from './baseApi'

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getIds: builder.mutation({
            query: () => ({
                method: 'POST',
                body: {
                    action: 'get_ids'
                }
            }),
            transformResponse: (response) => {
                const uniqueIds = [...new Set(response.result)]
                return {total: uniqueIds.length, ids: uniqueIds}
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
                return {total: uniqueIds.length, ids: uniqueIds}
            }
        }),
    }),
})