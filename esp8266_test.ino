/*
 * ESP8266-01S Test Sketch
 * Use this to test basic ESP8266-01S functionality
 */

#include <SoftwareSerial.h>

// ESP8266-01S Pin Configuration
#define ESP_RX 8  // Arduino Pin 8 -> ESP8266-01S TX
#define ESP_TX 9  // Arduino Pin 9 -> ESP8266-01S RX

SoftwareSerial espSerial(ESP_RX, ESP_TX);

void setup() {
  Serial.begin(9600);
  espSerial.begin(115200);
  
  Serial.println("ESP8266-01S Test Started");
  Serial.println("========================");
  
  delay(2000);
  
  // Test 1: Basic AT command
  Serial.println("Test 1: Basic AT command");
  espSerial.println("AT");
  delay(1000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 2: Check firmware version
  Serial.println("\nTest 2: Firmware version");
  espSerial.println("AT+GMR");
  delay(1000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 3: Set WiFi mode
  Serial.println("\nTest 3: Set WiFi mode to Station");
  espSerial.println("AT+CWMODE=1");
  delay(1000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 4: Try to connect to WiFi
  Serial.println("\nTest 4: Connect to WiFi");
  espSerial.println("AT+CWJAP=\"TP-Link_DA40\",\"84332363\"");
  delay(10000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 5: Get IP address
  Serial.println("\nTest 5: Get IP address");
  espSerial.println("AT+CIFSR");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  Serial.println("\nTest completed!");
}

void loop() {
  // Keep checking for any incoming data
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(100);
}
