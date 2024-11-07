import { Edit, useForm , useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";

export const UserEdit = () => {
    const { formProps, saveButtonProps, queryResult, formLoading } = useForm({});

    const userData = queryResult?.data?.data;

    return (
        <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={"username"}
                    name={["username"]}
                    rules={[
                        {
                            required: true,
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"email"}
                    name="email"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={"phone"}
                    name="phone"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Edit>
    )
}