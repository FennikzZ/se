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
	WithdrawalBankNumber   string    `json:"withdrawal_bank_number"`   // หมายเลขบัญชีธนาคาร
	WithdrawalDate         time.Time `json:"withdrawal_date"`          // วันที่ทำการถอน

	BankNameID     		uint    		`json:"bank_name_id"`     // ชื่อธนาคารที่ถอนเงิน
	BankName			*BankName  		`gorm:"foreignKey: bank_name_id" json:"bank_name"`
	
	UserID 				uint 			`json:"user_id"` // เก็บ UserID
	User                *Users    		`gorm:"foreignKey:UserID" json:"user"`
}