package config

import (
	"fmt"
	"time"

	"example.com/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	// อัปเดตข้อมูล AutoMigrate ให้ครอบคลุมทุก Entity
	db.AutoMigrate(
		&entity.Users{},
		&entity.Genders{},
		&entity.Promotion{},
		&entity.DiscountType{},
		&entity.Status{},
	)

	// สร้างข้อมูลตัวอย่าง Gender
	GenderMale := entity.Genders{Gender: "Male"}
	GenderFemale := entity.Genders{Gender: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	// สร้างข้อมูลตัวอย่าง Status
	ActiveStatus := entity.Status{Status: "ACTIVE"}
	ExpiredStatus := entity.Status{Status: "EXPIRED"}
	db.FirstOrCreate(&ActiveStatus, &entity.Status{Status: "ACTIVE"})
	db.FirstOrCreate(&ExpiredStatus, &entity.Status{Status: "EXPIRED"})

	// สร้างข้อมูลตัวอย่าง DiscountType
	AmountDiscount := entity.DiscountType{DiscountType: "amount"}
	PercentDiscount := entity.DiscountType{DiscountType: "percent"}
	db.FirstOrCreate(&AmountDiscount, &entity.DiscountType{DiscountType: "amount"})
	db.FirstOrCreate(&PercentDiscount, &entity.DiscountType{DiscountType: "percent"})

	promotions := []entity.Promotion{
		{
			PromotionCode:        "DRIVE001",
			PromotionName:        "ส่งฟรี ไม่มีข้อแม้!",
			PromotionDescription: "รับบริการส่งฟรีสำหรับระยะทางไม่เกิน 10 กม.",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			Distance:             10.0,
			Photo:                "promo1.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE002",
			PromotionName:        "แค่ 5 กม. ก็ลดเลย!",
			PromotionDescription: "เดินทางในระยะทาง 5 กม. ขึ้นไป ลดทันที 50 บาท",
			Discount:             50.0,
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             5.0,
			Photo:                "promo2.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE003",
			PromotionName:        "ระยะทางไกลก็ลดให้!",
			PromotionDescription: "รับส่วนลด 15% สำหรับการเดินทางในระยะทาง 20 กม. ขึ้นไป",
			Discount:             15.0,
			EndDate:              time.Now().Add(90 * 24 * time.Hour),
			UseLimit:             2,
			UseCount:             0,
			Distance:             20.0,
			Photo:                "promo3.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE004",
			PromotionName:        "ยิ่งขยับ ยิ่งลด!",
			PromotionDescription: "รับส่วนลด 30 บาทเมื่อเดินทางในระยะทางเกิน 3 กม.",
			Discount:             30.0,
			EndDate:              time.Now().Add(120 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             3.0,
			Photo:                "promo4.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE005",
			PromotionName:        "8 กม. ส่งฟรี ไม่มีเงื่อนไข",
			PromotionDescription: "รับบริการส่งฟรีเมื่อระยะทางไม่เกิน 8 กม.",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(45 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             8.0,
			Photo:                "promo5.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE006",
			PromotionName:        "15 กม. ลดให้เลย 20%",
			PromotionDescription: "รับส่วนลด 20% สำหรับการเดินทางที่ระยะทางขั้นต่ำ 15 กม.",
			Discount:             20.0,
			EndDate:              time.Now().Add(180 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             15.0,
			Photo:                "promo6.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE007",
			PromotionName:        "12 กม. ขึ้นไป ลด 100!",
			PromotionDescription: "รับส่วนลด 100 บาทสำหรับการเดินทางที่ระยะทางเกิน 12 กม.",
			Discount:             100.0,
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             12.0,
			Photo:                "promo7.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE008",
			PromotionName:        "6 กม. สุดคุ้ม!",
			PromotionDescription: "เดินทางในระยะทางไม่เกิน 6 กม. รับส่วนลด 50%",
			Discount:             50.0,
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			Distance:             6.0,
			Photo:                "promo8.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE009",
			PromotionName:        "18 กม. ลดแรง 25%",
			PromotionDescription: "ลด 25% สำหรับระยะทางเกิน 18 กม.",
			Discount:             25.0,
			EndDate:              time.Now().Add(90 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             18.0,
			Photo:                "promo9.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE010",
			PromotionName:        "ระยะทางใกล้ ส่งฟรี!",
			PromotionDescription: "ระยะทางไม่เกิน 5 กม. รับบริการส่งฟรี",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             5.0,
			Photo:                "promo10.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             2, // ACTIVE
		},
	}
	

	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, promo := range promotions {
		db.FirstOrCreate(&promo, &entity.Promotion{PromotionCode: promo.PromotionCode})
	}

	// สร้างผู้ใช้ตัวอย่าง
	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	User := &entity.Users{
		FirstName: "Software",
		LastName:  "Analysis",
		Email:     "sa@gmail.com",
		Age:       80,
		Password:  hashedPassword,
		BirthDay:  BirthDay,
		GenderID:  1,
	}

	db.FirstOrCreate(User, &entity.Users{
		Email: "sa@gmail.com",
	})
}

