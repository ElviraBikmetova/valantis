import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Select, Form, Skeleton } from 'antd'
import { toggleIsFilter } from '../../store/generalSlice'
import { productApi } from '../../store/services'

export const FilterItem = ({ field }) => {
  const [getFields, { data: fieldsData }] = productApi.useGetFieldsMutation()
  const dispatch = useDispatch()

  useEffect(() => {
      getFields(field)
  }, [field])

  const filterSort = (optionA, optionB) => {
    const labelA = optionA?.label
    const labelB = optionB?.label
    if (!isNaN(labelA) && !isNaN(labelB)) {
      // Если оба значения являются числами, то сравниваем их как числа
      return Number(labelA) - Number(labelB)
    } else {
      // В противном случае сравниваем их как строки
      return (labelA ?? '').toLowerCase().localeCompare((labelB ?? '').toLowerCase())
    }
  }

  return (
    <Form.Item name={field} rules={[{ required: true, message: '' }]} validateStatus="success">
      <Select
      allowClear
      showSearch
      style={{width: 250}}
      options={fieldsData && fieldsData.map(field => { return field === null ? {value: 'without value', label: ' Без значения'} : {value: field, label: field}})}
      onClear={() => dispatch(toggleIsFilter(false))}
      placeholder="Выберите значение"
      optionFilterProp="children"
      filterOption={(input, option) => (String(option?.label) || '').includes(input)}
      filterSort={filterSort}
      notFoundContent={<Skeleton active paragraph={{ rows: 7 }} />}
      />
    </Form.Item>
  )
}