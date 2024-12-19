package main

import (
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/middlewares"
	"github.com/gin-gonic/gin"
	"net/http"

	"example.com/sa-67-example/controller/bankname"    // Import Bank Controller
	"example.com/sa-67-example/controller/withdrawal" // Import Withdrawal Controller

	"example.com/sa-67-example/controller/discounttype" //
	"example.com/sa-67-example/controller/promotion"    // เพิ่มการ import ฟังก์ชัน UsePromotion จาก package promotion
	"example.com/sa-67-example/controller/status"       //
)

const PORT = "8000"

func main() {
	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// Auth Route
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)

	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes())

		// User Routes
		router.PUT("/user/:id", users.Update)
		router.GET("/users", users.GetAll)
		router.GET("/user/:id", users.Get)
		router.DELETE("/user/:id", users.Delete)

		// Promotion Routes
		router.GET("/promotions", promotion.GetAllPromotion)
		router.GET("/promotion/:id", promotion.GetPromotion)
		router.POST("/promotion", promotion.CreatePromotion)
		router.PUT("/promotion/:id", promotion.UpdatePromotion)
		router.DELETE("/promotion/:id", promotion.DeletePromotion)

		//commission
		router.GET("/zzz", withdrawal.GetAllCommission)


		//withdrwal
		router.POST("/withdrawal/money", withdrawal.CreateWithdrawal) 
		router.GET("/withdrawal/statement", withdrawal.GetAllWithdrawal) // เพิ่มเส้นทางดึงข้อมูลการถอนเงินทั้งหมด
		router.GET("/withdrawal/statement/:id", withdrawal.GetWithdrawal)  // เพิ่มเส้นทางดึงข้อมูลการถอนเงินตาม ID

	}

	r.GET("/bankname", bankname.GetAllBankName) // Bank Routesเพิ่มเส้นทางการดึงข้อมูลธนาคาร

	r.GET("/discounttype", discounttype.GetAllD) // ใช้ฟังก์ชัน GetAllD จาก package discounttype

	r.GET("/statuses", status.GetAllStatus) // เพิ่มเส้นทางสำหรับ Status

	// Genders Route
	r.GET("/genders", genders.GetAll)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
