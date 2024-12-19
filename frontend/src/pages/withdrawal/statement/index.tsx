import { useState, useEffect } from "react";
import { Table, Button, Divider, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetUsers, DeleteUsersById, GetWithdrawal } from "../../../services/https/index";
import { UsersInterface } from "../../../interfaces/IUser";
import { WithdrawalInterface } from "../../../interfaces/IWithdrawal";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Statement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "",
      render: (record) => (
        <>
          {record?.ID && myId !== record.ID ? (
            <Button
              type="dashed"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                deleteUserById(record.ID);
              }}
            />
          ) : null}
        </>
      ),
    },
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "วัน/เดือน/ปี เกิด",
      key: "birthday",
      render: (record) => <>{dayjs(record.birthday).format("DD/MM/YYYY")}</>,
    },
    {
      title: "อายุ",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record) => <>{record?.gender?.gender}</>,
    },
    {
      title: "ยอดเงิน",
      key: "income",
      render: (record) => <>{record.income} บาท</>,
    },
    {
      title: "",
      render: (record) => (
        <>
          {record?.ID ? (
            <Button
              type="primary"
              onClick={() => {
                navigate(`/promotion/edit/${record.ID}`);
              }}
            >
              แก้ไขข้อมูล
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  // เพิ่มคอลัมน์สำหรับการถอนเงิน
  const withdrawalColumns: ColumnsType<WithdrawalInterface> = [
    {
      title: "ลำดับ",
      render: (record) => <>{record.user_id}</>,
      key: "UserID",
    },
    {
      title: "จำนวนเงินที่ถอน",
      dataIndex: "withdrawal_amount",
      key: "withdrawal_amount",
      render: (amount) => <>{amount} บาท</>,
    },
    {
      title: "ค่าคอมมิชชั่น",
      dataIndex: "withdrawal_commission",
      key: "withdrawal_commission",
      render: (commission) => <>{commission} บาท</>,
    },
    {
      title: "จำนวนเงินสุทธิ",
      dataIndex: "withdrawal_net_amount",
      key: "withdrawal_net_amount",
      render: (netAmount) => <>{netAmount} บาท</>,
    },
    {
      title: "หมายเลขบัญชีธนาคาร",
      dataIndex: "withdrawal_bank_number",
      key: "withdrawal_bank_number",
    },
    {
      title: "วันที่ถอนเงิน",
      dataIndex: "withdrawal_date",
      key: "withdrawal_date",
      render: (date) => <>{dayjs(date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "ชื่อธนาคาร",
      dataIndex: "bank_name",
      key: "bank_name",
      render: (bank) => <>{bank?.bank_name}</>,
    },
  ];

  const deleteUserById = async (id: string) => {
    if (!id) return;
    let res = await DeleteUsersById(id);
    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      await getUsers();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getUsers = async () => {
    let res = await GetUsers();
    if (res.status === 200) {
      const currentUser = res.data.filter(
        (user: UsersInterface) => user.ID?.toString() === myId
      );
      setUsers(currentUser);
    } else {
      setUsers([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getWithdrawal = async () => {
    let res = await GetWithdrawal();
    if (res.status === 200) {
      // กรองข้อมูลการถอนที่ตรงกับ user_id
      const filteredWithdrawals = res.data.filter(
        (withdrawal: WithdrawalInterface) => withdrawal.user_id.toString() === myId
      );
      setWithdrawals(filteredWithdrawals);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getUsers();
    getWithdrawal(); // ดึงข้อมูลการถอนเงิน
  }, [myId]);

  return (
    <>
      {contextHolder}

      <Divider />

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={users}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>

      <Divider />

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="id"
          columns={withdrawalColumns}
          dataSource={withdrawals}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}

export default Statement;