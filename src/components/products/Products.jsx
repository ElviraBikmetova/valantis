import { useEffect, useRef, useState } from "react";
import { ProductItem } from "./ProductItem";
import { baseApi } from "../../store/services";
import s from "./styles.module.scss"
import { Filters } from "../filters/Filters";
import { useSelector } from "react-redux";
import { filter } from "../../store/filterSlice";

export const limit = 50

export function ProductList() {
  const [getIds, { data: idsData }] = baseApi.useGetIdsMutation()
  const [getItems, { data: products }] = baseApi.useGetItemsMutation()
  const [_, { data: filteredIds }] = baseApi.useFilterMutation({fixedCacheKey: 'sharedFilter'})
  const { isFilter } = useSelector(filter)
//   console.log('isFilter', isFilter)

  const offsetRef = useRef(0)
  const [isBack, setIsBack] = useState(false)

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
    getIds({offset: offsetRef.current, limit})
  }, [])

  useEffect(() => {
    getProducts(isFilter ? filteredIds : idsData)
  }, [isFilter ? filteredIds : idsData])

  const goToPreviousPage = () => {
    if (offsetRef.current > limit) {
        getIds({offset: offsetRef.current - limit, limit})
        offsetRef.current -= limit
        setIsBack(true)
    }
  }

  const goToNextPage = () => {
    getIds({offset: offsetRef.current + limit, limit})
    offsetRef.current += limit
    setIsBack(false)
  }

  return (
    <div className={s.wrapper}>
        <div className={s.list}>
        {products && products.map(item => <ProductItem key={item.id} productData={item}/>)}
        </div>
        <div className={s.pagination}>
            <button className={s.btn} onClick={goToPreviousPage} disabled={offsetRef.current < limit}>Назад</button>
            <button className={s.btn} onClick={goToNextPage} disabled={products?.length < limit}>Вперед</button>
        </div>
        <Filters/>
    </div>
  );
}

