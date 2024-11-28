package entity

import (
	"gorm.io/gorm"
)

type Commission struct {
	gorm.Model

	CommissionID    uint   `json:"commission_id" gorm:"primaryKey"` // รหัสคอมมิชชั่น (PK)
	CommissionTotal int    `json:"commission_total"`                // ยอดคอมมิชชั่นรวม (หัก 30)
	CommissionDate  int    `json:"commission_date"`                 // วันที่คอมมิชชั่น
	WithdrawalID    uint   `json:"withdrawal_id"`                   // รหัสการถอนเงิน (FK)
	Withdrawal      *Withdrawal `gorm:"foreignKey:withdrawalID" json:"withdrawal"` // การเชื่อมโยงกับ Withdrawal
}
