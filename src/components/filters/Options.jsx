import { v4 as uuidv4 } from 'uuid';
import s from "./styles.module.scss"
import { baseApi } from '../../store/services'
import { useEffect } from 'react';

export const Options = ({ field }) => {
    const [getFields, { data: fieldsData }] = baseApi.useGetFieldsMutation()

    useEffect(() => {
        getFields(field)
    }, [])

    return (
        <>
            {fieldsData && fieldsData.map(field => {
                return <option key={uuidv4()} value={field}>{field}</option>
            })}
        </>
    )
}

