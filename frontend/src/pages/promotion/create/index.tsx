import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PromotionInterface } from "../../../interfaces/IPromotion";
import { CreatePromotion } from "../../../services/https";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";

function PromotionCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [fileList, setFileList] = useState<any>([]);

  const onFinish = async (values: PromotionInterface) => {
    const promotionData = {
      ...values,
      discount_type: discountType,
      photo: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };

    let res = await CreatePromotion(promotionData);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const onChange = ({ fileList: newFileList }: { fileList: any }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src as string;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // ทำให้เนื้อหากลาง
        height: "110vh", // ใช้ความสูงของหน้าจอเต็มที่
        padding: "20px",
        backgroundColor: "rgba(233, 213, 255, 0.4)"
      }}
    >
      {contextHolder}
      <Card
  style={{
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // สีขาวโปร่งใส 80%
    borderRadius: "8px", // ทำให้มุมของ card กลม
    padding: "20px", // เพิ่ม padding ให้กับ card
    display: "flex",
    flexDirection: "column",
  }}
>
  <h2 style={{ color: "#6B21A8", textAlign: "center", fontSize: "29px", fontWeight: "bold", marginTop: 0 }}>
    สร้างโปรโมชั่นใหม่
  </h2>

  <Divider style={{ margin: "10px 0" }} /> {/* ลด margin เพื่อให้ Divider ไม่ห่างจากหัวข้อ */}

        {/* รูปภาพโปรโมชั่น */}
        <Row justify="center" style={{ marginBottom: 16 }}>
          <Col xs={4} style={{ textAlign: "center" }}>
            <Form.Item label="รูปภาพโปรโมชั่น" name="photo">
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัพโหลด</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>

        <Form
          name="promotionCreate"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{
            backgroundColor: "rgba(127, 107, 188, 0.2)", // สีม่วงโปร่งแสง 36%
            padding: "20px", // เพิ่ม padding เพื่อความสวยงาม
            borderRadius: "8px", // เพิ่มมุมกลมให้กับฟอร์ม
          }}
        >

          <Row gutter={[16, 16]}>
            {/* รหัสโปรโมชั่น และ ชื่อโปรโมชั่น */}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="รหัสโปรโมชั่น"
                    name="promotion_code"
                    rules={[
                      { required: true, message: "กรุณากรอกรหัสโปรโมชั่น !" },
                      { max: 20, message: "รหัสโปรโมชั่นต้องไม่เกิน 20 ตัวอักษร !" },
                    ]}>
                    <Input placeholder="กรอกรหัส เช่น NEWYEAR2024" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="ชื่อโปรโมชั่น"
                    name="promotion_name"
                    rules={[{ required: true, message: "กรุณากรอกชื่อโปรโมชั่น !" }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* ประเภทส่วนลด และ ส่วนลด */}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="ประเภทส่วนลด"
                    name="discount_type"
                    rules={[{ required: true, message: "กรุณาเลือกประเภทส่วนลด !" }]}>
                    <Select
                      value={discountType}
                      onChange={(value) => setDiscountType(value)}
                    >
                      <Select.Option value="amount">จำนวนเงิน (บาท)</Select.Option>
                      <Select.Option value="percent">เปอร์เซ็นต์ (%)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={discountType === "amount" ? "ส่วนลด (บาท)" : "ส่วนลด (%)"}
                    name="discount"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนส่วนลด !" }]}>
                    <InputNumber
                      min={0}
                      max={discountType === "percent" ? 100 : undefined}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* จำนวนครั้งที่ใช้ได้ และ วันหมดเขต */}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="จำนวนครั้งที่ใช้ได้"
                    name="max_uses"
                    rules={[{ required: true, message: "กรุณากรอกจำนวนครั้งที่ใช้ได้ !" }]}>
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="วันหมดเขต"
                    name="end_date"
                    rules={[{ required: true, message: "กรุณาเลือกวันหมดเขต !" }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* คำอธิบายโปรโมชั่น */}
            <Col xs={24}>
              <Form.Item
                label="คำอธิบายโปรโมชั่น"
                name="promotion_description"
                rules={[{ required: true, message: "กรุณากรอกคำอธิบายโปรโมชั่น !" }]}>
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>

            {/* ปุ่ม */}
            <Col xs={24} style={{ textAlign: "right" }}>
              <Form.Item>
                <Space>
                  <Link to="/promotion">
                    <Button>ยกเลิก</Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: "#9333EA", borderColor: "#9333EA" }} // ปรับสีปุ่ม
                  >
                    สร้างโปรโมชั่น
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default PromotionCreate;
