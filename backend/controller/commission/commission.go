package commission

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
)

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
