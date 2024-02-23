import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import s from "./styles.module.scss"
import { Options } from "./Options";
import { FIELDS } from "../../constants";
import { useState } from "react";
import { baseApi } from "../../store/services";
import { useDispatch, useSelector } from "react-redux";
import { filter, toggleIsFilter } from "../../store/filterSlice";

export const Filters = () => {
    const [filterItems] = baseApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
    const { isFilter } = useSelector(filter)
    // console.log('isFilter', isFilter)
    const [selectedFilter, setSelectedFilter] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)
    const dispatch = useDispatch()

    const {
        register,
        unregister,
        formState: { isValid },
        handleSubmit
    } = useForm()

    const selectFilter = (filter) => {
        if (!isFilter) {
            setSelectedFilter(filter)
            Object.keys(FIELDS).filter(item => item !== filter).map(item => unregister(item))
        }
    }

    const resetFilter = () => {
        setSelectedFilter(null)
        setSelectedItem(null)
        dispatch(toggleIsFilter(false))
    }

    const onSubmit = (formData) => {
        if (!isFilter) {
            if (formData.hasOwnProperty('price')) {
                formData.price = +formData.price
            }
            filterItems(formData)
            setSelectedItem(formData[Object.keys(formData)[0]])
            dispatch(toggleIsFilter(true))
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {Object.keys(FIELDS).map((key) => {
                    return (
                        <div className={s.filter} key={key}>
                            <label htmlFor={key}  onClick={() => selectFilter(key)}>{FIELDS[key]}</label>
                            {selectedFilter === key
                                ? (selectedItem
                                ? <div>
                                    <span>{selectedItem}</span>
                                    <button onClick={() => resetFilter()}>X</button>
                                </div>
                                : <select className={s.select} id={key} {...selectedFilter === key && {...register(key)}}>
                                    <option className={s.option} value=''>Выбрать</option>
                                    <Options field={key}/>
                                </select>)
                                : null }
                        </div>
                    )})}
                <button>Применить фильтр</button>
            </form>
        </div>
    )
}

