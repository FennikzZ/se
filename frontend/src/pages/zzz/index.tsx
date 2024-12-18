import { useState, useEffect } from "react";
import { Row, Col, Divider, message, Image, Card, Tag, Button, Input } from "antd";
import { GetPromotions, UsePromotion } from "../../services/https/index"; // เพิ่ม UsePromotion
import dayjs from "dayjs";
import { CopyOutlined } from "@ant-design/icons";

// Define types for the API response if needed
interface ApiResponse<T> {
  status: number;
  data: T;
  error?: string;
}

export interface PromotionInterface {
  id: number;
  promotion_code: string;
  promotion_name: string;
  promotion_description: string;
  photo: string;
  DiscountTypeID: string;
  discount: number;
  status_id: number;
  use_limit: number;
  use_count: number;
  distance: number;
  end_date: string;
  discount_type: string;
}

function Test() {
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [inputCode, setInputCode] = useState<string>("");

  // Fetch promotions data
  const getPromotions = async () => {
    try {
      const res: ApiResponse<PromotionInterface[]> | undefined = await GetPromotions();

      if (res && res.status === 200 && res.data) {
        setPromotions(res.data);
      } else {
        setPromotions([]);
        messageApi.error(res?.error || "Unknown error");
      }
    } catch (error) {
      messageApi.error("ไม่สามารถดึงข้อมูลโปรโมชันได้");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getPromotions();
  }, []);

  // Function to format date
  const formatDate = (date: string) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  // Render promotion status
  const renderStatus = (statusId: number) => {
    if (statusId === 1) {
      return <Tag color="green" style={{ fontSize: '15px', padding: '5px 10px', borderRadius: '5px' }}>ใช้งานได้</Tag>;
    }
    if (statusId === 2) {
      return <Tag color="red" style={{ fontSize: '15px', padding: '5px 10px', borderRadius: '5px' }}>ปิดการใช้งาน</Tag>;
    }
    return <Tag color="default" style={{ fontSize: '24px', padding: '10px 20px', borderRadius: '20px' }}>ไม่ระบุ</Tag>;
  };

  // Function to handle promo code copy
  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    messageApi.success("คัดลอกรหัสโปรโมชั่นแล้ว");
  };

  // Function to use promotion by code
const usePromotionByCode = async (code: string) => {
  try {
    // หาโปรโมชั่นที่ตรงกับรหัสโปรโมชั่นที่กรอก
    const promotion = promotions.find(promo => promo.promotion_code === code);
    if (!promotion) {
      messageApi.error("ไม่พบโปรโมชั่นที่ใช้รหัสนี้");
      return;
    }

    // ส่ง promotion.id ไปยัง backend
    const res = await UsePromotion(promotion.id); // ส่ง id ของโปรโมชั่นที่ต้องการใช้

    if (res.status === 200) {
      // อัพเดต use_count ใน frontend ให้ตรงกับที่ server อัพเดต
      setPromotions((prevPromotions) =>
        prevPromotions.map((promo) =>
          promo.id === promotion.id
            ? { ...promo, use_count: promo.use_count + 1 }
            : promo
        )
      );
      messageApi.success("ใช้โปรโมชั่นสำเร็จ");
    } else {
      messageApi.error("ไม่สามารถใช้โปรโมชั่นได้");
    }
  } catch (error) {
    messageApi.error("เกิดข้อผิดพลาดในการใช้โปรโมชั่น");
  }
};

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={24}>
          <h2>โปรโมชั่นทั้งหมด</h2>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        {promotions.map((promotion) => (
          <Row gutter={[16, 16]} key={promotion.id} style={{ marginBottom: 20 }}>
            <Col span={24}>
              <Card
                className="coupon-card"
                style={{
                  border: "1px solid #DAD6EF",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "row",
                  height: "100%",
                  backgroundColor: "#F9F7FE",
                }}
              >
                <Row gutter={16} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                  <Col span={8}>
                    <Image
                      alt={promotion.promotion_name ?? "Default Alt Text"}
                      src={promotion.photo ?? "/default-image.jpg"}
                      style={{
                        width: "100%",
                        height: "330px",
                        objectFit: "cover",
                        borderRadius: "20px",
                      }}
                    />
                  </Col>
                  <Col span={16}>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <div
                          style={{
                            fontSize: "48px",
                            fontWeight: "bold",
                            color: "#47456C",
                            textAlign: "left",
                            marginBottom: "10px",
                          }}
                        >
                          <span>{promotion.promotion_name ?? "ไม่มีรหัสโปรโมชัน"}</span>
                          <span
                            style={{
                              marginLeft: "10px",
                              fontSize: "48px",
                              fontWeight: "bold",
                              color: "#575A83",
                            }}
                          >
                            ลดสูงสุด{" "}
                            {promotion.DiscountTypeID === "amount"
                              ? `${promotion.discount} บาท`
                              : `${promotion.discount}%`}
                          </span>
                        </div>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle" style={{ position: "relative" }}>
                          <Col>
                            <Tag
                              style={{
                                fontSize: "30px",
                                backgroundColor: "#7F6BCC",
                                color: "white",
                                padding: "10px 30px",
                                borderRadius: "20px",
                              }}
                            >
                              ใส่รหัส {promotion.promotion_code}
                              <Button
                                type="text"
                                icon={<CopyOutlined style={{ fontSize: "26px" }} />}
                                onClick={() => copyPromoCode(promotion.promotion_code)}
                                style={{
                                  fontSize: "20px",
                                  padding: "6px 12px",
                                  marginLeft: "10px",
                                  borderRadius: "8px",
                                  backgroundColor: "#7F6BCC",
                                  color: "white",
                                  transition: "background-color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6A56B9")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7F6BCC")}
                              />
                            </Tag>
                          </Col>
                          <Col>
                            <div style={{ textAlign: "right" }}>
                              {renderStatus(promotion.status_id)}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "wrap",
                            padding: "20px",
                            borderTop: "1px solid #E4E4E4",
                            fontSize: "16px",
                            color: "#47456C",
                            fontWeight: "500",
                            textAlign: "left",
                            backgroundColor: "#F2F1FF",
                            borderRadius: "8px",
                          }}
                        >
                          {promotion.promotion_description}
                        </div>
                      </Col>
                      <Col span={24}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "15px 20px",
                            borderTop: "1px solid #E4E4E4",
                            fontSize: "16px",
                            color: "#47456C",
                            fontWeight: "500",
                            backgroundColor: "#F9F7FE",
                            borderRadius: "8px",
                          }}
                        >
                          <div>หมดเขตโปรโมชั่น {formatDate(promotion.end_date)}</div>
                          <div style={{ textAlign: "right" }}>
                            ระยะทางขั้นต่ำ: {promotion.distance} กม. / จำกัดสิทธิ์ {promotion.use_limit} ครั้ง
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Input
                          placeholder="กรอกรหัสโปรโมชั่น"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          onPressEnter={() => usePromotionByCode(inputCode)}
                          style={{
                            marginTop: "10px",
                            borderRadius: "8px",
                            padding: "10px",
                          }}
                        />
                        <Button
                          type="primary"
                          onClick={() => usePromotionByCode(inputCode)}
                          style={{ marginTop: "10px", width: "100%" }}
                        >
                          ใช้โปรโมชั่น
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        ))}
      </div>
    </>
  );
}

export default Test;