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
		//payment
		&entity.Payment{},
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
		{
			PromotionCode:        "DRIVE002",
			PromotionName:        "ลด 10% เมื่อซื้อสินค้าครบ 500 บาท",
			PromotionDescription: "รับส่วนลด 10% เมื่อยอดซื้อเกิน 500 บาท",
			Discount:             10.0, // ส่วนลด 10%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo2.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE003",
			PromotionName:        "ลด 100 บาท สำหรับการซื้อครั้งแรก",
			PromotionDescription: "ลูกค้าที่ยังไม่เคยซื้อ สามารถรับส่วนลด 100 บาท",
			Discount:             100.0, // ส่วนลด 100 บาท
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             50,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo3.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE004",
			PromotionName:        "ลด 15% สำหรับการซื้อสินค้าราคาสูงกว่า 1000 บาท",
			PromotionDescription: "รับส่วนลด 15% เมื่อยอดซื้อเกิน 1000 บาท",
			Discount:             15.0, // ส่วนลด 15%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo4.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE005",
			PromotionName:        "ลด 200 บาท เมื่อชำระผ่านบัตรเครดิต",
			PromotionDescription: "รับส่วนลด 200 บาท เมื่อชำระผ่านบัตรเครดิต",
			Discount:             200.0, // ส่วนลด 200 บาท
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             30,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo5.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE006",
			PromotionName:        "ลด 50% เมื่อซื้อ 2 ชิ้นขึ้นไป",
			PromotionDescription: "รับส่วนลด 50% เมื่อซื้อสินค้าทุกประเภท 2 ชิ้นขึ้นไป",
			Discount:             50.0, // ส่วนลด 50%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo6.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE007",
			PromotionName:        "ส่งฟรี สำหรับการสั่งซื้อมากกว่า 1000 บาท",
			PromotionDescription: "รับบริการส่งฟรี เมื่อยอดสั่งซื้อเกิน 1000 บาท",
			Discount:             100.0, // ส่งฟรี (ถือว่าเป็นการลดราคา)
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             50,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo7.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE008",
			PromotionName:        "ลด 25% สำหรับการสั่งซื้อผ่านแอปพลิเคชัน",
			PromotionDescription: "รับส่วนลด 25% เมื่อสั่งซื้อผ่านแอปพลิเคชันของเรา",
			Discount:             25.0, // ส่วนลด 25%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo8.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE009",
			PromotionName:        "ลด 30% เมื่อซื้อสินค้าราคา 2000 บาทขึ้นไป",
			PromotionDescription: "รับส่วนลด 30% เมื่อยอดซื้อเกิน 2000 บาท",
			Discount:             30.0, // ส่วนลด 30%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             80,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo9.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE010",
			PromotionName:        "ลด 10% สำหรับสินค้าประเภทอุปกรณ์กีฬา",
			PromotionDescription: "รับส่วนลด 10% สำหรับสินค้าประเภทอุปกรณ์กีฬา",
			Discount:             10.0, // ส่วนลด 10%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             100,
			UseCount:             0,
			Distance:             0.0,
			Photo:                "promo10.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusID:             1, // ACTIVE
		},
	}

	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, promo := range promotions {
		db.FirstOrCreate(&promo, &entity.Promotion{PromotionCode: promo.PromotionCode})
	}

	// สร้างข้อมูล Payment ตัวอย่าง
	payment := entity.Payment{
		PaymentAmount: 1500.00,       // จำนวนเงินที่ชำระ
		PaymentMethod: "Credit Card", // วิธีการชำระ
		PaymentDate:   time.Now(),    // วันที่ชำระเงิน (ใช้เวลาปัจจุบัน)
		BookingID:     1,             // ID ของการจอง (สมมุติว่า BookingID คือ 1)
		PromotionID:   nil,           // สมมุติว่าไม่มีโปรโมชั่นที่ใช้ในตอนนี้
	}

	// บันทึกข้อมูล Payment ตัวอย่างลงในฐานข้อมูล
	db.Create(&payment)

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
