import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Image } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetPromotions, DeletePromotionById } from "../../services/https/index";
import { PromotionInterface } from "../../interfaces/IPromotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // Columns for the table
  const columns: ColumnsType<PromotionInterface> = [
    {
      title: "ภาพโปรโมชัน",
      dataIndex: "photo",
      key: "photo",
      render: (text) =>
        text ? (
          <Image width={50} src={text} alt="Promotion" />
        ) : (
          "-"
        ),
    },
    {
      title: "รหัสโปรโมชั่น",
      dataIndex: "promotion_code",
      key: "promotion_code",
    },
    {
      title: "ชื่อโปรโมชั่น",
      dataIndex: "promotion_name",
      key: "promotion_name",
    },
    {
      title: "ประเภทส่วนลด",
      dataIndex: "discount_type",
      key: "discount_type",
      render: (text) => (text === "amount" ? "จำนวนเงิน (บาท)" : "เปอร์เซ็นต์ (%)"),
    },
    {
      title: "จำนวนส่วนลด",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "วันเริ่มต้น",
      key: "start_date",
      render: (record) => <>{dayjs(record.start_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "วันหมดเขต",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "คำอธิบายโปรโมชั่น",
      dataIndex: "promotion_description",
      key: "promotion_description",
      render: (text) => (
        <div style={{ wordWrap: 'break-word', whiteSpace: 'normal', maxWidth: '200px' }}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="dashed"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deletePromotionById(record.ID!)} // ใช้ 'id' ตาม interface
        >
          ลบ
        </Button>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => {
            if (record.ID) {
              navigate(`/promotion/edit/${record.ID}`);
            } else {
              messageApi.error("ไม่พบข้อมูลโปรโมชั่นที่ต้องการแก้ไข");
            }
          }}
          style={{ backgroundColor: "#575A83", borderColor: "#575A83" }}  // กำหนดสีปุ่ม
        >
          แก้ไขข้อมูล
        </Button>
      ),
    },
  ];

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

  // Delete promotion by ID
  const deletePromotionById = async (id: number) => {
    try {
      const res = await DeletePromotionById(String(id)); // แปลง id เป็น string
      if (res.status === 200) {
        messageApi.success(res.data.message);
        getPromotions(); // Refresh data
      } else {
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถลบโปรโมชันได้");
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
        <Col span={12}>
          <h2>จัดการโปรโมชั่น</h2>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Space>
            <Link to="/promotion/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ backgroundColor: "#9333EA", borderColor: "#9333EA" }}  // กำหนดสีปุ่ม
              >
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={promotions}
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}

export default Promotion;
