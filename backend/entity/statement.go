package entity

import (
	"time"
	"gorm.io/gorm"
)

type Statement struct {
	gorm.Model

	StatementID        uint       `json:"statement_id" gorm:"primaryKey"` // รหัส statement (PK)
	CommissionID       uint       `json:"commission_id"`                 // รหัสคอมมิชชั่น (FK)
	Commission         *Commission `gorm:"foreignKey:CommissionID" json:"commission"` // การเชื่อมโยงกับ Commission
	WithdrawalID       uint       `json:"withdrawal_id"`                 // รหัสการถอนเงิน (FK)
	Withdrawal         *Withdrawal `gorm:"foreignKey:WithdrawalID" json:"withdrawal"` // การเชื่อมโยงกับ Withdrawal
	StatementDate      time.Time  `json:"statement_date"`                // วันที่สร้าง statement
	TransactionID      uint        `json:"transaction_id"`                // รหัสธุรกรรม (เพิ่มใหม่)
}

