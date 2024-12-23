import { useState, useEffect } from "react";
import { Button, Col, Row, Divider, message, Card } from "antd";
import { LoginOutlined, HistoryOutlined, CreditCardOutlined } from "@ant-design/icons"; // เพิ่ม WalletOutlined และ HistoryOutlined
import { GetUsers, DeleteUsersById } from "../../services/https/index";
import { UsersInterface } from "../../interfaces/IUser";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/wallet.png"; // อย่าลืมนำเข้าภาพโลโก้

function Withdrawal() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

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
              maxWidth: "2000px", // ปรับขนาด Card
              margin: "0 auto", // จัดกึ่งกลาง
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
              <CreditCardOutlined style={{ color: "#7F6BCC", marginRight: "8px" }} />
              {userIncome} บาท
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
              icon={<LoginOutlined />} // เพิ่มไอคอนเบิกเงิน
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
              icon={<HistoryOutlined />} // เพิ่มไอคอนประวัติการถอนเงิน
            >
              ประวัติการทำรายการ
            </Button>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Withdrawal;
