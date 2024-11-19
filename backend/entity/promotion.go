package entity


import (
	
	"time"

	"gorm.io/gorm"

)

type Promotion struct {
	gorm.Model // gorm.Model จะทำให้มี ID, CreatedAt, UpdatedAt, DeletedAt อัตโนมัติ

	PromotionCode        string    `json:"promotion_code" gorm:"unique;not null"`      // รหัสโปรโมชั่น
	PromotionName        string    `json:"promotion_name"`                              // ชื่อโปรโมชั่น
	PromotionDescription string    `json:"promotion_description"`                       // คำอธิบายโปรโมชั่น
	Discount             float64   `json:"discount"`                                    // ส่วนลดโปรโมชั่น
	DiscountType         string    `json:"discount_type"`                               // ประเภทส่วนลด (amount/percent)
	MaxUses              int       `json:"max_uses"`                                    // จำนวนผู้ใช้ที่ใช้ได้สูงสุด
	UsesCount            uint8     `json:"uses_count"`                                  // จำนวนคนที่ใช้ไปแล้ว
	EndDate              time.Time `json:"end_date"`                                    // วันที่หมดเขตโปรโมชั่น
    Photo               string    `gorm:"type:longtext" json:"photo"`  // รูปโปรโมชั่น
}
