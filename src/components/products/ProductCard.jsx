import { Skeleton } from 'antd'
import { formatPrice } from '../../helpers/formatPrice'
import s from './styles.module.scss'

export const ProductCard = ({productData}) => {
  return (
    <div className={s.productCard}>
      <div className={s.cardTitle}>{productData.product}</div>
      <div className={s.info}>
        <div>
          <div className={s.label}>Артикул:</div>
          <div className={s.id}>{productData.id}</div>
        </div>
        <div className={s.price}>{formatPrice(productData.price)}</div>
          <div className={s.brand}>
          {productData.brand &&
            <>
              <div className={s.label}>Бренд:</div>
              <div className={s.brandName}>{productData.brand}</div>
            </>
          }
          </div>
      </div>
    </div>
  )
}

export const ProductCardSceleton = () => {
  return (
    <div className={s.productCardSceleton}>
      <Skeleton active paragraph={{ rows: 5 }} />
    </div>
  )
}

