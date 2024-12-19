import { useState, useEffect } from "react";
import { Table, Divider, message, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetCommission } from "../../services/https/index";
import { CommissionInterface } from "../../interfaces/ICommission"; // Import CommissionInterface
import dayjs from "dayjs";

const { Title } = Typography;

function Commission() {
  const [commissions, setCommissions] = useState<CommissionInterface[]>([]); // State for commissions
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<CommissionInterface> = [
    {
      title: "ลำดับ",
      render: (record) => <>{record.WithdrawalID}</>,
      key: "WithdrawalID",
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
  }, []);

  return (
    <>
      {contextHolder}

      <Divider />
      
      {/* Display latest commission total */}
      <div style={{ marginBottom: 20 }}>
        <Title level={4}>
          จำนวนรายได้ทั้งหมด: {latestCommissionTotal} บาท
        </Title>
      </div>

      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="WithdrawalID"
          columns={columns}
          dataSource={commissions} // Display all commission data
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}

export default Commission;