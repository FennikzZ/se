import React, { useState, useEffect } from "react";
import { Carousel, Card, Image, Tag, Divider, message, Row, Col, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { GetPromotions } from "../../services/https/index";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทยสำหรับวันที่
import "./Home.css";

// สร้าง Interface ภายในไฟล์นี้
interface PromotionInterface {
  id: number;
  promotion_code: string;
  promotion_name: string;
  promotion_description: string;
  photo: string;
  discount_type_id: number | string;
  discount: number;
  status_id: number;
  use_limit: number;
  distance: number;
  end_date: string;
}

const Home: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi] = message.useMessage();

  // Fetch promotions data
  const getPromotions = async () => {
    try {
      const res = await GetPromotions();
      if (res.status === 200) {
        setPromotions(res.data);
      } else {
        setPromotions([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถดึงข้อมูลโปรโมชันได้");
    }
  };

  useEffect(() => {
    getPromotions();
  }, []);

  // Format date in Thai locale
  const formatDate = (date: string) => dayjs(date).locale("th").format("D MMMM YYYY");

  // Handle copy promo code to clipboard
  const copyPromoCode = (promoCode: string) => {
    navigator.clipboard.writeText(promoCode).then(
      () => messageApi.success("คัดลอกโปรโมชันสำเร็จ!"),
      () => messageApi.error("ไม่สามารถคัดลอกโปรโมชันได้")
    );
  };

  // Render promotion status with larger size
  const renderStatus = (statusId: number) => {
    if (statusId === 1) {
      return <Tag color="green" style={{ fontSize: '15px', padding: '5px 10px', borderRadius: '5px' }}>ใช้งานได้</Tag>;
    }
    if (statusId === 2) {
      return <Tag color="red" style={{ fontSize: '15px', padding: '5px 10px', borderRadius: '5px' }}>ปิดการใช้งาน</Tag>;
    }
    return <Tag color="default" style={{ fontSize: '24px', padding: '10px 20px', borderRadius: '20px' }}>ไม่ระบุ</Tag>;
  };

  return (
    <div className="home-container" style={{ backgroundColor: "#DAD6EF" }}>
      <Navbar />
      <div
        className="banner"
        style={{
          background: "linear-gradient(to bottom right, #47456C, #9333EA)",
          padding: "40px 0",
          textAlign: "center",
        }}
      >
        <h1 className="banner-title" style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: "bold" }}>
          Cabana Promotions
        </h1>
        <p style={{ color: "#FFFFFF", fontSize: "18px", fontWeight: "lighter" }}>
          Discover the latest offers and discounts!
        </p>
      </div>

      <div className="promotion-banner" style={{ position: "relative", padding: "30px 0" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#9333EA", fontSize: "24px" }}>
          Promotions
        </h2>
        <Divider />

        <Carousel arrows infinite={false} style={{ padding: "0 20px" }}>
          {promotions.map((promotion) => (
            <div key={promotion.id}>
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
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Col>
                  <Col span={16}>
                    <Row gutter={[16, 16]}>
                      {/* Promotion Name and Discount */}
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
                            {promotion.discount_type_id === "amount"
                              ? `${promotion.discount} บาท`
                              : `${promotion.discount}%`}
                          </span>
                        </div>
                      </Col>

                      {/* Promotion Code and Status */}
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
                                icon={<CopyOutlined style={{ fontSize: "26px" }} />}  // Set the icon size here
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

                      {/* Show Description */}
                      <Col span={24}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "wrap",
                            padding: "20px",
                            borderTop: "1px solid #E4E4E4",
                            fontSize: "20px",
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

                      {/* End Date and Other Details */}
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
                            ระยะทางขั้นต่ำ: {promotion.distance} กม. / จำกัดสิทธิ์ {promotion.use_limit} คน
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </div>
          ))}
        </Carousel>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
