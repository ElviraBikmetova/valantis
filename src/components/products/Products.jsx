import { useEffect, useRef, useState } from "react";
import { ProductItem } from "./ProductItem";
import { baseApi } from "../../store/services";
import s from "./styles.module.scss"
import { Filters } from "../filters/Filters";
import { useSelector } from "react-redux";
import { filter } from "../../store/filterSlice";
import { Pagination } from "antd";

export const limit = 50

export function ProductList() {
  const [getIdsCount, { data: idsCount }] = baseApi.useGetIdsCountMutation()
  const [getIds, { data: idsData }] = baseApi.useGetIdsMutation()
  const [getItems, { data: products }] = baseApi.useGetItemsMutation()
  const [_, { data: filteredIds }] = baseApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
  const { isFilter } = useSelector(filter)


  const offsetRef = useRef(0)
  const [isBack, setIsBack] = useState(false)

//   console.log('isBack', isBack)

  const getProducts = (idsData) => {
    if (idsData) {
        if (idsData.ids.length < limit && !idsData.isMaxLimit) {
            if (isBack) {
                getIds({offset: offsetRef.current - (limit - idsData.ids.length), limit: limit + (limit - idsData.ids.length)})
                getItems(idsData.ids)
            } else {
                getIds({offset: offsetRef.current, limit: limit + (limit - idsData.ids.length)})
                getItems(idsData.ids)
                offsetRef.current += limit - idsData.ids.length
            }
        } else {
            getItems(idsData.ids)
        }
    //
    }
  }


  useEffect(() => {
    getIdsCount()
    getIds({offset: offsetRef.current, limit})
  }, [])

  useEffect(() => {
    getProducts(isFilter ? filteredIds : idsData)
  }, [isFilter ? filteredIds : idsData])

//   console.log('offsetRef.current', offsetRef.current)

  const handlePageChange = (page, pageSize) => {
    const newOffset = (page - 1) * pageSize + (offsetRef.current % pageSize)  // Вычисляем новое смещение
    getIds({ offset: newOffset, limit }) // Вызываем вашу функцию для загрузки данных
    if (newOffset < offsetRef.current) {
        // Движение назад
        setIsBack(true)
      } else {
        // Движение вперёд или на ту же страницу
        setIsBack(false)
      }
    offsetRef.current = newOffset // Обновляем значение смещения в ref
  }

  return (
    <div className={s.wrapper}>
        <div className={s.list}>
        {products && products.map(item => <ProductItem key={item.id} productData={item}/>)}
        </div>
        <div className={s.pagination}>
            <Pagination
            defaultPageSize={limit}
            total={idsCount}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} товаров`}
            onChange={handlePageChange}
            />
            {/* <button className={s.btn} onClick={goToPreviousPage} disabled={offsetRef.current < limit}>Назад</button>
            <button className={s.btn} onClick={goToNextPage} disabled={products?.length < limit}>Вперед</button> */}
        </div>
        <Filters/>
    </div>
  );
}

