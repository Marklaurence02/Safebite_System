#include <SoftwareSerial.h>

// ESP8266-01S Pin Configuration
#define ESP_RX 8  // Arduino Pin 8 -> ESP8266-01S TX
#define ESP_TX 9  // Arduino Pin 9 -> ESP8266-01S RX

SoftwareSerial espSerial(ESP_RX, ESP_TX);

void setup() {
  Serial.begin(9600);
  espSerial.begin(115200);
  
  Serial.println("=== WiFi Network Scanner ===");
  Serial.println("Scanning for available WiFi networks...");
  Serial.println();
  
  delay(2000);
  
  // Test 1: Basic communication
  Serial.println("Step 1: Testing ESP8266 communication");
  espSerial.println("AT");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 2: Reset ESP8266
  Serial.println("\nStep 2: Resetting ESP8266");
  espSerial.println("AT+RST");
  delay(5000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 3: Set WiFi mode to Station
  Serial.println("\nStep 3: Setting WiFi mode to Station");
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(2000);
  
  // Test 4: Scan for WiFi networks
  Serial.println("\nStep 4: Scanning for WiFi networks");
  Serial.println("Available networks:");
  Serial.println("====================");
  
  espSerial.println("AT+CWLAP");
  delay(10000); // Wait 10 seconds for scan results
  
  while (espSerial.available()) {
    String response = espSerial.readString();
    Serial.println(response);
  }
  
  delay(2000);
  
  // Test 5: Try to connect with current credentials
  Serial.println("\nStep 5: Testing current WiFi credentials");
  Serial.println("SSID: TP-Link_DA40");
  Serial.println("Password: 84332363");
  
  String cmd = "AT+CWJAP=\"TP-Link_DA40\",\"84332363\"";
  espSerial.println(cmd);
  
  // Wait for response
  unsigned long startTime = millis();
  while (millis() - startTime < 15000) {
    if (espSerial.available()) {
      String response = espSerial.readString();
      Serial.println("Response: " + response);
      
      if (response.indexOf("OK") >= 0) {
        Serial.println("✅ SUCCESS: WiFi connected!");
        break;
      }
      if (response.indexOf("FAIL") >= 0) {
        Serial.println("❌ FAILED: WiFi connection failed");
        break;
      }
    }
    delay(100);
  }
  
  Serial.println("\n=== Scanner Complete ===");
  Serial.println("Check the network list above for your WiFi name");
  Serial.println("Make sure the SSID and password are correct");
}

void loop() {
  // Keep checking for any incoming data
  while (espSerial.available()) {
    Serial.write(espSerial.read());
  }
  
  delay(100);
}
