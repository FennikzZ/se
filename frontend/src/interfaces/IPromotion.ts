export interface PromotionInterface {
    id?: number;
    promotion_code?: string; // รหัสโปรโมชั่น
    promotion_name?: string;
    promotion_description?: string;
    discount?: number; // จำนวนส่วนลด
    discount_type?: "amount" | "percent"; // ประเภทส่วนลด
    start_date?: string;
    end_date?: string;
    photo?: string;
  }