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
		//promotion
		&entity.Promotion{},
		&entity.DiscountType{},
		&entity.Status{},
		//withdraw
		&entity.Withdrawal{},
		&entity.Commission{},
		&entity.BankName{},
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

	// สร้างข้อมูลตัวอย่าง BankName
	BankBangkok := entity.BankName{BankName: "ธนาคารกรุงเทพ"}
	BankKasikorn := entity.BankName{BankName: "ธนาคารกสิกรไทย"}
	BankSCB := entity.BankName{BankName: "ธนาคารไทยพาณิชย์"}
	BankKrungthai := entity.BankName{BankName: "ธนาคารกรุงไทย"}
	BankTMB := entity.BankName{BankName: "ธนาคารทหารไทย"}

	// ใช้ FirstOrCreate เพื่อป้องกันการสร้างข้อมูลซ้ำ
	db.FirstOrCreate(&BankBangkok, &entity.BankName{BankName: "ธนาคารกรุงเทพ"})
	db.FirstOrCreate(&BankKasikorn, &entity.BankName{BankName: "ธนาคารกสิกรไทย"})
	db.FirstOrCreate(&BankSCB, &entity.BankName{BankName: "ธนาคารไทยพาณิชย์"})
	db.FirstOrCreate(&BankKrungthai, &entity.BankName{BankName: "ธนาคารกรุงไทย"})
	db.FirstOrCreate(&BankTMB, &entity.BankName{BankName: "ธนาคารทหารไทย"})

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
		// Add other promotions here as before
	}

	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, promo := range promotions {
		db.FirstOrCreate(&promo, &entity.Promotion{PromotionCode: promo.PromotionCode})
	}

	// สร้างผู้ใช้ตัวอย่าง
	hashedPassword, _ := HashPassword("123456")
	BirthDay, _ := time.Parse("2006-01-02", "1988-11-12")

	users := []entity.Users{
		{
			FirstName: "Software",
			LastName:  "Analysis",
			Email:     "sa@gmail.com",
			Age:       80,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    54000,
		},
		{
			FirstName: "John",
			LastName:  "Doe",
			Email:     "john.doe@gmail.com",
			Age:       30,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    45000,
		},
		{
			FirstName: "Jane",
			LastName:  "Smith",
			Email:     "jane.smith@gmail.com",
			Age:       25,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  2,
			Income:    50000,
		},
		{
			FirstName: "Alice",
			LastName:  "Johnson",
			Email:     "alice.johnson@gmail.com",
			Age:       28,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  2,
			Income:    48000,
		},
		{
			FirstName: "Bob",
			LastName:  "Brown",
			Email:     "bob.brown@gmail.com",
			Age:       35,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    52000,
		},
		{
			FirstName: "Charlie",
			LastName:  "Davis",
			Email:     "charlie.davis@gmail.com",
			Age:       40,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    60000,
		},
		{
			FirstName: "David",
			LastName:  "Evans",
			Email:     "david.evans@gmail.com",
			Age:       32,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    47000,
		},
		{
			FirstName: "Eve",
			LastName:  "Harris",
			Email:     "eve.harris@gmail.com",
			Age:       29,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  2,
			Income:    49000,
		},
		{
			FirstName: "Frank",
			LastName:  "Jackson",
			Email:     "frank.jackson@gmail.com",
			Age:       38,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    51000,
		},
		{
			FirstName: "Grace",
			LastName:  "King",
			Email:     "grace.king@gmail.com",
			Age:       26,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  2,
			Income:    46000,
		},
		{
			FirstName: "Henry",
			LastName:  "Lee",
			Email:     "henry.lee@gmail.com",
			Age:       33,
			Password:  hashedPassword,
			BirthDay:  BirthDay,
			GenderID:  1,
			Income:    53000,
		},
	}

	// บันทึกข้อมูลผู้ใช้ตัวอย่างลงในฐานข้อมูล
	for _, user := range users {
		db.FirstOrCreate(&user, &entity.Users{Email: user.Email})
	}
}
