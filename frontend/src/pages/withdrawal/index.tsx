import { useState, useEffect } from "react";
import { Table, Button, Col, Row, Divider, message, Card } from "antd";
import { DeleteOutlined, CopyrightOutlined } from "@ant-design/icons"; // เพิ่ม CopyrightOutlined
import type { ColumnsType } from "antd/es/table";
import { GetUsers, DeleteUsersById } from "../../services/https/index";
import { UsersInterface } from "../../interfaces/IUser";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import logo from "../../assets/wallet.png"; // อย่าลืมนำเข้าภาพโลโก้

function Withdrawal() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "",
      render: (record) => (
        <>
          {/* ตรวจสอบว่า record.ID มีค่าก่อน */}
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
      key: "id",
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
          {/* ตรวจสอบว่า record.ID มีค่าก่อน */}
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

  const deleteUserById = async (id: string) => {
    if (!id) return;  // if the ID is undefined, exit the function
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
      // กรองเฉพาะผู้ใช้ที่กำลังใช้งานอยู่
      const currentUser = res.data.filter(
        (user: UsersInterface) => user.ID?.toString() === myId // added safe check for user.ID
      );
      setUsers(currentUser); // เซ็ตข้อมูลผู้ใช้ที่กำลังใช้งาน
    } else {
      setUsers([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, [myId]);

  // สมมุติว่ามีแค่ผู้ใช้เดียวใน currentUser
  const userIncome = users.length > 0 ? users[0].income : 0;

  // ฟังก์ชันที่เรียกเมื่อคลิกปุ่ม "เบิกเงิน"
  const handleWithdrawClick = () => {
    navigate("/withdrawal/money");  // เปลี่ยนเส้นทางไปยังหน้า "เบิกเงิน"
  };

  // ฟังก์ชันที่เรียกเมื่อคลิกปุ่ม "ตรวจสอบประวัติการถอนเงิน"
  const handleHistoryClick = () => {
    navigate("/withdrawal/statement");  // เปลี่ยนเส้นทางไปยังหน้า "ประวัติการถอนเงิน"
  };

  return (
    <>
      {contextHolder}

      <Divider />

      {/* เพิ่ม Card สำหรับกระเป๋าเงิน */}
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            style={{
              background: "rgba(255, 255, 255, 0.4)", // โปร่งแสง
              backdropFilter: "blur(10px)", // เบลอพื้นหลัง
              textAlign: "center",
              padding: "30px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              borderRadius: "10px",
              border: "none",
            }}
          >
            <h2
              style={{
                fontSize: "50px",
                fontWeight: "bold",
                color: "#9333EA",
                marginBottom: "20px",
              }}
            >
              กระเป๋าเงิน
            </h2>

            {/* แสดงโลโก้ โดยใช้ตัวแปร logo ที่นำเข้า */}
            <img
              src={logo}
              alt="logo"
              style={{
                width: "200px",
                marginBottom: "20px",
                borderRadius: "8px", // ทำให้มุมโลโก้โค้งมน
              }}
            />

            <h3 style={{ fontSize: "20px", color: "#47456C", marginBottom: "20px" }}>
              ยอดเงินของคุณ
            </h3>
            <h3 style={{ fontSize: "25px", color: "#47456C" }}>
              <CopyrightOutlined style={{ color: "#7F6BCC" }} /> {userIncome} บาท
            </h3>

            {/* ปุ่มเบิกเงิน */}
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: "#7F6BCC",
                borderColor: "#7F6BCC",
                marginTop: "20px",
                width: "100%",
                borderRadius: "5px",
                fontSize: "18px",
              }}
              onClick={handleWithdrawClick} // เมื่อคลิกปุ่มจะไปที่หน้า "เบิกเงิน"
            >
              เบิกเงิน
            </Button>

            {/* ปุ่มตรวจสอบประวัติการถอนเงิน */}
            <Button
              type="default"
              size="large"
              style={{
                backgroundColor: "#DAD6EF",
                borderColor: "#DAD6EF",
                marginTop: "10px",
                width: "100%",
                borderRadius: "5px",
                fontSize: "18px",
              }}
              onClick={handleHistoryClick} // เมื่อคลิกปุ่มจะไปที่หน้า "ประวัติการถอนเงิน"
            >
              ตรวจสอบประวัติการถอนเงิน
            </Button>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={users}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}

export default Withdrawal;
