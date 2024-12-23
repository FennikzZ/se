// controller/status/status.go
package statuspromotion

import (
	"net/http"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

func GetAllStatus(c *gin.Context) {

	db := config.DB()


	var statuspromotion []entity.StatusPromotion
 
	db.Find(&statuspromotion)
 
 
	c.JSON(http.StatusOK, &statuspromotion)

}
