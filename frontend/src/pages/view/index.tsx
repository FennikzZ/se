import { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useSwipeable } from "react-swipeable";
import { Row, Col, Card, Image, Divider, message, Tag } from "antd";
import { GetPromotions } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/IPromotion";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทยสำหรับวันที่
import "./View.css";

function View() {
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [index, setIndex] = useState(0); // Index for the active promotion
  const [messageApi, contextHolder] = message.useMessage();

  // คำนวณตำแหน่งกลาง
  const calculateCenterIndex = (length: number) => Math.floor(length / 2);

  // Fetch promotions data
  const getPromotions = async () => {
    try {
      const res = await GetPromotions();
      if (res.status === 200) {
        setPromotions(res.data);
        setIndex(calculateCenterIndex(res.data.length)); // ตั้งค่า index ให้เริ่มกลาง
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

  // Animation for sliding effect
  const springStyle = useSpring({
    transform: `translateX(-${index * 33.33}%)`, // Move based on index
  });

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex((prev) => (prev + 1) % promotions.length), // Next promotion
    onSwipedRight: () => setIndex((prev) => (prev - 1 + promotions.length) % promotions.length), // Previous promotion
  });

  // ฟังก์ชันการแปลงวันที่ให้แสดงเป็นวันที่ ชื่อเดือน ค.ศ.
  const formatDate = (date: string) => {
    return dayjs(date).locale("th").format("D MMMM YYYY"); // วันที่ ชื่อเดือน ค.ศ.
  };

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={24}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#9333EA" }}>
            โปรโมชั่นทั้งหมด
          </h2>
        </Col>
      </Row>
      <Divider />
      <div
        {...handlers}
        style={{
          overflow: "hidden",
          width: "100%",
          position: "relative",
        }}
      >
        <animated.div
          style={{
            display: "flex",
            width: `${promotions.length * 33.33}%`, // Adjust width for all cards
            ...springStyle,
          }}
        >
          {promotions.map((promotion, i) => (
            <div
              key={promotion.id}
              style={{
                flex: "0 0 33.33%",
                padding: "0 10px",
                boxSizing: "border-box",
                transform: i === index ? "scale(1.1)" : "scale(0.9)", // เพิ่มเอฟเฟกต์ขยาย
                opacity: i === index ? 1 : 0.6, // การ์ดเด่นจะแสดงชัดกว่า
                transition: "transform 0.3s, opacity 0.3s",
              }}
            >
              <Card
                className="coupon-card"
                style={{
                  border: i === index ? "2px solid #9333EA" : "1px solid #DAD6EF", // เส้นขอบสำหรับการ์ดเด่น
                }}
              >
                <Row gutter={16}>
                  {/* รูปภาพโปรโมชัน */}
                  <Col span={24} className="coupon-image">
                    <Image
                      alt={promotion.promotion_name ?? "Default Alt Text"} 
                      src={promotion.photo ?? "/default-image.jpg"} 
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </Col>

                  {/* ข้อมูลโปรโมชัน */}
                  <Col span={24} style={{ textAlign: "center", marginTop: "10px" }}>
                    <Tag
                      style={{
                        fontSize: "16px",
                        backgroundColor: "#7F6BCC",
                        color: "#fff",
                        padding: "5px 10px",
                      }}
                    >
                      {promotion.promotion_name ?? "ไม่มีชื่อโปรโมชัน"} 
                    </Tag>
                    <p
                      style={{
                        margin: "10px 0",
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#47456C",
                      }}
                    >
                      ส่วนลด:{" "}
                      {promotion.discount_type === "amount"
                        ? `${promotion.discount} บาท`
                        : `${promotion.discount}%`}
                    </p>
                    <p style={{ margin: "5px 0", color: "#575A83" }}>
                      ช่วงเวลาโปรโมชัน: {promotion.start_date ? formatDate(promotion.start_date) : "ไม่ระบุ"} ถึง{" "}
                      {promotion.end_date ? formatDate(promotion.end_date) : "ไม่ระบุ"}
                    </p>
                    <p style={{ margin: "5px 0", fontStyle: "italic", color: "#575A83" }}>
                      {promotion.promotion_description ?? "-"} 
                    </p>
                    <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
                      CODE :{" "}
                      <Tag
                        style={{
                          backgroundColor: "#9333EA",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {promotion.promotion_code ?? "ไม่มีรหัสโปรโมชัน"}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          ))}
        </animated.div>
      </div>
      {/* Navigation buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => setIndex((prev) => (prev - 1 + promotions.length) % promotions.length)}
          disabled={promotions.length <= 1}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            borderRadius: "5px",
            background: "#9333EA",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {"<"}
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % promotions.length)}
          disabled={promotions.length <= 1}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            background: "#9333EA",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {">"}
        </button>
      </div>
    </>
  );
}

export default View;
