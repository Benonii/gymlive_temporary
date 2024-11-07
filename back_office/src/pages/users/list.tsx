import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import {
    DateField,
    DeleteButton,
    EditButton,
    List,
    MarkdownField,
    ShowButton,
    useTable,
} from "@refinedev/antd";

import {type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table, Button } from "antd";

export const UsersList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="name" title={"ID"} />
                <Table.Column dataIndex="username" title={"Username"} />
                <Table.Column dataIndex="email" title={"Email"} />
                <Table.Column dataIndex="phone" title={"Phone Number"} />
                <Table.Column dataIndex="last_active" title={"Last active"} />
                <Table.Column
                    dataIndex="status"
                    title={"Status"} 
                    render={(_, record: any) => {
                        return (
                            <Space>
                                <Button
                                    style={{
                                        // backgroundColor: ,
                                        color: record.isActive ? "green" : "red",
                                    }}
                                    onClick={() => {
                                        console.log("User status changed!")
                                    }}
                                >
                                    {record.isActive ? "Active" : "Deactivated"}
                                </Button>
                            </Space>
                        )
                    }}
                /> 
                <Table.Column 
                    title={"Actions"}
                    dataIndex="actions"
                    render={(_, record: any) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    )
}