import { v4 as uuidv4 } from 'uuid';
import s from "./styles.module.scss"
import { baseApi } from '../../store/services'
import { useEffect, useState } from 'react';
import { Select, Form } from 'antd';
import { FIELDS } from '../../constants';

export const FilterItem = ({ field }) => {
  const [getFields, { data: fieldsData }] = baseApi.useGetFieldsMutation()

  useEffect(() => {
      getFields(field)
  }, [])

  return (
    <Form.Item name={field} label={FIELDS[field]}>
      <Select
      options={fieldsData && fieldsData.map(field => { return {value: field, label: field}})} allowClear
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => (String(option?.label) || '').includes(input)}
      filterSort={(optionA, optionB) => {
        const labelA = optionA?.label;
      const labelB = optionB?.label;
      if (!isNaN(labelA) && !isNaN(labelB)) {
        // Если оба значения являются числами, то сравниваем их как числа
        return Number(labelA) - Number(labelB);
      } else {
        // В противном случае сравниваем их как строки
        // return labelA.localeCompare(labelB);
        return (labelA ?? '').toLowerCase().localeCompare((labelB ?? '').toLowerCase())
      }
      }
      // (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
      />
    </Form.Item>
  )
}