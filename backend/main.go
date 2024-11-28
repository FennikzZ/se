package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/promotion"  // เพิ่มการ import ฟังก์ชัน UsePromotion จาก package promotion
	"example.com/sa-67-example/controller/discounttype"
	"example.com/sa-67-example/controller/status"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/middlewares"
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

	}

	r.GET("/discounttype", discounttype.GetAllD) // ใช้ฟังก์ชัน GetAllD จาก package discounttype

	r.GET("/statuses", status.GetAllStatus) // เพิ่มเส้นทางสำหรับ Status

	r.POST("/zzz", promotion.UsePromotion)  // เรียกใช้ฟังก์ชัน UsePromotion จาก package promotion

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
