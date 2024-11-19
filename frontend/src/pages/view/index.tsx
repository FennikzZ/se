import { useState, useEffect } from "react";
import { Row, Col, Divider, message, Image, Card } from "antd";
import { GetPromotions } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/IPromotion";
import dayjs from "dayjs";
import './View.css';  // Assuming you're using a CSS file for styling

function View() {
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

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

  // Fetch data on component mount
  useEffect(() => {
    getPromotions();
  }, []);

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
        {/* Loop through the promotions and display each one in a new row */}
        {promotions.map((promotion) => (
          <Row gutter={[16, 16]} key={promotion.id} style={{ marginBottom: 20 }}>
            <Col span={24}>
              <Card className="coupon-card">
                <Row gutter={16}>
                  {/* Image on the left (30%) */}
                  <Col span={8} className="coupon-image">
                    <Image
                      alt={promotion.promotion_name}
                      src={promotion.photo || '/default-image.jpg'}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </Col>
                  {/* Promotion details on the right (70%) */}
                  <Col span={16} className="coupon-details">
                    <h3>{promotion.promotion_name}</h3>

                    <p>
                      <strong>ส่วนลด: </strong>
                      {promotion.discount_type === "amount"
                        ? `${promotion.discount} บาท`
                        : `${promotion.discount}%`}
                    </p>

                    <p><strong>คำอธิบาย:</strong> {promotion.promotion_description || "-"}</p>

                    <p><strong>วันหมดเขต:</strong> {dayjs(promotion.end_date).format("DD/MM/YYYY")}</p>

                    <p><strong>รหัสโปรโมชั่น:</strong> {promotion.promotion_code}</p>
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

export default View;
