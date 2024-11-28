package withdrawal

import (
	"net/http"
	"time"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func ProcessWithdrawalAndCommission(c *gin.Context) {
	// รับข้อมูลจาก body ของ request
	var withdrawalRequest entity.Withdrawal
	if err := c.ShouldBindJSON(&withdrawalRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// คำนวณค่าคอมมิชชั่น (หัก 30%)
	withdrawalRequest.WithdrawalCommission = int(float64(withdrawalRequest.WithdrawalAmount) * 0.30)
	withdrawalRequest.WithdrawalNetAmount = withdrawalRequest.WithdrawalAmount - withdrawalRequest.WithdrawalCommission

	// บันทึกการถอนเงินในฐานข้อมูล
	db := config.DB()
	if err := db.Create(&withdrawalRequest).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process withdrawal"})
		return
	}

	// บันทึกค่าคอมมิชชั่นในฐานข้อมูล
	commission := entity.Commission{
		CommissionTotal: withdrawalRequest.WithdrawalCommission,
		CommissionDate:  int(time.Now().Unix()),
		WithdrawalID:    withdrawalRequest.ID, // ใช้ ID ของ withdrawal ที่บันทึกไว้
	}

	if err := db.Create(&commission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process commission"})
		return
	}

	// บันทึกข้อมูล statement
	statement := entity.Statement{
		WithdrawalID: withdrawalRequest.ID,
		CommissionID: commission.CommissionID,
		StatementDate: time.Now(),
	}

	if err := db.Create(&statement).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create statement"})
		return
	}

	// ส่งผลลัพธ์กลับไปยังผู้ใช้
	c.JSON(http.StatusOK, gin.H{
		"message":         "Withdrawal processed successfully",
		"withdrawal":      withdrawalRequest,
		"commission":      commission,
		"statement":       statement,
	})
}
