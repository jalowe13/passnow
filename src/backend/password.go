// password.go
// Jacob Lowe
// Generate password logic

package main

import (
	"fmt"
	"math/rand"
	"time"
)
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
func GenPass(passwordLength int) string {
    fmt.Println("Generating password...")
	fmt.Println("Password length: ", passwordLength)
    rand.Seed(time.Now().UnixNano())
    password := make([]byte, passwordLength) // Use passwordLength instead of length
    for i := range password {
        password[i] = charset[rand.Intn(len(charset))]
    }
    return string(password)
}