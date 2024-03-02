import s from "./styles.module.scss"
import { FIELDS } from "../../constants/constants";
import { useState } from "react";
import { productApi } from "../../store/services";
import { useDispatch } from "react-redux";
import { toggleIsFilter, toggleIsPending } from "../../store/generalSlice";
import { FilterItem } from "./FilterItem";
import { Form, Select } from "antd";
import { SubmitButton } from "../ui/SubmitButton";

export const Filters = ({ isPending }) => {
    const [selectedOption, setSelectedOption] = useState('')
    const [filterItems] = productApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const onFinish = (values) => {
        if (values.brand === 'without value') {
            values.brand = null
        }
        filterItems(values)
        dispatch(toggleIsFilter(true))
        dispatch(toggleIsPending(true))
    }

    return (
        <div className={s.filters}>
            <Select
            className={s.fieldsSelect}
            onChange={(value) => setSelectedOption(value)}
            options={Object.keys(FIELDS).map((key) => { return {value: key, label: FIELDS[key]}})}
            placeholder="Выберите параметр"
            allowClear
            onClear={() => dispatch(toggleIsFilter(false))}
            disabled={isPending}
            />
            {selectedOption &&
            <Form form={form} name='validateOnly' onFinish={onFinish} className={s.form} autoComplete="off" disabled={isPending}>
                <FilterItem field={selectedOption}/>
                <Form.Item>
                    <SubmitButton form={form} isLoading={isPending}>Отфильтровать</SubmitButton>
                </Form.Item>
            </Form>}
        </div>
    )
}
