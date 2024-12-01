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

	// บันทึกโปรโมชั่นใหม่ลงในฐานข้อมูล
	db := config.DB()
	if result := db.Create(&withdrawal); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create withdrawal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion created successfully", "withdrawal": withdrawal})
}

// GetAll Withdrawal - ดึงข้อมูลWithdrawalทั้งหมด
func GetAllWithdrawal(c *gin.Context) {
	var withdrawals []entity.Withdrawal

	db := config.DB()

	// ดึงข้อมูลการถอนทั้งหมด พร้อมข้อมูล Bank
	results := db.Preload("Bank").Find(&withdrawals)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, withdrawals)
}

// Get Withdrawal - ดึงข้อมูลWithdrawalตาม ID
func GetWithdrawal(c *gin.Context) {
	ID := c.Param("id")
	var withdrawal entity.Withdrawal  // ประกาศตัวแปร withdrawal

	db := config.DB()

	// ค้นหาการถอนเงินโดย ID พร้อมข้อมูล Bank
	results := db.Preload("Bank").First(&withdrawal, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, withdrawal)  //  withdrawal
}
