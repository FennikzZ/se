import { Space, Button, Col, Row, Divider, Form, Input, Card, message, DatePicker, InputNumber, Select } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { WithdrawalInterface } from "../../../interfaces/IWithdrawal"; // ใช้แค่ WithdrawalInterface
import { CreateWithdrawal } from "../../../services/https"; // ยังคงเรียกใช้ CreateWithdrawal สำหรับการบันทึกข้อมูล
import { useNavigate, Link } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web"; // import react-spring

function WithdrawalCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedBankName, setSelectedBank] = useState<string>(""); // Selected bank ID (string)
  const [bankname] = useState<any[]>([
    { ID: "1", bank_name: "ธนาคารกรุงเทพ" },
    { ID: "2", bank_name: "ธนาคารกสิกรไทย" },
    { ID: "3", bank_name: "ธนาคารไทยพาณิชย์" },
    { ID: "4", bank_name: "ธนาคารกรุงไทย" },
    { ID: "5", bank_name: "ธนาคารทหารไทย" },
  ]); // ธนาคารที่กำหนดไว้ในตัวแปร banks

  const onFinish = async (values: WithdrawalInterface) => {
    // แปลง selectedBankName จาก string เป็น number
    const withdrawalData = {
      ...values,
      bank_name_id: Number(selectedBankName), // ใช้ selectedBankName เพื่อส่งค่า bank_name_id
    };

    let res = await CreateWithdrawal(withdrawalData);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/withdrawal"); // เปลี่ยนเส้นทางไปยังหน้าคำขอถอนเงิน
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // Adding animation for the card and form
  const cardAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(-50px)" },
    config: { tension: 250, friction: 20 },
  });

  const formAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
    delay: 100,
    config: { tension: 200, friction: 30 },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "110vh",
        padding: "20px",
        backgroundColor: "rgba(233, 213, 255, 0.4)", // สีพื้นหลังอ่อน
      }}
    >
      {contextHolder}
      <animated.div style={cardAnimation}>
        <Card
          style={{
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ color: "#6B21A8", textAlign: "center", fontSize: "29px", fontWeight: "bold", marginTop: 0 }}>
            สร้างคำขอถอนเงิน
          </h2>
          <Divider style={{ margin: "10px 0" }} />
          <animated.div style={formAnimation}>
            <Form
              name="withdrawalCreate"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              style={{
                backgroundColor: "rgba(127, 107, 188, 0.2)", // สีม่วงโปร่งแสง 36%
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Row gutter={[16, 16]}>
                {/* จำนวนเงินที่ถอน */}
                <Col xs={24}>
                  <Form.Item
                    label="จำนวนเงินที่ถอน"
                    name="withdrawal_amount"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนเงินที่ถอน !" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                {/* ค่าคอมมิชชั่นจากการถอน */}
                <Col xs={24}>
                  <Form.Item
                    label="ค่าคอมมิชชั่นจากการถอน"
                    name="withdrawal_commission"
                    rules={[{ required: true, message: "กรุณากรอกค่าคอมมิชชั่นจากการถอน !" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                {/* จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น */}
                <Col xs={24}>
                  <Form.Item
                    label="จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น"
                    name="withdrawal_net_amount"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนเงินสุทธิ !" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                {/* หมายเลขบัญชีธนาคาร */}
                <Col xs={24}>
                  <Form.Item
                    label="หมายเลขบัญชีธนาคาร"
                    name="withdrawal_bank_number"
                    rules={[{ required: true, message: "กรุณากรอกหมายเลขบัญชีธนาคาร !" }]}
                  >
                    <Input placeholder="กรอกหมายเลขบัญชีธนาคาร" />
                  </Form.Item>
                </Col>

                {/* วันที่ทำการถอน */}
                <Col xs={24}>
                  <Form.Item
                    label="วันที่ทำการถอน"
                    name="withdrawal_date"
                    rules={[{ required: true, message: "กรุณาเลือกวันที่ทำการถอน !" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                {/* ธนาคาร */}
                <Col xs={24}>
                  <Form.Item
                    label="ธนาคาร"
                    name="bank_name_id"
                    rules={[{ required: true, message: "กรุณาเลือกธนาคาร !" }]}
                  >
                    <Select
                      value={selectedBankName}
                      onChange={(value) => setSelectedBank(value)} // value เป็น string
                      placeholder="เลือกธนาคาร"
                    >
                      {bankname.map((bank) => (
                        <Select.Option key={bank.ID} value={bank.ID.toString()}>
                          {bank.bank_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* ปุ่ม */}
                <Col xs={24} sm={24} style={{ textAlign: "center" }}>
                  <Form.Item>
                    <Space size="large">
                      <Link to="/withdrawals">
                        <Button block style={{ width: "150px" }}>ยกเลิก</Button>
                      </Link>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        block
                        style={{
                          backgroundColor: "#9333EA",
                          borderColor: "#9333EA",
                          color: "#fff",
                          width: "150px", // กำหนดความกว้าง
                        }}
                      >
                        บันทึก
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </animated.div>
        </Card>
      </animated.div>
    </div>
  );
}

export default WithdrawalCreate;