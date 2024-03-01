export const formatPrice = (price) => {
    const formatedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
    }).format(price)

	return formatedPrice
}