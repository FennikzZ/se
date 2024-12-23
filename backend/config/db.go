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
		&entity.StatusPromotion{},
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
	ActiveStatus := entity.StatusPromotion{StatusPromotion: "ACTIVE"}
	ExpiredStatus := entity.StatusPromotion{StatusPromotion: "EXPIRED"}
	db.FirstOrCreate(&ActiveStatus, &entity.StatusPromotion{StatusPromotion: "ACTIVE"})
	db.FirstOrCreate(&ExpiredStatus, &entity.StatusPromotion{StatusPromotion: "EXPIRED"})

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
			PromotionName:        "ส่งฟรี ไม่มีข้อแม้ !",
			PromotionDescription: "ฟรีสำหรับลูกค้าทุกท่าน",
			Discount:             100, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             2,
			UseCount:             0,
			DistancePromotion:    0.0,
			Photo:                "promo1.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE002",
			PromotionName:        "ลด 10/10",
			PromotionDescription: "รับส่วนลด 10% เมื่อเดินทางขั้นต่ำ 10 กม.",
			Discount:             10, // ส่วนลด 10%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			DistancePromotion:    10.0,
			Photo:                "promo2.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE003",
			PromotionName:        "ลด 100 บาทต้อนรับปีใหม่",
			PromotionDescription: "เพียงเดินทางขั้นต่ำ 10 กม. ช่วงเทศกาล",
			Discount:             100, // ส่วนลด 100 บาท
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			DistancePromotion:    10.0,
			Photo:                "promo3.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE004",
			PromotionName:        "ลด 15% สุดคุ้ม",
			PromotionDescription: "เมื่อเดินทางในเมืองขั้นต่ำ 5 กม.",
			Discount:             15, // ส่วนลด 15%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             4,
			UseCount:             0,
			DistancePromotion:    5.0,
			Photo:                "promo4.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE005",
			PromotionName:        "ลด 200 บาทแน่นๆ",
			PromotionDescription: "เมื่อเดินทางระยะไกล 20 กม.",
			Discount:             200, // ส่วนลด 200 บาท
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             2,
			UseCount:             0,
			DistancePromotion:    20.0,
			Photo:                "promo5.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE006",
			PromotionName:        "ลดครึ่งนึง 50%",
			PromotionDescription: "เมื่อเดินทางในระยะ 7 กม.",
			Discount:             50, // ส่วนลด 50%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             4,
			UseCount:             0,
			DistancePromotion:    7.0,
			Photo:                "promo6.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE007",
			PromotionName:        "เดินทางคุ้มลด 5%",
			PromotionDescription: "แจกจ่ายเดินทางขั้นต่ำเพียง 3 กม.",
			Discount:             5, // 
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             7,
			UseCount:             0,
			DistancePromotion:    3.0,
			Photo:                "promo7.jpg",
			DiscountTypeID:       2, // percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE008",
			PromotionName:        "ลด 25% เดือนแห่งความสุข",
			PromotionDescription: "เดินทางครบเพียง 6 กม.",
			Discount:             25, // ส่วนลด 25%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             8,
			UseCount:             0,
			DistancePromotion:    6.0,
			Photo:                "promo8.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE009",
			PromotionName:        "ลด 35% สุดโหด",
			PromotionDescription: "ภายในพื้นที่ 8 กม.",
			Discount:             35, // ส่วนลด 30%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             9,
			UseCount:             0,
			DistancePromotion:    8.0,
			Photo:                "promo9.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE010",
			PromotionName:        "คุ้มกว่านี้มีอีกไหม 99",
			PromotionDescription: "ลด 99% เหมือนส่งฟรีระยะทางขั้นต่ำ 30 กม.",
			Discount:             99, // ส่วนลด 99%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             4,
			UseCount:             0,
			DistancePromotion:    30.0,
			Photo:                "promo10.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             2, // close
		},
	}

	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, promo := range promotions {
		db.FirstOrCreate(&promo, &entity.Promotion{PromotionCode: promo.PromotionCode})
	}

	// สร้างข้อมูล Commission ตัวอย่าง
	commission := entity.Commission{
		CommissionAmount: 0.0,
		CommissionTotal:  0.0,        // ค่าคอมมิชชั่นที่หัก
		CommissionDate:   time.Now(), // วันที่คอมมิชชั่น
		WithdrawalID:     0,          // ใช้รหัส Withdrawal (ปรับให้เหมาะสมกับข้อมูลที่มี)
		Withdrawal:       nil,        // การเชื่อมโยงกับข้อมูล Withdrawal
	}

	// บันทึกข้อมูล Commission ลงในฐานข้อมูล
	db.Create(&commission)

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
