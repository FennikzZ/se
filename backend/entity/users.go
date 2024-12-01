package entity

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model

	FirstName string `json:"first_name"`

	LastName string `json:"last_name"`

	Email string `json:"email"`

	Age uint8 `json:"age"`

	Password string `json:"-"`

	BirthDay time.Time `json:"birthday"`

	GenderID uint `json:"gender_id"`

	Gender *Genders `gorm:"foreignKey: gender_id" json:"gender"`

	Income float64 `json:"income"` //เงินที่ทั้งหมดของคนขับ

	Withdrawals []Withdrawal `gorm:"foreignKey:UserID" json:"withdrawals"` // เปลี่ยนเป็นหลายรายการ
}
