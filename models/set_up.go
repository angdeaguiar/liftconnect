package models

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func ConnectDataBase() {
	database, err := gorm.Open("postgres", "host=localhost port=5432 user=postgres password=password dbname=liftconnect")

	if err != nil {
		panic(err)
	}

	DB = database
}
