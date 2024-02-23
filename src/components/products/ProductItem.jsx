import s from './styles.module.scss'

export const ProductItem = ({productData}) => {
  return (
    <div className={s.productItem}>
        <img src="http://dummyimage.com/220x100/99cccc.gif&text=Product+image!" alt='Product' />
        <div className={s.name}>{productData.product}</div>
        <div>{productData.price}</div>
        <div>{productData.brand}</div>
        <div>{productData.id}</div>
    </div>
  )
}

