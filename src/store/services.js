import { LIMIT } from '../constants/constants'
import { baseApi } from './baseApi'

export const productApi = baseApi.injectEndpoints({
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
                if (response.result.length < LIMIT) {
                    return {isMaxLimit: true, ids: uniqueIds}
                }
                // if (response.result.length > limit) {
                //     return {isMaxLimit: false, total: response.result.length, ids: uniqueIds.slice(0, 49)}
                // }
                return {isMaxLimit: false, ids: uniqueIds}
            }
        }),
        getIdsCount: builder.mutation({
            query: () => ({
                method: 'POST',
                body: {
                    action: 'get_ids'
                }
            }),
            transformResponse: (response) => [...new Set(response.result)].length
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
                if (response.result.length < LIMIT) {
                    return {isMaxLimit: true, isFiltered: true, ids: uniqueIds}
                }
                return {isMaxLimit: false, isFiltered: true, ids: uniqueIds}
            }
        }),
    }),
})