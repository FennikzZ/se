package bank


import (

   "net/http"


   "example.com/sa-67-example/config"

   "example.com/sa-67-example/entity"

   "github.com/gin-gonic/gin"

)


func GetAllBankName(c *gin.Context) {


   db := config.DB()


   var bankname []entity.BankName

   db.Find(&bankname)


   c.JSON(http.StatusOK, &bankname)


}