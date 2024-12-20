package promotion

import (
	"time"
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
)

// GetAll Promotions - ดึงข้อมูลโปรโมชั่นทั้งหมด
func GetAllPromotion(c *gin.Context) {
	var promotions []entity.Promotion

	db := config.DB()

	// ดึงข้อมูลโปรโมชั่นทั้งหมด พร้อมข้อมูล DiscountType และ Status
	results := db.Preload("DiscountType").Preload("Status").Find(&promotions)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, promotions)
}

// Get Promotion - ดึงข้อมูลโปรโมชั่นตาม ID
func GetPromotion(c *gin.Context) {
	ID := c.Param("id")
	var promotion entity.Promotion

	db := config.DB()

	// ค้นหาโปรโมชั่นโดย ID พร้อมข้อมูล DiscountType และ Status
	results := db.Preload("DiscountType").Preload("Status").First(&promotion, ID)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, promotion)
}

// Create Promotion - สร้างโปรโมชั่นใหม่
func CreatePromotion(c *gin.Context) {
	var promotion entity.Promotion

	// รับข้อมูล JSON ที่ส่งมาจาก client
	if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// ตรวจสอบว่า StatusID ถูกส่งมาหรือไม่
	if promotion.StatusID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "StatusID is required"})
		return
	}

	// บันทึกโปรโมชั่นใหม่ลงในฐานข้อมูล
	db := config.DB()
	if result := db.Create(&promotion); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion created successfully", "promotion": promotion})
}

// Update Promotion - แก้ไขข้อมูลโปรโมชั่น
func UpdatePromotion(c *gin.Context) {
	var promotion entity.Promotion
	promotionID := c.Param("id")

	// ค้นหาข้อมูลโปรโมชั่นที่ต้องการแก้ไข
	db := config.DB()
	result := db.First(&promotion, promotionID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	// รับข้อมูล JSON ที่ส่งมาจาก client เพื่ออัปเดตโปรโมชั่น
	if err := c.ShouldBindJSON(&promotion); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลโปรโมชั่นที่อัปเดต
	result = db.Save(&promotion)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update promotion"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion updated successfully"})
}

// Delete Promotion - ลบโปรโมชั่น
func DeletePromotion(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// ลบโปรโมชั่นจากฐานข้อมูล
	if tx := db.Exec("DELETE FROM promotions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Promotion not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Promotion deleted successfully"})
}

// UsePromotion - ฟังก์ชันสำหรับใช้โปรโมชั่นโดย promotion_code
func UsePromotion(c *gin.Context) {
	var request struct {
		PromotionCode string `json:"promotion_code"` // รับ promotion_code จาก body
	}

	// รับข้อมูลจาก body
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var promotion entity.Promotion
	db := config.DB()

	// ค้นหาข้อมูลโปรโมชั่นโดยใช้ promotion_code
	if result := db.Where("promotion_code = ?", request.PromotionCode).First(&promotion); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		return
	}

	// ตรวจสอบสถานะโปรโมชั่น (status_id)
	if promotion.StatusID == 2 {
		// ถ้า status_id = 2 (ปิดการใช้งาน) จะไม่สามารถใช้ได้
		c.JSON(http.StatusForbidden, gin.H{"error": "Promotion is disabled"})
		return
	}

	// ตรวจสอบว่า EndDate มากกว่าวันปัจจุบัน
	if promotion.EndDate.Before(time.Now()) || promotion.EndDate.Equal(time.Now()) {
		// ถ้า EndDate มากกว่าวันปัจจุบัน ให้เปลี่ยน StatusID เป็น 2 ทันที
		promotion.StatusID = 2

		// บันทึกการเปลี่ยนแปลง status_id ในฐานข้อมูล
		if result := db.Save(&promotion); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
			return
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Promotion has expired, status updated to disabled"})
		return
	}

	// ตรวจสอบว่า use_count ไม่เกิน use_limit
	if promotion.UseCount >= promotion.UseLimit {
		// ถ้า use_count เท่ากับ use_limit ให้เปลี่ยน status_id เป็น 2
		promotion.StatusID = 2

		// บันทึกการเปลี่ยนแปลง status_id ในฐานข้อมูล
		if result := db.Save(&promotion); result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
			return
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Promotion use limit reached, status updated to disabled"})
		return
	}

	// เพิ่ม use_count ไป 1
	promotion.UseCount++

	// บันทึกข้อมูลที่อัปเดตลงในฐานข้อมูล
	if result := db.Save(&promotion); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update use count"})
		return
	}

	// ส่งผลลัพธ์กลับ
	c.JSON(http.StatusOK, gin.H{"message": "Promotion used successfully", "promotion": promotion})
}