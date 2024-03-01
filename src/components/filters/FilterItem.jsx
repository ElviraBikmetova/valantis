import { productApi } from '../../store/services'
import { useEffect } from 'react';
import { Select, Form, Skeleton } from 'antd';
import s from "./styles.module.scss"
import { useDispatch } from 'react-redux';
import { toggleIsFilter } from '../../store/filterSlice';

export const FilterItem = ({ field }) => {
  const [getFields, { data: fieldsData, isLoading }] = productApi.useGetFieldsMutation()
  const dispatch = useDispatch()

  // console.log('field', field)


  useEffect(() => {
      getFields(field)
  }, [field])

  // console.log('fieldsData', fieldsData)

  const filterSort = (optionA, optionB) => {
    const labelA = optionA?.label;
    const labelB = optionB?.label;
    if (!isNaN(labelA) && !isNaN(labelB)) {
      // Если оба значения являются числами, то сравниваем их как числа
      return Number(labelA) - Number(labelB);
    } else {
      // В противном случае сравниваем их как строки
      return (labelA ?? '').toLowerCase().localeCompare((labelB ?? '').toLowerCase())
    }
  }

  return (
    <Form.Item name={field} rules={[{ required: true, message: '' }]} validateStatus="success">
      <Select
      style={{width: 250}}
      options={fieldsData && fieldsData.map(field => { return field === null ? {value: 'without value', label: ' Без значения'} : {value: field, label: field}})}
      allowClear
      onClear={() => dispatch(toggleIsFilter(false))}
      showSearch
      placeholder="Выберите значение"
      optionFilterProp="children"
      filterOption={(input, option) => (String(option?.label) || '').includes(input)}
      filterSort={filterSort}
      notFoundContent={isLoading ? <Skeleton active paragraph={{ rows: 7 }} /> : null}
      />
    </Form.Item>
  )
}