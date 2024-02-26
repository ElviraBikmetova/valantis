import { productApi } from '../../store/services'
import { useEffect } from 'react';
import { Select, Form } from 'antd';
import s from "./styles.module.scss"
import { useDispatch } from 'react-redux';
import { toggleIsFilter } from '../../store/filterSlice';

export const FilterItem = ({ field }) => {
  const [getFields, { data: fieldsData }] = productApi.useGetFieldsMutation()
  const dispatch = useDispatch()

  useEffect(() => {
      getFields(field)
  }, [])

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
    <Form.Item name={field} rules={[{ required: true }]}>
      <Select
      className={s.itemSelect}
      style={{width: 250}}
      options={fieldsData && fieldsData.map(field => { return field === null ? {value: 'without value', label: ' Без значения'} : {value: field, label: field}})}
      allowClear
      onClear={() => dispatch(toggleIsFilter(false))}
      showSearch
      placeholder="Выберите значение"
      optionFilterProp="children"
      filterOption={(input, option) => (String(option?.label) || '').includes(input)}
      filterSort={filterSort}
      />
    </Form.Item>
  )
}