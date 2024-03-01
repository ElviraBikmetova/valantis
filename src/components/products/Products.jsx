import { useEffect, useRef, useState } from "react";
import { ProductCard, ProductCardSceleton } from "./ProductCard";
import { productApi } from "../../store/services";
import s from "./styles.module.scss"
import { Filters } from "../filters/Filters";
import { useDispatch, useSelector } from "react-redux";
import { filter, toggleIsFilter } from "../../store/filterSlice";
import { Button, Pagination } from "antd";
import { LIMIT } from "../../constants/constants";
import { Footer } from '../footer/Footer.jsx'

export function Products() {
    const [isFilterVisible, setIsFilterVisible] = useState(false)
    const [getIdsCount, { data: idsCount }] = productApi.useGetIdsCountMutation()
    const [getIds, { data: idsData }] = productApi.useGetIdsMutation()
    const [getItems, { data: products, isLoading }] = productApi.useGetItemsMutation()
    const [_, { data: filteredIds }] = productApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
    const { isFilter } = useSelector(filter)
    const dispatch = useDispatch()

    const offsetRef = useRef(0)
    const [isBack, setIsBack] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [currentFilterPage, setCurrentFilterPage] = useState(1)

//   console.log('isBack', isBack)

    const getProducts = (idsData) => {
        // console.log('idsData.isFiltered', idsData?.isFiltered)
        if (idsData) {
            if (idsData.ids.length < LIMIT && !idsData.isMaxLimit) {
                if (isBack) {
                    getIds({offset: offsetRef.current - (LIMIT - idsData.ids.length), limit: LIMIT + (LIMIT - idsData.ids.length)})
                    // getItems(idsData.ids)
                } else {
                    getIds({offset: offsetRef.current, limit: LIMIT + (LIMIT - idsData.ids.length)})
                    // getItems(idsData.ids)
                    offsetRef.current += LIMIT - idsData.ids.length
                }
            } else {
                //TODO - сделать обработку случая, когда дублируются айдишники в товарах и их больше лимита
                if (idsData.isFiltered) {
                    // console.log('in if')
                    const filteredIdsPart = idsData.ids.slice(offsetRef.current, offsetRef.current + LIMIT)
                    // console.log('filteredIdsPart', filteredIdsPart)
                    getItems(filteredIdsPart)
                } else {
                    getItems(idsData.ids)
                }
            }
        }
    }

    useEffect(() => {
        offsetRef.current = 0
        setCurrentFilterPage(1)
        if (!isFilter) {
            getProducts(idsData)
        }
    }, [isFilter])

    useEffect(() => {
        getIdsCount()
        getIds({offset: offsetRef.current, limit: LIMIT})
    }, [])

    useEffect(() => {
        getProducts(isFilter ? filteredIds : idsData)
    }, [filteredIds, idsData])

    const handlePageChange = (page, pageSize) => {
        // console.log('offsetRef.current in handlePageChange', offsetRef.current)
        // console.log('page', page)

        const newOffset = (page - 1) * pageSize + (offsetRef.current % pageSize)  // Вычисляем новое смещение
        if (isFilter && filteredIds) {
            setCurrentFilterPage(page)
            const filteredIdsPart = filteredIds.ids.slice(newOffset, newOffset + pageSize)
            getItems(filteredIdsPart)
        } else {
            setCurrentPage(page)
            getIds({ offset: newOffset, limit: LIMIT })
        }

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

    // console.log('offsetRef.current', offsetRef.current)
    // console.log('idsData', idsData)
    // console.log('filteredIds', filteredIds)

    return (
        <>
            <div className={s.banner}>
                <h1 className={s.title}>Valantis Jewelry</h1>
            </div>
            <div className={'container'}>
                <div className={s.filter}>
                    <Button onClick={toggleFilterVisible} disabled={isLoading}>Фильтр</Button>
                    {isFilterVisible && <Filters isLoading={isLoading} />}
                </div>
                <div className={s.list}>
                    {isLoading && Array.from({ length: 15 }, (_, index) => <ProductCardSceleton key={index} />)}
                    {products && products.map(item => <ProductCard key={item.id} productData={item}/>)}
                </div>
                <div className={s.pagination}>
                    <Pagination
                    current={isFilter ? currentFilterPage : currentPage}
                    defaultCurrent={1}
                    defaultPageSize={LIMIT}
                    total={isFilter ? filteredIds?.ids?.length : idsCount}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} товаров`}
                    onChange={handlePageChange}
                    disabled={isLoading}
                    />
                </div>
            </div>
            <Footer />
        </>

    )
}

