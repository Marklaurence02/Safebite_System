#include <SoftwareSerial.h>

// ESP8266-01S Pin Configuration
#define ESP_RX 8  // Arduino Pin 8 -> ESP8266-01S TX
#define ESP_TX 9  // Arduino Pin 9 -> ESP8266-01S RX

// Wi-Fi Info
#define WIFI_SSID "TP-Link_DA40"
#define WIFI_PASS "84332363"

SoftwareSerial espSerial(ESP_RX, ESP_TX);

void setup() {
  Serial.begin(9600);
  espSerial.begin(115200);
  
  Serial.println("=== ESP8266-01S WiFi Test ===");
  Serial.println("Testing WiFi connection with USB power only");
  Serial.println();
  
  delay(2000);
  
  // Test 1: Basic communication
  Serial.println("Test 1: Basic AT command");
  espSerial.println("AT");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 2: Reset ESP8266
  Serial.println("\nTest 2: Reset ESP8266");
  espSerial.println("AT+RST");
  delay(5000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 3: Set WiFi mode
  Serial.println("\nTest 3: Set WiFi mode to Station");
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 4: Try to connect to WiFi
  Serial.println("\nTest 4: Attempting WiFi connection");
  Serial.println("SSID: " + String(WIFI_SSID));
  
  String cmd = "AT+CWJAP=\"" + String(WIFI_SSID) + "\",\"" + String(WIFI_PASS) + "\"";
  espSerial.println(cmd);
  
  // Wait for response with timeout
  unsigned long startTime = millis();
  bool connected = false;
  
  while (millis() - startTime < 20000) { // 20 second timeout
    if (espSerial.available()) {
      String response = espSerial.readString();
      Serial.println("ESP Response: " + response);
      
      if (response.indexOf("OK") >= 0) {
        connected = true;
        break;
      }
      if (response.indexOf("FAIL") >= 0) {
        Serial.println("WiFi connection FAILED");
        break;
      }
    }
    delay(100);
  }
  
  if (connected) {
    Serial.println("\n✅ WiFi connection SUCCESSFUL!");
    
    // Test 5: Get IP address
    Serial.println("\nTest 5: Getting IP address");
    espSerial.println("AT+CIFSR");
    delay(2000);
    
    while (espSerial.available()) {
      Serial.write(espSerial.read());
    }
    
  } else {
    Serial.println("\n❌ WiFi connection FAILED");
    Serial.println("Possible causes:");
    Serial.println("1. USB power insufficient for ESP8266-01S");
    Serial.println("2. WiFi credentials incorrect");
    Serial.println("3. WiFi network not in range");
    Serial.println("4. ESP8266-01S wiring issue");
  }
  
  Serial.println("\n=== Test Complete ===");
}

void loop() {
  // Keep checking for any incoming data
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(100);
}
