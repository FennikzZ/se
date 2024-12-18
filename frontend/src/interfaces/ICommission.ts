export interface CommissionInterface {
	commission_id?: number; // Optional commission ID (Primary Key)
	commission_total: number; // จำนวนคอมมิชชั่นรวม (หัก 30)
	commission_date: string; // วันที่คอมมิชชั่น (ISO8601 format)
  
	WithdrawalID: string; 
  }
  