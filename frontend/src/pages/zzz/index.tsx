import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Table, Divider, message, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetCommission, GetWithdrawal } from "../../services/https/index";
import { CommissionInterface } from "../../interfaces/ICommission"; // Import CommissionInterface
import { WithdrawalInterface } from "../../interfaces/IWithdrawal"; // Import WithdrawalInterface
import dayjs from "dayjs";
import { StockOutlined, AuditOutlined } from "@ant-design/icons";
import './Commission.css'; // Import custom CSS file

const { Title } = Typography;

function Commission() {
  const [commissions, setCommissions] = useState<CommissionInterface[]>([]); // State for commissions
  const [withdrawals, setWithdrawals] = useState<WithdrawalInterface[]>([]); // State for withdrawals
  const [messageApi, contextHolder] = message.useMessage();

  // ดึงข้อมูลการถอน
  const getWithdrawals = async () => {
    let res = await GetWithdrawal();
    if (res.status === 200) {
      setWithdrawals(res.data); // Set all withdrawal data
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const columns: ColumnsType<CommissionInterface> = [
    {
      title: "ลำดับ",
      render: (_, __, index) => <>{index + 1}</>, // แสดงลำดับที่เรียงจาก 1
      key: "index",
    },
    {
      title: "ค่าคอมมิชชั่นจากการถอน",
      dataIndex: "commission_amount",
      key: "commission_amount",
      render: (commission) => <>{commission} บาท</>,
    },
    {
      title: "รายได้รวมทั้งหมด",
      dataIndex: "commission_total",
      key: "commission_total",
      render: (commission) => <>{commission} บาท</>,
    },
    {
      title: "วันที่ที่ทำการ",
      dataIndex: "commission_date",
      key: "commission_date",
      render: (date) => <>{dayjs(date).format("DD/MM/YYYY")}</>,
    },
  ];

  const getCommission = async () => {
    let res = await GetCommission();
    if (res.status === 200) {
      setCommissions(res.data); // Set all commission data
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // Calculate the latest commission total (most recent entry)
  const latestCommissionTotal = commissions.length
    ? commissions[commissions.length - 1].commission_total
    : 0;

  useEffect(() => {
    getCommission(); // ดึงข้อมูลคอมมิชชั่นทั้งหมด
    getWithdrawals(); // ดึงข้อมูลการถอนทั้งหมด
  }, []);

  return (
    <>
      {contextHolder}



      {/* Dashboard Style for the latest commission total */}
      <Row gutter={[16, 16]} justify="center" className="dashboard-cards">
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Card bordered={false} className="card card-commission-total">
            <Statistic
              title="รายได้รวมปัจจุบัน"
              value={latestCommissionTotal}
              prefix={<StockOutlined />}
              suffix="บาท"
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Card bordered={false} className="card card-withdrawal-count">
            <Statistic
              title="จำนวนการถอน"
              value={commissions.length} // Assuming the number of commissions is the number of withdrawals
              prefix={<AuditOutlined />}
              valueStyle={{ fontSize: "24px", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>
      <Divider className="divider" />

      {/* Table for Commission Data */}
      <Table
        rowKey="WithdrawalID"
        columns={columns}
        dataSource={commissions} // Display all commission data
        style={{ width: "100%" }}
        className="commission-table"
      />
    </>
  );
}

export default Commission;
