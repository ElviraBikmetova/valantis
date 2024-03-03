import { Button, Form } from 'antd'
import { useEffect, useState } from 'react'

export const SubmitButton = ({ form, isLoading, children }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form)

    useEffect(() => {
    form
        .validateFields({
        validateOnly: true,
        })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false))
    }, [form, values])

    return (
        <Button htmlType="submit" disabled={!submittable || isLoading}>
        {children}
        </Button>
    )
}