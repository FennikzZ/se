import { useEffect, useState } from "react";
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
import { PlusOutlined } from "@ant-design/icons";
import { PromotionInterface } from "../../../interfaces/IPromotion";
import { GetPromotionById, UpdatePromotionById } from "../../../services/https";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop"; // Use 'antd-img-crop' for image upload and cropping

function PromotionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<any>([]); // Store uploaded files
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [form] = Form.useForm();

  const getPromotionById = async (id: string) => {
    let res = await GetPromotionById(id);

    if (res.status === 200) {
      const promotion = res.data;
      form.setFieldsValue({
        promotion_code: promotion.promotion_code || "", // Ensure it's not undefined
        promotion_name: promotion.promotion_name || "", // Ensure it's not undefined
        discount_type: promotion.discount_type || "amount", // Ensure it's not undefined
        discount: promotion.discount || "", // Ensure it's not undefined
        start_date: promotion.start_date ? dayjs(promotion.start_date) : null,
        end_date: promotion.end_date ? dayjs(promotion.end_date) : null,
        promotion_description: promotion.promotion_description || "", // Ensure it's not undefined
      });
      setDiscountType(promotion.discount_type || "amount"); // Ensure it's not undefined
      setFileList(promotion.photo ? [{ url: promotion.photo }] : []);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลโปรโมชั่น",
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    }
  };

  const onFinish = async (values: PromotionInterface) => {
    const promotionData = {
      ...values,
      discount_type: discountType,
      photo: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };

    let res = await UpdatePromotionById(id || "", promotionData); // Ensure id is passed as string

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

  useEffect(() => {
    if (id) {
      getPromotionById(id);  // ดึงข้อมูลโปรโมชั่นจาก API
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลโปรโมชั่น",
      });
      navigate("/promotion");  // ถ้าไม่มี id จะไปหน้าอื่น
    }
  }, [id]);
  

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      {contextHolder}
      <Card style={{ width: "100%", maxWidth: "800px" }}>
        <h2>แก้ไขข้อมูล โปรโมชั่น</h2>
        <Divider />

        {/* Image Upload */}
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

        <Form name="promotionEdit" form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 16]}>
            {/* Promotion Code and Name */}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="รหัสโปรโมชั่น"
                    name="promotion_code"
                    rules={[{ required: true, message: "กรุณากรอกรหัสโปรโมชั่น !" }, { max: 20, message: "รหัสโปรโมชั่นต้องไม่เกิน 20 ตัวอักษร !" }]}
                  >
                    <Input placeholder="กรอกรหัส เช่น NEWYEAR2024" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="ชื่อโปรโมชั่น"
                    name="promotion_name"
                    rules={[{ required: true, message: "กรุณากรอกชื่อโปรโมชั่น !" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Discount Type and Amount */}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="ประเภทส่วนลด"
                    name="discount_type"
                    rules={[{ required: true, message: "กรุณาเลือกประเภทส่วนลด !" }]}
                  >
                    <Select value={discountType} onChange={(value) => setDiscountType(value)}>
                      <Select.Option value="amount">จำนวนเงิน (บาท)</Select.Option>
                      <Select.Option value="percent">เปอร์เซ็นต์ (%)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label={discountType === "amount" ? "ส่วนลด (บาท)" : "ส่วนลด (%)"} name="discount" rules={[{ required: true, message: "กรุณากรอกจำนวนส่วนลด !" }]}>
                    <InputNumber min={0} max={discountType === "percent" ? 100 : undefined} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Max Uses and End Date */}
            <Col xs={24}>
              <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                  <Form.Item label="วันเริ่มโปรโมชั่น" name="start_date" rules={[{ required: true, message: "กรุณาเลือกวันหมดเขต !" }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item label="วันสิ้นสุด" name="end_date" rules={[{ required: true, message: "กรุณาเลือกวันหมดเขต !" }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Promotion Description */}
            <Col xs={24}>
              <Form.Item label="คำอธิบายโปรโมชั่น" name="promotion_description" rules={[{ required: true, message: "กรุณากรอกคำอธิบายโปรโมชั่น !" }]}>
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>

            {/* Action Buttons */}
            <Col xs={24} style={{ textAlign: "right" }}>
              <Form.Item>
                <Space>
                  <Link to="/promotion">
                    <Button>ยกเลิก</Button>
                  </Link>
                  <Button type="primary" htmlType="submit">บันทึกการแก้ไข</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default PromotionEdit;
