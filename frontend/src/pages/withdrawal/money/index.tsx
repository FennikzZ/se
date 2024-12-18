import { Space, Button, Col, Row, Divider, Form, Input, Card, message, DatePicker, InputNumber, Select } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { WithdrawalInterface } from "../../../interfaces/IWithdrawal"; 
import { CreateWithdrawal } from "../../../services/https"; 
import { useNavigate, Link } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";

function WithdrawalCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedBankName, setSelectedBank] = useState<string>(""); 
  const [form] = Form.useForm(); 
  const [bankname] = useState<any[]>([
    { ID: "1", bank_name: "ธนาคารกรุงเทพ" },
    { ID: "2", bank_name: "ธนาคารกสิกรไทย" },
    { ID: "3", bank_name: "ธนาคารไทยพาณิชย์" },
    { ID: "4", bank_name: "ธนาคารกรุงไทย" },
    { ID: "5", bank_name: "ธนาคารทหารไทย" },
  ]);

  const onFinish = async (values: WithdrawalInterface) => {
    const withdrawalData = {
      ...values,
      bank_name_id: Number(selectedBankName),
    };

    let res = await CreateWithdrawal(withdrawalData);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/withdrawal");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const handleWithdrawalAmountChange = (value: number | null) => {
    if (value === null) return;
    const commission = value * 0.3;
    const netAmount = value - commission;
    form.setFieldsValue({
      withdrawal_commission: commission,
      withdrawal_net_amount: netAmount,
    });
  };

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
        backgroundColor: "rgba(233, 213, 255, 0.4)",
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
                backgroundColor: "rgba(127, 107, 188, 0.2)",
                padding: "20px",
                borderRadius: "8px",
              }}
              form={form}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item
                    label="จำนวนเงินที่ถอน"
                    name="withdrawal_amount"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนเงินที่ถอน !" }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      step={1}
                      precision={0}
                      onChange={handleWithdrawalAmountChange}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="ค่าคอมมิชชั่นจากการถอน"
                    name="withdrawal_commission"
                    rules={[{ required: true, message: "กรุณากรอกค่าคอมมิชชั่นจากการถอน !" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} disabled />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น"
                    name="withdrawal_net_amount"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนเงินสุทธิ !" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} disabled />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="หมายเลขบัญชีธนาคาร"
                    name="withdrawal_bank_number"
                    rules={[
                      { required: true, message: "กรุณากรอกหมายเลขบัญชีธนาคาร !" },
                      {
                        pattern: /^[0-9]{10}$/, // Regex for exactly 10 digits
                        message: "หมายเลขบัญชีธนาคารต้องเป็นตัวเลข 10 หลัก",
                      },
                    ]}
                  >
                    <Input
                      placeholder="กรอกหมายเลขบัญชีธนาคาร"
                      maxLength={10} // Limit to 10 characters
                      onChange={(e) => {
                        // Ensure input contains only digits
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="วันที่ทำการถอน"
                    name="withdrawal_date"
                    rules={[{ required: true, message: "กรุณาเลือกวันที่ทำการถอน !" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="ธนาคาร"
                    name="bank_name_id"
                    rules={[{ required: true, message: "กรุณาเลือกธนาคาร !" }]}
                  >
                    <Select
                      value={selectedBankName}
                      onChange={(value) => setSelectedBank(value)}
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

                <Col xs={24} sm={24} style={{ textAlign: "center" }}>
                  <Form.Item>
                    <Space size="large">
                      <Link to="/withdrawal">
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
                          width: "150px",
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
