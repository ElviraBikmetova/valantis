import { useEffect, useRef, useState } from "react";
import { ProductCard, ProductCardSceleton } from "./ProductCard";
import { productApi } from "../../store/services";
import s from "./styles.module.scss"
import { Filters } from "../filters/Filters";
import { useDispatch, useSelector } from "react-redux";
import { general, toggleIsFilter, toggleIsPending } from "../../store/generalSlice";
import { Button, Pagination } from "antd";
import { LIMIT } from "../../constants/constants";

export function Products() {
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [getIds, { data: idsData }] = productApi.useGetIdsMutation()
    const [getItems, { data: products, isSuccess }] = productApi.useGetItemsMutation()
    const [_, { data: filteredIds }] = productApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
    const { isFilter, isPending } = useSelector(general)
    const dispatch = useDispatch()
    const offsetRef = useRef(0)
    const offsetFilterRef = useRef(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentFilterPage, setCurrentFilterPage] = useState(1)

    const getProducts = (idsData, offset = offsetRef.current, limit = LIMIT) => {
        if (idsData) {
            const idsPart = idsData.ids.slice(offset, offset + limit)
            getItems(idsPart)
        }
    }

    useEffect(() => {
        getIds()
    }, [])

    useEffect(() => {
        if (isFilter) {
            getProducts(filteredIds, offsetFilterRef.current)
        } else {
            getProducts(idsData)
            dispatch(toggleIsPending(true))
        }
        setCurrentFilterPage(1)
        offsetFilterRef.current = 0
    }, [isFilter, filteredIds, idsData])


    useEffect(() => {
        if (isSuccess) {
            dispatch(toggleIsPending(false))
        }
    },[isSuccess])

    const handlePageChange = (page, pageSize) => {
        dispatch(toggleIsPending(true))
        const newOffset = (page - 1) * pageSize // Вычисляем новое смещение
        if (isFilter) {
            setCurrentFilterPage(page)
            getProducts(filteredIds, newOffset, pageSize)
            offsetFilterRef.current = newOffset // Обновляем значение смещения в ref
        } else {
            setCurrentPage(page)
            getProducts(idsData, newOffset, pageSize)
            offsetRef.current = newOffset // Обновляем значение смещения в ref
        }
    }

    const toggleFilterVisible = () => {
        setIsFilterVisible(!isFilterVisible)
        if (isFilterVisible) {
            dispatch(toggleIsFilter(false))
        }
    }

    let content
    if (isPending) {
        content = Array.from({ length: 15 }, (_, index) => <ProductCardSceleton key={index} />)
    } else {
        if (products) {
            content = products.map(item => <ProductCard key={item.id} productData={item}/>)
        }
    }

    return (
        <>
            <div className={'container'}>
                <div className={s.filter}>
                    <Button onClick={toggleFilterVisible} disabled={isPending}>Фильтр</Button>
                    {isFilterVisible && <Filters isPending={isPending} />}
                </div>
                <div className={s.list}>{content}</div>
                <div className={s.pagination}>
                    <Pagination
                    current={isFilter ? currentFilterPage : currentPage}
                    defaultCurrent={1}
                    defaultPageSize={LIMIT}
                    total={isFilter ? filteredIds?.total : idsData?.total}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} товаров`}
                    onChange={handlePageChange}
                    disabled={isPending}
                    />
                </div>
            </div>
        </>

    )
}

