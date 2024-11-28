// controller/status/status.go
package status

import (
	"net/http"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func GetAllStatus(c *gin.Context) {

	db := config.DB()


	var status []entity.Status
 
	db.Find(&status)
 
 
	c.JSON(http.StatusOK, &status)

}
