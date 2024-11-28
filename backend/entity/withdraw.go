package entity

import (
	"time"
	"gorm.io/gorm"
)

type Withdrawal struct {
	gorm.Model

	WithdrawalAmount       int       `json:"withdrawal_amount"`        // จำนวนเงินที่ถอน
	WithdrawalCommission   int       `json:"withdrawal_commission"`    // ค่าคอมมิชชั่นจากการถอน (หัก 30)
	WithdrawalNetAmount    int       `json:"withdrawal_net_amount"`    // จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น
	WithdrawalBankName     string    `json:"withdrawal_bank_name"`     // ชื่อธนาคารที่ถอนเงิน
	WithdrawalBankNumber   string    `json:"withdrawal_bank_number"`   // หมายเลขบัญชีธนาคาร
	WithdrawalDate         time.Time `json:"withdrawal_date"`          // วันที่ทำการถอน
	DriverID               uint      `json:"driver_id"`                // รหัสของผู้ขับ (เชื่อมโยงกับ Driver หรือ Users)
	Driver                 *Users    `gorm:"foreignKey:DriverID" json:"driver"` // การเชื่อมโยงกับ Users หรือ Driver
}
