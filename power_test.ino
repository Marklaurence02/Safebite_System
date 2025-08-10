/*
 * ESP8266-01S Power Test
 * Test if ESP8266-01S works with USB power only
 */

#include <SoftwareSerial.h>

// ESP8266-01S Pin Configuration
#define ESP_RX 8  // Arduino Pin 8 -> ESP8266-01S TX
#define ESP_TX 9  // Arduino Pin 9 -> ESP8266-01S RX

SoftwareSerial espSerial(ESP_RX, ESP_TX);

void setup() {
  Serial.begin(9600);
  espSerial.begin(115200);
  
  Serial.println("ESP8266-01S Power Test");
  Serial.println("======================");
  Serial.println("This test will check if ESP8266-01S works with USB power");
  Serial.println("If it fails, you need external 3.3V power supply");
  Serial.println();
  
  delay(3000);
  
  // Test 1: Basic AT command (low power)
  Serial.println("Test 1: Basic AT command");
  espSerial.println("AT");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 2: Firmware version (low power)
  Serial.println("\nTest 2: Firmware version");
  espSerial.println("AT+GMR");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 3: WiFi mode (medium power)
  Serial.println("\nTest 3: Set WiFi mode");
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 4: WiFi scan (high power - this might fail with USB)
  Serial.println("\nTest 4: WiFi scan (high power test)");
  espSerial.println("AT+CWLAP");
  delay(10000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  Serial.println("\nPower test completed!");
  Serial.println("If Test 4 failed, you need external 3.3V power supply");
}

void loop() {
  // Keep checking for any incoming data
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(100);
}


