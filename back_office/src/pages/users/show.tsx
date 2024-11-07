import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useOne, useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const UserShow = () => {
    const { queryResult } = useShow({});
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Title level={5}>{"Name"}</Title>
            <TextField value={"John Doe"} />
            <Title level={5}>{"Usernaeme"}</Title>
            <TextField value="johndoe123" />
            <Title level={5}>{"Email"}</Title>
            <TextField value={record?.email} />
            <Title level={5}>{"Phone"}</Title>
            <TextField value="+123456789" />
            <Title level={5}>{"Account Status"}</Title>
            <TextField value="Active" />
            <Title level={5}>{"Next Payment Data"}</Title>
            <TextField value="11/8/2024" />
            <Title level={5}>{"Last payment date"}</Title>
            <TextField value="12/8/2024" />
            <Title level={5}>{"Card Ending"}</Title>
            <TextField value="12/31/2024" />
            <Title level={5} style={{color: "red"}}>{"Deactive Account"}</Title>
            <Title level={5}>{"Suspended account"}</Title>
            <TextField value="No" />
            <Title level={5}>{"Promo credits"}</Title>
            <TextField value="200" />
        </Show>
    )
}