package withdrawal

import (
	"net/http"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func CreateWithdrawal(c *gin.Context) {
	var withdrawal entity.Withdrawal

	// รับข้อมูล JSON ที่ส่งมาจาก client
	if err := c.ShouldBindJSON(&withdrawal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// ตรวจสอบผู้ใช้ที่เกี่ยวข้องกับการถอน
	db := config.DB()
	var user entity.Users

	// ค้นหาผู้ใช้จากฐานข้อมูล
	if err := db.First(&user, withdrawal.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// ตรวจสอบว่า income ของผู้ใช้เป็น 0 หรือไม่
	if user.Income == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ยอดเงินไม่เพียงพอ"})
		return
	}

	// ลดค่า income ของผู้ใช้จากยอดที่ถอน
	user.Income -= float64(withdrawal.WithdrawalAmount)

	// บันทึกข้อมูลการถอน
	if result := db.Create(&withdrawal); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create withdrawal"})
		return
	}

	// อัพเดตข้อมูลผู้ใช้ในฐานข้อมูล
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user income"})
		return
	}

	// คำนวณ commission_total โดยการบวก withdrawal_commission ใหม่กับค่าคอมมิชชั่นที่เก่ากว่า
	var lastCommission entity.Commission
	db.Last(&lastCommission) // หาค่าคอมมิชชั่นล่าสุด

	commissionTotal := lastCommission.CommissionTotal + withdrawal.WithdrawalCommission

	// สร้างข้อมูลคอมมิชชั่นใหม่
	commission := entity.Commission{
		CommissionTotal: commissionTotal,
		CommissionDate:  withdrawal.WithdrawalDate, // ใช้วันที่เดียวกับวันที่ถอน
		WithdrawalID:    withdrawal.ID,
	}

	// บันทึกข้อมูลคอมมิชชั่น
	if err := db.Create(&commission).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create commission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Withdrawal and commission created successfully", "withdrawal": withdrawal, "commission": commission})
}

// GetAll Withdrawal - ดึงข้อมูลWithdrawalทั้งหมด
func GetAllWithdrawal(c *gin.Context) {
	var withdrawal []entity.Withdrawal

	db := config.DB()

	// ดึงข้อมูลการถอนทั้งหมด พร้อมข้อมูล Bank
	results := db.Preload("BankName").Find(&withdrawal)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, withdrawal)
}

// Get Withdrawal - ดึงข้อมูลWithdrawalตาม ID
func GetWithdrawal(c *gin.Context) {
	ID := c.Param("id")
	var withdrawal entity.Withdrawal  // ประกาศตัวแปร withdrawal

	db := config.DB()

	// ค้นหาการถอนเงินโดย ID พร้อมข้อมูล Bank
	results := db.Preload("BankName").First(&withdrawal, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, withdrawal)  //  withdrawal
}

// GetAllCommission - ดึงข้อมูลคอมมิชชั่นทั้งหมด
func GetAllCommission(c *gin.Context) {
	var commissions []entity.Commission

	db := config.DB()
	if err := db.Preload("Withdrawal").Find(&commissions).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to fetch commissions"})
		return
	}

	c.JSON(http.StatusOK, commissions)
}

// GetCommissionByID - ดึงข้อมูลคอมมิชชั่นโดย ID
func GetCommissionByID(c *gin.Context) {
	var commission entity.Commission
	id := c.Param("id")

	db := config.DB()
	if err := db.Preload("Withdrawal").First(&commission, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Commission not found"})
		return
	}

	c.JSON(http.StatusOK, commission)
}