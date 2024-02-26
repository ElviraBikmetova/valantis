import { useEffect, useRef, useState } from "react";
import { ProductItem } from "./ProductItem";
import { productApi } from "../../store/services";
import s from "./styles.module.scss"
import { Filters } from "../filters/Filters";
import { useDispatch, useSelector } from "react-redux";
import { filter, toggleIsFilter } from "../../store/filterSlice";
import { Button, Pagination } from "antd";
import { LIMIT } from "../../constants/constants";

export function ProductList() {
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [getIdsCount, { data: idsCount }] = productApi.useGetIdsCountMutation()
    const [getIds, { data: idsData }] = productApi.useGetIdsMutation()
    const [getItems, { data: products }] = productApi.useGetItemsMutation()
    const [_, { data: filteredIds }] = productApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
    const { isFilter } = useSelector(filter)
    const dispatch = useDispatch()

    const offsetRef = useRef(0)
    const [isBack, setIsBack] = useState(false)

//   console.log('isBack', isBack)

    const getProducts = (idsData) => {
        if (idsData) {
            if (idsData.ids.length < LIMIT && !idsData.isMaxLimit) {
                if (isBack) {
                    getIds({offset: offsetRef.current - (LIMIT - idsData.ids.length), limit: LIMIT + (LIMIT - idsData.ids.length)})
                    getItems(idsData.ids)
                } else {
                    getIds({offset: offsetRef.current, limit: LIMIT + (LIMIT - idsData.ids.length)})
                    getItems(idsData.ids)
                    offsetRef.current += LIMIT - idsData.ids.length
                }
            } else {
                //TODO - если передаются фильрованные айдишники и их больше лимита, то нужно их передавать порциями
                getItems(idsData.ids)
            }
        }
    }

    useEffect(() => {
        getIdsCount()
        getIds({offset: offsetRef.current, limit: LIMIT})
    }, [])

    useEffect(() => {
        getProducts(isFilter ? filteredIds : idsData)
    }, [isFilter ? filteredIds : idsData])

    //   console.log('offsetRef.current', offsetRef.current)

    const handlePageChange = (page, pageSize) => {
        const newOffset = (page - 1) * pageSize + (offsetRef.current % pageSize)  // Вычисляем новое смещение
        getIds({ offset: newOffset, limit: LIMIT })
        if (newOffset < offsetRef.current) {
            // Движение назад
            setIsBack(true)
        } else {
            // Движение вперёд или на ту же страницу
            setIsBack(false)
        }
        offsetRef.current = newOffset // Обновляем значение смещения в ref
    }

    const toggleFilterVisible = () => {
        setIsFilterVisible(!isFilterVisible)
        if (isFilterVisible) {
            dispatch(toggleIsFilter(false))
        }
    }

    return (
        <div className={s.wrapper}>
            <div className={s.filter}>
                <Button onClick={toggleFilterVisible}>Фильтр</Button>
                {isFilterVisible && <Filters/>}
            </div>
            <div className={s.list}>
                {products && products.map(item => <ProductItem key={item.id} productData={item}/>)}
            </div>
            <div className={s.pagination}>
                <Pagination
                defaultPageSize={LIMIT}
                total={isFilter ? filteredIds?.ids?.length : idsCount}
                showSizeChanger={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} товаров`}
                onChange={handlePageChange}
                />
            </div>
        </div>
    )
}

